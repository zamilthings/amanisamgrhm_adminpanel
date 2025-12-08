// components/VerseModal.jsx
import { useState, useEffect } from "react";
import { X, Save, BookOpen, Hash, FileText } from "lucide-react";

export default function VerseModal({ mode, verse, surah, onSave, onClose, open }) {
  const [formData, setFormData] = useState({
    id: "",
    chapter_no: "",
    verse_no: "",
    juz_no: "",
    arabic: "",
    arabic_ascii: "",
    malayalam: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && verse) {
      setFormData({
        id: verse.id || "",
        chapter_no: verse.chapter_no || "",
        verse_no: verse.verse_no || "",
        juz_no: verse.juz_no || "",
        arabic: verse.arabic || "",
        arabic_ascii: verse.arabic_ascii || "",
        malayalam: verse.malayalam || ""
      });
    } else if (mode === "add" && verse) {
      setFormData({
        id: "",
        chapter_no: verse.chapter_no || "",
        verse_no: verse.verse_no || "",
        juz_no: verse.juz_no || 1,
        arabic: "",
        arabic_ascii: "",
        malayalam: ""
      });
    }
  }, [mode, verse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.arabic.trim()) {
      alert("Arabic text is required");
      return;
    }

    if (!formData.verse_no || formData.verse_no <= 0) {
      alert("Verse number must be valid");
      return;
    }

    if (!formData.juz_no || formData.juz_no <= 0) {
      alert("Juz number must be valid");
      return;
    }

    setLoading(true);
    
    const dataToSave = {
      ...formData,
      verse_no: parseInt(formData.verse_no),
      juz_no: parseInt(formData.juz_no),
      chapter_no: parseInt(formData.chapter_no),
      id: mode === "edit" ? parseInt(formData.id) : undefined
    };

    await onSave(dataToSave);
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {mode === "add" ? "Add New Verse" : "Edit Verse"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {surah && `${surah.arabic_name} - ${surah.malayalam_name}`}
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
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Chapter Info (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-2 text-blue-500" />
                  Chapter
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="font-semibold text-gray-800">{surah?.arabic_name}</div>
                  <div className="text-sm text-gray-500">{surah?.malayalam_name}</div>
                </div>
              </div>

              {/* Verse Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-2 text-green-500" />
                  Verse Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.verse_no}
                  onChange={(e) => setFormData({...formData, verse_no: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  min="1"
                  max={surah?.verse_count}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Chapter has {surah?.verse_count} verses total
                </p>
              </div>

              {/* Juz Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2 text-purple-500" />
                  Juz Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.juz_no}
                  onChange={(e) => setFormData({...formData, juz_no: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  min="1"
                  max="30"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Quran has 30 Juz total</p>
              </div>
            </div>

            {/* Arabic Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arabic Text <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.arabic}
                onChange={(e) => setFormData({...formData, arabic: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-y font-arabic text-xl text-right leading-relaxed"
                placeholder="النص العربي..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Original Arabic text of the verse
              </p>
            </div>

            {/* Arabic ASCII */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arabic (ASCII Transliteration)
              </label>
              <textarea
                value={formData.arabic_ascii}
                onChange={(e) => setFormData({...formData, arabic_ascii: e.target.value})}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-y font-mono"
                placeholder="Al-nas al-arabi..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Romanized Arabic text for searching
              </p>
            </div>

            {/* Malayalam Translation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Malayalam Translation
              </label>
              <textarea
                value={formData.malayalam}
                onChange={(e) => setFormData({...formData, malayalam: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-y"
                placeholder="മലയാളം പരിഭാഷ..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Malayalam translation/meaning of the verse
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {mode === "add" ? "Adding..." : "Updating..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {mode === "add" ? "Add Verse" : "Update Verse"}
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