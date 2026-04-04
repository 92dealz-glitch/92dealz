import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, X, Upload, Plus, ChevronDown } from "lucide-react";
import { createAd, updateAd } from "@/services/ads.service";
import { uploadImage } from "@/services/upload.service";
import { useRouter } from "next/navigation";
import { getFallbackArray } from "@/data/categoriesData";
import { getMyProfile } from "@/lib/api";
import { NIGERIAN_STATES } from "@/data/locationData";
import { useAlert } from "@/context/AlertContext";

type Step = 1 | 2 | 3;

interface CategoryItem {
    id: string; // slug
    catId: number;
    title: string;
    icon: string;
    columns: { heading: string; items: string[] }[];
    specifications_template: any[];
}

interface DealFormProps {
    initialData?: any;
    isEdit?: boolean;
    isAdmin?: boolean;
}

const formatWithCommas = (val: string | number) => {
    if (!val && val !== 0) return "";
    const clean = String(val).replace(/\D/g, "");
    return new Intl.NumberFormat().format(Number(clean));
};

const stripCommas = (val: string) => {
    return val.replace(/\D/g, "");
};

export default function DealForm({ initialData, isEdit = false, isAdmin = false }: DealFormProps) {
    const router = useRouter();
    const [step, setStep] = useState<Step>(1);
    const [showClearModal, setShowClearModal] = useState(false);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [isNigerian, setIsNigerian] = useState(false);
    const { showVendorTasks, showAlert } = useAlert();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
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
        
        getMyProfile().then(res => {
            if (res.success && res.data) {
                setProfile(res.data);
                const phone = String(res.data.phone || "");
                const isNig = phone.startsWith("+234") || phone.startsWith("234") || (phone.startsWith("0") && phone.length >= 11);
                setIsNigerian(isNig);
            }
        });

        if (initialData) {
            setFormData({
                title: initialData.title || "",
                category: initialData.category || "",
                category_id: initialData.category_id || null,
                subcategory: initialData.subcategory || "",
                condition: initialData.condition || "",
                brand: initialData.brand || "",
                model: initialData.model || "",
                color: initialData.color || "",
                price: String(initialData.price || ""),
                negotiable: initialData.negotiable || "No",
                description: initialData.description || "",
                images: initialData.images_json ? JSON.parse(initialData.images_json) : (initialData.image_url ? [initialData.image_url] : []),
                state: initialData.state || "",
                city: initialData.city || "",
                specifications: initialData.specifications || {}
            });
        }
    }, [initialData]);

    const updateFormData = (newData: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const nextStep = () => setStep((prev) => (Math.min(prev + 1, 3) as Step));
    const prevStep = () => setStep((prev) => (Math.max(prev - 1, 1) as Step));

    const handleSubmit = async () => {
        if (!formData.title || !formData.price || formData.images.length === 0) {
            showAlert("Please fill in all required fields and upload at least one image.", "Incomplete Form");
            return;
        }

        if (!isAdmin && (!profile?.is_phone_verified || !profile?.is_email_verified)) {
            showVendorTasks();
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                status: initialData?.status || "active"
            };

            let res;
            if (isEdit && initialData?.id) {
                res = await updateAd(initialData.id, payload);
                if (res.success) {
                    await showAlert("Ad updated successfully!", "Success");
                    router.push(isAdmin ? "/admin/deals" : "/vendor-dashboard/my-ads");
                }
            } else {
                res = await createAd(payload);
                if (res.success) {
                    await showAlert("Your ad has been submitted and is pending admin approval.", "Success!");
                    router.push("/vendor-dashboard/my-ads");
                }
            }
        } catch (err: any) {
            showAlert(err.message || "Failed to save ad", "Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-black font-black text-[18px]">{isEdit ? "Edit Product" : "Add New Product"}</h2>
                {!isEdit && (
                    <button
                        onClick={() => setShowClearModal(true)}
                        className="bg-zinc-700 hover:bg-zinc-800 text-white font-bold py-1.5 px-4 rounded text-xs transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="p-5 sm:p-8 lg:p-12 max-w-4xl mx-auto">
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl sm:text-[24px] font-black text-black">
                            {step === 1 && "Product Info"}
                            {step === 2 && "Pricing & Details"}
                            {step === 3 && "Photos & Location"}
                        </h3>
                        <span className="text-[#10B981] font-bold text-sm">{step === 1 ? "33%" : step === 2 ? "66%" : "100%"}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#f45c03] transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {step === 1 && <StepOne data={formData} updateData={updateFormData} onNext={nextStep} categories={categories} />}
                {step === 2 && <StepTwo data={formData} updateData={updateFormData} onNext={nextStep} onBack={prevStep} />}
                {step === 3 && (
                    <StepThree 
                        data={formData} 
                        updateData={updateFormData} 
                        onBack={prevStep} 
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        isNigerian={isNigerian}
                        isEdit={isEdit}
                    />
                )}
            </div>

            {/* Clear Modal */}
            {showClearModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative">
                        <button onClick={() => setShowClearModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-black">
                            <X size={24} />
                        </button>
                        <h4 className="text-black font-black text-xl mb-4">Clear all fields?</h4>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => { setFormData({ title: "", category: "", category_id: null, subcategory: "", condition: "", brand: "", model: "", color: "", price: "", negotiable: "No", description: "", images: [], state: "", city: "", specifications: {} }); setStep(1); setShowClearModal(false); }} className="bg-red-500 text-white font-black py-4 rounded-xl">Yes, clear</button>
                            <button onClick={() => setShowClearModal(false)} className="bg-white border border-zinc-200 font-black py-4 rounded-xl">No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Child Components
function StepOne({ data, updateData, onNext, categories }: any) {
    const selectedCat = categories.find((c: any) => Number(c.catId) === data.category_id);
    const subcategoryOptions = selectedCat ? selectedCat.columns.flatMap((c: any) => c.items) : [];
    const specsTemplate = selectedCat?.specifications_template || [];

    return (
        <div className="space-y-8">
            <InputField label="Product Title" placeholder="e.g. iPhone 13 Pro" value={data.title} onChange={(v:any) => updateData({ title: v })} required />
            <div className="flex flex-col gap-2">
                <label className="text-black font-black text-sm">Category<span className="text-[#f45c03] ml-1">*</span></label>
                <div className="relative">
                    <select 
                        value={data.category_id || ""}
                        onChange={(e) => {
                            const id = Number(e.target.value);
                            const cat = categories.find((c: any) => Number(c.catId) === id);
                            updateData({ category_id: id, category: cat?.id || "", subcategory: "" });
                        }}
                        className="appearance-none w-full border border-zinc-200 rounded-lg p-4 text-zinc-900 font-bold focus:outline-none focus:border-[#f45c03] bg-white transition-colors"
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map((c: any) => <option key={c.catId} value={c.catId}>{c.title}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                </div>
            </div>

            {subcategoryOptions.length > 0 && <SelectField label="Subcategory" options={subcategoryOptions} value={data.subcategory} onChange={(v:any) => updateData({ subcategory: v })} required />}

            {specsTemplate.length > 0 && (
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-6">
                    <h4 className="text-black font-black text-sm mb-6">Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {specsTemplate.map((s: any) => (
                            <div key={s.label}>
                                {s.type === "select" ? (
                                    <SelectField label={s.label} options={s.options} value={data.specifications[s.label] || ""} onChange={(v:any) => updateData({ specifications: { ...data.specifications, [s.label]: v } })} />
                                ) : (
                                    <InputField label={s.label} placeholder={s.placeholder} value={data.specifications[s.label] || ""} onChange={(v:any) => updateData({ specifications: { ...data.specifications, [s.label]: v } })} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <button onClick={onNext} disabled={!data.title || !data.category_id} className="w-full sm:w-auto bg-[#f45c03] text-white font-black py-4 px-12 rounded-xl disabled:opacity-50">Next Step</button>
        </div>
    );
}

function StepTwo({ data, updateData, onNext, onBack }: any) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField label="Price (₦)" placeholder="Enter price" value={formatWithCommas(data.price)} onChange={(v:any) => updateData({ price: stripCommas(v) })} required />
                <SelectField label="Negotiable" options={["Yes", "No"]} value={data.negotiable} onChange={(v:any) => updateData({ negotiable: v })} />
            </div>
            <textarea placeholder="Product description..." value={data.description} onChange={(e) => updateData({ description: e.target.value })} rows={6} className="w-full border border-zinc-200 rounded-lg p-4 font-bold outline-none focus:border-[#f45c03] transition-colors" />
            <div className="flex justify-between gap-4">
                <button onClick={onBack} className="bg-zinc-100 text-black font-black py-4 px-12 rounded-xl">Back</button>
                <button onClick={onNext} disabled={!data.price || !data.description} className="bg-[#f45c03] text-white font-black py-4 px-12 rounded-xl disabled:opacity-50">Next Step</button>
            </div>
        </div>
    );
}

function StepThree({ data, updateData, onBack, onSubmit, isSubmitting, isNigerian, isEdit }: any) {
    const [uploading, setUploading] = useState(false);
    const onChooseFile = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const res = await uploadImage(file);
            updateData({ images: [...data.images, res.url] });
        } catch (err) {} finally { setUploading(false); }
    };

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CustomSelect label="Country" options={["Nigeria", "China"]} value={data.state} onChange={(v:any) => updateData({ state: v, city: "" })} required disabled={isNigerian} />
                {data.state === "Nigeria" && <CustomSelect label="State" options={NIGERIAN_STATES} value={data.city} onChange={(v:any) => updateData({ city: v })} required />}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {data.images.map((url: any, idx: any) => (
                    <div key={url} className="aspect-square relative rounded-xl border border-zinc-200 group overflow-hidden">
                        <img src={url} className="w-full h-full object-cover" alt="product" />
                        <button onClick={() => updateData({ images: data.images.filter((_:any, i:any) => i !== idx) })} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><X size={12} /></button>
                        {idx === 0 && <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[8px] px-2 py-0.5 rounded font-black uppercase">Cover</span>}
                    </div>
                ))}
                {data.images.length < 20 && (
                    <label className="aspect-square border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#f45c03] transition-all">
                        <Plus size={24} className="text-zinc-400" />
                        <span className="text-[10px] font-black uppercase text-zinc-500">{uploading ? "..." : "Add"}</span>
                        <input type="file" hidden onChange={onChooseFile} />
                    </label>
                )}
            </div>
            <div className="flex justify-between gap-4">
                <button onClick={onBack} className="bg-zinc-100 text-black font-black py-4 px-12 rounded-xl">Back</button>
                <button onClick={onSubmit} disabled={isSubmitting || data.images.length === 0} className="bg-[#f45c03] text-white font-black py-4 px-12 rounded-xl disabled:opacity-50">
                    {isSubmitting ? "Saving..." : (isEdit ? "Update Ad" : "Post Ad")}
                </button>
            </div>
        </div>
    );
}

function InputField({ label, placeholder, value, onChange, required }: any) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-black font-black text-sm">{label}{required && <span className="text-[#f45c03] ml-1">*</span>}</label>
            <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-zinc-200 rounded-lg p-4 font-bold outline-none focus:border-[#f45c03]" />
        </div>
    );
}

function SelectField({ label, options, value, onChange, required }: any) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-black font-black text-sm">{label}{required && <span className="text-[#f45c03] ml-1">*</span>}</label>
            <div className="relative">
                <select value={value} onChange={e => onChange(e.target.value)} className="appearance-none w-full border border-zinc-200 rounded-lg p-4 font-bold outline-none focus:border-[#f45c03] bg-white">
                    <option value="" disabled>Select</option>
                    {options.map((opt:any) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2" size={18} />
            </div>
        </div>
    );
}

function CustomSelect({ label, options, value, onChange, required, disabled }: any) {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex flex-col gap-2 relative">
            <label className="text-black font-black text-sm">{label}{required && <span className="text-[#f45c03] ml-1">*</span>}</label>
            <button onClick={() => !disabled && setOpen(!open)} className={`flex justify-between items-center w-full border rounded-lg p-4 font-bold ${disabled?"bg-zinc-50 text-zinc-400":"bg-white"}`}>
                <span>{value || `Select ${label}`}</span>
                <ChevronDown size={18} />
            </button>
            {open && (
                <div className="absolute top-full mt-2 w-full bg-white border border-zinc-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto py-2">
                    {options.map((opt:any) => <button key={opt} onClick={() => { onChange(opt); setOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-orange-50 font-bold text-sm">{opt}</button>)}
                </div>
            )}
        </div>
    );
}
