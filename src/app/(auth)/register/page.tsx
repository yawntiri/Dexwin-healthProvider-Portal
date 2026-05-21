"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Info,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

interface FacilityInfo {
  facilityName: string;
  facilityType: string;
  ghsLicense: string;
  gpsAddress: string;
  region: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  adminName: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const FACILITY_TYPES = [
  "Hospital",
  "Clinic",
  "Pharmacy",
  "Laboratory",
  "Diagnostic Center",
  "Dental Clinic",
  "Optometry",
  "Physiotherapy",
  "Mental Health Center",
  "Nursing Home",
  "Other",
];

const REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Brong-Ahafo",
  "Savannah",
  "Bono East",
  "Ahafo",
  "Western North",
  "Oti",
  "North East",
];

// ─── Password strength helper ─────────────────────────────────────────────────

function getPasswordChecks(pw: string) {
  return {
    length: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    digit: /[0-9]/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  };
}

function PasswordStrength({ password }: { password: string }) {
  const checks = getPasswordChecks(password);
  const passed = Object.values(checks).filter(Boolean).length;

  const color =
    passed <= 1
      ? "bg-red-400"
      : passed <= 2
      ? "bg-orange-400"
      : passed <= 3
      ? "bg-yellow-400"
      : passed <= 4
      ? "bg-blue-400"
      : "bg-emerald-500";

  const labels: { key: keyof typeof checks; label: string }[] = [
    { key: "length", label: "At least 8 characters" },
    { key: "uppercase", label: "Uppercase letter" },
    { key: "lowercase", label: "Lowercase letter" },
    { key: "digit", label: "Number" },
    { key: "symbol", label: "Symbol" },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`h-1 flex-1 rounded-full transition-all ${
              n <= passed ? color : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-0.5">
        {labels.map(({ key, label }) => (
          <li
            key={key}
            className={`flex items-center gap-1 text-xs ${
              checks[key] ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            <span className="text-[10px]">{checks[key] ? "✓" : "○"}</span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: "Facility" },
    { n: 2, label: "Account" },
    { n: 3, label: "Verify" },
    { n: 4, label: "Done" },
  ];

  return (
    <div className="flex items-center justify-center mb-8 gap-0">
      {steps.map(({ n, label }, idx) => {
        const done = current > n;
        const active = current === n;
        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? "bg-blue-600 text-white"
                    : active
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`text-[10px] font-medium mt-1 ${
                  active ? "text-blue-600" : done ? "text-slate-600" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-10 h-px mx-1 mb-4 transition-all ${
                  done ? "bg-blue-400" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared input styles ──────────────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 " +
  "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors";

const selectCls =
  "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors appearance-none";

const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

// ─── Main page ────────────────────────────────────────────────────────────────

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAssisted = searchParams.get("assisted") === "true";

  const [step, setStep] = useState<Step>(1);

  // Step 1 state
  const [facility, setFacility] = useState<FacilityInfo>({
    facilityName: "",
    facilityType: "",
    ghsLicense: "",
    gpsAddress: "",
    region: "",
  });
  const [facilityErrors, setFacilityErrors] = useState<Partial<FacilityInfo>>({});

  // Step 2 state
  const [contact, setContact] = useState<ContactInfo>({
    phone: "",
    email: "",
    adminName: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [contactErrors, setContactErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({});

  // Step 3 state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (step === 3 && resendCountdown > 0) {
      const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    } else if (resendCountdown === 0) {
      setCanResend(true);
    }
  }, [step, resendCountdown]);

  // Focus first OTP box when entering step 3
  useEffect(() => {
    if (step === 3) {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  // ── Step 1 validation ────────────────────────────────────────────────────
  function validateFacility(): boolean {
    const errs: Partial<FacilityInfo> = {};
    if (!facility.facilityName.trim()) errs.facilityName = "Required";
    if (!facility.facilityType) errs.facilityType = "Required";
    if (!facility.ghsLicense.trim()) errs.ghsLicense = "Required";
    if (!facility.gpsAddress.trim()) errs.gpsAddress = "Required";
    if (!facility.region) errs.region = "Required";
    setFacilityErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Step 2 validation ────────────────────────────────────────────────────
  function validateContact(): boolean {
    const errs: Partial<Record<keyof ContactInfo, string>> = {};
    if (!contact.phone.trim()) errs.phone = "Required";
    else if (!/^0\d{9}$/.test(contact.phone.replace(/\s/g, "")))
      errs.phone = "Enter a valid Ghana number (e.g. 024XXXXXXX)";

    if (!contact.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
      errs.email = "Enter a valid email address";

    if (!contact.adminName.trim()) errs.adminName = "Required";

    const checks = getPasswordChecks(contact.password);
    const passed = Object.values(checks).filter(Boolean).length;
    if (!contact.password) errs.password = "Required";
    else if (passed < 3) errs.password = "Password is too weak";

    if (!contact.confirmPassword) errs.confirmPassword = "Required";
    else if (contact.password !== contact.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    if (!contact.agreedToTerms)
      errs.agreedToTerms = "You must agree to continue" as never;

    setContactErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── OTP handlers ─────────────────────────────────────────────────────────
  function handleOtpChange(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = char;
    setOtp(next);
    setOtpError("");
    if (char && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function handleOtpConfirm(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Please enter all 6 digits.");
      return;
    }
    setOtpLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setOtpLoading(false);
    setStep(4);
  }

  function handleResend() {
    setResendCountdown(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function goNext() {
    if (step === 1 && validateFacility()) setStep(2);
    else if (step === 2 && validateContact()) setStep(3);
  }

  function goBack() {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md mb-3">
            <span className="text-white text-xl font-extrabold tracking-tight">D</span>
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">Dexwin</span>
          <p className="text-sm text-slate-500 mt-1">Provider registration</p>
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Assisted onboarding banner — shown on step 1 when ?assisted=true */}
        {isAssisted && step === 1 && (
          <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3">
            <Info size={16} className="mt-0.5 shrink-0 text-amber-500" />
            <span>
              <span className="font-semibold">Assisted onboarding requested</span> — A Dexwin team
              member will contact you to complete setup.
            </span>
          </div>
        )}

        {/* ── Step 1: Facility Information ── */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Facility information</h2>
            <p className="text-sm text-slate-500 mb-5">Tell us about your healthcare facility.</p>

            <div className="space-y-4">
              {/* Facility name */}
              <div>
                <label className={labelCls}>Facility name</label>
                <input
                  type="text"
                  value={facility.facilityName}
                  onChange={(e) =>
                    setFacility((f) => ({ ...f, facilityName: e.target.value }))
                  }
                  placeholder="e.g. Accra Specialist Hospital"
                  className={inputCls}
                />
                {facilityErrors.facilityName && (
                  <p className="text-xs text-red-500 mt-1">{facilityErrors.facilityName}</p>
                )}
              </div>

              {/* Facility type */}
              <div>
                <label className={labelCls}>Facility type</label>
                <div className="relative">
                  <select
                    value={facility.facilityType}
                    onChange={(e) =>
                      setFacility((f) => ({ ...f, facilityType: e.target.value }))
                    }
                    className={selectCls}
                  >
                    <option value="">Select type…</option>
                    {FACILITY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                  />
                </div>
                {facilityErrors.facilityType && (
                  <p className="text-xs text-red-500 mt-1">{facilityErrors.facilityType}</p>
                )}
              </div>

              {/* GHS License */}
              <div>
                <label className={labelCls}>Ghana Health Service License #</label>
                <input
                  type="text"
                  value={facility.ghsLicense}
                  onChange={(e) =>
                    setFacility((f) => ({ ...f, ghsLicense: e.target.value }))
                  }
                  placeholder="e.g. GHS-2024-00123"
                  className={inputCls}
                />
                {facilityErrors.ghsLicense && (
                  <p className="text-xs text-red-500 mt-1">{facilityErrors.ghsLicense}</p>
                )}
              </div>

              {/* GPS Address */}
              <div>
                <label className={labelCls}>GPS address</label>
                <input
                  type="text"
                  value={facility.gpsAddress}
                  onChange={(e) =>
                    setFacility((f) => ({ ...f, gpsAddress: e.target.value }))
                  }
                  placeholder="e.g. GA-123-4567"
                  className={inputCls}
                />
                {facilityErrors.gpsAddress && (
                  <p className="text-xs text-red-500 mt-1">{facilityErrors.gpsAddress}</p>
                )}
              </div>

              {/* Region */}
              <div>
                <label className={labelCls}>Region</label>
                <div className="relative">
                  <select
                    value={facility.region}
                    onChange={(e) =>
                      setFacility((f) => ({ ...f, region: e.target.value }))
                    }
                    className={selectCls}
                  >
                    <option value="">Select region…</option>
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                  />
                </div>
                {facilityErrors.region && (
                  <p className="text-xs text-red-500 mt-1">{facilityErrors.region}</p>
                )}
              </div>
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={goNext}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ── Step 2: Contact & Admin Account ── */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Contact & admin account</h2>
            <p className="text-sm text-slate-500 mb-5">Set up your administrator credentials.</p>

            <div className="space-y-4">
              {/* Phone */}
              <div>
                <label className={labelCls}>Contact phone</label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                  placeholder="024XXXXXXX"
                  className={inputCls}
                />
                {contactErrors.phone && (
                  <p className="text-xs text-red-500 mt-1">{contactErrors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className={labelCls}>Contact email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                  placeholder="admin@yourfacility.com"
                  className={inputCls}
                />
                {contactErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{contactErrors.email}</p>
                )}
              </div>

              {/* Admin name */}
              <div>
                <label className={labelCls}>Admin full name</label>
                <input
                  type="text"
                  value={contact.adminName}
                  onChange={(e) => setContact((c) => ({ ...c, adminName: e.target.value }))}
                  placeholder="e.g. Dr. Kwame Mensah"
                  className={inputCls}
                />
                {contactErrors.adminName && (
                  <p className="text-xs text-red-500 mt-1">{contactErrors.adminName}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={contact.password}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, password: e.target.value }))
                    }
                    placeholder="Create a strong password"
                    className={inputCls + " pr-10"}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {contactErrors.password && (
                  <p className="text-xs text-red-500 mt-1">{contactErrors.password}</p>
                )}
                <PasswordStrength password={contact.password} />
              </div>

              {/* Confirm password */}
              <div>
                <label className={labelCls}>Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={contact.confirmPassword}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, confirmPassword: e.target.value }))
                    }
                    placeholder="Repeat your password"
                    className={inputCls + " pr-10"}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {contactErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{contactErrors.confirmPassword}</p>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={contact.agreedToTerms}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, agreedToTerms: e.target.checked }))
                    }
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 shrink-0"
                  />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {contactErrors.agreedToTerms && (
                  <p className="text-xs text-red-500 mt-1">{contactErrors.agreedToTerms as string}</p>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Email Verification ── */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1 text-center">
              Verify your email
            </h2>
            <p className="text-sm text-slate-500 mb-6 text-center">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-slate-700">{contact.email || "your email"}</span>.
              Enter it below.
            </p>

            {otpError && (
              <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            <form onSubmit={handleOtpConfirm} className="space-y-5">
              {/* OTP inputs */}
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                ))}
              </div>

              {/* Resend */}
              <div className="text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Resend code
                  </button>
                ) : (
                  <p className="text-sm text-slate-400">
                    Resend code in{" "}
                    <span className="font-semibold text-slate-600">{resendCountdown}s</span>
                  </p>
                )}
              </div>

              {/* Confirm */}
              <button
                type="submit"
                disabled={otpLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {otpLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify & continue"
                )}
              </button>

              <button
                type="button"
                onClick={goBack}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
                Back
              </button>
            </form>
          </div>
        )}

        {/* ── Step 4: Success ── */}
        {step === 4 && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={56} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Registration submitted!</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Your account is under review. Dexwin will verify your license and facility details
              within <span className="font-semibold text-slate-700">2–3 business days</span>. You&apos;ll
              receive an email at{" "}
              <span className="font-semibold text-slate-700">
                {contact.email || "your email address"}
              </span>{" "}
              when approved.
            </p>

            <div className="space-y-3">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
              >
                Sign in
              </Link>
              <Link
                href="/register?assisted=true"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm"
              >
                Request assisted onboarding
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Page footer */}
      <p className="text-center text-xs text-slate-400 mt-6">
        © 2026 Dexwin Health{" "}
        <span className="mx-1">·</span>
        <a href="#" className="hover:text-slate-600 transition-colors">
          Privacy
        </a>
        <span className="mx-1">·</span>
        <a href="#" className="hover:text-slate-600 transition-colors">
          Terms
        </a>
      </p>

      {/* Sign in link */}
      <p className="text-center text-sm text-slate-500 mt-3">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 h-64 animate-pulse" />}>
      <RegisterPageContent />
    </Suspense>
  );
}
