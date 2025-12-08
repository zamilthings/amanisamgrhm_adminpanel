import { useEffect, useState } from "react";
import { supabase } from "@/libs/createClient";
import { toast } from "sonner";
import Table from "@/components/Table";
import TafsirModal from "@/components/Modal/TafsirModal";
import { 
  BookOpen, 
  Filter, 
  Download, 
  Search,
  RefreshCw,
  Plus,
  FileText,
  Hash,
  Layers,
  Book,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function Thafseer() {
  const [surahs, setSurahs] = useState([]);
  const [tafsirs, setTafsirs] = useState([]);
  const [filteredTafsirs, setFilteredTafsirs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [selectedTafsir, setSelectedTafsir] = useState(null);
  
  // Filter states
  const [chapterFilter, setChapterFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [rangeFilter, setRangeFilter] = useState({ start: "", end: "" });

  // Load surah list for filtering
  useEffect(() => {
    async function loadSurahs() {
      try {
        const { data, error } = await supabase
          .from("surahs")
          .select("id, malayalam_name, arabic_name, verse_count")
          .order("id");
        
        if (error) throw error;
        setSurahs(data || []);
      } catch (error) {
        toast.error("Failed to load chapters");
        console.error(error);
      }
    }
    loadSurahs();
  }, []);

  // Load tafsir data
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("thafseers")
        .select("*")
        .order("chapter_no")
        .order("verse_start");

      if (error) throw error;
      
      setTafsirs(data || []);
      setFilteredTafsirs(data || []);
      
      // Reset filters
      setChapterFilter("all");
      setSearchTerm("");
      setRangeFilter({ start: "", end: "" });
      
      toast.success(`Loaded ${data?.length || 0} tafsir entries`);
    } catch (error) {
      toast.error("Failed to load tafsir data");
      console.error(error);
      setTafsirs([]);
      setFilteredTafsirs([]);
    } finally {
      setLoading(false);
    }
  }

  // Apply filters
  useEffect(() => {
    let result = [...tafsirs];

    // Apply chapter filter
    if (chapterFilter !== "all") {
      result = result.filter(item => item.chapter_no === parseInt(chapterFilter));
    }

    // Apply verse range filter
    if (rangeFilter.start && rangeFilter.end) {
      const start = parseInt(rangeFilter.start);
      const end = parseInt(rangeFilter.end);
      if (!isNaN(start) && !isNaN(end)) {
        result = result.filter(item => 
          (item.verse_start >= start && item.verse_start <= end) ||
          (item.verse_end >= start && item.verse_end <= end) ||
          (item.verse_start <= start && item.verse_end >= end)
        );
      }
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.thafseer?.toLowerCase().includes(term) ||
        item.chapter_no?.toString().includes(term) ||
        item.verse_start?.toString().includes(term) ||
        item.verse_end?.toString().includes(term)
      );
    }

    setFilteredTafsirs(result);
  }, [tafsirs, chapterFilter, rangeFilter, searchTerm]);

  const handleEdit = (tafsir) => {
    setSelectedTafsir(tafsir);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = async (tafsir) => {
    const surahName = surahs.find(s => s.id === tafsir.chapter_no)?.malayalam_name || `Chapter ${tafsir.chapter_no}`;
    const verseRange = tafsir.verse_start === tafsir.verse_end 
      ? `verse ${tafsir.verse_start}`
      : `verses ${tafsir.verse_start}-${tafsir.verse_end}`;
    
    if (!window.confirm(`Are you sure you want to delete tafsir for ${surahName} (${verseRange})?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("thafseers")
        .delete()
        .eq("id", tafsir.id);

      if (error) throw error;

      toast.success(`Tafsir deleted successfully`);
      loadData(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete tafsir");
      console.error(error);
    }
  };

  const handleView = (tafsir) => {
    // Open in a new tab or show details modal
    const surahName = surahs.find(s => s.id === tafsir.chapter_no)?.malayalam_name || `Chapter ${tafsir.chapter_no}`;
    toast.info(`Viewing tafsir for ${surahName} (${tafsir.verse_start}-${tafsir.verse_end})`);
  };

  const handleAddNew = () => {
    setSelectedTafsir(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleModalSave = async (tafsirData) => {
    try {
      if (modalMode === "add") {
        // Add new tafsir
        const { data, error } = await supabase
          .from("thafseers")
          .insert([tafsirData])
          .select()
          .single();

        if (error) throw error;

        const surahName = surahs.find(s => s.id === tafsirData.chapter_no)?.malayalam_name || `Chapter ${tafsirData.chapter_no}`;
        toast.success(`Tafsir added successfully for ${surahName}`);
      } else {
        // Update existing tafsir
        const { error } = await supabase
          .from("thafseers")
          .update(tafsirData)
          .eq("id", tafsirData.id);

        if (error) throw error;

        const surahName = surahs.find(s => s.id === tafsirData.chapter_no)?.malayalam_name || `Chapter ${tafsirData.chapter_no}`;
        toast.success(`Tafsir updated successfully for ${surahName}`);
      }

      setModalOpen(false);
      loadData(); // Refresh the list
    } catch (error) {
      toast.error(`Failed to ${modalMode} tafsir`);
      console.error(error);
    }
  };

  const handleExport = () => {
    if (!filteredTafsirs.length) {
      toast.warning("No tafsir entries to export");
      return;
    }

    const csvContent = [
      ["ID", "Chapter", "Verse Start", "Verse End", "Tafsir"],
      ...filteredTafsirs.map(item => [
        item.id,
        item.chapter_no,
        item.verse_start,
        item.verse_end,
        `"${item.thafseer.replace(/"/g, '""')}"`
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tafsir-entries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success(`Exported ${filteredTafsirs.length} tafsir entries`);
  };

  const handleBulkAdd = () => {
    toast.info("Bulk tafsir import coming soon!");
    // Could open a modal for bulk text paste or file upload
  };

  // Get unique chapters for filtering
  const uniqueChapters = [...new Set(tafsirs.map(t => t.chapter_no))].sort((a, b) => a - b);
  
  // Statistics
  const stats = {
    total: tafsirs.length,
    chaptersCovered: uniqueChapters.length,
    singleVerse: tafsirs.filter(t => t.verse_start === t.verse_end).length,
    multiVerse: tafsirs.filter(t => t.verse_start !== t.verse_end).length,
    averageLength: tafsirs.length > 0 
      ? Math.round(tafsirs.reduce((sum, t) => sum + (t.thafseer?.length || 0), 0) / tafsirs.length)
      : 0
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
      header: "Chapter", 
      accessor: "chapter_no",
      render: (value, row) => {
        const surah = surahs.find(s => s.id === value);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{value}</span>
              {surah && (
                <span className="text-xs text-gray-500">
                  {surah.arabic_name}
                </span>
              )}
            </div>
            {surah && (
              <div className="text-sm text-gray-600">{surah.malayalam_name}</div>
            )}
          </div>
        );
      }
    },
    { 
      header: "Verses", 
      accessor: "verse_start",
      render: (value, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-sm font-semibold ${
              row.verse_start === row.verse_end
                ? "bg-green-100 text-green-600"
                : "bg-blue-100 text-blue-600"
            }`}>
              {row.verse_start === row.verse_end ? (
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {row.verse_start}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {row.verse_start}-{row.verse_end}
                </span>
              )}
            </span>
            <span className="text-xs text-gray-400">
              {row.verse_end - row.verse_start + 1} verse{row.verse_end - row.verse_start + 1 > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )
    },
    { 
      header: "Tafsir Preview", 
      accessor: "thafseer",
      render: (value) => (
        <div className="max-w-md">
          <div className="text-gray-700 line-clamp-2 text-sm">
            {value?.substring(0, 150)}{value && value.length > 150 ? "..." : ""}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {value?.length || 0} characters
          </div>
        </div>
      )
    },
    { 
      header: "Status", 
      accessor: "id",
      render: (value, row) => {
        const surah = surahs.find(s => s.id === row.chapter_no);
        const verseCount = surah?.verse_count || 0;
        const coveredVerses = row.verse_end - row.verse_start + 1;
        const coverage = verseCount > 0 ? (coveredVerses / verseCount) * 100 : 0;
        
        return (
          <div className="text-sm">
            {coverage === 100 ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Complete
              </span>
            ) : coverage >= 50 ? (
              <span className="text-blue-600 font-medium">
                {Math.round(coverage)}% covered
              </span>
            ) : (
              <span className="text-yellow-600 font-medium">
                {Math.round(coverage)}% covered
              </span>
            )}
          </div>
        );
      }
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quran Tafsir</h2>
          <p className="text-gray-600 mt-1">Detailed explanations and interpretations of Quranic verses</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={loadData}
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
            Add Tafsir
          </button>
          
          <button
            onClick={handleBulkAdd}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Layers className="w-4 h-4" />
            Bulk Import
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Entries</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Chapters Covered</p>
              <p className="text-2xl font-bold text-green-600">{stats.chaptersCovered}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Book className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Single Verses</p>
              <p className="text-2xl font-bold text-purple-600">{stats.singleVerse}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Hash className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Multi-Verses</p>
              <p className="text-2xl font-bold text-orange-600">{stats.multiVerse}</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Layers className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setChapterFilter("all");
                setRangeFilter({ start: "", end: "" });
                setSearchTerm("");
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
            
            <button
              onClick={handleExport}
              disabled={!filteredTafsirs.length}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                !filteredTafsirs.length
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <Download className="w-4 h-4" />
              Export ({filteredTafsirs.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Chapter Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Chapter
            </label>
            <select
              value={chapterFilter}
              onChange={(e) => setChapterFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="all">All Chapters ({uniqueChapters.length})</option>
              {uniqueChapters.map(chapter => {
                const surah = surahs.find(s => s.id === chapter);
                return (
                  <option key={chapter} value={chapter}>
                    {chapter}. {surah?.arabic_name || "Chapter"} - {surah?.malayalam_name || "Unknown"}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Verse Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verse Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="From"
                value={rangeFilter.start}
                onChange={(e) => setRangeFilter(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                min="1"
              />
              <span className="text-gray-400">to</span>
              <input
                type="number"
                placeholder="To"
                value={rangeFilter.end}
                onChange={(e) => setRangeFilter(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                min="1"
              />
            </div>
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Tafsir
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search in tafsir content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Filter Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              Showing <span className="font-semibold">{filteredTafsirs.length}</span> of <span className="font-semibold">{tafsirs.length}</span> entries
              {chapterFilter !== "all" && ` in Chapter ${chapterFilter}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
            
            <div className="text-gray-500">
              Average length: {stats.averageLength} characters
            </div>
          </div>
        </div>
      </div>

      {/* Tafsir Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tafsir data...</p>
        </div>
      ) : tafsirs.length > 0 ? (
        <Table
          title="Tafsir Entries"
          columns={columns}
          data={filteredTafsirs}
          pageSize={15}
          showSearch={false} // We have our own search
          showActions={true}
          showRowsPerPage={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          emptyMessage={
            searchTerm || chapterFilter !== "all" || rangeFilter.start || rangeFilter.end
              ? "No tafsir entries match your filters"
              : "No tafsir entries found"
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Tafsir Entries</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Start adding tafsir explanations for Quranic verses to build your interpretation database.
          </p>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            Add First Tafsir Entry
          </button>
        </div>
      )}

      {modalOpen && (
        <TafsirModal
          mode={modalMode}
          tafsir={selectedTafsir}
          surahs={surahs}
          onSave={handleModalSave}
          onClose={() => setModalOpen(false)}
          open={modalOpen}
        />
      )}
    </div>
  );
}