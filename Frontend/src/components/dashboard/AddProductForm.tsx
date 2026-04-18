import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, X, Upload, Plus, Star, Zap, Info, CheckCircle2, ChevronDown, Lock } from "lucide-react";
import { createAd } from "@/services/ads.service";
import { uploadImage } from "@/services/upload.service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getFallbackArray } from "@/data/categoriesData";
import { getMyProfile, UserProfile } from "@/lib/api";
import { NIGERIAN_STATES, NIGERIAN_LOCATIONS } from "@/data/locationData";
import { useAlert } from "@/context/AlertContext";
import { useCurrency } from "@/context/CurrencyContext";

type Step = 1 | 2 | 3;

interface CategoryItem {
    id: string; // slug
    catId: number;
    title: string;
    icon: string;
    columns: { heading: string; items: string[] }[];
    specifications_template: any[];
}

const formatWithCommas = (val: string) => {
    if (!val) return "";
    const clean = val.replace(/\D/g, "");
    return new Intl.NumberFormat().format(Number(clean));
};

const stripCommas = (val: string) => {
    return val.replace(/\D/g, "");
};

export default function AddProductForm() {
    const [step, setStep] = useState<Step>(1);
    const [showClearModal, setShowClearModal] = useState(false);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isNigerian, setIsNigerian] = useState(false);
    const [isChina, setIsChina] = useState(false);
    const [profileLoaded, setProfileLoaded] = useState(false);
    const { showVendorTasks, showAlert } = useAlert();

    const { rates } = useCurrency();

    // Shared state for all steps
    const [formData, setFormData] = useState({
        title: "",
        category: "", // slug or id? I'll use numeric id for API but slug for UI if needed.
        category_id: null as number | null,
        subcategory: "",
        condition: "",
        brand: "",
        model: "",
        color: "",
        price: "",
        originalCurrency: "USD" as "NGN" | "USD" | "CNY",
        negotiable: "No",
        description: "",
        images: [] as string[],
        state: "",
        internalStorage: "",
        city: "",
        location: "", // Country
        specifications: {} as Record<string, any>,
        plan_type: "free" as "free" | "basic" | "star" | "premium"
    });



    useEffect(() => {
        getFallbackArray().then(res => {
            setCategories(res as any);
        });

        const detectLocation = async () => {
            try {
                const res = await getMyProfile();
                if (res.success && res.data) {
                    const phoneStr = String(res.data.phone || "");
                    const isNig = res.data.country_code === 'NG' || res.data.country_name === 'Nigeria' || phoneStr.startsWith('+234') || phoneStr.startsWith('234');
                    const isCh = res.data.country_code === 'CN' || res.data.country_name === 'China' || phoneStr.startsWith('+86') || phoneStr.startsWith('86');
                    setIsChina(isCh);
                    let finalIsNig = isNig;
                    let finalIsChina = isCh;

                    // Fallback to IP location if phone is not verified or not matching known regions
                    if (!isNig && !isCh) {
                        try {
                            const ipRes = await fetch("https://ipapi.co/json/").then(r => r.json());
                            if (ipRes && ipRes.country_code === "NG") {
                                finalIsNig = true;
                            } else if (ipRes && ipRes.country_code === "CN") {
                                finalIsChina = true;
                            }
                        } catch (ipErr) {
                            console.warn("IP Geolocation failed, defaulting to phone detection", ipErr);
                        }
                    }

                    setIsNigerian(finalIsNig);
                    setIsChina(finalIsChina);
                    setProfile(res.data);

                    const defaultCurrency = finalIsNig ? "NGN" : finalIsChina ? "CNY" : "USD";
                    const defaultLocation = finalIsNig ? "Nigeria" : finalIsChina ? "China" : "";

                    setFormData(prev => ({
                        ...prev,
                        location: prev.location || defaultLocation,
                        originalCurrency: (prev.originalCurrency === "USD" && !prev.price) ? defaultCurrency : prev.originalCurrency,
                        plan_type: finalIsChina ? 'basic' : 'free' // Default new ads
                    }));

                }
            } catch (err) {
                console.error("Failed to load profile or detect location", err);
            } finally {
                setProfileLoaded(true);
            }
        };

        detectLocation();
    }, []);

    const updateFormData = (newData: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const nextStep = () => setStep((prev) => (Math.min(prev + 1, 3) as Step));
    const prevStep = () => setStep((prev) => (Math.max(prev - 1, 1) as Step));

    const selectedCategory = categories.find(c => Number(c.catId) === formData.category_id);

    return (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-black font-black text-[18px]">Add New Product</h2>
                <button
                    onClick={() => setShowClearModal(true)}
                    className="bg-zinc-700 hover:bg-zinc-800 text-white font-bold py-1.5 px-4 rounded text-xs transition-colors"
                >
                    Clear
                </button>
            </div>

            <div className="p-5 sm:p-8 lg:p-12 max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl sm:text-[24px] font-black text-black">
                            {step === 1 && "Product Info"}
                            {step === 2 && "Pricing & Details"}
                            {step === 3 && "Photos & Location"}
                        </h3>
                        <span className="text-[#10B981] font-bold text-sm">{step === 1 ? "33%" : step === 2 ? "66%" : "100%"}</span>
                    </div>
                    <div className="text-zinc-500 font-bold text-sm mb-3">Step {step} of 3</div>
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#f45c03] transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Plan Info Badge */}
                {profile && (
                    <div className="mb-8 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${profile.subscription_plan === 'star' ? 'bg-yellow-100 text-yellow-600' : profile.subscription_plan === 'basic' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                                {profile.subscription_plan === 'star' ? <Star size={20} /> : <Zap size={20} />}
                            </div>
                            <div>
                                <p className="text-xs font-black text-zinc-400 uppercase tracking-wider">Current Plan</p>
                                <p className="text-black font-black uppercase">
                                    {isChina 
                                        ? (profile.subscription_plan === 'free' || !profile.subscription_plan ? 'Plan Required' : profile.subscription_plan === 'basic' ? 'Featured Tier' : profile.subscription_plan === 'star' ? 'Premium Tier' : profile.subscription_plan)
                                        : (profile.subscription_plan || 'Free')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 1: Product Info */}
                {step === 1 && (
                    <StepOne
                        data={formData}
                        updateData={updateFormData}
                        onNext={nextStep}
                        categories={categories}
                    />
                )}

                {/* Step 2: Pricing & Details */}
                {step === 2 && (
                    <StepTwo
                        data={formData}
                        updateData={updateFormData}
                        onNext={nextStep}
                        onBack={prevStep}
                        selectedCategory={selectedCategory}
                    />
                )}

                {/* Step 3: Photos & Location */}
                {step === 3 && (
                    <StepThree
                        data={formData}
                        updateData={updateFormData}
                        onBack={prevStep}
                        isNigerian={isNigerian}
                        isChina={isChina}
                        profile={profile}
                        showVendorTasks={showVendorTasks}
                    />
                )}
            </div>

            {/* Clear Modal */}
            {showClearModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200 text-center relative">
                        <button
                            onClick={() => setShowClearModal(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <div className="mb-6 flex justify-center">
                            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center">
                                <TrashIcon />
                            </div>
                        </div>
                        <h4 className="text-black font-black text-xl mb-4">
                            Are you sure you want to clear all fields?
                        </h4>
                        <p className="text-zinc-500 font-semibold mb-8 text-sm leading-relaxed">
                            It&apos;ll remove all the info you&apos;ve already filled in this ad
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    setFormData({
                                        title: "",
                                        category: "",
                                        category_id: null,
                                        subcategory: "",
                                        condition: "",
                                        brand: "",
                                        model: "",
                                        color: "",
                                        price: "",
                                        negotiable: "No",
                                        description: "",
                                        images: [] as string[],
                                        state: "",
                                        city: "",
                                        location: "",
                                        internalStorage: "",
                                        originalCurrency: "USD",
                                        specifications: {} as Record<string, any>,
                                        plan_type: "free" as "free" | "basic" | "star"
                                    });
                                    setStep(1);
                                    setShowClearModal(false);
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-xl transition-all"
                            >
                                Yes, clear
                            </button>
                            <button
                                onClick={() => setShowClearModal(false)}
                                className="bg-white border border-zinc-200 text-black font-black py-4 rounded-xl hover:bg-zinc-50 transition-all"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function TrashIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10H35" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.3333 10V6.66667C13.3333 5.78261 13.6845 4.93477 14.3096 4.30964C14.9348 3.68452 15.7826 3.33333 16.6667 3.33333H23.3333C24.2174 3.33333 25.0652 3.68452 25.6904 4.30964C26.3155 4.93477 26.6667 5.78261 26.6667 6.66667V10M31.6667 10V33.3333C31.6667 34.2174 31.3155 35.0652 30.6904 35.6904C30.0652 36.3155 29.2174 36.6667 28.3333 36.6667H11.6667C10.7826 36.6667 9.93477 36.3155 9.30964 35.6904C8.68452 35.0652 8.33333 34.2174 8.33333 33.3333V10H31.6667Z" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16.6667 18.3333V28.3333" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M23.3333 18.3333V28.3333" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function InputField({ label, placeholder, value, onChange, required = false, type = "text", maxLength = 100 }: { label: string, placeholder: string, value: string, onChange: (v: string) => void, required?: boolean, type?: string, maxLength?: number }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <label className="text-black font-black text-[15px]">{label}{required && <span className="text-[#f45c03] ml-1">*</span>}</label>
                {maxLength && (
                    <span className={`text-[10px] font-bold ${value.length >= maxLength ? 'text-red-500' : 'text-zinc-400'}`}>
                        {value.length} / {maxLength}
                    </span>
                )}
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors"
            />
        </div>
    )
}

function SelectField({ label, options, value, onChange, required = false }: { label: string, options: string[], value: string, onChange: (v: string) => void, required?: boolean }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-black font-black text-[15px]">{label}{required && <span className="text-[#f45c03] ml-1">*</span>}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="appearance-none w-full border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors bg-white"
                >
                    <option value="" disabled>Select {label}</option>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <ChevronDownIcon />
                </div>
            </div>
        </div>
    )
}

function ChevronDownIcon() {
    return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
}

function CustomSelect({ label, options, value, onChange, required = false, disabled = false }: { label: string, options: string[], value: string, onChange: (v: string) => void, required?: boolean, disabled?: boolean }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="flex flex-col gap-2 relative" ref={ref}>
            <label className="text-black font-black text-[15px]">{label}{required && <span className="text-[#f45c03] ml-1">*</span>}</label>
            <button
                type="button"
                onClick={() => !disabled && setOpen(!open)}
                className={`flex items-center justify-between w-full border ${disabled ? 'bg-zinc-50 border-zinc-100' : 'bg-white border-zinc-200 focus:border-[#f45c03]'} rounded-lg p-4 text-zinc-900 font-bold transition-all text-left h-[58px]`}
                disabled={disabled}
            >
                <span className={!value ? "text-zinc-400" : ""}>{value || `Select ${label}`}</span>
                <ChevronDown className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} size={18} />
            </button>
            {open && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-zinc-100 rounded-xl shadow-xl z-50 py-2 max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 border-t-4 border-t-orange-500">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors hover:bg-orange-50 hover:text-orange-600 ${value === opt ? 'bg-orange-50 text-orange-600' : 'text-zinc-700'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function StepOne({ data, updateData, onNext, categories }: { data: any, updateData: (d: any) => void, onNext: () => void, categories: CategoryItem[] }) {
    const selectedCat = categories.find(c => Number(c.catId) === data.category_id);
    const subcategoryOptions = selectedCat ? selectedCat.columns.flatMap(c => c.items) : [];
    const specs = selectedCat?.specifications_template || [];

    const handleSpecChange = (label: string, value: any) => {
        updateData({
            specifications: {
                ...data.specifications,
                [label]: value
            }
        });
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <InputField label="Product Title" placeholder="e.g. washing machine" value={data.title} onChange={(v) => updateData({ title: v })} required maxLength={70} />
            <div className="flex flex-col gap-2">
                <label className="text-black font-black text-[15px]">Category<span className="text-[#f45c03] ml-1">*</span></label>
                <div className="relative">
                    <select
                        value={data.category_id || ""}
                        onChange={(e) => {
                            const id = Number(e.target.value);
                            const cat = categories.find(c => Number(c.catId) === id);
                            updateData({ category_id: id, category: cat?.id || "", subcategory: "" });
                        }}
                        className="appearance-none w-full border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors bg-white"
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map(c => <option key={c.catId} value={c.catId}>{c.title}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <ChevronDownIcon />
                    </div>
                </div>
            </div>

            {subcategoryOptions.length > 0 && (
                <SelectField
                    label="Subcategory"
                    options={subcategoryOptions}
                    value={data.subcategory}
                    onChange={(v) => updateData({ subcategory: v })}
                    required
                />
            )}

            {specs.length > 0 && (
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-6 mt-4">
                    <h4 className="text-black font-black text-[17px] mb-6">Product Specifications <span className="text-[#f45c03] ml-1">*</span></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {specs.map((s: any) => (
                            <div key={s.label}>
                                {s.type === "select" ? (
                                    <SelectField
                                        label={s.label}
                                        options={s.options}
                                        value={data.specifications[s.label] || ""}
                                        onChange={(v) => handleSpecChange(s.label, v)}
                                    />
                                ) : s.type === "number" ? (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-black font-black text-[15px]">{s.label}</label>
                                        <input
                                            type="number"
                                            value={data.specifications[s.label] || ""}
                                            onChange={(e) => handleSpecChange(s.label, e.target.value)}
                                            placeholder={s.placeholder || ""}
                                            className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors bg-white"
                                        />
                                    </div>
                                ) : (
                                    <InputField
                                        label={s.label}
                                        placeholder={s.placeholder || ""}
                                        value={data.specifications[s.label] || ""}
                                        onChange={(v) => handleSpecChange(s.label, v)}
                                        maxLength={50}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}



            <div className="flex flex-col items-end gap-2 pt-8">
                {(!data.title || !data.category_id) && (
                    <p className="text-red-500 font-bold text-sm">
                        ⚠️ Product Title and Category are compulsory.
                    </p>
                )}
                <button
                    onClick={onNext}
                    disabled={!data.title || !data.category_id}
                    className="bg-[#f45c03] hover:bg-[#f45c03] disabled:opacity-50 text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-orange-100 w-full sm:w-auto sm:min-w-[200px]"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

function StepTwo({ data, updateData, onNext, onBack, selectedCategory }: { data: any, updateData: (d: any) => void, onNext: () => void, onBack: () => void, selectedCategory?: CategoryItem }) {
    const { rates } = useCurrency();

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                    <label className="text-black font-black text-[15px]">Price<span className="text-[#f45c03] ml-1">*</span></label>
                    <div className="flex gap-2">
                        <div className="relative w-1/3">
                            <select
                                value={data.originalCurrency}
                                onChange={(e) => updateData({ originalCurrency: e.target.value as any })}
                                className="appearance-none w-full border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors bg-zinc-50"
                            >
                                <option value="NGN">NGN (₦)</option>
                                <option value="USD">USD ($)</option>
                                <option value="CNY">CNY (¥)</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                <ChevronDown size={14} />
                            </div>
                        </div>
                        <div className="w-2/3">
                            <input
                                type="text"
                                value={formatWithCommas(data.price)}
                                onChange={(e) => {
                                    const val = stripCommas(e.target.value);
                                    if (val.length <= 12) updateData({ price: val });
                                }}
                                placeholder="Enter price (Max 12 digits)"
                                className="w-full border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors"
                            />
                        </div>
                    </div>
                    {data.price && data.originalCurrency !== "NGN" && (
                        <p className="text-[10px] font-bold text-zinc-400">
                            Standardized: {(Number(data.price) / (rates[data.originalCurrency] || 1) * rates.NGN).toLocaleString(undefined, { maximumFractionDigits: 0 })} NGN approx.
                        </p>
                    )}
                </div>
                <SelectField label="Condition" options={["New", "Used", "Refurbished"]} value={data.condition} onChange={(v) => updateData({ condition: v })} required />
                <SelectField label="Negotiable" options={["Yes", "No"]} value={data.negotiable} onChange={(v) => updateData({ negotiable: v })} />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <label className="text-black font-black text-[15px]">Description <span className="text-[#f45c03] ml-1">*</span></label>
                    <span className={`text-[10px] font-bold ${data.description.length >= 500 ? 'text-red-500' : 'text-zinc-400'}`}>
                        {data.description.length} / 500
                    </span>
                </div>
                <textarea
                    placeholder="Describe your product in detail..."
                    value={data.description}
                    onChange={(e) => updateData({ description: e.target.value })}
                    maxLength={500}
                    rows={6}
                    className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] transition-colors resize-none"
                />
            </div>

            <div className="flex flex-col gap-4 pt-8">
                {(!data.price || !data.description) && (
                    <p className="text-red-500 font-bold text-sm text-right">
                        ⚠️ Price and Description are compulsory.
                    </p>
                )}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <button
                        onClick={onBack}
                        className="bg-[#f45c03] hover:bg-[#f45c03] text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-orange-100 w-full sm:w-auto sm:min-w-[200px]"
                    >
                        Back
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!data.price || !data.description}
                        className="bg-[#f45c03] hover:bg-[#f45c03] disabled:opacity-50 text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-orange-100 w-full sm:w-auto sm:min-w-[200px]"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

function StepThree({ data, updateData, onBack, isNigerian, isChina, profile, showVendorTasks }: {
    data: any,
    updateData: (d: any) => void,
    onBack: () => void,
    isNigerian?: boolean,
    isChina?: boolean,
    profile: any,
    showVendorTasks: () => void
}) {
    const router = useRouter();
    const { showAlert, showConfirm } = useAlert();
    const [submitting, setSubmitting] = useState(false);
    const [limitError, setLimitError] = useState<string | null>(null);
    const [explanationModal, setExplanationModal] = useState<{ title: string, msg: string, plan: string } | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);

    async function onChooseFile(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;

        // 3MB limit check
        if (f.size > 3 * 1024 * 1024) {
            showAlert("File is too large. Each image must be less than 3MB.", "Oops!");
            return;
        }

        setUploading(true);
        try {
            const res = await uploadImage(f);
            updateData({ images: [...data.images, res.url] });
        } catch (er: any) {
            console.error(er);
        } finally {
            setUploading(false);
        }
    }

    async function postAd() {
        const p = Number(data.price);
        if (!data.title || Number.isNaN(p) || data.images.length === 0) return;

        // Strict dual verification check for vendors
        if (!profile?.is_phone_verified || !profile?.is_email_verified) {
            showVendorTasks(); // Globally triggers the tasks modal
            return;
        }

        setSubmitting(true);
        try {
            await createAd({
                title: data.title,
                price: p,
                description: data.description,
                category_id: data.category_id,
                subcategory: data.subcategory,
                specifications: data.specifications,
                images: data.images,
                condition: data.condition,
                brand: data.brand,
                model: data.model,
                color: data.color,
                negotiable: data.negotiable,
                location: data.location,
                state: data.state,
                city: data.city,
                originalCurrency: data.originalCurrency,
                originalPrice: p,
                plan_type: data.plan_type
            });
            await showAlert("Your ad has been submitted and is pending admin approval. It will be listed once reviewed.", "Success!");
            router.push("/vendor-dashboard/my-ads");
        } catch (er: any) {
            console.error(er);
            // Professional pop up for subscription/limit errors
            if (er.message && (er.message.includes("Capacity Reached") || er.message.includes("expired") || er.message.includes("must select a paid"))) {
                showAlert(er.message, "Plan Required");
            } else {
                showAlert(er.message || "Something went wrong. Please try again.", "Error");
            }
        } finally {
            setSubmitting(false);
        }
    }

    // Handled by props now

    const getExplanation = (tier: string) => {
        if (tier === 'basic') return { title: "Featured Boost", msg: "Featured ads appear in the 'Trending' section and have 5x more visibility than standard ads.", plan: "Featured Tier" };
        if (tier === 'star') return { title: "Premium Visibility", msg: "Star ads are highlighted in 'Hot Deals' and 'Featured' sections for maximum market dominance.", plan: "Premium Enterprise" };
        if (tier === 'premium') return { title: "Ultimate Visibility", msg: "Ultimate ads get top-category priority placement and a dedicated badge for absolute trust.", plan: "Ultimate Tier" };
        return null;
    };

    return (
        <div className="space-y-12 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-8">
                <h4 className="text-orange-800 font-black text-sm mb-1">Review your details:</h4>
                <p className="text-orange-600 text-xs font-bold">
                    {data.title} • {data.originalCurrency === 'NGN' ? '₦' : data.originalCurrency === 'USD' ? '$' : '¥'}{Number(data.price).toLocaleString()} • {data.category} {data.subcategory && `> ${data.subcategory}`}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CustomSelect
                    label="Country"
                    options={isChina ? ["China"] : ["Nigeria"]}
                    value={data.location || ""}
                    onChange={(v) => {
                        updateData({ location: v, state: "", city: "" });
                    }}
                />

                {data.location === "Nigeria" ? (
                    <>
                        <CustomSelect
                            label="State"
                            options={NIGERIAN_STATES}
                            value={data.state || ""}
                            onChange={(v) => updateData({ state: v, city: "" })}
                            required
                        />
                        {data.state && (
                            <CustomSelect
                                label="City"
                                options={NIGERIAN_LOCATIONS[data.state] || []}
                                value={data.city || ""}
                                onChange={(v) => updateData({ city: v })}
                                required
                            />
                        )}
                    </>
                ) : null}
            </div>

            <div>
                <h4 className="text-black font-black text-[17px] mb-4">First picture - is the title/display image.</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {data.images.map((url: string, idx: number) => (
                        <div key={url} className="aspect-square rounded-xl border border-zinc-200 relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`image-${idx}`} className="absolute inset-0 w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">{idx === 0 ? "DISPLAY" : `#${idx + 1}`}</span>
                            <button
                                onClick={() => updateData({ images: data.images.filter((_: any, i: number) => i !== idx) })}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {data.images.length < 20 && (
                        <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#f45c03] hover:bg-orange-50 transition-all text-zinc-400 hover:text-[#f45c03] relative overflow-hidden">
                            <>
                                <Plus size={24} />
                                <span className="text-[10px] font-black uppercase">{uploading ? "Uploading..." : data.images.length === 0 ? "Upload Image" : "Add Photo"}</span>
                            </>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChooseFile} />
                        </label>
                    )}
                </div>
                <p className="mt-4 text-zinc-500 text-xs font-bold">You can upload up to 20 photos. First image will be used as cover.</p>
            </div>

            <div>
                <h4 className="text-[24px] font-black text-black mb-2">Visibility Tier</h4>
                <p className="text-zinc-500 font-bold text-sm mb-6">Choose how you want this ad to appear on the platform.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(isChina && (profile?.subscription_plan === 'free' || !profile?.subscription_plan)) && (
                        <div className="md:col-span-2 lg:col-span-4">
                            <div className="p-10 bg-black rounded-[32px] text-center border-4 border-[#f45c03] shadow-2xl">
                                <Info size={56} className="text-[#f45c03] mx-auto mb-6" />
                                <h3 className="text-3xl font-black text-white mb-3">Subscription Required</h3>
                                <p className="text-zinc-400 font-bold mb-8 text-lg">In order to add product you have to purchase a plan for better experience and visibility</p>
                                <Link href="/pricing" className="inline-block bg-[#f45c03] text-white px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-orange-500/20">
                                    View Pricing Plans
                                </Link>
                            </div>
                        </div>
                    )}
                    {!isChina && (
                        <VisibilityOption
                            id="free"
                            title="Standard"
                            price="FREE"
                            perk="Lasts 30 Days"
                            active={data.plan_type === 'free'}
                            onClick={() => updateData({ plan_type: 'free' })}
                            disabled={false}
                            count={profile?.subscription_stats ? `${profile.subscription_stats.free} / ${profile.subscription_stats.limits.free}` : null}
                        />
                    )}
                    <VisibilityOption
                        id="basic"
                        title={isChina ? "Featured Tier" : "Featured"}
                        price={isChina ? "$9.99" : "BASIC"}
                        perk="Trending Ads list"
                        active={data.plan_type === 'basic'}
                        onClick={() => {
                            const hasPlan = (profile?.basic_plan_expires_at && new Date(profile.basic_plan_expires_at) > new Date());
                            if (!hasPlan) setExplanationModal(getExplanation('basic'));
                            else updateData({ plan_type: 'basic' });
                        }}
                        disabled={false}
                        isLocked={!(profile?.basic_plan_expires_at && new Date(profile.basic_plan_expires_at) > new Date())}
                        count={profile?.subscription_stats ? `${profile.subscription_stats.basic} / ${profile.subscription_stats.limits.basic}` : null}
                    />
                    <VisibilityOption
                        id="star"
                        title={isChina ? "Premium Tier" : "Premium"}
                        price={isChina ? "$24.99" : "STAR"}
                        perk="Hot Deals & Featured"
                        active={data.plan_type === 'star'}
                        onClick={() => {
                            const hasPlan = (profile?.star_plan_expires_at && new Date(profile.star_plan_expires_at) > new Date()) || 
                                           (profile?.premium_plan_expires_at && new Date(profile.premium_plan_expires_at) > new Date());
                            if (!hasPlan) setExplanationModal(getExplanation('star'));
                            else updateData({ plan_type: 'star' });
                        }}
                        disabled={false}
                        isLocked={!((profile?.star_plan_expires_at && new Date(profile.star_plan_expires_at) > new Date()) || 
                                  (profile?.premium_plan_expires_at && new Date(profile.premium_plan_expires_at) > new Date()))}
                        count={profile?.subscription_stats ? `${profile.subscription_stats.star} / ${profile.subscription_stats.limits.star}` : null}
                    />
                    {!isChina && (
                        <VisibilityOption
                            id="premium"
                            title="Ultimate"
                            price="PREMIUM"
                            perk="Top Category Placement"
                            active={data.plan_type === 'premium'}
                            onClick={() => {
                                const hasPlan = (profile?.premium_plan_expires_at && new Date(profile.premium_plan_expires_at) > new Date());
                                if (!hasPlan) setExplanationModal(getExplanation('premium'));
                                else updateData({ plan_type: 'premium' });
                            }}
                            disabled={false}
                            isLocked={!(profile?.premium_plan_expires_at && new Date(profile.premium_plan_expires_at) > new Date())}
                            count={profile?.subscription_stats ? `${profile.subscription_stats.premium} / ∞` : null}
                        />
                    )}
                </div>

                {/* Limit Error Dialog */}
                {limitError && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <div className="bg-white rounded-[32px] p-10 max-w-md w-full animate-in zoom-in-95 duration-200 shadow-2xl text-center border-4 border-orange-500">
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Info size={40} className="text-[#f45c03]" />
                            </div>
                            <h3 className="text-2xl font-black text-black mb-4">Capacity Reached</h3>
                            <p className="text-zinc-600 font-bold mb-8 leading-relaxed">{limitError}</p>
                            <div className="flex flex-col gap-3">
                                <Link href="/pricing" className="w-full bg-[#f45c03] text-white py-4 rounded-xl font-black shadow-lg shadow-orange-100">Upgrade Plan</Link>
                                <button onClick={() => setLimitError(null)} className="w-full py-2 text-zinc-400 font-bold">Close</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Explanation Modal */}
                {explanationModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-[32px] p-8 max-w-md w-full animate-in zoom-in-95 duration-200 shadow-2xl relative">
                            <button onClick={() => setExplanationModal(null)} className="absolute top-6 right-6 text-zinc-400 hover:text-black focus:outline-none"><X size={24} /></button>
                            <div className="mb-6">
                                <h3 className="text-3xl font-black text-black mb-2">{explanationModal.title}</h3>
                                <p className="text-zinc-500 font-bold text-sm">{explanationModal.msg}</p>
                            </div>
                            <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl mb-8 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm"><Zap className="text-orange-600" size={24} /></div>
                                <div>
                                    <p className="text-sm font-black text-orange-900">Required Upgrade</p>
                                    <p className="text-xs font-bold text-orange-700">Need <span className="underline">{explanationModal.plan}</span> to unlock.</p>
                                </div>
                            </div>
                            <Link href="/pricing" className="block w-full text-center bg-black text-white py-4 rounded-xl font-black">Plan Pricing</Link>
                        </div>
                    </div>
                )}
                {profile?.subscription_plan === 'free' && !isChina && (
                    <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3">
                        <Info size={18} className="text-orange-600" />
                        <p className="text-xs font-bold text-orange-800">
                            Upgrade to <Link href="/pricing" className="underline font-black">Basic, Star or Ultimate</Link> to unlock premium visibility tiers for your products.
                        </p>
                    </div>
                )}
                {/* Redundant bar removed as per requirement */}
            </div>

            <div className="flex flex-col gap-4 pt-8">
                {(data.images.length === 0 || !data.title || !data.price) && (
                    <p className="text-red-500 font-bold text-sm text-right">
                        ⚠️ {data.images.length === 0 ? "A product picture is compulsory to list your deal." : "Missing required product details."}
                    </p>
                )}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <button
                        onClick={onBack}
                        className="bg-[#f45c03] hover:bg-[#f45c03] text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-orange-100 w-full sm:w-auto sm:min-w-[200px]"
                    >
                        Back
                    </button>
                    <div className="flex gap-4 w-full sm:w-auto">
                        {(() => {
                            const currentPlanType = data.plan_type || 'free';
                            const stats = profile?.subscription_stats;
                            const limitReached = stats ? (currentPlanType !== 'premium' && (stats[currentPlanType as keyof typeof stats] as number) >= (stats.limits[currentPlanType as keyof typeof stats.limits] as number)) : false;

                            if (limitReached) {
                                return (
                                    <Link
                                        href="/pricing"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto bg-black text-white font-black py-4 px-8 rounded-xl transition-all shadow-lg text-center"
                                    >
                                        Upgrade Plan to Post
                                    </Link>
                                );
                            }

                            return (
                                <button
                                    onClick={postAd}
                                    disabled={submitting || data.images.length === 0 || !data.title || !data.price}
                                    className="w-full sm:w-auto bg-[#f45c03] hover:bg-[#f45c03] disabled:opacity-50 text-white font-black py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-100 sm:min-w-[180px]"
                                >
                                    {submitting ? "Posting..." : "Post Ad"}
                                </button>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    )
}

function VisibilityOption({ id, title, price, perk, active, onClick, disabled, count, isLocked }: { id: string, title: string, price: string, perk: string, active: boolean, onClick: () => void, disabled: boolean, count: string | null, isLocked?: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`flex flex-col p-5 rounded-[24px] border-2 transition-all text-left relative overflow-hidden ${active
                    ? 'border-[#f45c03] bg-orange-50/50 shadow-md shadow-orange-100'
                    : isLocked
                        ? 'border-zinc-100 bg-zinc-50'
                        : disabled
                            ? 'opacity-40 grayscale cursor-not-allowed'
                            : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
        >
            {active && (
                <div className="absolute top-3 right-3 text-[#f45c03]">
                    <CheckCircle2 size={24} />
                </div>
            )}
            {isLocked && (
                <div className="absolute top-3 right-3 text-zinc-300">
                    <Lock size={18} />
                </div>
            )}
            <div className={`mb-3 text-[10px] font-black uppercase tracking-widest ${active ? 'text-[#f45c03]' : 'text-zinc-400'}`}>
                {price}
            </div>
            <h5 className="text-black font-black text-lg mb-1">{title}</h5>
            <p className="text-zinc-500 font-bold text-[11px] mb-4">{perk}</p>

            {count && (
                <div className={`mt-auto pt-3 border-t ${active ? 'border-orange-200' : 'border-zinc-100'}`}>
                    <span className="text-[9px] font-black uppercase text-zinc-400">Used Slots</span>
                    <div className="text-xs font-black text-black">{count}</div>
                </div>
            )}

            {isLocked && (
                <div className="mt-auto pt-3 border-t border-zinc-100">
                    <span className="text-[9px] font-black uppercase text-[#f45c03] font-black flex items-center gap-1">
                        Unlock Tier
                    </span>
                </div>
            )}
        </button>
    );
}

function PromoteCard({ title, price, desc }: { title: string, price: string, desc: string }) {
    return (
        <div className="border border-[#f45c03]/30 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-black font-black text-lg">{title}</h5>
                <span className="text-[#f45c03] font-black text-xl">{price}</span>
            </div>
            <div className="flex gap-2 mb-4">
                {["7 days", "14 days", "30 days"].map(d => (
                    <span key={d} className="bg-green-100 text-green-600 px-3 py-1 rounded text-[11px] font-black">
                        {d}
                    </span>
                ))}
            </div>
            <p className="text-zinc-500 text-xs font-bold leading-relaxed">{desc}</p>
        </div>
    )
}

