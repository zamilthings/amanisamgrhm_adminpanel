import React, { useState } from "react";
import { Keyboard, X, Languages } from "lucide-react";

const MALAYALAM_CHARS = [
  ["അ", "ആ", "ഇ", "ഈ", "ഉ", "ഊ", "ഋ", "എ", "ഏ", "ഐ", "ഒ", "ഓ", "ഔ", "അം", "അഃ"],
  ["ക", "ഖ", "ഗ", "ഘ", "ങ", "ച", "ഛ", "ജ", "ഝ", "ഞ", "ട", "ഠ", "ഡ", "ഢ", "ണ"],
  ["ത", "ഥ", "ദ", "ധ", "ന", "പ", "ഫ", "ബ", "ഭ", "മ", "യ", "ര", "ല", "വ", "ശ"],
  ["ഷ", "സ", "ഹ", "ള", "ഴ", "റ", "ശ്", "ക്", "മ്", "ാ", "ി", "ീ", "ു", "ൂ", "ൃ"],
  ["െ", "േ", "ൈ", "ൊ", "ോ", "ൗ", "്", "ം", "ഃ", "0", "1", "2", "3", "4", "5"]
];

const ARABIC_CHARS = [
  ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"],
  ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط", "ذ"],
  ["ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ", "!", "؟"],
  ["َ", "ً", "ُ", "ٌ", "ِ", "ٍ", "ْ", "ّ", "ٰ", "(", ")", "/"]
];

export default function KeyboardHelper({ onInput, targetField }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("malayalam"); // "malayalam" or "arabic"

  const chars = lang === "malayalam" ? MALAYALAM_CHARS : ARABIC_CHARS;

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors text-xs font-medium"
      >
        <Keyboard className="w-3.5 h-3.5" />
        {lang === "malayalam" ? "Malayalam Keyboard" : "Arabic Keyboard"}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] bg-white rounded-xl shadow-2xl border border-gray-200 w-[450px] overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-800">
            {lang === "malayalam" ? "Malayalam Input" : "Arabic Input"}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === "malayalam" ? "arabic" : "malayalam")}
            className="text-xs text-blue-600 hover:underline px-2"
          >
            Switch to {lang === "malayalam" ? "Arabic" : "Malayalam"}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Keyboard Grid */}
      <div className="p-3 bg-gray-50">
        <div className="grid gap-1">
          {chars.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1 justify-center">
              {row.map((char, cIdx) => (
                <button
                  key={`${rIdx}-${cIdx}`}
                  type="button"
                  onClick={() => onInput(char)}
                  className={`
                    w-8 h-10 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-800 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 active:bg-blue-100 transition-all shadow-sm
                    ${lang === "arabic" ? "font-arabic text-lg" : "text-sm"}
                  `}
                >
                  {char}
                </button>
              ))}
            </div>
          ))}
        </div>
        
        {/* Footer Actions */}
        <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400">
          <p>Click characters to insert into "{targetField}"</p>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => onInput(" ")}
              className="px-4 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
            >
              Space
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
