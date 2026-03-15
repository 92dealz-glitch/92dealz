"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { forgotPassword, verifyOtp as apiVerifyOtp, resetPassword, loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";

type Step = "enter" | "otp" | "reset" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("enter");
  const [email, setEmail] = useState("");
  const router = useRouter();

  // OTP state (6 digits)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [resendTimer, setResendTimer] = useState(30);

  // Reset password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let t: number | undefined;
    if (step === "otp" && resendTimer > 0) {
      t = window.setTimeout(() => setResendTimer((s) => s - 1), 1000);
    }
    return () => { if (t) clearTimeout(t); };
  }, [resendTimer, step]);

  async function sendCode() {
    setError(null);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    try {
      setLoading(true);
      await forgotPassword({ email });
      setStep("otp");
      setResendTimer(30);
      setOtp(["", "", "", "", "", ""]);
    } catch (e: any) {
      setError(e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(idx: number, val: string) {
    if (!/^[0-9]*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < inputsRef.current.length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  }

  async function verifyOtp() {
    setError(null);
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    try {
      setLoading(true);
      await apiVerifyOtp({ email, otp: code });
      setStep("reset");
    } catch (e: any) {
      setError(e.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  }

  async function onResetPassword() {
    setError(null);
    if (!password || password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await resetPassword({ email, newPassword: password });
      // auto-login after reset
      await loginUser({ email, password });
      router.push("/");
    } catch (e: any) {
      setError(e.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white relative">
        {/* Close (desktop) */}
        <Link href="/" className="hidden sm:block absolute top-4 right-4 z-30 text-orange-500 hover:text-orange-700">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Link>

        <div className="flex flex-col sm:flex-row">
          {/* Left artwork */}
          <div className="hidden sm:flex sm:w-1/2 relative bg-[#f6efe6] items-center justify-center p-8">
            <img src="/assets/images/authbg.svg" alt="auth bg" className="absolute inset-0 w-full h-full object-cover z-0" />
            <div className="relative z-10 w-full h-full flex flex-col justify-center pl-10 pr-6">
              <img src="/234dealslogo.svg" alt="234Deals" width={110} height={60} className="mb-6" />
              <h2 className="text-6xl font-extrabold text-gray-900 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                Forgot Your
              </h2>
              <h3 className="text-6xl font-extrabold text-orange-500 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                Password?
              </h3>
            </div>
          </div>

          {/* Right: multi-step content */}
          <div className="w-full sm:w-1/2 p-8 sm:p-12">
            {/* Step: Enter email */}
            {step === "enter" && (
              <div>
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl font-extrabold text-orange-500" style={{ fontFamily: "Georgia, serif" }}>Forgot Your Password?</h1>
                  <Link href="/" className="sm:hidden text-orange-500">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </Link>
                </div>
                <p className="mt-3 text-gray-800 font-medium">Don't worry. Enter your email and we'll send you a verification code.</p>

                <label className="mt-6 block text-sm font-semibold text-gray-900">Email Address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition placeholder-gray-400" />

                <button onClick={sendCode} disabled={loading} className="mt-6 w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3.5 rounded-xl text-base font-semibold transition-colors shadow-md disabled:opacity-50">{loading ? "Sending..." : "Send Verification Code"}</button>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

                <div className="mt-8 flex items-center">
                  <Link href="/login" className="flex items-center gap-3 text-gray-800 hover:underline"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span className="font-semibold">Back to Login</span></Link>
                </div>
              </div>
            )}

            {/* Step: OTP entry */}
            {step === "otp" && (
              <div className="text-center">
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl font-extrabold text-orange-500" style={{ fontFamily: "Georgia, serif" }}>We've sent you a verification code!</h1>
                  <Link href="/" className="sm:hidden text-orange-500">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </Link>
                </div>
                <p className="mt-3 text-gray-700">Enter the 6-digit code sent to {email || "your email"} to reset your password</p>

                <div className="mt-6 flex items-center justify-center gap-4">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputsRef.current[i] = el;
                      }}
                      value={otp[i]}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0) {
                          inputsRef.current[i - 1]?.focus();
                        }
                      }}
                      className="w-16 h-16 text-center rounded-md border-2 border-orange-400 text-xl font-semibold focus:outline-none"
                      inputMode="numeric"
                    />
                  ))}
                </div>

                <div className="mt-4 text-sm text-orange-500 font-medium">{resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : <button onClick={() => { setResendTimer(30); sendCode(); }} className="underline">Resend OTP</button>}</div>

                <button onClick={verifyOtp} disabled={loading} className="mt-6 w-64 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-base font-semibold transition disabled:opacity-50">{loading ? "Verifying..." : "Verify Code"}</button>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

                <div className="mt-6 flex items-center justify-center">
                  <Link href="/login" className="flex items-center gap-3 text-gray-800 hover:underline"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span className="font-semibold">Back to Login</span></Link>
                </div>
              </div>
            )}

            {/* Step: Reset password */}
            {step === "reset" && (
              <div>
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl font-extrabold text-orange-500" style={{ fontFamily: "Georgia, serif" }}>Reset Your Password</h1>
                  <Link href="/" className="sm:hidden text-orange-500">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </Link>
                </div>
                <p className="mt-3 text-gray-700">Enter a new password to secure your account.</p>

                <label className="mt-6 block text-sm font-semibold text-gray-900">New Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition placeholder-gray-400" />

                <label className="mt-4 block text-sm font-semibold text-gray-900">Confirm New Password</label>
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition placeholder-gray-400" />

                <button onClick={onResetPassword} disabled={loading} className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl text-base font-semibold transition disabled:opacity-50">{loading ? "Resetting..." : "Reset Password"}</button>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

                <div className="mt-6 flex items-center">
                  <Link href="/login" className="flex items-center gap-3 text-gray-800 hover:underline"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span className="font-semibold">Back to Login</span></Link>
                </div>
              </div>
            )}

            {/* Step: Success */}
            {step === "success" && (
              <div className="text-center py-10 px-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-500" style={{ fontFamily: "Georgia, serif" }}>Password reset successful!!</h1>

                <div className="mt-8 flex justify-center">
                  <svg width="160" height="160" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="56" stroke="#34A853" strokeWidth="6" />
                    <path d="M36 62l12 12 36-36" stroke="#34A853" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M74 34c8 6 14 16 14 26" stroke="#34A853" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.06" />
                  </svg>
                </div>

                <p className="mt-6 text-green-600 text-lg font-medium">You can now log in with your new password.</p>

                <div className="mt-10 flex items-center justify-center">
                  <Link href="/login" className="flex items-center gap-3 text-gray-800 hover:underline">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span className="font-semibold">Back to Login</span>
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
