"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Link href="/">
            <img src="/234dealslogo.svg" alt="234Deals" className="h-8" />
           </Link>
           <span className="text-gray-300 mx-2">|</span>
           <span className="font-semibold text-gray-700">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">{session?.user?.name}</p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Welcome Card */}
          <div className="md:col-span-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {session?.user?.name?.split(' ')[0]}! 👋</h1>
            <p className="opacity-90">Here's what's happening with your account today.</p>
          </div>

          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Wishlist Items</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Messages</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>

          {/* Recent Activity Placeholder */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
            </div>
            <div className="p-12 text-center text-gray-500">
              <p>No recent activity to show.</p>
              <button className="mt-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition">
                Browse Products
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition">
                <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">📦</span>
                <span className="font-medium text-gray-700">Track Order</span>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition">
                <span className="p-2 bg-green-100 text-green-600 rounded-lg">👤</span>
                <span className="font-medium text-gray-700">Edit Profile</span>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition">
                <span className="p-2 bg-purple-100 text-purple-600 rounded-lg">❤️</span>
                <span className="font-medium text-gray-700">View Wishlist</span>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
