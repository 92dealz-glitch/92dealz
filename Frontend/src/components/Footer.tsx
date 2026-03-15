import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white">
      {/* subtle shadow divider on top of footer */}
      <div className="w-full h-4">
        <div
          className="w-full h-1"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0.06), rgba(255,255,255,0))',
          }}
        />
        <div className="w-full h-1 bg-white" />
        <div className="w-full h-2 bg-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-start">
          <div>
            <h5 className="text-sm font-semibold mb-4">OUR COMPANY</h5>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>About 234Deals</li>
              <li>We are Hiring</li>
              <li>Affiliates</li>
              <li>Pricing</li>
              <li>Terms and conditions</li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold mb-4">SUPPORT</h5>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>Support@234deals.com</li>
              <li>Safety Tips</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold mb-4">POLICIES</h5>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>Cookie Policy</li>
              <li>Copyright Policy</li>
              <li>Billing Policy</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div className="flex flex-col items-end">
            <h5 className="text-sm font-semibold mb-4">Follow us on</h5>
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-end">
              {/* Social SVG icons */}
              <a
                aria-label="instagram"
                className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-300"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke="#111"
                    strokeWidth="1.2"
                  />
                  <circle cx="12" cy="12" r="3" stroke="#111" strokeWidth="1.2" />
                  <circle cx="17.5" cy="6.5" r="0.75" fill="#111" />
                </svg>
              </a>
              <a
                aria-label="facebook"
                className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-300"
              >
                <svg
                  width="10"
                  height="18"
                  viewBox="0 0 10 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.5 18V10.8h2.4l.4-3.1H6.5V5.1c0-.9.3-1.6 1.7-1.6h1.8V.2C10 0 8.6 0 7.3 0 4.9 0 3 1.6 3 4.5v3.2H0v3.1h3V18h3.5z"
                    fill="#111"
                  />
                </svg>
              </a>
              <a
                aria-label="twitter"
                className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-300"
              >
                <svg
                  width="16"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23 4.5c-.7.3-1.4.6-2.1.7.8-.5 1.3-1.3 1.6-2.2-.7.4-1.5.7-2.3.9C19.4 3 18.3 2.5 17 2.5c-1.8 0-3.2 1.5-3.2 3.4 0 .3 0 .6.1.9C10.1 6.5 6.3 4.4 3.6 1.4c-.4.6-.6 1.3-.6 2.1 0 1.2.6 2.2 1.6 2.8-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.5 3.1 3.9-.5.1-1 .2-1.6.2-.4 0-.8 0-1.2-.1.8 2.5 3.1 4.3 5.9 4.4-2.1 1.7-4.7 2.6-7.4 2.6-.5 0-1 0-1.5-.1C4.5 20.3 7.8 21.5 11.5 21.5c7.2 0 11.1-6 11.1-11.2v-.5c.8-.6 1.4-1.3 1.9-2.1-.7.3-1.4.5-2.2.6z"
                    fill="#111"
                  />
                </svg>
              </a>
              <a
                aria-label="whatsapp"
                className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-300"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.5 3.5A11.9 11.9 0 0012 0C5.4 0 .4 5 0 11.6a11.7 11.7 0 001.6 5.6L0 24l6.9-1.8a11.7 11.7 0 005.6 1.6c6.6-.4 11.6-5.4 11.6-12 0-3.2-1.2-6.2-3.6-8.3zM12 21.8a9.9 9.9 0 01-5.3-1.5l-.4-.3-4.1 1.1 1.1-4.1-.3-.4A9.9 9.9 0 012.2 12 9.8 9.8 0 1112 21.8z"
                    fill="#111"
                  />
                </svg>
              </a>
            </div>

            {/* Logo + tagline */}
            <div className="text-center md:text-right">
              <div className="flex flex-col items-center md:items-end gap-2">
                <Image
                  src="/234dealslogo.svg"
                  alt="234Deals Logo"
                  width={112}
                  height={60}
                  className="w-28 h-auto object-contain"
                />
                <div className="text-sm font-semibold text-gray-800">
                  234Deals
                </div>
                <div className="text-xs text-gray-600">
                  The Marketplace By Us For Us
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#efe8e8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4">
          <p className="text-center text-sm text-gray-800 font-medium">
            Copyright © 2025. 234Deals, All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
