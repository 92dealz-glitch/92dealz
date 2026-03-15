"use client";

import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2,
  Edit,
  Download,
  Bell
} from "lucide-react";
import AddTaxonomyModal from "@/components/admin/taxonomy/AddTaxonomyModal";
import { useNotification } from "@/context/NotificationContext";
import { API_BASE } from "@/services/apiClient";

export default function TaxonomyManagementPage() {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<"Categories" | "Tags" | "Merchants">("Categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
        if (!token) return;

        setLoading(true);
        // Fetch categories
        const catRes = await fetch(`${API_BASE}/admin/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.data || []);
        }

        // Fetch merchants (vendors)
        const merRes = await fetch(`${API_BASE}/users?role=vendor`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const merData = await merRes.json();
        if (merData.success) {
          setMerchants(merData.data || []);
        }

      } catch (err) {
        console.error("Failed to load taxonomy data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [API_BASE]);

  const handleDelete = async (type: string, id: number, name: string) => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      const endpoint = type === "Categories" ? `/admin/categories/${id}` : `/users/${id}`;
      
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        if (type === "Categories") setCategories(prev => prev.filter(c => c.id !== id));
        else setMerchants(prev => prev.filter(m => m.id !== id));
        showNotification("warning", `${name} deleted.`);
      }
    } catch (err) {
      showNotification("error", `Failed to delete ${name}.`);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-orange-600 text-2xl">Loading taxonomy...</div>;

  const categoryIcons: Record<string, string> = {
    "Electronics": "📱",
    "Fashion": "👗",
    "Home & Kitchen": "🍳",
    "Phones": "📱",
    "Gaming": "🎮",
    "Vehicle": "🚗",
    "Babies & Kids": "🧸",
    "Health & Beauty": "💄",
  };

  return (
    <div className="space-y-8 font-bold">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Taxonomy Management</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium italic">Manage categories, tags and merchant profiles</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E85A28] text-[#E85A28] rounded-lg bg-white hover:bg-orange-50 transition-colors text-sm font-bold shadow-sm active:scale-95">
            <Download size={16} />
            Export
          </button>
          <button className="relative p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm">
            <Bell size={20} className="text-zinc-600" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex p-2 bg-zinc-50 border-b border-zinc-100">
          {["Categories", "Tags", "Merchants"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                activeTab === tab 
                  ? "bg-white text-[#E85A28] shadow-sm shadow-orange-500/10" 
                  : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 md:max-w-md font-bold">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-orange-500 transition-colors text-sm font-medium"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#E85A28] text-white px-6 py-2.5 rounded-lg hover:bg-[#D14F23] transition-colors font-bold shadow-md shadow-[#E85A28]/20 active:scale-95"
            >
              <Plus size={20} />
              Add {activeTab.slice(0, -1)}
            </button>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto border border-zinc-50 rounded-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 text-zinc-500 text-[12px] font-bold uppercase tracking-wider italic">
                  <th className="px-6 py-4">Categorie Name</th>
                  <th className="px-6 py-4">Deals/Items</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 underline decoration-zinc-100 italic">
                {activeTab === "Categories" && categories.length > 0 && categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 flex items-center justify-center bg-zinc-100 rounded-lg text-lg grayscale group-hover:grayscale-0 transition-all">
                          {categoryIcons[cat.name] || "📦"}
                        </span>
                        <span className="text-sm font-black text-zinc-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-900 font-black">{cat.items || 0} items</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-[#10B981] text-white text-[10px] font-black uppercase rounded leading-none">Active</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button className="p-2 text-zinc-400 hover:text-orange-500 transition-colors active:scale-95"><Edit size={18} /></button>
                        <button onClick={() => handleDelete("Categories", cat.id, cat.name)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors active:scale-95"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}

                {activeTab === "Categories" && categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-zinc-400 font-bold italic">No categories found in backend.</td>
                  </tr>
                )}

                {activeTab === "Tags" && (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center text-zinc-400 font-medium">No tags found.</td>
                  </tr>
                )}

                {activeTab === "Merchants" && merchants.map((mer) => (
                  <tr key={mer.id} className="hover:bg-zinc-50 transition-colors group italic">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-black text-zinc-400 overflow-hidden">{(mer.name || "V").slice(0, 2)}</div>
                        <span className="text-sm font-black text-zinc-900">{mer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-900 font-black">N/A</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 text-white text-[10px] font-black uppercase rounded leading-none bg-[#10B981]">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-zinc-400 hover:text-orange-500 transition-colors active:scale-95"><Edit size={18} /></button>
                        <button onClick={() => handleDelete("Merchants", mer.id, mer.name)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors active:scale-95"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddTaxonomyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={activeTab.slice(0, -1).toLowerCase() as any} 
      />
    </div>
  );
}
