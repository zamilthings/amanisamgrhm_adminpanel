// pages/Chapters.jsx
import { useEffect, useState } from "react";
import { supabase } from "@/libs/createClient";
import { toast } from "sonner";
import Table from "@/components/Table";
import { Plus, RefreshCw, FileText, BookOpen, MessageSquare } from "lucide-react";
import SurahModal from "@/components/Modal/SurahModal";

export default function Chapters() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

  useEffect(() => {
    loadSurahs();
  }, []);

  async function loadSurahs() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("surahs")
        .select("*")
        .order("id");
      
      if (error) throw error;
      setSurahs(data || []);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load chapters");
      console.error("Error loading surahs:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (surah) => {
    setSelectedSurah(surah);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = async (surah) => {
    if (!window.confirm(`Are you sure you want to delete "${surah.arabic_name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("surahs")
        .delete()
        .eq("id", surah.id);

      if (error) throw error;

      toast.success(`Chapter "${surah.arabic_name}" deleted successfully`);
      loadSurahs(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete chapter");
      console.error("Delete error:", error);
    }
  };

  const handleView = (surah) => {
    // Open in a new tab or show details modal
    console.log("View surah details:", surah);
    toast.info(`Viewing ${surah.arabic_name} details`);
  };

  const handleAddNew = () => {
    setSelectedSurah(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleModalSave = async (surahData) => {
    try {
      if (modalMode === "add") {
        // Add new surah
        const { data, error } = await supabase
          .from("surahs")
          .insert([surahData])
          .select()
          .single();

        if (error) throw error;

        toast.success(`Chapter "${surahData.arabic_name}" added successfully`);
      } else {
        // Update existing surah
        const { error } = await supabase
          .from("surahs")
          .update(surahData)
          .eq("id", surahData.id);

        if (error) throw error;

        toast.success(`Chapter "${surahData.arabic_name}" updated successfully`);
      }

      setModalOpen(false);
      loadSurahs(); // Refresh the list
    } catch (error) {
      toast.error(`Failed to ${modalMode} chapter`);
      console.error("Save error:", error);
    }
  };

  const columns = [
    { 
      header: "ID", 
      accessor: "id",
      render: (value) => (
        <span className="font-mono font-semibold text-blue-600">#{value}</span>
      )
    },
    { 
      header: "Arabic Name", 
      accessor: "arabic_name",
      render: (value) => (
        <div className="text-right font-arabic text-xl leading-relaxed">{value}</div>
      )
    },
    { 
      header: "Malayalam Name", 
      accessor: "malayalam_name",
      render: (value) => (
        <div className="font-medium text-gray-800">{value}</div>
      )
    },
    { 
      header: "Malayalam Meaning", 
      accessor: "malayalam_meaning",
      render: (value) => (
        <div className="text-gray-600">{value || "-"}</div>
      )
    },
    { 
      header: "Verses", 
      accessor: "verse_count",
      render: (value) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
          {value} verses
        </span>
      )
    },
    { 
      header: "Revelation Type", 
      accessor: "chapter_type",
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          value === 'Meccan' 
            ? 'bg-green-100 text-green-600' 
            : 'bg-purple-100 text-purple-600'
        }`}>
          {value || "N/A"}
        </span>
      )
    },
  ];

  if (loading && surahs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chapters...</p>
        </div>
      </div>
    );
  }

  if (error && surahs.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto mt-8">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">!</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-700 mb-2">Error loading chapters</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadSurahs}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quran Chapters (Surahs)</h2>
          <p className="text-gray-600 mt-1">Manage all 114 chapters of the Holy Quran</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={loadSurahs}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Chapter
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Chapters</p>
              <p className="text-2xl font-bold text-gray-800">{surahs.length}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Meccan Revelations</p>
              <p className="text-2xl font-bold text-green-600">
                {surahs.filter(s => s.chapter_type === 'Meccan').length}
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <span className="text-green-600 font-bold">م</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Medinan Revelations</p>
              <p className="text-2xl font-bold text-purple-600">
                {surahs.filter(s => s.chapter_type === 'Medinan').length}
              </p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <span className="text-purple-600 font-bold">مـ</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Verses</p>
              <p className="text-2xl font-bold text-orange-600">
                {surahs.reduce((sum, s) => sum + (s.verse_count || 0), 0)}
              </p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        title="Surahs List"
        columns={columns}
        data={surahs}
        pageSize={10}
        showSearch={true}
        showActions={true}
        showRowsPerPage={true}
        onEdit={handleEdit}
        // onDelete={handleDelete}
        onView={handleView}
        emptyMessage="No chapters found. Add your first chapter to get started."
      />

      {/* Surah Modal for Add/Edit */}
      {modalOpen && (
        <SurahModal
          mode={modalMode}
          surah={selectedSurah}
          onSave={handleModalSave}
          onClose={() => setModalOpen(false)}
          open={modalOpen}
        />
      )}
    </div>
  );
}