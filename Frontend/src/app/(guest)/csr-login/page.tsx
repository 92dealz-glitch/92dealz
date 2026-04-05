"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import ReCAPTCHA from "react-google-recaptcha";

export default function CSRLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

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
        setError(result.error === "CredentialsSignin" ? "Invalid auth credentials" : result.error);
        setLoading(false);
        return;
      }

      // Automatically fetch session to verify role is correct before redirecting
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      
      if (session?.user?.role !== "csr" && session?.user?.role !== "admin") {
         // They logged in but aren't CSR/Admin
         setError("Access Denied: Missing CSR privileges.");
         setLoading(false);
         return;
      }

      router.push("/csr-dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center py-12 px-4 selection:bg-blue-500/30">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-8 sm:p-10 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"></div>
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-zinc-800 rounded-2xl mb-6 border border-zinc-700 shadow-inner">
            <img src="/234dealslogo.svg" alt="234Deals" width={60} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase" style={{ fontFamily: "Georgia, serif" }}>
            CSR <span className="text-blue-500">Portal</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Secure access to customer service</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mt-0.5 shrink-0">
               <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
             </svg>
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Staff Email ID</label>
            <input
              type="text"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="csr@234deals.com"
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-medium placeholder-zinc-600 shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-2xl px-5 py-4 pr-12 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-medium placeholder-zinc-600 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                aria-label="Toggle password"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><path d="M14.12 14.12a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="py-2 flex justify-center scale-90 sm:scale-100 origin-center overflow-hidden">
            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
              <ReCAPTCHA
                theme="dark"
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY.replace(/\s/g, "")}
                onChange={(token) => setCaptchaToken(token)}
              />
            ) : (
              <p className="text-xs text-red-500 italic">Security key missing.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black text-sm py-4 rounded-2xl hover:bg-blue-500 active:scale-[0.98] transition-all shadow-xl shadow-blue-950/20 disabled:opacity-50 uppercase tracking-widest mt-2"
          >
            {loading ? (
               <span className="flex items-center justify-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Authorizing...
               </span>
            ) : "Authenticate"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
            <Link href="/" className="text-zinc-600 hover:text-blue-500 text-[10px] font-bold uppercase tracking-widest transition-colors">
              Return to Website
            </Link>
        </div>
      </div>
    </div>
  );
}
