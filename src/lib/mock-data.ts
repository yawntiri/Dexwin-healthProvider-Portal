import type {
  Provider, TeamMember, SettlementAccount, Service, Bill, BillLineItem,
  PatientRecord, AuditEntry, Notification, SupportTicket, DailyRevenue,
  RevenueByCategory, RevenueByEmployer, TopService, Session, AuthUser
} from "./types";

// ─── Current User ─────────────────────────────────────────────────────────────

export const currentUser: AuthUser = {
  id: "usr-001",
  name: "Kwame Mensah",
  email: "kwame.mensah@accrahospital.com",
  role: "Owner",
  providerId: "prov-001",
  providerName: "Accra General Hospital",
  providerStatus: "Active",
  twoFaEnabled: true,
  twoFaEnforced: true,
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const mockProvider: Provider = {
  id: "prov-001",
  facilityName: "Accra General Hospital",
  facilityType: "Hospital",
  status: "Active",
  primaryContactName: "Kwame Mensah",
  primaryContactEmail: "kwame.mensah@accrahospital.com",
  primaryContactPhone: "+233244567890",
  businessEmail: "admin@accrahospital.com",
  businessPhone: "+233302123456",
  ghanaGpsAddress: "GA-182-4567",
  hefraLicenseNumber: "HEFRA/H/2019/0456",
  operatingHours: "Mon–Fri 8:00 AM – 8:00 PM · Sat 9:00 AM – 4:00 PM",
  isVerifiedByDexwin: true,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2025-03-10"),
};

// ─── Team Members ─────────────────────────────────────────────────────────────

export const mockTeam: TeamMember[] = [
  {
    id: "usr-001",
    providerId: "prov-001",
    name: "Kwame Mensah",
    email: "kwame.mensah@accrahospital.com",
    role: "Owner",
    status: "Active",
    lastActiveAt: new Date(),
    joinedAt: new Date("2024-01-15"),
    twoFaEnabled: true,
  },
  {
    id: "usr-002",
    providerId: "prov-001",
    name: "Ama Boateng",
    email: "ama.boateng@accrahospital.com",
    role: "Manager",
    status: "Active",
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    joinedAt: new Date("2024-02-01"),
    twoFaEnabled: true,
  },
  {
    id: "usr-003",
    providerId: "prov-001",
    name: "Kofi Asante",
    email: "kofi.asante@accrahospital.com",
    role: "Staff",
    status: "Active",
    lastActiveAt: new Date(Date.now() - 30 * 60 * 1000),
    joinedAt: new Date("2024-03-10"),
    twoFaEnabled: false,
  },
  {
    id: "usr-004",
    providerId: "prov-001",
    name: "Abena Osei",
    email: "abena.osei@accrahospital.com",
    role: "Staff",
    status: "Invited",
    invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    twoFaEnabled: false,
  },
  {
    id: "usr-005",
    providerId: "prov-001",
    name: "Yaw Darko",
    email: "yaw.darko@accrahospital.com",
    role: "Staff",
    status: "Deactivated",
    lastActiveAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    joinedAt: new Date("2024-04-01"),
    twoFaEnabled: false,
  },
];

// ─── Settlement Accounts ──────────────────────────────────────────────────────

export const mockSettlementAccounts: SettlementAccount[] = [
  {
    id: "acct-001",
    providerId: "prov-001",
    type: "Bank",
    accountHolderName: "Accra General Hospital",
    accountNumber: "****7823",
    bankName: "GCB Bank",
    bankBranch: "Accra Main Branch",
    status: "Verified",
    isActive: true,
    verifiedAt: new Date("2024-01-20"),
    addedAt: new Date("2024-01-18"),
    addedBy: "usr-001",
  },
  {
    id: "acct-002",
    providerId: "prov-001",
    type: "MoMo",
    accountHolderName: "Accra General Hospital",
    accountNumber: "****9001",
    momoNetwork: "MTN",
    momoNumber: "****9001",
    status: "Verified",
    isActive: false,
    verifiedAt: new Date("2024-06-15"),
    addedAt: new Date("2024-06-14"),
    addedBy: "usr-001",
  },
];

// ─── Services Catalog ─────────────────────────────────────────────────────────

export const mockServices: Service[] = [
  { id: "svc-001", providerId: "prov-001", code: "CONS-001", name: "General Consultation", category: "Consultation", defaultPrice: 150, description: "Standard outpatient consultation", status: "Active", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15"), createdBy: "usr-001" },
  { id: "svc-002", providerId: "prov-001", code: "CONS-002", name: "Specialist Consultation", category: "Consultation", defaultPrice: 350, description: "Consultation with specialist physician", status: "Active", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15"), createdBy: "usr-001" },
  { id: "svc-003", providerId: "prov-001", code: "DIAG-001", name: "Full Blood Count", category: "Diagnostic", defaultPrice: 120, status: "Active", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15"), createdBy: "usr-001" },
  { id: "svc-004", providerId: "prov-001", code: "DIAG-002", name: "Malaria RDT", category: "Diagnostic", defaultPrice: 80, status: "Active", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15"), createdBy: "usr-001" },
  { id: "svc-005", providerId: "prov-001", code: "DIAG-003", name: "Chest X-Ray", category: "Diagnostic", defaultPrice: 200, status: "Active", createdAt: new Date("2024-02-01"), updatedAt: new Date("2024-02-01"), createdBy: "usr-001" },
  { id: "svc-006", providerId: "prov-001", code: "PHARM-001", name: "Antimalarial (Artesunate)", category: "Pharmacy", defaultPrice: 45, status: "Active", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15"), createdBy: "usr-002" },
  { id: "svc-007", providerId: "prov-001", code: "PHARM-002", name: "Paracetamol (24 tabs)", category: "Pharmacy", defaultPrice: 20, status: "Active", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15"), createdBy: "usr-002" },
  { id: "svc-008", providerId: "prov-001", code: "PROC-001", name: "Wound Dressing", category: "Procedure", defaultPrice: 95, status: "Active", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15"), createdBy: "usr-001" },
  { id: "svc-009", providerId: "prov-001", code: "PROC-002", name: "IV Cannulation", category: "Procedure", defaultPrice: 75, status: "Active", createdAt: new Date("2024-03-01"), updatedAt: new Date("2024-03-01"), createdBy: "usr-001" },
  { id: "svc-010", providerId: "prov-001", code: "EMRG-001", name: "Emergency Assessment", category: "Emergency", defaultPrice: 500, status: "Active", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-15"), createdBy: "usr-001" },
  { id: "svc-011", providerId: "prov-001", code: "CONS-003", name: "Antenatal Visit", category: "Consultation", defaultPrice: 180, status: "Inactive", createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-05-10"), createdBy: "usr-001" },
];

// ─── Bills ────────────────────────────────────────────────────────────────────

const makeBillItems = (items: Partial<BillLineItem>[]): BillLineItem[] =>
  items.map((item, i) => ({
    id: `item-${i}`,
    description: item.description ?? "Service",
    category: item.category ?? "Consultation",
    amount: item.amount ?? 100,
    serviceId: item.serviceId,
  }));

export const mockBills: Bill[] = [
  {
    id: "bill-001",
    referenceNumber: "DXW-REF-001",
    providerId: "prov-001",
    patientDexwinPayId: "DXW1234567890",
    patientFirstName: "Kweku",
    patientEmployerName: "Ghana Revenue Authority",
    visitType: "Outpatient consultation",
    lineItems: makeBillItems([
      { description: "General Consultation", category: "Consultation", amount: 150, serviceId: "svc-001" },
      { description: "Full Blood Count", category: "Diagnostic", amount: 120, serviceId: "svc-003" },
      { description: "Antimalarial (Artesunate)", category: "Pharmacy", amount: 45, serviceId: "svc-006" },
    ]),
    subtotal: 315,
    healthWalletShare: 315,
    cashOverage: 0,
    cashOvPaymentConfirmed: false,
    status: "Paid",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
    paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
    settlementAccountId: "acct-001",
    createdBy: "usr-003",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
  },
  {
    id: "bill-002",
    referenceNumber: "DXW-REF-002",
    providerId: "prov-001",
    patientDexwinPayId: "DXW9876543210",
    patientFirstName: "Esi",
    patientEmployerName: "Stanbic Bank Ghana",
    visitType: "Emergency",
    lineItems: makeBillItems([
      { description: "Emergency Assessment", category: "Emergency", amount: 500, serviceId: "svc-010" },
      { description: "Chest X-Ray", category: "Diagnostic", amount: 200, serviceId: "svc-005" },
      { description: "IV Cannulation", category: "Procedure", amount: 75, serviceId: "svc-009" },
    ]),
    subtotal: 775,
    healthWalletShare: 600,
    cashOverage: 175,
    cashOvPaymentConfirmed: true,
    status: "Paid",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000),
    paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000),
    settlementAccountId: "acct-001",
    createdBy: "usr-003",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000),
  },
  {
    id: "bill-003",
    referenceNumber: "DXW-REF-003",
    providerId: "prov-001",
    patientDexwinPayId: "DXW5544332211",
    patientFirstName: "Adwoa",
    patientEmployerName: "MTN Ghana",
    visitType: "Follow-up",
    lineItems: makeBillItems([
      { description: "Specialist Consultation", category: "Consultation", amount: 350, serviceId: "svc-002" },
    ]),
    subtotal: 350,
    healthWalletShare: 350,
    cashOverage: 0,
    cashOvPaymentConfirmed: false,
    status: "Pending",
    submittedAt: new Date(Date.now() - 30 * 60 * 1000),
    createdBy: "usr-002",
    createdAt: new Date(Date.now() - 35 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "bill-004",
    referenceNumber: "DXW-REF-004",
    providerId: "prov-001",
    patientDexwinPayId: "DXW1122334455",
    patientFirstName: "Fiifi",
    patientEmployerName: "Vodafone Ghana",
    visitType: "Pharmacy pickup",
    lineItems: makeBillItems([
      { description: "Paracetamol (24 tabs)", category: "Pharmacy", amount: 20, serviceId: "svc-007" },
      { description: "Antimalarial (Artesunate)", category: "Pharmacy", amount: 45, serviceId: "svc-006" },
    ]),
    subtotal: 65,
    healthWalletShare: 65,
    cashOverage: 0,
    cashOvPaymentConfirmed: false,
    status: "Approved",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    approvedAt: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
    createdBy: "usr-003",
    createdAt: new Date(Date.now() - 2.1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
  },
  {
    id: "bill-005",
    referenceNumber: "DXW-REF-005",
    providerId: "prov-001",
    patientDexwinPayId: "DXW9988776655",
    patientFirstName: "Akua",
    patientEmployerName: "Ecobank Ghana",
    visitType: "Diagnostic only",
    lineItems: makeBillItems([
      { description: "Malaria RDT", category: "Diagnostic", amount: 80 },
      { description: "Full Blood Count", category: "Diagnostic", amount: 120 },
    ]),
    subtotal: 200,
    healthWalletShare: 200,
    cashOverage: 0,
    cashOvPaymentConfirmed: false,
    status: "Failed",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000),
    failedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
    failureReason: "Payment to your settlement account could not be completed.",
    createdBy: "usr-003",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
  },
  {
    id: "bill-006",
    referenceNumber: "",
    providerId: "prov-001",
    patientDexwinPayId: "DXW3322114455",
    patientFirstName: "Nana",
    patientEmployerName: "Ghana Revenue Authority",
    visitType: "Outpatient consultation",
    lineItems: makeBillItems([
      { description: "General Consultation", category: "Consultation", amount: 150 },
    ]),
    subtotal: 150,
    healthWalletShare: 150,
    cashOverage: 0,
    cashOvPaymentConfirmed: false,
    status: "Draft",
    createdBy: "usr-002",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

// ─── Patients ─────────────────────────────────────────────────────────────────

export const mockPatients: PatientRecord[] = [
  {
    dexwinPayId: "DXW1234567890",
    firstName: "Kweku",
    maskedId: "DXW***7890",
    employerName: "Ghana Revenue Authority",
    benefitStatus: "Ready to use",
    availableBalance: 850,
    totalVisits: 3,
    lastVisitDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    bills: mockBills.filter(b => b.patientDexwinPayId === "DXW1234567890"),
  },
  {
    dexwinPayId: "DXW9876543210",
    firstName: "Esi",
    maskedId: "DXW***3210",
    employerName: "Stanbic Bank Ghana",
    benefitStatus: "Ready to use",
    availableBalance: 1200,
    totalVisits: 2,
    lastVisitDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    bills: mockBills.filter(b => b.patientDexwinPayId === "DXW9876543210"),
  },
  {
    dexwinPayId: "DXW5544332211",
    firstName: "Adwoa",
    maskedId: "DXW***2211",
    employerName: "MTN Ghana",
    benefitStatus: "Ready to use",
    availableBalance: 430,
    totalVisits: 1,
    lastVisitDate: new Date(Date.now() - 30 * 60 * 1000),
    bills: mockBills.filter(b => b.patientDexwinPayId === "DXW5544332211"),
  },
  {
    dexwinPayId: "DXW9988776655",
    firstName: "Akua",
    maskedId: "DXW***6655",
    employerName: "Ecobank Ghana",
    benefitStatus: "Ready to use",
    availableBalance: 600,
    totalVisits: 1,
    lastVisitDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    bills: mockBills.filter(b => b.patientDexwinPayId === "DXW9988776655"),
  },
];

// ─── Audit Entries ────────────────────────────────────────────────────────────

export const mockAuditEntries: AuditEntry[] = [
  { id: "aud-001", providerId: "prov-001", eventCategory: "Bill", eventType: "Bill submitted", actorId: "usr-003", actorName: "Kofi Asante", actorRole: "Staff", affectedResource: "DXW-REF-003", timestamp: new Date(Date.now() - 30 * 60 * 1000) },
  { id: "aud-002", providerId: "prov-001", eventCategory: "Bill", eventType: "Bill paid", actorId: "System", actorName: "System", actorRole: "System", affectedResource: "DXW-REF-001", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000) },
  { id: "aud-003", providerId: "prov-001", eventCategory: "Patient", eventType: "Patient record viewed", actorId: "usr-003", actorName: "Kofi Asante", actorRole: "Staff", affectedResource: "DXW***7890", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: "aud-004", providerId: "prov-001", eventCategory: "Settlement Account", eventType: "Settlement account added", actorId: "usr-001", actorName: "Kwame Mensah", actorRole: "Owner", affectedResource: "****9001 (MoMo · MTN)", timestamp: new Date("2024-06-14") },
  { id: "aud-005", providerId: "prov-001", eventCategory: "Settlement Account", eventType: "Settlement account verified", actorId: "System", actorName: "System", actorRole: "System", affectedResource: "****9001", timestamp: new Date("2024-06-15") },
  { id: "aud-006", providerId: "prov-001", eventCategory: "Team", eventType: "User invited", actorId: "usr-001", actorName: "Kwame Mensah", actorRole: "Owner", affectedResource: "abena.osei@accrahospital.com (Staff)", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: "aud-007", providerId: "prov-001", eventCategory: "Security", eventType: "Password changed", actorId: "usr-002", actorName: "Ama Boateng", actorRole: "Manager", timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  { id: "aud-008", providerId: "prov-001", eventCategory: "Service Catalog", eventType: "Service deactivated", actorId: "usr-001", actorName: "Kwame Mensah", actorRole: "Owner", affectedResource: "CONS-003 · Antenatal Visit", beforeValue: "Active", afterValue: "Inactive", timestamp: new Date("2024-05-10") },
  { id: "aud-009", providerId: "prov-001", eventCategory: "Bill", eventType: "Bill payment failed", actorId: "System", actorName: "System", actorRole: "System", affectedResource: "DXW-REF-005", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000) },
  { id: "aud-010", providerId: "prov-001", eventCategory: "Report", eventType: "Report exported", actorId: "usr-001", actorName: "Kwame Mensah", actorRole: "Owner", affectedResource: "Revenue by category · May 2025 · PDF", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export const mockNotifications: Notification[] = [
  { id: "notif-001", userId: "usr-001", title: "Payment Settled", message: "GH₵315.00 from Kweku (DXW***7890) has been settled to your account.", type: "payment", isRead: false, billId: "bill-001", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000) },
  { id: "notif-002", userId: "usr-001", title: "Payment Failed", message: "Payment to your settlement account for Akua (DXW***6655) could not be completed.", type: "payment", isRead: false, billId: "bill-005", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000) },
  { id: "notif-003", userId: "usr-001", title: "Team Invitation Sent", message: "Invitation sent to abena.osei@accrahospital.com as Staff.", type: "team", isRead: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: "notif-004", userId: "usr-001", title: "Payment Settled", message: "GH₵600.00 from Esi (DXW***3210) has been settled to your account.", type: "payment", isRead: true, billId: "bill-002", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000) },
];

// ─── Support Tickets ──────────────────────────────────────────────────────────

export const mockSupportTickets: SupportTicket[] = [
  {
    id: "tkt-001",
    ticketNumber: "TKT-20250521-001",
    providerId: "prov-001",
    createdBy: "usr-001",
    category: "Settlement",
    subject: "Settlement not received for bill DXW-REF-005",
    description: "The payment for DXW-REF-005 failed and the patient has been asked to pay out of pocket. Please advise on whether there is an issue with our settlement account.",
    status: "In Progress",
    linkedBillRef: "DXW-REF-005",
    linkedFailureReason: "Payment to your settlement account could not be completed.",
    linkedAmount: 200,
    linkedTimestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    messages: [
      { id: "msg-001", ticketId: "tkt-001", senderName: "Kwame Mensah", senderType: "provider", message: "The payment for DXW-REF-005 failed and the patient has been asked to pay out of pocket.", sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { id: "msg-002", ticketId: "tkt-001", senderName: "Dexwin Support", senderType: "dexwin_support", message: "Thank you for reaching out. We are investigating the failed settlement. We will update you within 24 hours.", sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

// ─── Sessions ─────────────────────────────────────────────────────────────────

export const mockSessions: Session[] = [
  { id: "sess-001", device: "MacBook Pro", browser: "Chrome 124", location: "Accra, Ghana", lastActiveAt: new Date(), isCurrent: true },
  { id: "sess-002", device: "iPhone 15", browser: "Safari 17", location: "Accra, Ghana", lastActiveAt: new Date(Date.now() - 3 * 60 * 60 * 1000), isCurrent: false },
  { id: "sess-003", device: "Windows PC", browser: "Firefox 125", location: "Accra, Ghana", lastActiveAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), isCurrent: false },
];

// ─── Analytics ────────────────────────────────────────────────────────────────

export const mockDailyRevenue: DailyRevenue[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  return {
    date: date.toISOString().split("T")[0],
    amount: isWeekend ? Math.random() * 2000 + 500 : Math.random() * 8000 + 2000,
    count: isWeekend ? Math.floor(Math.random() * 5 + 1) : Math.floor(Math.random() * 20 + 5),
  };
});

export const mockRevenueByCategory: RevenueByCategory[] = [
  { category: "Consultation", amount: 18500, count: 87, percentChange: 12.4 },
  { category: "Diagnostic", amount: 11200, count: 56, percentChange: 8.1 },
  { category: "Pharmacy", amount: 6800, count: 142, percentChange: -2.3 },
  { category: "Procedure", amount: 4300, count: 28, percentChange: 5.7 },
  { category: "Emergency", amount: 3200, count: 6, percentChange: 18.2 },
];

export const mockRevenueByEmployer: RevenueByEmployer[] = [
  { employerName: "Ghana Revenue Authority", amount: 14200, count: 52 },
  { employerName: "Stanbic Bank Ghana", amount: 9800, count: 38 },
  { employerName: "MTN Ghana", amount: 8400, count: 31 },
  { employerName: "Ecobank Ghana", amount: 7100, count: 29 },
  { employerName: "Vodafone Ghana", amount: 4500, count: 19 },
];

export const mockTopServices: TopService[] = [
  { serviceCode: "CONS-001", serviceName: "General Consultation", category: "Consultation", volume: 87, revenue: 13050 },
  { serviceCode: "DIAG-001", serviceName: "Full Blood Count", category: "Diagnostic", volume: 56, revenue: 6720 },
  { serviceCode: "PHARM-001", serviceName: "Antimalarial (Artesunate)", category: "Pharmacy", volume: 48, revenue: 2160 },
  { serviceCode: "DIAG-002", serviceName: "Malaria RDT", category: "Diagnostic", volume: 42, revenue: 3360 },
  { serviceCode: "CONS-002", serviceName: "Specialist Consultation", category: "Consultation", volume: 31, revenue: 10850 },
];

// ─── Overview metrics ─────────────────────────────────────────────────────────

export const mockOverviewMetrics = {
  settledThisPeriod: 44000,
  periodChange: 14.2,
  billsByStatus: {
    Pending: 3,
    Approved: 4,
    Paid: 89,
    Failed: 2,
  },
  recentBills: mockBills.slice(0, 5),
};
