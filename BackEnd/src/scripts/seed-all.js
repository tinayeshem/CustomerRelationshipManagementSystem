/**
 * Seed ALL collections with a few rows aligned to your UI.
 * Safe to re-run (upserts + “seed” tags).
 * Run: cd BackEnd/src && npm run db:seed:local   // or :atlas
 */

import "../config/env.js";                         // <- my  your env loader is here

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

// bring actual model classes
import {
  User, Team, Client, LRSU, Activity, Contract, Finance, Report, Notification,
} from "../models/index.js";

// ---------- helpers ----------
const now = new Date();// Stores the current date/time. Handy for timestamps.
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);//Makes a date at the first day of this month (00:00 time). Helps seed “this month’s” data.
const day = 24 * 60 * 60 * 1000; //Number of milliseconds in a day. Used for easy date math.
const eur = (n) => Math.round(n * 100) / 100;//Rounds a number to 2 decimals (like currency).

const upsertOne = (Model, where, insert) =>
  Model.findOneAndUpdate(where, { $setOnInsert: insert }, { upsert: true, new: true, setDefaultsOnInsert: true });//A tiny utility that creates a document if it doesn’t exist, or returns the existing one.

async function ensureCollectionsAndIndexes(...Models) {
  for (const M of Models) { await M.createCollection().catch(() => {}); await M.syncIndexes(); }
}//Makes sure each collection actually exists, and builds indexes from the schema.

//createCollection() does nothing if it already exists (we ignore the error).
//syncIndexes() ensures MongoDB indexes match your schema’s indexes.

// ---------- static seeds ----------
//These arrays are not saved yet. They’re templates we’ll insert later.


const seedUsers = [
  { name: "Ana Marić",   email: "ana.maric@som.hr",   role: "KAM",     phone: "+385-91-111-1111" },
  { name: "Marko Petrović", email: "marko.petrovic@som.hr", role: "Sales",   phone: "+385-91-222-2222" },
  { name: "Petra Babić", email: "petra.babic@som.hr", role: "Support", phone: "+385-91-333-3333" }
];//Three team members (Ana, Marko, Petra) with roles and contact info.

const seedTeams = [
  { name: "Support", description: "Support team", members: [
    { memberEmail: "ana.maric@som.hr", role: "Manager" },
    { memberEmail: "petra.babic@som.hr", role: "Member" },
  ]},
  { name: "Sales", description: "Sales team", members: [
    { memberEmail: "marko.petrovic@som.hr", role: "Manager" },
    { memberEmail: "ana.maric@som.hr", role: "Member" },
  ]},
];
//Two teams (“Support”, “Sales”) with member emails and roles inside the team.
// We will resolve these emails to User ObjectIds later.


const seedClients = [
  { name: "Zagreb Municipality", type: "LRSU", county: "Zagreb", status: "Active", priority: "Low",
    address: { line1: "Trg bana Jelačića 1", city: "Zagreb", county: "Zagreb" },
    kamEmail: "ana.maric@som.hr", revenue: 45000, costs: 32000
  },
  { name: "Split City Council", type: "LRSU", county: "Split-Dalmatia", status: "Potential", priority: "Urgent",
    address: { line1: "Peristil bb", city: "Split", county: "Split-Dalmatia" },
    kamEmail: "ana.maric@som.hr", revenue: 0, costs: 5000
  },
  { name: "Sports Club Dinamo", type: "Club", county: "Zagreb", status: "Active", priority: "Medium",
    address: { line1: "Maksimirska", city: "Zagreb", county: "Zagreb" },
    kamEmail: "marko.petrovic@som.hr", revenue: 12000, costs: 9500
  },
  { name: "Tech Solutions Ltd", type: "Company", county: "Zagreb", status: "Active", priority: "Low",
    address: { line1: "Radnička cesta 1", city: "Zagreb", county: "Zagreb" },
    kamEmail: "petra.babic@som.hr", revenue: 25000, costs: 18000
  },
  { name: "Crafters Association Zagreb", type: "Association", county: "Zagreb", status: "Active", priority: "Low",
    address: { line1: "Praška 3", city: "Zagreb", county: "Zagreb" },
    kamEmail: "petra.babic@som.hr", revenue: 8000, costs: 0
  },
];
//Five clients with address, status, priority, KAM email, and simple finance fields.
//Again, KAM email will be replaced with a User ObjectId.


const seedLrsu = [
  { name: "Zagreb Municipality", type: "City", county: "Zagreb", mayor: "Milan Bandić",
    status: "Client", priority: "High",
    contactPersons: [{ name: "Ivana Novak", role: "Secretary", email: "ivana@zagreb.hr" }]
  },
  { name: "Split City", type: "City", county: "Split-Dalmatia", mayor: "Ivica Puljak",
    status: "Negotiation in Progress", priority: "Urgent",
    contactPersons: [{ name: "Ante K.", role: "Chief of Staff", email: "ante@split.hr" }]
  },
];
//Two LRSU rows with contactPersons and metadata.



// ---------- factories (DI) ----------
const activitiesFactory = ({ usersByEmail, clientsByName }) => ([
  {
    activityType: "Call", category: "Support", client: "Zagreb Municipality",
    when: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    responsible: "ana.maric@som.hr", status: "Done", priority: "High",
    isTicket: true, ticketType: "Bug", premiumSupport: true,
    notes: "[seed] Resolved ticketing issue. Client happy with response time."
  },
  {
    activityType: "Email", category: "Sales", client: "Sports Club Dinamo",
    when: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    responsible: "marko.petrovic@som.hr", status: "In Progress", priority: "Medium",
    isTicket: false, notes: "[seed] Following up on contract proposal."
  },
  {
    activityType: "In-person Meeting", category: "Sales", client: "Split City Council",
    when: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0),
    responsible: "ana.maric@som.hr", status: "To Do", priority: "Low",
    isTicket: false, notes: "[seed] Demo presentation for Split City."
  }
].map(a => ({
  activityType: a.activityType,
  category: a.category,
  linkedClient: clientsByName[a.client]._id,
  clientType: "Client",
  when: a.when,
  responsible: usersByEmail[a.responsible]._id,
  status: a.status,
  priority: a.priority,
  isTicket: a.isTicket,
  ticketType: a.ticketType,
  premiumSupport: !!a.premiumSupport,
  notes: a.notes
})));

const invoicesFactory = ({ clientsByName }) => ([
  { client: "Zagreb Municipality", gross: 45000, number: "INV-2025-001", description: "Annual SLA" },
  { client: "Zagreb Municipality", gross: 35000, number: "INV-2025-002", description: "Phase 2 rollout" },
  { client: "Tech Solutions Ltd",  gross: 25000, number: "INV-2025-003", description: "Custom reports" },
  { client: "Sports Club Dinamo",  gross: 12000, number: "INV-2025-004", description: "Training + support" },
  { client: "Crafters Association Zagreb", gross: 8000, number: "INV-2025-005", description: "Justification services" },
].map(i => {
  const net = eur(i.gross / 1.25);
  return {
    client: clientsByName[i.client]._id,
    kind: "invoice",
    number: i.number,
    description: i.description,
    currency: "EUR",
    netAmount: net,
    vatRate: 25,
    grossAmount: eur(net * 1.25),
    status: "paid",
    issueDate: new Date(startOfMonth.getTime() + 2 * day),
    paidDate: new Date(startOfMonth.getTime() + 3 * day),
    tags: ["seed"]
  };
}));

// ---------- seeders (SRP) -- Seeders (each function does one job)----------

//Every function below inserts one entity type. They’re intentionally small (SOLID: single responsibility).

async function seedUsersUC() {
  const out = [];
  for (const u of seedUsers) out.push(await upsertOne(User, { email: u.email }, u));
  return out;
}
//For each user in seedUsers --upsertOne(User, { email }, userData) → create if missing or return existing.
//Returns the created/found users.



async function seedTeamsUC({ usersByEmail }) {
  const out = [];
  for (const t of seedTeams) {
    const members = t.members.map(m => ({ user: usersByEmail[m.memberEmail]._id, role: m.role }));
    out.push(await upsertOne(Team, { name: t.name }, { name: t.name, description: t.description, members }));
  }
  // back-link
  for (const team of out) {
    await User.updateMany({ _id: { $in: team.members.map(m => m.user) } }, { $addToSet: { teams: team._id } });
  }
  return out;
}
//Converts each member email to user: <User _id>
//Upserts the team by name.
//Back-links users so each user’s teams array contains this team (without duplicates, thanks to $addToSet).

async function seedClientsUC({ usersByEmail }) {
  const out = [];
  for (const c of seedClients) {
    out.push(await upsertOne(Client, { name: c.name }, { ...c, kam: usersByEmail[c.kamEmail]._id }));
  }
  return out;
}
//Upserts each client by name.
//Replaces kamEmail with kam: <User _id>.




async function seedLrsuUC() {
  const out = [];
  for (const l of seedLrsu) out.push(await upsertOne(LRSU, { name: l.name }, l));
  return out;
}

//Upserts each LRSU row by name.

async function seedContractsUC({ clientsByName, usersByEmail }) {
  await Contract.deleteMany({ title: /seed/i });
  return Contract.insertMany([
    {
      client: clientsByName["Zagreb Municipality"]._id,
      title: "Support SLA 2025 [seed]",
      status: "Active",
      effectiveDate: startOfMonth,
      expiryDate: new Date(now.getFullYear(), now.getMonth() + 11, 30),
      signers: [{ name: "Ana Marić", email: "ana.maric@som.hr", role: "KAM" }],
      currentVersion: 1,
      versions: [{ version: 1, fileKey: `contracts/${clientsByName["Zagreb Municipality"]._id}/sla-2025-v1.pdf`, size: 120000, uploadedBy: usersByEmail["ana.maric@som.hr"]._id }]
    },
    {
      client: clientsByName["Split City Council"]._id,
      title: "Proposal 2025 [seed]",
      status: "Draft",
      currentVersion: 1,
      versions: [{ version: 1, fileKey: `contracts/${clientsByName["Split City Council"]._id}/proposal-v1.pdf`, size: 90000, uploadedBy: usersByEmail["ana.maric@som.hr"]._id }]
    }
  ]);
}
//First line removes any previously seeded contracts (title containing “[seed]”).
//insertMany adds 2 example contracts:
//Each client is a Client ObjectId.
//versions holds file metadata (as if stored in S3).
//uploadedBy is a User ObjectId.

async function seedActivitiesUC({ usersByEmail, clientsByName }) {
  await Activity.deleteMany({ notes: /\[seed\]/i });
  return Activity.insertMany(activitiesFactory({ usersByEmail, clientsByName }));
}
//Removes previously seeded activities (we detect via the [seed] string in notes).
//Creates new activities from the factory.


async function seedFinanceUC({ clientsByName }) {
  await Finance.deleteMany({ tags: "seed" });
  return Finance.insertMany(invoicesFactory({ clientsByName }));
}
//Removes previously seeded finance rows (they have tags: ["seed"]).
//Inserts invoices from the factory.

async function seedReportsUC({ usersByEmail }) {
  await Report.deleteMany({ name: /seed/i });
  return Report.insertMany([
    { name: "Time Spent (This Month) [seed]", type: "timeSpent",     filters: { range: "month" }, viz: "table", createdBy: usersByEmail["petra.babic@som.hr"]._id },
    { name: "Client Profitability [seed]",    type: "profitByClient", filters: { range: "month" }, viz: "table", createdBy: usersByEmail["ana.maric@som.hr"]._id }
  ]);
}
//Deletes old seeded report definitions.
//Inserts two report definitions (not the computed data—your app will compute when viewing/exporting).

async function seedNotificationsUC({ usersByEmail }) {
  await Notification.deleteMany({ title: /\[seed\]/i });
  return Notification.insertMany([
    { user: usersByEmail["ana.maric@som.hr"]._id,   title: "[seed] Demo tomorrow 9:00", body: "Split City Council presentation.", entityType: "Activity", importance: "high", channels: ["inapp"] },
    { user: usersByEmail["marko.petrovic@som.hr"]._id, title: "[seed] Proposal follow-up", body: "Sports Club Dinamo expects pricing.", entityType: "Activity", channels: ["inapp"] },
    { user: usersByEmail["petra.babic@som.hr"]._id, title: "[seed] Premium support ticket", body: "Zagreb Municipality (Bug)", entityType: "Ticket", channels: ["inapp"] }
  ]);
}
//Deletes previously seeded notifications (title has [seed]).
//Inserts three example notifications for each user.



// ---------- orchestrator ----------
async function main() {
  await connectDB();//Opens a single connection to MongoDB using your MONGO_URI.
  await ensureCollectionsAndIndexes(User, Team, Client, LRSU, Activity, Contract, Finance, Report, Notification);
  //Makes sure all collections exist and their indexes are in place


  const userDocs = await seedUsersUC();//Seeds users first.

  const usersByEmail = Object.fromEntries(userDocs.map(u => [u.email, u]));//Builds a lookup map: email ➜ user document.

  await seedTeamsUC({ usersByEmail });//Seeds teams with real user ObjectIds. Also back-links teams into users.

  const clientDocs = await seedClientsUC({ usersByEmail });//Seeds clients (needs users to exist so we can set kam).

  await seedLrsuUC();//Seeds LRSU

  const clientsByName = Object.fromEntries(clientDocs.map(c => [c.name, c]));
  //Builds a lookup map: client name ➜ client document.
 //(Needed to convert names to ObjectIds.)


  await seedContractsUC({ clientsByName, usersByEmail });
  await seedActivitiesUC({ usersByEmail, clientsByName });
  await seedFinanceUC({ clientsByName });
  await seedReportsUC({ usersByEmail });
  await seedNotificationsUC({ usersByEmail });

  //Seeds the remaining collections, passing the lookup maps so factories can fill in ObjectIds.

  const [u, t, c, l, a, f, r, n] = await Promise.all([
    User.countDocuments(), Team.countDocuments(), Client.countDocuments(), LRSU.countDocuments(),
    Activity.countDocuments({ notes: /\[seed\]/i }), Finance.countDocuments({ tags: "seed" }),
    Report.countDocuments({ name: /seed/i }), Notification.countDocuments({ title: /\[seed\]/i })
  ]);
  console.log("✅ Seed complete:", { users: u, teams: t, clients: c, lrsu: l, activities_seeded: a, finance_seeded: f, reports_seeded: r, notifications_seeded: n });
  //Counts how many documents exist now:
  //For Activities/Finance/Reports/Notifications we count only the seeded ones using the markers so we don’t mix with your future real data.
  //Prints a friendly summary.

  await mongoose.disconnect();
  //Cleanly closes the DB connection.
}

main().catch(err => { console.error(err); process.exit(1); });
//Runs main() and if an error happens, prints it and exits with a failure code.
