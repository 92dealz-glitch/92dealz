"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/lib/api";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"user" | "vendor">("user");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!captchaToken) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }

    setLoading(true);

    try {
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email.trim(),
        password: formData.password.trim(),
        captchaToken,
      });

      if (result?.error) {
        setError(result.error === "CredentialsSignin" ? "Invalid email/phone or password" : result.error);
        setLoading(false);
        return;
      }

      // After successful signIn, the SessionSync component will handle 
      // the localStorage synchronization automatically in the background.
      
      // We still need to know the role for the initial redirect if it's not a reload
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      const role = String((session?.user as any)?.role || "").toLowerCase();

      if (role === "admin") {
        setError("Admin login is restricted. Please use the official administrator portal.");
        setLoading(false);
        return;
      }

      // If we have a callbackUrl, prioritize it. Otherwise, use role-based defaults.
      if (callbackUrl) {
         router.push(callbackUrl);
      } else if (role === "vendor" || role === "seller") {
        router.push("/vendor-dashboard");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-0 px-0 sm:py-12 sm:px-4">
      <div className="w-full sm:max-w-4xl sm:rounded-2xl overflow-hidden shadow-none sm:shadow-2xl border-0 sm:border sm:border-gray-200 bg-white relative min-h-screen sm:min-h-0">

        {/* Close button — desktop only */}
        <Link href="/" className="hidden sm:block absolute top-4 right-4 z-30 text-orange-500 hover:text-orange-700 transition-colors">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Link>

        {/* ── MOBILE LAYOUT ── */}
        <div className="flex flex-col sm:hidden min-h-screen bg-gray-100 px-5 pt-10 pb-8">

          {/* Back arrow + Login heading */}
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="text-orange-500">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <h1 className="text-2xl font-extrabold text-orange-500" style={{ fontFamily: "Georgia, serif" }}>
              Login
            </h1>
          </div>

          <p className="text-gray-600 text-[14px] mb-8 leading-snug">
            Welcome back! please login to your account
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Toggle */}
            <div className="flex rounded-xl border border-gray-200 bg-gray-100 p-1 mb-4">
              {(["user", "vendor"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${role === r ? "bg-white text-orange-500 shadow-sm" : "text-gray-500"}`}
                >
                  {r === "user" ? "User" : "Vendor"}
                </button>
              ))}
            </div>
            {/* Phone / Username / Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Phone Number/{" "}
                <span className="text-gray-400 font-normal">Username/ Email Address</span>
              </label>
              <input
                type="text"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your phone number or email"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div className="mb-1">
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-12 text-sm outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mb-6">
              <Link href="/forgot-password" className="text-sm text-orange-500 font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            <div className="py-2 mb-2 flex justify-center scale-90 sm:scale-100 origin-center overflow-hidden">
              {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && isMobile ? (
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY.replace(/\s/g, "")}
                  onChange={(token) => setCaptchaToken(token)}
                />
              ) : !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && isMobile ? (
                <p className="text-xs text-red-500 italic">reCAPTCHA sitekey missing. Please check ENV vars.</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white font-bold text-base py-3.5 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-md shadow-orange-200 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="text-orange-500 font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* ── DESKTOP LAYOUT (Split Screen) ── */}
        <div className="hidden sm:flex w-full h-full min-h-[600px]">
          {/* Left: Login Form */}
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-orange-500 mb-2" style={{ fontFamily: "Georgia, serif" }}>
              Login
            </h1>
            <p className="text-gray-600 mb-8">
              Welcome back! please login to your account
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Toggle */}
              <div className="flex rounded-xl border border-gray-200 bg-gray-100 p-1">
                {(["user", "vendor"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${role === r ? "bg-white text-orange-500 shadow-sm" : "text-gray-500"}`}
                  >
                    {r === "user" ? "User" : "Vendor"}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number/ Username/ Email Address
                </label>
                <input
                  type="text"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your phone number or email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-orange-500 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>

              <div className="py-2 flex justify-center scale-90 sm:scale-100 origin-center overflow-hidden">
                {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !isMobile ? (
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY.replace(/\s/g, "")}
                    onChange={(token) => setCaptchaToken(token)}
                  />
                ) : !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !isMobile ? (
                  <p className="text-xs text-red-500 italic">reCAPTCHA sitekey missing.</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition shadow-md disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-bold text-orange-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Right: Image/Illustration */}
          <div className="w-1/2 bg-[#fff7f3] relative overflow-hidden flex items-center justify-center">
             <img
              src="/assets/images/authbg.svg"
              alt="auth art"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="relative z-10 text-center px-10">
              <img src="/234dealslogo.svg" alt="Logo" width={140} className="mx-auto mb-6" />
              <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-600 text-lg">
                Login to access your personalized dashboard and track your orders.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
