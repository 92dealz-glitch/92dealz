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
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Email us</p>
                <a href="mailto:234deals@gmail.com" className="text-orange-500 hover:underline">234deals@gmail.com</a>
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
                <input type="text" name="name" id="name" required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <input type="email" name="email" id="email" required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
              <input type="text" name="subject" id="subject" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition" placeholder="How can we help?" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
              <textarea name="message" id="message" rows={5} required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition resize-none" placeholder="Your message here..."></textarea>
            </div>
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl transition shadow-md">
              Send Message
            </button>
            {status && <p className="text-sm font-medium text-center text-green-600 mt-4">{status}</p>}
          </form>
        </div>

      </main>
      <Footer />
    </div>
  );
}
