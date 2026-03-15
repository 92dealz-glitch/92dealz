"use client";
import React, { useRef, useState } from "react";
import { ChevronLeft, X, Upload, Plus } from "lucide-react";
import { createAd } from "@/services/ads.service";
import { uploadImage } from "@/services/upload.service";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3;

export default function AddProductForm() {
    const [step, setStep] = useState<Step>(1);
    const [showClearModal, setShowClearModal] = useState(false);
    
    // Shared state for all steps
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        condition: "",
        brand: "",
        model: "",
        color: "",
        price: "",
        negotiable: "No",
        description: "",
        images: [] as string[]
    });

    const updateFormData = (newData: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const nextStep = () => setStep((prev) => (Math.min(prev + 1, 3) as Step));
    const prevStep = () => setStep((prev) => (Math.max(prev - 1, 1) as Step));

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
                {step === 1 && <StepOne data={formData} updateData={updateFormData} onNext={nextStep} />}

                {/* Step 2: Pricing & Details */}
                {step === 2 && <StepTwo data={formData} updateData={updateFormData} onNext={nextStep} onBack={prevStep} />}

                {/* Step 3: Photos & Location */}
                {step === 3 && <StepThree data={formData} updateData={updateFormData} onBack={prevStep} />}
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
                                        condition: "",
                                        brand: "",
                                        model: "",
                                        color: "",
                                        price: "",
                                        negotiable: "No",
                                        description: "",
                                        images: []
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

function StepOne({ data, updateData, onNext }: { data: any, updateData: (d: any) => void, onNext: () => void }) {
    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <InputField label="Product Title" placeholder="e.g. washing machine" value={data.title} onChange={(v) => updateData({ title: v })} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SelectField label="Category" options={["Electronics", "Phones", "Fashion"]} value={data.category} onChange={(v) => updateData({ category: v })} required />
                <SelectField label="Condition" options={["New", "Used - Like New", "Used - Good"]} value={data.condition} onChange={(v) => updateData({ condition: v })} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SelectField label="Brand" options={["Apple", "Samsung", "Nike"]} value={data.brand} onChange={(v) => updateData({ brand: v })} required />
                <SelectField label="Model" options={["14 Pro Max", "S23 Ultra", "Air Force 1"]} value={data.model} onChange={(v) => updateData({ model: v })} required />
            </div>
            <SelectField label="Color" options={["Black", "White", "Silver", "Gold"]} value={data.color} onChange={(v) => updateData({ color: v })} required />

            <div className="flex justify-end pt-8">
                <button
                    onClick={onNext}
                    disabled={!data.title || !data.category || !data.condition}
                    className="bg-[#E85A28] hover:bg-[#D44D1F] disabled:opacity-50 text-white font-black py-4 px-12 rounded-xl transition-all shadow-lg shadow-orange-100 min-w-[200px]"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

function StepTwo({ data, updateData, onNext, onBack }: { data: any, updateData: (d: any) => void, onNext: () => void, onBack: () => void }) {
    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField label="Price(₦)" placeholder="Enter price here" value={data.price} onChange={(v) => updateData({ price: v })} required />
                <SelectField label="Negotiable" options={["Yes", "No"]} value={data.negotiable} onChange={(v) => updateData({ negotiable: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SelectField label="Screen size" options={["6.1 inch", "6.7 inch"]} value={data.screenSize} onChange={(v) => updateData({ screenSize: v })} />
                <SelectField label="RAM" options={["4GB", "8GB", "12GB"]} value={data.ram} onChange={(v) => updateData({ ram: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SelectField label="Main Camera" options={["12MP", "48MP", "108MP"]} value={data.mainCamera} onChange={(v) => updateData({ mainCamera: v })} />
                <SelectField label="Selfie Camera" options={["8MP", "12MP"]} value={data.selfieCamera} onChange={(v) => updateData({ selfieCamera: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SelectField label="Battery (mAh)" options={["4000", "5000"]} value={data.battery} onChange={(v) => updateData({ battery: v })} />
                <SelectField label="Internal Storage" options={["64GB", "128GB", "256GB"]} value={data.internalStorage} onChange={(v) => updateData({ internalStorage: v })} required />
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

            <div className="flex justify-between pt-8 gap-4">
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
                images: data.images 
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
                <p className="text-orange-600 text-xs font-bold">{data.title} • ₦{Number(data.price).toLocaleString()} • {data.category}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SelectField label="State" options={["Lagos", "Abuja", "Rivers"]} value={data.state || ""} onChange={(v) => updateData({ state: v })} required />
                <SelectField label="City" options={["Ikeja", "Lekki", "Garki"]} value={data.city || ""} onChange={(v) => updateData({ city: v })} required />
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

            <div className="flex flex-wrap justify-between pt-8 gap-4">
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
                        className="flex-1 sm:flex-none bg-[#E85A28] hover:bg-[#D44D1F] text-white font-black py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-100 min-w-[180px]"
                    >
                        {submitting ? "Posting..." : "Post Ad"}
                    </button>
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
