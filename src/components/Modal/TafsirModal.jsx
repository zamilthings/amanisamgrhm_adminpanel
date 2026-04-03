import { useState, useEffect } from "react";
import { X, Save, BookOpen, Hash, Layers, Text, Keyboard } from "lucide-react";
import KeyboardHelper from "@/components/Input/KeyboardHelper";

export default function TafsirModal({ mode, tafsir, surahs, onSave, onClose, open }) {
  const [formData, setFormData] = useState({
    id: "",
    chapter_no: "",
    verse_start: "",
    verse_end: "",
    thafseer: ""
  });

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && tafsir) {
      setFormData({
        id: tafsir.id || "",
        chapter_no: tafsir.chapter_no || "",
        verse_start: tafsir.verse_start || "",
        verse_end: tafsir.verse_end || "",
        thafseer: tafsir.thafseer || ""
      });
    } else {
      // Reset for add mode
      setFormData({
        id: "",
        chapter_no: "",
        verse_start: "",
        verse_end: "",
        thafseer: ""
      });
    }
  }, [mode, tafsir]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.chapter_no) {
      alert("Please select a chapter");
      return;
    }

    if (!formData.verse_start || formData.verse_start <= 0) {
      alert("Start verse must be valid");
      return;
    }

    if (!formData.verse_end || formData.verse_end <= 0) {
      alert("End verse must be valid");
      return;
    }

    if (parseInt(formData.verse_start) > parseInt(formData.verse_end)) {
      alert("Start verse must be less than or equal to end verse");
      return;
    }

    if (!formData.thafseer.trim()) {
      alert("Tafsir content is required");
      return;
    }

    const selectedSurah = surahs.find(s => s.id === parseInt(formData.chapter_no));
    if (selectedSurah) {
      const verseCount = selectedSurah.verse_count;
      if (parseInt(formData.verse_end) > verseCount) {
        alert(`Chapter ${formData.chapter_no} only has ${verseCount} verses`);
        return;
      }
    }

    setLoading(true);
    
    const dataToSave = {
      ...formData,
      chapter_no: parseInt(formData.chapter_no),
      verse_start: parseInt(formData.verse_start),
      verse_end: parseInt(formData.verse_end),
      id: mode === "edit" ? parseInt(formData.id) : undefined
    };

    await onSave(dataToSave);
    setLoading(false);
  };

  const handleVerseStartChange = (value) => {
    setFormData(prev => ({
      ...prev,
      verse_start: value,
      verse_end: value > prev.verse_end ? value : prev.verse_end
    }));
  };

  const handleKeyboardInput = (char) => {
    setFormData(prev => ({
      ...prev,
      thafseer: prev.thafseer + char
    }));
  };

  const selectedSurah = surahs.find(s => s.id === parseInt(formData.chapter_no));
  const verseCount = selectedSurah?.verse_count || 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {mode === "add" ? "Add New Tafsir" : "Edit Tafsir"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Detailed explanation of Quranic verses
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
            {/* Chapter Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-2 text-blue-500" />
                Chapter <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.chapter_no}
                onChange={(e) => setFormData({...formData, chapter_no: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                required
              >
                <option value="">Select a chapter...</option>
                {surahs.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.id}. {s.arabic_name} - {s.malayalam_name} ({s.verse_count} verses)
                  </option>
                ))}
              </select>
              
              {selectedSurah && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <span className="font-semibold">{selectedSurah.arabic_name}</span> • {selectedSurah.malayalam_name}
                    <br />
                    <span className="text-blue-600">Total verses: {verseCount}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Verse Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Layers className="w-4 h-4 inline mr-2 text-green-500" />
                Verse Range <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Verse</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.verse_start}
                      onChange={(e) => handleVerseStartChange(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      min="1"
                      max={verseCount}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">End Verse</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.verse_end}
                      onChange={(e) => setFormData({...formData, verse_end: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      min={formData.verse_start || 1}
                      max={verseCount}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-500">
                {formData.verse_start && formData.verse_end && (
                  <>
                    Covering <span className="font-semibold text-blue-600">
                      {formData.verse_end - formData.verse_start + 1} verse
                      {formData.verse_end - formData.verse_start + 1 > 1 ? 's' : ''}
                    </span>
                    {verseCount > 0 && (
                      <span className="ml-2">
                        ({Math.round(((formData.verse_end - formData.verse_start + 1) / verseCount) * 100)}% of chapter)
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Tafsir Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Text className="w-4 h-4 inline mr-2 text-purple-500" />
                  Tafsir Content <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${showKeyboard ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <Keyboard className="w-3 h-3" />
                  {showKeyboard ? 'Keyboard Open' : 'Virtual Keyboard'}
                </button>
              </div>
              <textarea
                value={formData.thafseer}
                onChange={(e) => setFormData({...formData, thafseer: e.target.value})}
                rows="12"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-y"
                placeholder="Write detailed tafsir explanation here..."
                required
              />
              <div className="mt-2 flex items-center justify-between text-sm">
                <div className="text-gray-500">
                  {formData.thafseer.length} characters • {formData.thafseer.split(/\s+/).filter(w => w.length > 0).length} words
                </div>
                <div className="text-gray-500">
                  Lines: {formData.thafseer.split('\n').length}
                </div>
              </div>
            </div>

            {/* Preview (for edit mode) */}
            {mode === "edit" && formData.thafseer && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    {formData.thafseer.split('\n').map((line, index) => (
                      <p key={index} className="text-gray-700 mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
                    {mode === "add" ? "Add Tafsir" : "Update Tafsir"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {showKeyboard && (
        <KeyboardHelper 
          onInput={handleKeyboardInput} 
          targetField="Tafsir Content" 
        />
      )}
    </div>
  );
}