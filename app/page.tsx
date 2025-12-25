"use client";
import { useState } from "react";
import {
  Shield,
  Upload,
  Activity,
  Layers,
  Image as ImageIcon,
  FileSearch,
  Crosshair,
} from "lucide-react";

export default function ForensicDashboard() {
  const [img1, setImg1] = useState<File | null>(null);
  const [img2, setImg2] = useState<File | null>(null);
  const [ela1, setEla1] = useState<string | null>(null);
  const [ela2, setEla2] = useState<string | null>(null);
  const [diffResult, setDiffResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const getELA = async (file: File, setter: Function) => {
    const formData = new FormData();
    formData.append("image1", file);
    formData.append("type", "ela");
    const res = await fetch("/api/forensics", {
      method: "POST",
      body: formData,
    });
    const blob = await res.blob();
    setter(URL.createObjectURL(blob));
  };

  const handleCompare = async () => {
    if (!img1 || !img2) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image1", img1);
    formData.append("image2", img2);
    formData.append("type", "compare");
    const res = await fetch("/api/forensics", {
      method: "POST",
      body: formData,
    });
    const blob = await res.blob();
    setDiffResult(URL.createObjectURL(blob));
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-6 bg-[#0a0c10] min-h-screen text-slate-300 font-sans">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto flex items-center justify-between mb-6 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-500" size={22} />
          <h1 className="text-lg font-bold text-white tracking-tight uppercase">
            Forensic Analysis Station
          </h1>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
        {/* LEFT SIDE: Inputs (Stack vertically) */}
        <div className="lg:col-span-6 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {/* Slot A */}
          <div className="bg-[#11141a] border border-slate-800 rounded-xl p-4 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                Image-A
              </span>
              <label className="cursor-pointer text-blue-400 hover:text-white transition">
                <Upload size={16} />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files![0];
                    setImg1(file);
                    getELA(file, setEla1);
                  }}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2 aspect-[16/7]">
              <div className="bg-black rounded-lg border border-slate-800/50 overflow-hidden relative">
                {img1 ? (
                  <img
                    src={URL.createObjectURL(img1)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center opacity-10">
                    <ImageIcon size={40} />
                  </div>
                )}
              </div>
              <div className="bg-black rounded-lg border border-slate-800/50 overflow-hidden relative">
                {ela1 ? (
                  <img src={ela1} className="w-full h-full object-contain" />
                ) : (
                  <div className="h-full flex items-center justify-center opacity-5">
                    <Activity size={40} />
                  </div>
                )}
                <div className="absolute top-1 right-1 text-[7px] bg-blue-500/20 text-blue-400 px-1 rounded">
                  ELA
                </div>
              </div>
            </div>
          </div>

          {/* Slot B */}
          <div className="bg-[#11141a] border border-slate-800 rounded-xl p-4 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                Image-B
              </span>
              <label className="cursor-pointer text-purple-400 hover:text-white transition">
                <Upload size={16} />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files![0];
                    setImg2(file);
                    getELA(file, setEla2);
                  }}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2 aspect-[16/7]">
              <div className="bg-black rounded-lg border border-slate-800/50 overflow-hidden relative">
                {img2 ? (
                  <img
                    src={URL.createObjectURL(img2)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center opacity-10">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>
              <div className="bg-black rounded-lg border border-slate-800/50 overflow-hidden relative">
                {ela2 ? (
                  <img src={ela2} className="w-full h-full object-contain" />
                ) : (
                  <div className="h-full flex items-center justify-center opacity-5">
                    <Activity size={24} />
                  </div>
                )}
                <div className="absolute top-1 right-1 text-[7px] bg-purple-500/20 text-purple-400 px-1 rounded">
                  ELA
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-900/5 border border-blue-900/20 rounded-xl">
            <h4 className="text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-widest">
              System Protocol
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Upload two images to calculate pixel variance. The right panel
              displays the <b>Normalized Difference Map</b>, highlighting
              manipulated regions.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Full View Result */}
        <div className="lg:col-span-6 bg-black border border-slate-800 rounded-2xl overflow-hidden relative flex flex-col">
          <div className="p-3 bg-[#11141a] border-b border-slate-800 flex justify-between items-center">
            <span className="text-[10px] font-bold text-red-500 tracking-[0.2em] flex items-center gap-2 uppercase">
              <Crosshair size={12} /> Analysis_Output_Stream
            </span>
            {diffResult && (
              <span className="text-[9px] text-slate-600 font-mono italic underline">
                High-Confidence Detection Active
              </span>
            )}
            <button
              onClick={handleCompare}
              disabled={!img1 || !img2 || loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white px-6 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2"
            >
              {loading ? (
                <Activity className="animate-spin" size={14} />
              ) : (
                <Layers size={14} />
              )}
              {loading ? "ANALYZING..." : "RUN COMPARISON"}
            </button>
          </div>

          <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] flex items-center justify-center p-6 overflow-auto">
            {diffResult ? (
              <img
                src={diffResult}
                className="max-w-full h-auto max-h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                alt="Forensic Result"
              />
            ) : (
              <div className="text-center opacity-20 group">
                <FileSearch
                  size={64}
                  className="mx-auto mb-4 group-hover:scale-110 transition-transform"
                />
                <p className="text-xs uppercase tracking-widest font-bold">
                  Awaiting Dual Input for Delta Map
                </p>
              </div>
            )}
          </div>

          {/* Result Legend */}
          {diffResult && (
            <div className="absolute bottom-6 right-6 bg-black/80 border border-slate-800 p-3 rounded-lg backdrop-blur-md max-w-[250px]">
              <p className="text-[10px] text-slate-400 leading-tight">
                <b className="text-white block mb-1">INTERPRETATION:</b>
                Pixels that light up represent areas where Source A and Source B
                differ significantly in compression or content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
