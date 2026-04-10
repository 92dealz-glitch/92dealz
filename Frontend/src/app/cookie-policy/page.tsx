import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-12 sm:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">Cookie Policy</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>This Cookie Policy explains how 234Deals uses cookies and similar technologies to recognize you when you visit our website.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. What are cookies?</h2>
          <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work or work more efficiently.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Why do we use cookies?</h2>
          <p>We use first and third-party cookies for several reasons. Some are required for technical reasons in order for our marketplace to operate (like maintaining your login session). Others enable us to remember your preferences—such as your preferred location filter—to provide a more personalized and efficient browsing experience.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How can I control cookies?</h2>
          <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your web browser controls.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
