import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, Phone, Star, Users, Video } from "lucide-react";

const typeIcon = (t) => {
  switch (t) {
    case "Call":
      return <Phone className="h-3.5 w-3.5" />;
    case "Email":
      return <Mail className="h-3.5 w-3.5" />;
    case "Online Meeting":
      return <Video className="h-3.5 w-3.5" />;
    case "In-person Meeting":
      return <Users className="h-3.5 w-3.5" />;
    default:
      return <Users className="h-3.5 w-3.5" />;
  }
};

function parseDateTime(d, t) {
  try {
    const iso = `${d || ""}T${(t || "00:00").padStart(5, "0")}:00`;
    const dt = new Date(iso);
    return isNaN(dt.getTime()) ? null : dt;
  } catch {
    return null;
  }
}

function daysSince(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const ms = Date.now() - d.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function getPremiumForClient(name, organizations, leads, activitiesForClient) {
  if (
    Array.isArray(activitiesForClient) &&
    activitiesForClient.some((a) => !!a.premiumSupport)
  )
    return true;
  const org = Array.isArray(organizations)
    ? organizations.find((o) => o?.organizationName === name)
    : null;
  if (org && typeof org.premiumSupport === "boolean")
    return !!org.premiumSupport;
  const lead = Array.isArray(leads)
    ? leads.find((l) => l?.name === name)
    : null;
  if (lead && typeof lead.isPremium === "boolean") return !!lead.isPremium;
  return false;
}

export default function Timeline({ activities, organizations }) {
  const leads = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("sales_leads");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const byClient = React.useMemo(() => {
    const map = new Map();
    (activities || []).forEach((a) => {
      if (!a?.linkedClient) return;
      const arr = map.get(a.linkedClient) || [];
      arr.push(a);
      map.set(a.linkedClient, arr);
    });
    // sort each client's activities chronologically (oldest first)
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => {
        const da = parseDateTime(a.date, a.time) || new Date(0);
        const db = parseDateTime(b.date, b.time) || new Date(0);
        return da - db;
      });
    }
    return map;
  }, [activities]);

  const clients = React.useMemo(
    () => Array.from(byClient.keys()).sort(),
    [byClient],
  );

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Client Activity Timeline
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-800 border-blue-200"
          >
            {clients.length} Active Clients
          </Badge>
        </div>
        <CardDescription>
          Visual timeline showing activity progression for each client
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {clients.map((client) => {
          const items = byClient.get(client) || [];
          const last = items[items.length - 1];
          const lastDays = last ? daysSince(last.date) : null;
          const isPremium = getPremiumForClient(
            client,
            organizations,
            leads,
            items,
          );
          const initial = client?.trim()?.charAt(0)?.toUpperCase() || "?";

          return (
            <div
              key={client}
              className="rounded-lg border bg-white/90 backdrop-blur-sm p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center text-sm font-semibold">
                    {initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {client}
                      </h3>
                      {isPremium && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 border-yellow-200 inline-flex items-center gap-1"
                        >
                          <Star className="h-3 w-3" /> Premium
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>
                        {items.length}{" "}
                        {items.length === 1 ? "activity" : "activities"}
                      </span>
                      {lastDays != null && (
                        <span>
                          • last {lastDays === 0 ? "today" : `${lastDays}d ago`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-4 pl-3">
                <div className="relative">
                  <div
                    className="absolute left-3 top-0 bottom-0 w-px bg-blue-100"
                    aria-hidden
                  />
                  <div className="space-y-5">
                    {items.map((a, idx) => {
                      const dt = parseDateTime(a.date, a.time);
                      return (
                        <div key={a.id || idx} className="relative flex gap-4">
                          <div className="absolute -left-0.5 mt-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                          <div className="ml-6 flex-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                {typeIcon(a.activityType)}
                                <span className="font-medium">
                                  {a.activityType}
                                </span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {a.date} {a.time ? `at ${a.time}` : ""}
                              </span>
                              {a.status && (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-50 text-gray-700 border-gray-200"
                                >
                                  {a.status}
                                </Badge>
                              )}
                              {a.ticketType && (
                                <Badge
                                  variant="outline"
                                  className="bg-purple-50 text-purple-700 border-purple-200"
                                >
                                  {a.ticketType}
                                </Badge>
                              )}
                            </div>
                            {a.notes && (
                              <p className="text-sm mt-1 text-foreground/90">
                                {a.notes}
                              </p>
                            )}
                            {Array.isArray(a.responsible) &&
                              a.responsible.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Responsible: {a.responsible.join(", ")}
                                </p>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
