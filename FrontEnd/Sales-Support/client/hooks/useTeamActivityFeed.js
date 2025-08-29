import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Phone, Mail, Calendar, Users, Settings, Activity } from 'lucide-react';

// Map activity types to icons
const getActivityIcon = (activityType) => {
  switch (activityType?.toLowerCase()) {
    case 'call':
      return Phone;
    case 'email':
      return Mail;
    case 'online meeting':
    case 'in-person meeting':
      return Calendar;
    case 'demo':
    case 'presentation':
      return Users;
    case 'support':
    case 'maintenance':
      return Settings;
    default:
      return Activity;
  }
};

// Calculate relative time
const getRelativeTime = (dateStr, timeStr) => {
  try {
    // Handle missing time
    const time = timeStr || '00:00';
    const activityDate = new Date(`${dateStr}T${time}:00`);
    const now = new Date();
    const diffMs = now - activityDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) return 'upcoming';
    if (diffHours < 1) return 'less than 1 hour ago';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return activityDate.toLocaleDateString();
  } catch (error) {
    return 'unknown time';
  }
};

// Check if activity was created by current user
const isActivityByCurrentUser = (activity, currentUserName) => {
  // Check responsible field (can be array or string)
  const responsible = activity.responsible;
  if (Array.isArray(responsible)) {
    return responsible.includes(currentUserName);
  }
  if (typeof responsible === 'string') {
    return responsible === currentUserName;
  }
  
  // Fallback: check activityLog for creator
  const createdEntry = (activity.activityLog || []).find(log => log.action === 'Created');
  return createdEntry ? createdEntry.user === currentUserName : false;
};

// Get responsible person name for display
const getResponsiblePerson = (activity) => {
  const responsible = activity.responsible;
  if (Array.isArray(responsible)) {
    return responsible[0] || 'Unknown';
  }
  if (typeof responsible === 'string') {
    return responsible;
  }

  // Fallback: check activityLog
  const createdEntry = (activity.activityLog || []).find(log => log.action === 'Created');
  if (!createdEntry) return 'Unknown';
  if (Array.isArray(createdEntry.user)) return createdEntry.user[0] || 'Unknown';
  return createdEntry.user || 'Unknown';
};

// Get all actor names involved in an activity (for filtering)
const getActorNames = (activity) => {
  const responsible = activity.responsible;
  if (Array.isArray(responsible)) {
    return responsible.filter(Boolean);
  }
  if (typeof responsible === 'string') {
    return [responsible];
  }
  const createdEntry = (activity.activityLog || []).find(log => log.action === 'Created');
  if (!createdEntry || !createdEntry.user) return [];
  if (Array.isArray(createdEntry.user)) return createdEntry.user.filter(Boolean);
  return [createdEntry.user];
};

export const useTeamActivityFeed = (limit = 3) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const activitiesData = localStorage.getItem('activitiesList');
        const projectsData = localStorage.getItem('projectsData');
        
        setActivities(activitiesData ? JSON.parse(activitiesData) : []);
        setProjects(projectsData ? JSON.parse(projectsData) : []);
      } catch (error) {
        console.error('Error loading team activity feed data:', error);
        setActivities([]);
        setProjects([]);
      }
    };

    loadData();

    // Listen for data updates
    const handleActivitiesUpdate = () => loadData();
    const handleProjectsUpdate = () => loadData();

    window.addEventListener('activitiesListUpdated', handleActivitiesUpdate);
    window.addEventListener('projectsDataUpdated', handleProjectsUpdate);

    // Also listen for visibility change to reload when user switches tabs
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('activitiesListUpdated', handleActivitiesUpdate);
      window.removeEventListener('projectsDataUpdated', handleProjectsUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Filter and process team activities
  const teamActivityFeed = useMemo(() => {
    if (!user?.name || !projects.length) {
      return [];
    }

    const currentUserName = user.name;

    // Step 1: Find projects where current user is assigned
    const userProjects = projects.filter(project => 
      Array.isArray(project.assignedMembers) && 
      project.assignedMembers.includes(currentUserName)
    );

    if (userProjects.length === 0) {
      return [];
    }

    // Step 2: Get project IDs and organization names
    const projectIds = new Set(userProjects.map(p => p.id));
    const projectOrgNames = new Set(userProjects.map(p => p.organizationName));

    // Merge global activities with project card activities
    const projectCardActivities = projects.flatMap(p =>
      (Array.isArray(p.cardActivities) ? p.cardActivities : []).map(a => ({
        ...a,
        projectId: a.projectId ?? p.id,
        linkedClient: a.linkedClient || p.organizationName
      }))
    );
    // Deduplicate by id (prefer global entries)
    const allById = new Map();
    for (const a of projectCardActivities) allById.set(a.id, a);
    for (const a of activities) allById.set(a.id, { ...allById.get(a.id), ...a });
    const allActivities = Array.from(allById.values());

    // Step 3: Filter activities for user's projects
    const activitiesForUserProjects = allActivities.filter(activity => {
      const isLinkedByProjectId = activity.projectId && projectIds.has(activity.projectId);
      const isLinkedByOrgName = activity.linkedClient && projectOrgNames.has(activity.linkedClient);
      return isLinkedByProjectId || isLinkedByOrgName;
    });

    // Step 4: Exclude activities by current user and include only those by teammates assigned on these projects
    const allowedTeamMembers = new Set(
      userProjects
        .flatMap(p => Array.isArray(p.assignedMembers) ? p.assignedMembers : [])
        .filter(n => n && n !== currentUserName)
    );

    const teamMemberActivities = activitiesForUserProjects.filter(activity => {
      if (isActivityByCurrentUser(activity, currentUserName)) return false;
      const names = getActorNames(activity);
      return names.some(n => allowedTeamMembers.has(n));
    });

    // Step 5: Transform to feed format and sort by date/time
    const feedItems = teamMemberActivities.map(activity => ({
      id: activity.id,
      type: activity.activityType || 'Activity',
      client: activity.linkedClient || 'Unknown Client',
      time: getRelativeTime(activity.date, activity.time),
      status: activity.status?.toLowerCase() || 'unknown',
      icon: getActivityIcon(activity.activityType),
      responsiblePerson: getResponsiblePerson(activity),
      department: activity.category || 'General',
      priority: activity.priority || 'Medium',
      activityDate: activity.date,
      activityTime: activity.time,
      originalActivity: activity
    }));

    // Step 6: Sort by date/time (most recent first)
    const sortedFeed = feedItems.sort((a, b) => {
      try {
        const timeA = a.activityTime || '00:00';
        const timeB = b.activityTime || '00:00';
        const dateA = new Date(`${a.activityDate}T${timeA}:00`);
        const dateB = new Date(`${b.activityDate}T${timeB}:00`);
        return dateB - dateA; // Descending order (newest first)
      } catch (error) {
        return 0;
      }
    });

    return sortedFeed.slice(0, limit);
  }, [user?.name, activities, projects, limit]);

  return {
    teamActivityFeed,
    isLoading: false,
    hasProjects: projects.length > 0,
    userProjects: projects.filter(project => 
      Array.isArray(project.assignedMembers) && 
      project.assignedMembers.includes(user?.name || '')
    )
  };
};
