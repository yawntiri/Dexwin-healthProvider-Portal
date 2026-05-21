// ─── Core Enums ─────────────────────────────────────────────────────────────

export type FacilityType = "Hospital" | "Clinic" | "Pharmacy" | "Diagnostic Centre";

export type UserRole = "Owner" | "Manager" | "Staff";

export type UserStatus = "Invited" | "Active" | "Deactivated";

export type ProviderStatus = "Pending Admin Approval" | "Active" | "Suspended" | "Rejected";

export type BillStatus = "Draft" | "Pending" | "Approved" | "Paid" | "Failed";

export type BenefitStatus = "Ready to use" | "Benefit not active" | "No record found";

export type VisitType =
  | "Outpatient consultation"
  | "Follow-up"
  | "Emergency"
  | "Pharmacy pickup"
  | "Diagnostic only"
  | "Procedure"
  | "Antenatal"
  | "Postnatal"
  | "Vaccination"
  | "Inpatient admission"
  | "Other";

export type ServiceCategory =
  | "Consultation"
  | "Pharmacy"
  | "Diagnostic"
  | "Procedure"
  | "Emergency";

export type ServiceStatus = "Active" | "Inactive";

export type SettlementAccountType = "Bank" | "MoMo";

export type SettlementAccountStatus = "Pending Verification" | "Verified" | "Failed";

export type NotificationChannel = "email" | "in-portal";

export type SupportTicketStatus = "Open" | "In Progress" | "Waiting on You" | "Resolved";

export type SupportTicketCategory = "Transaction" | "Settlement" | "Account" | "Other";

export type AuditEventCategory =
  | "Registration"
  | "Profile"
  | "Settlement Account"
  | "Team"
  | "Security"
  | "Service Catalog"
  | "Bill"
  | "Patient"
  | "Report"
  | "Support";

export type Period = "Today" | "This week" | "This month" | "This year";

// ─── Provider / Facility ─────────────────────────────────────────────────────

export interface Provider {
  id: string;
  facilityName: string;
  facilityType: FacilityType;
  status: ProviderStatus;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  businessEmail: string;
  businessPhone: string;
  ghanaGpsAddress: string;
  hefraLicenseNumber?: string;
  pharmacyCouncilLicense?: string;
  logoUrl?: string;
  operatingHours?: string;
  isVerifiedByDexwin: boolean;
  pendingAdminReviewSince?: Date;
  suspendedAt?: Date;
  suspensionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── User / Team ─────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  providerId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActiveAt?: Date;
  invitedAt?: Date;
  joinedAt?: Date;
  twoFaEnabled: boolean;
}

// ─── Settlement Account ───────────────────────────────────────────────────────

export interface SettlementAccount {
  id: string;
  providerId: string;
  type: SettlementAccountType;
  accountHolderName: string;
  accountNumber: string; // masked except last 4
  bankName?: string;
  bankBranch?: string;
  momoNetwork?: "MTN" | "Telecel" | "AirtelTigo";
  momoNumber?: string; // masked
  status: SettlementAccountStatus;
  isActive: boolean;
  verifiedAt?: Date;
  addedAt: Date;
  addedBy: string;
}

// ─── Service Catalog ─────────────────────────────────────────────────────────

export interface Service {
  id: string;
  providerId: string;
  code: string;
  name: string;
  category: ServiceCategory;
  defaultPrice: number;
  description?: string;
  status: ServiceStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// ─── Bill / Transaction ───────────────────────────────────────────────────────

export interface BillLineItem {
  id: string;
  serviceId?: string;
  serviceCode?: string;
  description: string;
  category: ServiceCategory;
  amount: number;
}

export interface Bill {
  id: string;
  referenceNumber: string;
  providerId: string;
  patientDexwinPayId: string;
  patientFirstName: string;
  patientEmployerName: string;
  visitType: VisitType;
  visitTypeNote?: string;
  lineItems: BillLineItem[];
  subtotal: number;
  healthWalletShare: number;
  cashOverage: number;
  cashOvPaymentConfirmed: boolean;
  status: BillStatus;
  submittedAt?: Date;
  approvedAt?: Date;
  paidAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  settlementAccountId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Patient Record ───────────────────────────────────────────────────────────

export interface PatientRecord {
  dexwinPayId: string;
  firstName: string;
  maskedId: string; // e.g. DXW***1234
  employerName: string;
  benefitStatus: BenefitStatus;
  availableBalance?: number;
  totalVisits: number;
  lastVisitDate?: Date;
  bills: Bill[];
}

// ─── Audit Trail ─────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  providerId: string;
  eventCategory: AuditEventCategory;
  eventType: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | "System";
  affectedResource?: string;
  beforeValue?: string;
  afterValue?: string;
  timestamp: Date;
  ipAddress?: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface NotificationPreference {
  userId: string;
  paymentApproved: { email: boolean; inPortal: boolean };
  paymentSettled: { email: boolean; inPortal: boolean };
  paymentFailed: { email: boolean; inPortal: boolean };
  paymentDisputed: { email: boolean; inPortal: boolean };
  teamChanges: { email: boolean; inPortal: boolean };
  supportTicketUpdates: { email: boolean; inPortal: boolean };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "payment" | "team" | "security" | "support" | "system";
  isRead: boolean;
  billId?: string;
  createdAt: Date;
}

// ─── Support ─────────────────────────────────────────────────────────────────

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  providerId: string;
  createdBy: string;
  category: SupportTicketCategory;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  linkedBillRef?: string;
  linkedFailureReason?: string;
  linkedAmount?: number;
  linkedTimestamp?: Date;
  attachmentUrl?: string;
  messages: SupportMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderName: string;
  senderType: "provider" | "dexwin_support";
  message: string;
  sentAt: Date;
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export interface RevenueByCategory {
  category: ServiceCategory;
  amount: number;
  count: number;
  percentChange: number;
}

export interface RevenueByEmployer {
  employerName: string;
  amount: number;
  count: number;
}

export interface TopService {
  serviceCode: string;
  serviceName: string;
  category: ServiceCategory;
  volume: number;
  revenue: number;
}

export interface DailyRevenue {
  date: string;
  amount: number;
  count: number;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export interface FilterState {
  dateFrom?: string;
  dateTo?: string;
  status?: BillStatus[];
  category?: ServiceCategory[];
  search?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  providerId: string;
  providerName: string;
  providerStatus: ProviderStatus;
  avatarUrl?: string;
  twoFaEnabled: boolean;
  twoFaEnforced: boolean;
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActiveAt: Date;
  isCurrent: boolean;
}
