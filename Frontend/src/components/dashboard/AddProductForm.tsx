import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, X, Upload, Plus } from "lucide-react";
import { createAd } from "@/services/ads.service";
import { uploadImage } from "@/services/upload.service";
import { useRouter } from "next/navigation";
import { getFallbackArray, CategoryData } from "@/data/categoriesData";

type Step = 1 | 2 | 3;

interface CategoryItem {
    id: string; // slug
    catId: number;
    title: string;
    icon: string;
    columns: { heading: string; items: string[] }[];
    specifications_template: any[];
}

export default function AddProductForm() {
    const [step, setStep] = useState<Step>(1);
    const [showClearModal, setShowClearModal] = useState(false);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    
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
        negotiable: "No",
        description: "",
        images: [] as string[],
        state: "",
        city: "",
        specifications: {} as Record<string, any>
    });

    useEffect(() => {
        getFallbackArray().then(res => {
            setCategories(res as any);
        });
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

            <div className="p-8 lg:p-12 max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-[24px] font-black text-black">
                            {step === 1 && "Product Info"}
                            {step === 2 && "Pricing & Details"}
                            {step === 3 && "Photos & Location"}
                        </h3>
                        <span className="text-[#10B981] font-bold text-sm">{step === 1 ? "33%" : step === 2 ? "66%" : "100%"}</span>
                    </div>
                    <div className="text-zinc-500 font-bold text-sm mb-3">Step {step} of 3</div>
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#E85A28] transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

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
                                        images: [],
                                        state: "",
                                        city: "",
                                        specifications: {}
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

function InputField({ label, placeholder, value, onChange, required = false }: { label: string, placeholder: string, value: string, onChange: (v: string) => void, required?: boolean }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-black font-black text-[15px]">{label}{required && <span className="text-[#E85A28] ml-1">*</span>}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#E85A28] transition-colors"
            />
        </div>
    )
}

function SelectField({ label, options, value, onChange, required = false }: { label: string, options: string[], value: string, onChange: (v: string) => void, required?: boolean }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-black font-black text-[15px]">{label}{required && <span className="text-[#E85A28] ml-1">*</span>}</label>
            <div className="relative">
                <select 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="appearance-none w-full border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#E85A28] transition-colors bg-white"
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
            <InputField label="Product Title" placeholder="e.g. washing machine" value={data.title} onChange={(v) => updateData({ title: v })} required />
            <div className="flex flex-col gap-2">
                <label className="text-black font-black text-[15px]">Category<span className="text-[#E85A28] ml-1">*</span></label>
                <div className="relative">
                    <select 
                        value={data.category_id || ""}
                        onChange={(e) => {
                            const id = Number(e.target.value);
                            const cat = categories.find(c => Number(c.catId) === id);
                            updateData({ category_id: id, category: cat?.id || "", subcategory: "" });
                        }}
                        className="appearance-none w-full border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#E85A28] transition-colors bg-white"
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
                    <h4 className="text-black font-black text-[17px] mb-6">Product Specifications <span className="text-[#E85A28] ml-1">*</span></h4>
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
                                        className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#E85A28] transition-colors bg-white"
                                    />
                                </div>
                            ) : (
                                <InputField 
                                    label={s.label} 
                                    placeholder={s.placeholder || ""} 
                                    value={data.specifications[s.label] || ""} 
                                    onChange={(v) => handleSpecChange(s.label, v)} 
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
                    className="bg-[#E85A28] hover:bg-[#D44D1F] disabled:opacity-50 text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-orange-100 min-w-[200px]"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

function StepTwo({ data, updateData, onNext, onBack, selectedCategory }: { data: any, updateData: (d: any) => void, onNext: () => void, onBack: () => void, selectedCategory?: CategoryItem }) {

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField label="Price(₦)" placeholder="Enter price here" value={data.price} onChange={(v) => updateData({ price: v })} required />
                <SelectField label="Negotiable" options={["Yes", "No"]} value={data.negotiable} onChange={(v) => updateData({ negotiable: v })} />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-black font-black text-[15px]">Description <span className="text-[#E85A28] ml-1">*</span></label>
                <textarea
                    placeholder="Describe your product in detail..."
                    value={data.description}
                    onChange={(e) => updateData({ description: e.target.value })}
                    rows={6}
                    className="border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#E85A28] transition-colors resize-none"
                />
            </div>

            <div className="flex flex-col gap-4 pt-8">
                {(!data.price || !data.description) && (
                    <p className="text-red-500 font-bold text-sm text-right">
                        ⚠️ Price and Description are compulsory.
                    </p>
                )}
                <div className="flex justify-between gap-4">
                    <button
                        onClick={onBack}
                        className="bg-[#E85A28] hover:bg-[#D44D1F] text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-orange-100 min-w-[200px]"
                    >
                        Back
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!data.price || !data.description}
                        className="bg-[#E85A28] hover:bg-[#D44D1F] disabled:opacity-50 text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-orange-100 min-w-[200px]"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

function StepThree({ data, updateData, onBack }: { data: any, updateData: (d: any) => void, onBack: () => void }) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);

    async function onChooseFile(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
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
                state: data.state,
                city: data.city
            });
            router.push("/vendor-dashboard/my-ads");
        } catch (e: any) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <div className="space-y-12 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-8">
                <h4 className="text-orange-800 font-black text-sm mb-1">Review your details:</h4>
                <p className="text-orange-600 text-xs font-bold">
                    {data.title} • ₦{Number(data.price).toLocaleString()} • {data.category} {data.subcategory && `> ${data.subcategory}`}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SelectField label="State" options={["Nigeria", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"]} value={data.state || ""} onChange={(v) => updateData({ state: v })} required />
                <InputField label="City" placeholder="e.g. Ikeja, Lekki" value={data.city || ""} onChange={(v) => updateData({ city: v })} required />
            </div>

            <div>
                <h4 className="text-black font-black text-[17px] mb-4">First picture - is the title/display image.</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {data.images.map((url: string, idx: number) => (
                        <div key={url} className="aspect-square rounded-xl border border-zinc-200 relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`image-${idx}`} className="absolute inset-0 w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">{idx === 0 ? "DISPLAY" : `#${idx+1}`}</span>
                            <button 
                                onClick={() => updateData({ images: data.images.filter((_: any, i: number) => i !== idx) })}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {data.images.length < 20 && (
                        <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#E85A28] hover:bg-orange-50 transition-all text-zinc-400 hover:text-[#E85A28] relative overflow-hidden">
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
                <h4 className="text-[24px] font-black text-black mb-2">Promote your Ad</h4>
                <p className="text-zinc-500 font-bold text-sm mb-6">Reach more buyers by promoting your ad.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PromoteCard
                        title="Promote Ad"
                        price="₦2,000"
                        desc="Get more visibility by featuring your ad in search results and category listings."
                    />
                    <PromoteCard
                        title="Premium Boost"
                        price="₦4,000"
                        desc="Maximum exposure for your ad across key sections of the platform."
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 pt-8">
                {(data.images.length === 0 || !data.title || !data.price) && (
                    <p className="text-red-500 font-bold text-sm text-right">
                        ⚠️ {data.images.length === 0 ? "A product picture is compulsory to list your deal." : "Missing required product details."}
                    </p>
                )}
                <div className="flex flex-wrap justify-between gap-4">
                    <button
                        onClick={onBack}
                        className="bg-[#E85A28] hover:bg-[#D44D1F] text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-orange-100 min-w-[200px]"
                    >
                        Back
                    </button>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <button 
                            onClick={postAd} 
                            disabled={submitting || data.images.length === 0 || !data.title || !data.price} 
                            className="flex-1 sm:flex-none bg-[#E85A28] hover:bg-[#D44D1F] disabled:opacity-50 text-white font-black py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-100 min-w-[180px]"
                        >
                            {submitting ? "Posting..." : "Post Ad"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PromoteCard({ title, price, desc }: { title: string, price: string, desc: string }) {
    return (
        <div className="border border-[#E85A28]/30 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-black font-black text-lg">{title}</h5>
                <span className="text-[#E85A28] font-black text-xl">{price}</span>
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
