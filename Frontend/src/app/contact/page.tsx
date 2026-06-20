"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [status, setStatus] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    
    try {
      const response = await fetch("https://formspree.io/f/xeerrpnr", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      });
      if (response.ok) {
        setStatus("Thank you for your message! We will get back to you soon.");
        form.reset();
      } else {
        setStatus("Oops! There was a problem submitting your form");
      }
    } catch (error) {
      setStatus("Oops! There was a problem submitting your form");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 sm:py-20 flex flex-col md:flex-row gap-12">
        
        {/* Contact Info */}
        <div className="w-full md:w-1/3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Have questions, feedback, or need support? We're here to help! Fill out the form, or reach out to us directly via email.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFFDF9] rounded-full flex items-center justify-center text-emerald-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Email us</p>
                <a href="mailto:92dealz@gmail.com" className="text-[#708238] hover:underline font-bold">92dealz@gmail.com</a>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-8">
              <div className="w-12 h-12 bg-[#FFFDF9] rounded-full flex items-center justify-center text-emerald-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Head Office</p>
                <p className="text-gray-600 text-sm font-medium">Karachi, Pakistan</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-8">
              <div className="w-12 h-12 bg-[#FFFDF9] rounded-full flex items-center justify-center text-emerald-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Connect with us</p>
                <div className="flex gap-3 text-sm mt-1">
                  <a href="https://www.facebook.com/profile.php?id=61572818794677&mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-[#708238] hover:underline font-bold">Facebook</a>
                  <span className="text-gray-300">|</span>
                  <a href="https://www.tiktok.com/@92dealz.online?_r=1&_t=ZS-94k9ReRcEo1" target="_blank" rel="noopener noreferrer" className="text-[#708238] hover:underline font-bold">TikTok</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full md:w-2/3 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                <input type="text" name="name" id="name" required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input type="email" name="email" id="email" required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
              <input type="text" name="subject" id="subject" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition" placeholder="How can we help?" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
              <textarea name="message" id="message" rows={5} required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition resize-none" placeholder="Your message here..."></textarea>
            </div>
            <button type="submit" className="w-full bg-[#708238] hover:bg-[#5E6E2F] text-white font-semibold py-3.5 rounded-xl transition shadow-md">
              Send Message
            </button>
            {status && <p className="text-sm font-medium text-center text-[#708238] mt-4">{status}</p>}
          </form>
        </div>

      </main>
      <Footer />
    </div>
  );
}


