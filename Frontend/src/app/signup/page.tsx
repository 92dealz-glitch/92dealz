"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser, registerInitiate, registerVerify } from "@/lib/api";
import { getFallbackArray } from "@/data/categoriesData";

type UserRole = "user" | "vendor";
type ContactMethod = "phone" | "email";

const EyeIcon = ({ showPassword, setShowPassword }: { showPassword: boolean, setShowPassword: React.Dispatch<React.SetStateAction<boolean>> }) => (
  <button
    type="button"
    onClick={() => setShowPassword((p) => !p)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
    aria-label="Toggle password visibility"
  >
    {showPassword ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )}
  </button>
);

const inputCls = "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition placeholder-gray-400";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

interface BaseFieldsProps {
  role: UserRole;
  method: ContactMethod;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const BaseFields = ({ role, method, formData, handleChange, showPassword, setShowPassword }: BaseFieldsProps) => (
  <>
    <div>
      <label className={labelCls}>{role === "vendor" ? "Owner / Contact Name" : "Full Name"}</label>
      <input name="name" required value={formData.name} onChange={handleChange}
        placeholder={role === "vendor" ? "Your full name" : "Enter your full name"}
        className={inputCls} />
    </div>
    <div>
      <label className={labelCls}>{method === "phone" ? "Phone Number" : "Email Address"}</label>
      <input name="contact" required type={method === "email" ? "email" : "text"}
        value={formData.contact} onChange={handleChange}
        placeholder={method === "phone" ? "e.g. +2348012345678" : "you@example.com"}
        className={inputCls} />
    </div>
    <div>
      <label className={labelCls}>Password</label>
      <div className="relative">
        <input name="password" required type={showPassword ? "text" : "password"}
          value={formData.password} onChange={handleChange}
          placeholder="Create a password" className={`${inputCls} pr-11`} />
        <EyeIcon showPassword={showPassword} setShowPassword={setShowPassword} />
      </div>
    </div>
    <div>
      <label className={labelCls}>Confirm Password</label>
      <input name="confirmPassword" required type="password"
        value={formData.confirmPassword} onChange={handleChange}
        placeholder="Re-enter your password" className={inputCls} />
    </div>
  </>
);

const VendorFields = ({ formData, handleChange, categories }: { formData: any, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, categories: {id: string, title: string}[] }) => (
  <>
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Business Details</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>

    <div>
      <label className={labelCls}>Business / Store Name</label>
      <input name="businessName" required value={formData.businessName} onChange={handleChange}
        placeholder="e.g. Adaeze Fashion House" className={inputCls} />
    </div>
    <div>
      <label className={labelCls}>Business Category</label>
      <select name="businessCategory" required value={formData.businessCategory}
        onChange={handleChange}
        className={`${inputCls} bg-white`}>
        <option value="" disabled>Select a category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.title}</option>
        ))}
      </select>
    </div>
    <div>
      <label className={labelCls}>Business Address</label>
      <input name="businessAddress" required value={formData.businessAddress} onChange={handleChange}
        placeholder="e.g. 14 Broad Street, Lagos" className={inputCls} />
    </div>
  </>
);

const RoleToggle = ({ role, setRole, setError }: { role: UserRole, setRole: (r: UserRole) => void, setError: (e: string) => void }) => (
  <div className="flex rounded-xl border border-gray-200 bg-gray-100 p-1 mb-6">
    {(["user", "vendor"] as UserRole[]).map((r) => (
      <button
        key={r}
        type="button"
        onClick={() => { setRole(r); setError(""); }}
        className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
          role === r
            ? "bg-white text-orange-500 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        {r === "user" ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        )}
        {r === "user" ? "User" : "Vendor"}
      </button>
    ))}
  </div>
);

const ContactMethodToggle = ({ method, setMethod }: { method: ContactMethod, setMethod: (m: ContactMethod) => void }) => (
  <div className="flex gap-2 mb-4">
    {(["phone", "email"] as ContactMethod[]).map((m) => (
      <button
        key={m}
        type="button"
        onClick={() => setMethod(m)}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          method === m
            ? "bg-orange-500 border-orange-500 text-white"
            : "bg-white border-gray-300 text-gray-600 hover:border-orange-300"
        }`}
      >
        {m === "phone" ? "Phone Number" : "Email"}
      </button>
    ))}
  </div>
);

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("user");
  const [method, setMethod] = useState<ContactMethod>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [categories, setCategories] = useState<{id: string, title: string}[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    password: "",
    confirmPassword: "",
    // vendor-only
    businessName: "",
    businessCategory: "",
    businessAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1 = signup, 2 = otp
  const [otp, setOtp] = useState("");

  useEffect(() => {
    let mounted = true;
    getFallbackArray().then((res) => {
      if (mounted) setCategories(res as any);
    });
    return () => { mounted = false; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const contactVal = method === "email" ? formData.contact.trim().toLowerCase() : formData.contact.trim();
      await registerInitiate({
        name: formData.name,
        contact: contactVal,
        method,
        password: formData.password.trim(),
        role,
        businessName: formData.businessName,
        businessCategory: formData.businessCategory,
        businessAddress: formData.businessAddress,
      });
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const contactVal = method === "email" ? formData.contact.trim().toLowerCase() : formData.contact.trim();
      await registerVerify({ contact: contactVal, method, otp: otp.trim() });
      const res = await loginUser({ email: contactVal, password: formData.password.trim() });
      const r = String(res.user?.role || "").toLowerCase();
      if (r === "vendor") {
        router.push("/vendor-dashboard");
      } else if (r === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-0 px-0 sm:py-12 sm:px-4">
      <div className="w-full sm:max-w-4xl sm:rounded-2xl overflow-hidden shadow-none sm:shadow-2xl border-0 sm:border sm:border-gray-200 bg-white relative">

        {/* Close button — desktop */}
        <Link href="/" className="hidden sm:block absolute top-4 right-4 z-30 text-orange-500 hover:text-orange-700 transition-colors">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Link>

        {/* ══ MOBILE LAYOUT ══════════════════════════════════════ */}
        <div className="flex flex-col sm:hidden min-h-screen bg-gray-100 px-5 pt-10 pb-10">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="text-orange-500">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <h1 className="text-2xl font-extrabold text-orange-500" style={{ fontFamily: "Georgia, serif" }}>
              Create Account
            </h1>
          </div>
          <p className="text-gray-600 text-sm mb-6">Join 234Deals — sign up as a customer or vendor.</p>

          <RoleToggle role={role} setRole={setRole} setError={setError} />

          {role === "vendor" && (
            <div className="flex items-start gap-2 mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" className="mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-xs text-orange-700 leading-relaxed">
                Vendor accounts are reviewed within <strong>24 hours</strong>. You'll receive a confirmation before your store goes live.
              </p>
            </div>
          )}

          <ContactMethodToggle method={method} setMethod={setMethod} />

          {error && <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <BaseFields role={role} method={method} formData={formData} handleChange={handleChange} showPassword={showPassword} setShowPassword={setShowPassword} />
              {role === "vendor" && <VendorFields formData={formData} handleChange={handleChange} categories={categories} />}

              <button type="submit" disabled={loading}
                className="w-full bg-orange-500 text-white font-bold text-base py-3.5 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-md shadow-orange-200 disabled:opacity-50 mt-2">
                {loading ? "Sending Code..." : role === "vendor" ? "Register as Vendor" : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
               <div>
                <label className={labelCls}>Verification Code</label>
                <input 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code" 
                  className={inputCls} 
                  required
                />
                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed italic">
                  We sent a 6-digit code to <strong>{formData.contact}</strong>.<br />
                  If you don't see it, please <strong>check your spam/junk folder</strong>.<br />
                  Code expires in <span className="text-orange-600 font-bold">10 minutes</span>.
                </p>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-orange-500 text-white font-bold text-base py-3.5 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-md shadow-orange-200 disabled:opacity-50">
                {loading ? "Verifying..." : "Verify & Complete Signup"}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-zinc-500 text-sm font-bold">
                Go Back
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 font-bold hover:underline">Log In</Link>
          </p>
        </div>

        {/* ══ DESKTOP LAYOUT ═════════════════════════════════════ */}
        <div className="hidden sm:flex w-full min-h-[680px]">

          {/* Left: Illustration */}
          <div className="w-5/12 bg-[#fff7f3] relative overflow-hidden flex flex-col">
            <img src="/assets/images/authbg.svg" alt="auth art"
              className="absolute inset-0 w-full h-full object-cover opacity-80" />

            <div className="relative z-10 p-8">
              <Link href="/">
                <img src="/234dealslogo.svg" alt="234Deals" width={110} />
              </Link>
            </div>

            <div className="relative z-10 flex flex-col justify-center flex-1 px-8 pb-10">
              <p className="text-5xl font-extrabold text-gray-900 leading-tight">
                {role === "vendor" ? "Sell on" : "Shop on"}
              </p>
              <p className="text-5xl font-extrabold text-orange-500 leading-tight mb-4">
                234Deals
              </p>
              <p className="text-gray-700 text-base leading-relaxed max-w-[300px]">
                {role === "vendor"
                  ? "Set up your store, reach millions of buyers, and grow your business across Nigeria."
                  : "Join thousands of users buying and selling with ease across Nigeria."}
              </p>

              {role === "vendor" && (
                <div className="mt-6 space-y-3">
                  {["Free store setup", "Reach millions of buyers", "Secure & fast payouts"].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-7/12 p-10 overflow-y-auto flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold text-orange-500 mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Create Account
            </h1>
            <p className="text-gray-500 text-sm mb-6">Sign up as a customer or register your store as a vendor.</p>

            <RoleToggle role={role} setRole={setRole} setError={setError} />

            {role === "vendor" && (
              <div className="flex items-start gap-2 mb-5 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-xs text-orange-700 leading-relaxed">
                  Vendor accounts are reviewed within <strong>24 hours</strong>. You'll get a confirmation email before your store goes live.
                </p>
              </div>
            )}

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">Sign up via</p>
              <ContactMethodToggle method={method} setMethod={setMethod} />
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <BaseFields role={role} method={method} formData={formData} handleChange={handleChange} showPassword={showPassword} setShowPassword={setShowPassword} />
                {role === "vendor" && <VendorFields formData={formData} handleChange={handleChange} categories={categories} />}

                <button type="submit" disabled={loading}
                  className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition shadow-md disabled:opacity-50">
                  {loading ? "Sending Code..." : role === "vendor" ? "Register as Vendor" : "Create Account"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-5">
                 <div>
                  <label className={labelCls}>Verification Code</label>
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code" 
                    className={inputCls} 
                    required
                  />
                  <p className="text-[11px] text-gray-500 mt-3 leading-relaxed italic border-l-2 border-orange-200 pl-3">
                    We've sent a 6-digit verification code to <strong>{formData.contact}</strong>.<br />
                    If you don't see it in your inbox, please <strong>check your spam/junk folder</strong>.<br />
                    This code will expire in <span className="text-orange-600 font-bold">10 minutes</span>.
                  </p>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition shadow-md disabled:opacity-50">
                  {loading ? "Verifying..." : "Verify & Complete Signup"}
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-zinc-500 text-sm font-bold hover:text-zinc-700">
                  Go Back & Edit Details
                </button>
              </form>
            )}

            <p className="mt-5 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-orange-600 hover:underline">Log In</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
