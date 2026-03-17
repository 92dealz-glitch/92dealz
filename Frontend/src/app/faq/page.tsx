"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  { question: "How do I create an account?", answer: "Click on the 'Sign Up' button at the top right of the page and follow the prompts to register as either a user or a vendor." },
  { question: "How long does vendor approval take?", answer: "Vendor applications are typically reviewed within 24 hours. You will receive an email notification once your store is approved." },
  { question: "Is it free to list items?", answer: "Yes! 234Deals offers a free tier for vendors to start listing their products immediately. We also offer premium plans for advanced features." },
  { question: "How do I contact customer support?", answer: "You can reach us anytime at 234deals@gmail.com, or through the Contact Us form." },
  { question: "How do I reset my password?", answer: "Go to the login page and click 'Forgot Password'. Enter your email address to receive a verification code." }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[800px] mx-auto px-6 py-12 sm:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-10 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border text-gray-900 border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
