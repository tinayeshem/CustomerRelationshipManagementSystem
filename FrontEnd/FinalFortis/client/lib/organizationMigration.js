// Data migration utility for converting Client and LRSU data to unified Organization structure

// Sample data from Client dashboard (for migration reference)
const clientData = [
  {
    id: 1,
    name: "Zagreb Municipality",
    type: "LRSU",
    clientType: "Municipality",
    contractType: "Tender",
    contractValue: 45000,
    vatAmount: 11250,
    contractStart: "2024-01-01",
    contractEnd: "2026-12-31",
    paymentMethod: "Monthly",
    paymentDeadline: "15th of month",
    kam: "Ana Marić",
    status: "Active",
    county: "Zagreb",
    address: "Trg bana Jelačića 1, Zagreb, Croatia",
    contactPersons: [
      { name: "Ivan Horvat", role: "IT Manager", phone: "+385 1 234 5678", email: "ivan.horvat@zagreb.hr" }
    ],
    notes: "Excellent relationship. Always pays on time. Looking to expand services.",
    revenue: 45000,
    costs: 32000,
    profitability: 28.9,
    attachments: ["contract_2024.pdf", "service_agreement.pdf"],
    relatedContacts: ["Split Municipality", "Osijek City"],
    lastContact: "2024-01-10",
    nextPayment: "2024-01-15",
    contractRenewal: "2026-11-01",
    priority: "high"
  },
  {
    id: 2,
    name: "Sports Club Dinamo",
    type: "Club",
    clientType: "Sports Club",
    contractType: "Justification",
    contractValue: 12000,
    vatAmount: 3000,
    contractStart: "2024-03-01",
    contractEnd: "2025-02-28",
    paymentMethod: "Quarterly",
    paymentDeadline: "End of quarter",
    kam: "Marko Petrović",
    status: "Active",
    county: "Zagreb",
    address: "Maksimirska 128, Zagreb, Croatia",
    contactPersons: [
      { name: "Petra Kovač", role: "Secretary", phone: "+385 1 987 6543", email: "petra@dinamo.hr" }
    ],
    notes: "Growing club with potential for upgrade. Good payment history.",
    revenue: 12000,
    costs: 9500,
    profitability: 20.8,
    attachments: ["contract_dinamo.pdf"],
    relatedContacts: ["HNK Hajduk", "NK Osijek"],
    lastContact: "2024-01-08",
    nextPayment: "2024-03-31",
    contractRenewal: "2024-12-01",
    priority: "medium"
  },
  {
    id: 3,
    name: "Split City Council",
    type: "LRSU",
    clientType: "City",
    contractType: "Tender",
    contractValue: 75000,
    vatAmount: 18750,
    contractStart: "2024-06-01",
    contractEnd: "2027-05-31",
    paymentMethod: "Monthly",
    paymentDeadline: "30th of month",
    kam: "Ana Marić",
    status: "Potential",
    county: "Split-Dalmatia",
    address: "Peristil bb, Split, Croatia",
    contactPersons: [
      { name: "Luka Milic", role: "Deputy Mayor", phone: "+385 21 555 123", email: "luka.milic@split.hr" }
    ],
    notes: "High-value prospect. Currently in final negotiation phase.",
    revenue: 0,
    costs: 5000,
    profitability: -100,
    attachments: ["proposal_split.pdf", "demo_presentation.pdf"],
    relatedContacts: ["Rijeka Port", "Zadar Municipality"],
    lastContact: "2024-01-12",
    nextPayment: null,
    contractRenewal: null,
    priority: "urgent"
  },
  {
    id: 4,
    name: "Tech Solutions Ltd",
    type: "Company",
    clientType: "SME",
    contractType: "Direct",
    contractValue: 25000,
    vatAmount: 6250,
    contractStart: "2023-09-01",
    contractEnd: "2024-08-31",
    paymentMethod: "Bi-annual",
    paymentDeadline: "March 31, September 30",
    kam: "Marko Petrović",
    status: "Expired",
    county: "Zagreb",
    address: "Ilica 242, Zagreb, Croatia",
    contactPersons: [
      { name: "Stjepan Novak", role: "CEO", phone: "+385 1 444 7890", email: "stjepan@techsolutions.hr" }
    ],
    notes: "Contract expired. Needs renewal follow-up. Good technical partnership.",
    revenue: 25000,
    costs: 18000,
    profitability: 28.0,
    attachments: ["expired_contract.pdf", "renewal_proposal.pdf"],
    relatedContacts: ["Digital Craft", "Code Factory"],
    lastContact: "2023-12-15",
    nextPayment: null,
    contractRenewal: "2024-01-15",
    priority: "urgent"
  },
  {
    id: 5,
    name: "Crafters Association Zagreb",
    type: "Association",
    clientType: "Craftsmen",
    contractType: "Justification",
    contractValue: 8000,
    vatAmount: 2000,
    contractStart: "2024-02-01",
    contractEnd: "2025-01-31",
    paymentMethod: "Annual",
    paymentDeadline: "February 28",
    kam: "Petra Babić",
    status: "Active",
    county: "Zagreb",
    address: "Praška 3, Zagreb, Croatia",
    contactPersons: [
      { name: "Marija Craft", role: "President", phone: "+385 1 333 2222", email: "marija@crafters-zg.hr" }
    ],
    notes: "Reliable small client. Potential to connect with other associations.",
    revenue: 8000,
    costs: 6200,
    profitability: 22.5,
    attachments: ["association_contract.pdf"],
    relatedContacts: ["Craftsmen Union", "Trade Association"],
    lastContact: "2024-01-05",
    nextPayment: "2025-02-28",
    contractRenewal: "2024-11-01",
    priority: "low"
  }
];

const NEW_PHASES = ["New","First contact","interested","Offer sent","Accepted","Contract signed","implementation","Declined"];

// Sample data from LRSU dashboard (for migration reference)
const lrsuData = [
  {
    id: 1,
    name: "Zagreb Municipality",
    taxId: "12345678901",
    address: "Trg bana Jelačića 1, Zagreb",
    county: "Zagreb",
    rulingParty: "HDZ",
    mayor: "Milan Bandić",
    budgetSize: 2500000,
    contactPersons: [
      { name: "Ana Marić", role: "IT Director", phone: "+385 1 234 5678", email: "ana.maric@zagreb.hr" }
    ],
    notes: "Major client using SOM system. Very satisfied with services.",
    status: "Client",
    type: "Municipality",
    institutions: ["Zagreb Public Library", "Zagreb Zoo", "Technical Museum"],
    coordinates: { lat: 45.8150, lng: 15.9819 },
    lastContact: "2024-01-10",
    nextFollowUp: "2024-01-25",
    priority: "high",
    contractExpiry: "2025-12-31"
  },
  {
    id: 2,
    name: "Split City",
    taxId: "98765432109",
    address: "Peristil bb, Split",
    county: "Split-Dalmatia",
    rulingParty: "SDP",
    mayor: "Ivica Puljak",
    budgetSize: 1800000,
    contactPersons: [
      { name: "Marko Petrović", role: "Deputy Mayor", phone: "+385 21 345 678", email: "marko.petrovic@split.hr" }
    ],
    notes: "Potential for expansion into tourism management systems.",
    status: "Negotiation in Progress",
    type: "City",
    institutions: ["Split Museum", "Marjan Park Administration"],
    coordinates: { lat: 43.5081, lng: 16.4402 },
    lastContact: "2024-01-12",
    nextFollowUp: "2024-01-15",
    priority: "urgent",
    contractExpiry: "2024-02-28"
  },
  {
    id: 3,
    name: "Osijek Municipality",
    taxId: "11223344556",
    address: "Županijska 2, Osijek",
    county: "Osijek-Baranja",
    rulingParty: "HDZ",
    mayor: "Ivan Radić",
    budgetSize: 950000,
    contactPersons: [
      { name: "Petra Kovačić", role: "IT Coordinator", phone: "+385 31 234 567", email: "petra.kovacic@osijek.hr" }
    ],
    notes: "Former client, contract expired in 2023. Open to renewal.",
    status: "Former Client",
    type: "Municipality",
    institutions: ["Osijek University", "Croatian National Theatre"],
    coordinates: { lat: 45.5550, lng: 18.6955 },
    lastContact: "2023-12-15",
    nextFollowUp: "2024-02-01",
    priority: "medium",
    contractExpiry: "2023-12-31"
  },
  {
    id: 4,
    name: "Rijeka Port Authority",
    taxId: "55667788990",
    address: "Riva 1, Rijeka",
    county: "Primorje-Gorski Kotar",
    rulingParty: "SDP",
    mayor: "Marko Filipović",
    budgetSize: 3200000,
    contactPersons: [
      { name: "Luka Marinović", role: "General Manager", phone: "+385 51 987 654", email: "luka.marinovic@rijeka-port.hr" }
    ],
    notes: "High-value potential client. Interested in logistics management.",
    status: "Potential Client",
    type: "County",
    institutions: ["Maritime Museum", "Port Operations Center"],
    coordinates: { lat: 45.3271, lng: 14.4422 },
    lastContact: "2024-01-08",
    nextFollowUp: "2024-03-15",
    priority: "low",
    contractExpiry: null
  },
  {
    id: 5,
    name: "Varaždin City",
    taxId: "66778899001",
    address: "Gradska ul. 1, Varaždin",
    county: "Varaždin",
    rulingParty: "HDZ",
    mayor: "Neven Bosilj",
    budgetSize: 1200000,
    contactPersons: [
      { name: "Martina Babić", role: "Finance Director", phone: "+385 42 123 456", email: "martina.babic@varazdin.hr" }
    ],
    notes: "Recently contacted. Showed interest in our demo.",
    status: "Not Contacted",
    type: "City",
    institutions: ["Varaždin Castle", "City Theatre"],
    coordinates: { lat: 46.3058, lng: 16.3364 },
    lastContact: null,
    nextFollowUp: "2024-01-20",
    priority: "medium",
    contractExpiry: null
  }
];

/**
 * Converts a Client record to Organization format
 */
const migrateClientToOrganization = (client, index) => {
  // Determine unit type and category based on client type
  let unitType = "Independent";
  let category = client.clientType;
  let county = "";
  let municipality = "";
  let city = "";

  if (client.type === "LRSU") {
    unitType = "Government";
    if (client.clientType === "Municipality") {
      municipality = client.name;
      category = "Municipality";
    } else if (client.clientType === "City") {
      city = client.name;
      category = "City";
    } else if (client.clientType === "County") {
      county = client.name;
      category = "County";
    }
  }

  // Map status from Client to Organization
  let organizationStatus = client.status;
  if (client.status === "Active") organizationStatus = "Client";
  if (client.status === "Potential") organizationStatus = "Potential Client";
  if (client.status === "Expired") organizationStatus = "Former Client";

  // Determine phase based on status and contract info
  let phase = "First contact";
  if (client.status === "Active") phase = "implementation";
  else if (client.status === "Potential") phase = "interested";
  else if (client.status === "Expired") phase = "implementation";

  // Get primary contact person
  const primaryContact = client.contactPersons?.[0] || {};
  const [firstName, ...surnameArray] = (primaryContact.name || "").split(" ");
  const surname = surnameArray.join(" ");

  return {
    id: 1000 + index, // Offset to avoid conflicts with LRSU IDs
    organizationName: client.name,
    unitType: unitType,
    category: category,
    county: county,
    municipality: municipality,
    city: city,
    status: organizationStatus,
    phase: phase,
    nextPhase: (() => { const idx = NEW_PHASES.indexOf(phase); return idx >= 0 && idx < NEW_PHASES.length - 1 ? NEW_PHASES[idx + 1] : ""; })(),
    address: client.address,
    phone: "", // Not available in client data
    fax: "",   // Not available in client data
    email: primaryContact.email || "",
    websites: [], // Not available in client data
    contactPerson: {
      firstName: firstName || "",
      surname: surname || "",
      role: primaryContact.role || "",
      phone: primaryContact.phone || ""
    },
    notes: client.notes || "",
    createdDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    // Legacy fields for compatibility
    legacyClientId: client.id,
    legacySource: "Client",
    kam: client.kam,
    contractValue: client.contractValue,
    contractStart: client.contractStart,
    contractEnd: client.contractEnd,
    priority: client.priority
  };
};

/**
 * Converts an LRSU record to Organization format
 */
const migrateLRSUToOrganization = (lrsu, index) => {
  // LRSU data is already government-oriented
  let county = "";
  let municipality = "";
  let city = "";

  if (lrsu.type === "County") {
    county = lrsu.name;
  } else if (lrsu.type === "Municipality") {
    municipality = lrsu.name;
  } else if (lrsu.type === "City") {
    city = lrsu.name;
  }

  // Determine phase based on status
  let phase = "First contact";
  if (lrsu.status === "Client") phase = "implementation";
  else if (lrsu.status === "Negotiation in Progress") phase = "interested";
  else if (lrsu.status === "Former Client") phase = "implementation";
  else if (lrsu.status === "Potential Client") phase = "interested";
  else if (lrsu.status === "Not Contacted") phase = "First contact";

  // Get primary contact person
  const primaryContact = lrsu.contactPersons?.[0] || {};
  const [firstName, ...surnameArray] = (primaryContact.name || "").split(" ");
  const surname = surnameArray.join(" ");

  return {
    id: 2000 + index, // Offset to avoid conflicts with Client IDs
    organizationName: lrsu.name,
    unitType: "Government",
    category: lrsu.type,
    county: county,
    municipality: municipality,
    city: city,
    status: lrsu.status,
    phase: phase,
    nextPhase: (() => { const idx = NEW_PHASES.indexOf(phase); return idx >= 0 && idx < NEW_PHASES.length - 1 ? NEW_PHASES[idx + 1] : ""; })(),
    address: lrsu.address,
    phone: "", // Not available in LRSU data
    fax: "",   // Not available in LRSU data
    email: primaryContact.email || "",
    websites: [], // Not available in LRSU data
    contactPerson: {
      firstName: firstName || "",
      surname: surname || "",
      role: primaryContact.role || "",
      phone: primaryContact.phone || ""
    },
    notes: lrsu.notes || "",
    createdDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    // Legacy fields for compatibility
    legacyLRSUId: lrsu.id,
    legacySource: "LRSU",
    taxId: lrsu.taxId,
    mayor: lrsu.mayor,
    rulingParty: lrsu.rulingParty,
    budgetSize: lrsu.budgetSize,
    institutions: lrsu.institutions,
    priority: lrsu.priority
  };
};

/**
 * Performs complete migration from Client and LRSU data to Organization format
 */
export const performDataMigration = () => {
  console.log("Starting data migration from Client and LRSU to Organization...");
  
  const migratedOrganizations = [];
  
  // Migrate Client data
  clientData.forEach((client, index) => {
    const organizationRecord = migrateClientToOrganization(client, index);
    migratedOrganizations.push(organizationRecord);
  });
  
  // Migrate LRSU data (avoiding duplicates by name)
  lrsuData.forEach((lrsu, index) => {
    // Check if organization with same name already exists from client migration
    const existingOrg = migratedOrganizations.find(org => 
      org.organizationName.toLowerCase() === lrsu.name.toLowerCase()
    );
    
    if (existingOrg) {
      // Merge LRSU data into existing organization
      console.log(`Merging LRSU data for existing organization: ${lrsu.name}`);
      existingOrg.taxId = lrsu.taxId;
      existingOrg.mayor = lrsu.mayor;
      existingOrg.rulingParty = lrsu.rulingParty;
      existingOrg.budgetSize = lrsu.budgetSize;
      existingOrg.institutions = lrsu.institutions;
      existingOrg.legacyLRSUId = lrsu.id;
      // Prefer LRSU contact information if more complete
      if (!existingOrg.contactPerson.firstName && lrsu.contactPersons?.[0]) {
        const primaryContact = lrsu.contactPersons[0];
        const [firstName, ...surnameArray] = (primaryContact.name || "").split(" ");
        existingOrg.contactPerson = {
          firstName: firstName || "",
          surname: surnameArray.join(" "),
          role: primaryContact.role || "",
          phone: primaryContact.phone || ""
        };
        existingOrg.email = primaryContact.email || existingOrg.email;
      }
    } else {
      // Create new organization from LRSU data
      const organizationRecord = migrateLRSUToOrganization(lrsu, index);
      migratedOrganizations.push(organizationRecord);
    }
  });
  
  console.log(`Migration completed. Created ${migratedOrganizations.length} organization records.`);
  return migratedOrganizations;
};

/**
 * Checks if migration is needed (no existing organization data)
 */
export const isMigrationNeeded = () => {
  const existingData = localStorage.getItem('organizationData');
  return !existingData || JSON.parse(existingData).length === 0;
};

/**
 * Gets migration summary for display
 */
export const getMigrationSummary = () => {
  return {
    clientRecords: clientData.length,
    lrsuRecords: lrsuData.length,
    totalOrganizations: performDataMigration().length,
    duplicatesFound: clientData.length + lrsuData.length - performDataMigration().length
  };
};

export default {
  performDataMigration,
  isMigrationNeeded,
  getMigrationSummary
};
