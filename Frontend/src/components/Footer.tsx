import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1C1B18] border-t border-[#E9E0D4]/20 text-slate-400/90 selection:bg-[#C7A27C]/30">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 items-start">
          {/* Column 1 */}
          <div>
            <h5 className="text-sm font-bold text-slate-200 tracking-wider uppercase mb-5">OUR COMPANY</h5>
            <ul className="space-y-3.5 text-sm">
              <li><Link href="/about" className="hover:text-[#C7A27C] transition-colors duration-200">About 92Dealz</Link></li>
              <li><Link href="/signup" className="hover:text-[#C7A27C] transition-colors duration-200">We are Hiring</Link></li>
              <li><Link href="/affiliates" className="hover:text-[#C7A27C] transition-colors duration-200">Affiliates</Link></li>
              <li><Link href="/pricing" className="hover:text-[#C7A27C] transition-colors duration-200">Pricing</Link></li>
              <li><Link href="/terms" className="hover:text-[#C7A27C] transition-colors duration-200">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h5 className="text-sm font-bold text-slate-200 tracking-wider uppercase mb-5">SUPPORT</h5>
            <ul className="space-y-3.5 text-sm">
              <li><a href="mailto:92dealz@gmail.com" className="hover:text-[#C7A27C] transition-colors duration-200">Support@92dealz.com</a></li>
              <li><Link href="/safety-tips" className="hover:text-[#C7A27C] transition-colors duration-200">Safety Tips</Link></li>
              <li><Link href="/faq" className="hover:text-[#C7A27C] transition-colors duration-200">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-[#C7A27C] transition-colors duration-200">Contact Us</Link></li>
              <li className="pt-2.5 text-xs text-slate-500 italic border-t border-[#E9E0D4]/10 mt-2">
                Karachi, Pakistan
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h5 className="text-sm font-bold text-slate-200 tracking-wider uppercase mb-5">POLICIES</h5>
            <ul className="space-y-3.5 text-sm">
              <li><Link href="/cookie-policy" className="hover:text-[#C7A27C] transition-colors duration-200">Cookie Policy</Link></li>
              <li><Link href="/copyright-policy" className="hover:text-[#C7A27C] transition-colors duration-200">Copyright Policy</Link></li>
              <li><Link href="/billing-policy" className="hover:text-[#C7A27C] transition-colors duration-200">Billing Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#C7A27C] transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col items-center md:items-end col-span-2 md:col-span-1">
            <h5 className="text-sm font-bold text-slate-200 tracking-wider uppercase mb-5">Follow us on</h5>
            <div className="flex flex-wrap items-center gap-3 mb-6 justify-center md:justify-end">
              <Link
                href="#"
                aria-label="instagram"
                className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-[#C7A27C]/30 hover:border-[#C7A27C] hover:text-[#C7A27C] bg-[#C7A27C]/10 transition-all duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
                </svg>
              </Link>
              <Link
                href="https://www.facebook.com/profile.php?id=61572818794677&mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="facebook"
                className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-[#C7A27C]/30 hover:border-[#C7A27C] hover:text-[#C7A27C] bg-[#C7A27C]/10 transition-all duration-200"
              >
                <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 18V10.8h2.4l.4-3.1H6.5V5.1c0-.9.3-1.6 1.7-1.6h1.8V.2C10 0 8.6 0 7.3 0 4.9 0 3 1.6 3 4.5v3.2H0v3.1h3V18h3.5z" fill="currentColor" />
                </svg>
              </Link>
              <Link
                href="#"
                aria-label="twitter"
                className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-[#C7A27C]/30 hover:border-[#C7A27C] hover:text-[#C7A27C] bg-[#C7A27C]/10 transition-all duration-200"
              >
                <svg width="16" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 4.5c-.7.3-1.4.6-2.1.7.8-.5 1.3-1.3 1.6-2.2-.7.4-1.5.7-2.3.9C19.4 3 18.3 2.5 17 2.5c-1.8 0-3.2 1.5-3.2 3.4 0 .3 0 .6.1.9C10.1 6.5 6.3 4.4 3.6 1.4c-.4.6-.6 1.3-.6 2.1 0 1.2.6 2.2 1.6 2.8-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.5 3.1 3.9-.5.1-1 .2-1.6.2-.4 0-.8 0-1.2-.1.8 2.5 3.1 4.3 5.9 4.4-2.1 1.7-4.7 2.6-7.4 2.6-.5 0-1 0-1.5-.1C4.5 20.3 7.8 21.5 11.5 21.5c7.2 0 11.1-6 11.1-11.2v-.5c.8-.6 1.4-1.3 1.9-2.1-.7.3-1.4.5-2.2.6z" fill="currentColor" />
                </svg>
              </Link>
              <Link
                href="#"
                aria-label="whatsapp"
                className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-[#C7A27C]/30 hover:border-[#C7A27C] hover:text-[#C7A27C] bg-[#C7A27C]/10 transition-all duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.5 3.5A11.9 11.9 0 0012 0C5.4 0 .4 5 0 11.6a11.7 11.7 0 001.6 5.6L0 24l6.9-1.8a11.7 11.7 0 005.6 1.6c6.6-.4 11.6-5.4 11.6-12 0-3.2-1.2-6.2-3.6-8.3zM12 21.8a9.9 9.9 0 01-5.3-1.5l-.4-.3-4.1 1.1 1.1-4.1-.3-.4A9.9 9.9 0 012.2 12 9.8 9.8 0 1112 21.8z" fill="currentColor" />
                </svg>
              </Link>
              <Link
                href="https://www.tiktok.com/@92dealz.online?_r=1&_t=ZS-94k9ReRcEo1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="tiktok"
                className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-[#C7A27C]/30 hover:border-[#C7A27C] hover:text-[#C7A27C] bg-[#C7A27C]/10 transition-all duration-200"
              >
                <svg width="14" height="16" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"/>
                </svg>
              </Link>
            </div>

            <div className="text-center md:text-right mt-4 md:mt-0">
              <div className="flex flex-col items-center md:items-end gap-2.5">
                <Image
                  src="/92dealzlogo.svg"
                  alt="92Dealz Logo"
                  width={130}
                  height={60}
                  className="w-32 h-auto object-contain brightness-0 invert"
                />
                <div className="text-sm font-bold text-slate-200">
                  92Dealz
                </div>
                <div className="text-xs text-slate-500 font-extrabold italic text-center md:text-right">
                  A Marketplace By Us For Us
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#11100F] border-t border-[#E9E0D4]/10 py-6">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-center text-xs text-slate-500 font-medium">
            Copyright &copy; 2025. 92Dealz, All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
