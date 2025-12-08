// components/SurahModal.jsx
import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

export default function SurahModal({ mode, surah, onSave, onClose, open }) {
  const [formData, setFormData] = useState({
    id: "",
    arabic_name: "",
    malayalam_name: "",
    malayalam_meaning: "",
    english_name: "",
    verse_count: "",
    chapter_type: "Meccan",
    chapter_info: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && surah) {
      setFormData({
        id: surah.id || "",
        arabic_name: surah.arabic_name || "",
        malayalam_name: surah.malayalam_name || "",
        malayalam_meaning: surah.malayalam_meaning || "",
        english_name: surah.english_name || "",
        verse_count: surah.verse_count || "",
        chapter_type: surah.chapter_type || "Meccan",
        chapter_info: surah.chapter_info || "",
        description: surah.description || ""
      });
    } else {
      // Reset for add mode
      setFormData({
        id: "",
        arabic_name: "",
        malayalam_name: "",
        malayalam_meaning: "",
        english_name: "",
        verse_count: "",
        chapter_type: "Meccan",
        chapter_info: "",
        description: ""
      });
    }
  }, [mode, surah]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.arabic_name.trim() || !formData.malayalam_name.trim()) {
      alert("Arabic and Malayalam names are required");
      return;
    }

    if (!formData.verse_count || formData.verse_count <= 0) {
      alert("Verse count must be a positive number");
      return;
    }

    setLoading(true);
    
    // Convert verse_count to number
    const dataToSave = {
      ...formData,
      verse_count: parseInt(formData.verse_count),
      id: mode === "edit" ? parseInt(formData.id) : undefined
    };

    await onSave(dataToSave);
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {mode === "add" ? "Add New Chapter" : "Edit Chapter"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {mode === "add" ? "Enter details for new Quran chapter" : "Update chapter information"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID (only in edit mode) */}
              {mode === "edit" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Chapter ID cannot be changed</p>
                </div>
              )}

              {/* Arabic Name */}
              <div className={mode === "edit" ? "" : "md:col-span-2"}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arabic Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.arabic_name}
                  onChange={(e) => setFormData({...formData, arabic_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-arabic text-xl text-right"
                  placeholder="الفاتحة"
                  required
                />
              </div>

              {/* Malayalam Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Malayalam Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.malayalam_name}
                  onChange={(e) => setFormData({...formData, malayalam_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="അൽ-ഫാതിഹ"
                  required
                />
              </div>

              {/* Malayalam Meaning */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Malayalam Meaning
                </label>
                <input
                  type="text"
                  value={formData.malayalam_meaning}
                  onChange={(e) => setFormData({...formData, malayalam_meaning: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="തുറക്കുന്നവൾ"
                />
              </div>

              {/* English Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English Name
                </label>
                <input
                  type="text"
                  value={formData.english_name}
                  onChange={(e) => setFormData({...formData, english_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="The Opening"
                />
              </div>

              {/* Verse Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verse Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.verse_count}
                  onChange={(e) => setFormData({...formData, verse_count: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="7"
                  min="1"
                  required
                />
              </div>

              {/* Chapter Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revelation Type
                </label>
                <select
                  value={formData.chapter_type}
                  onChange={(e) => setFormData({...formData, chapter_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  <option value="Meccan">Meccan (مكية)</option>
                  <option value="Medinan">Medinan (مدنية)</option>
                </select>
              </div>
            </div>

            {/* Chapter Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chapter Info
              </label>
              <textarea
                value={formData.chapter_info}
                onChange={(e) => setFormData({...formData, chapter_info: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-y"
                placeholder="Brief information about this chapter..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-y"
                placeholder="Detailed description of the chapter..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {mode === "add" ? "Adding..." : "Updating..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {mode === "add" ? "Add Chapter" : "Update Chapter"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}