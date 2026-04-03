import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/libs/createClient";
import { toast } from "sonner";
import Table from "@/components/Table";
import VerseModal from "@/components/Modal/VerseModal";
import {
  BookOpen,
  Filter,
  Download,
  Search,
  RefreshCw,
  Plus,
  Layers,
  Hash
} from "lucide-react";
import { useSurahs } from "@/hooks/useSurahs";
import { useAyahs } from "@/hooks/useAyahs";
import { useQueryClient } from "@tanstack/react-query";

export default function Verses() {
  const queryClient = useQueryClient();
  const { data: surahs = [], isLoading: surahLoading } = useSurahs();
  const [selectedSurah, setSelectedSurah] = useState(null);
  
  const { 
    data: ayahs = [], 
    isLoading: loading, 
    refetch: fetchAyahs 
  } = useAyahs(selectedSurah);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedVerse, setSelectedVerse] = useState(null);

  // Filter states
  const [juzFilter, setJuzFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [verseRange, setVerseRange] = useState({ start: "", end: "" });

  // Reset filters when surah changes
  useEffect(() => {
    if (selectedSurah) {
      setJuzFilter("all");
      setSearchTerm("");
      setVerseRange({ start: "", end: "" });
    }
  }, [selectedSurah]);

  // Apply filters with useMemo to avoid infinite loops and unnecessary re-renders
  const filteredAyahs = useMemo(() => {
    let result = [...ayahs];

    // Apply Juz filter
    if (juzFilter !== "all") {
      result = result.filter(ayah => ayah.juz_no === parseInt(juzFilter));
    }

    // Apply verse range filter
    if (verseRange.start && verseRange.end) {
      const start = parseInt(verseRange.start);
      const end = parseInt(verseRange.end);
      if (!isNaN(start) && !isNaN(end)) {
        result = result.filter(ayah =>
          ayah.verse_no >= start && ayah.verse_no <= end
        );
      }
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ayah =>
        ayah.arabic?.toLowerCase().includes(term) ||
        ayah.arabic_ascii?.toLowerCase().includes(term) ||
        ayah.malayalam?.toLowerCase().includes(term) ||
        ayah.verse_no.toString().includes(term)
      );
    }

    return result;
  }, [ayahs, juzFilter, verseRange, searchTerm]);


  const handleEdit = (ayah) => {
    setSelectedVerse(ayah);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = async (ayah) => {
    const selectedSurahName = surahs.find(s => s.id === selectedSurah)?.malayalam_name;

    if (!window.confirm(`Are you sure you want to delete verse ${ayah.verse_no} of ${selectedSurahName}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("ayahs")
        .delete()
        .eq("id", ayah.id);

      if (error) throw error;

      toast.success(`Verse ${ayah.verse_no} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["ayahs", selectedSurah] });
    } catch (error) {
      toast.error("Failed to delete verse");
      console.error(error);
    }
  };

  const handleView = (ayah) => {
    toast.info(`Viewing verse ${ayah.verse_no}`);
    setSelectedVerse(ayah);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleAddNew = () => {
    if (!selectedSurah) {
      toast.warning("Please select a chapter first");
      return;
    }

    const selectedSurahObj = surahs.find(s => s.id === selectedSurah);
    const nextVerseNumber = ayahs.length > 0
      ? Math.max(...ayahs.map(a => a.verse_no)) + 1
      : 1;

    setSelectedVerse({
      chapter_no: selectedSurah,
      verse_no: nextVerseNumber,
      juz_no: 1,
      arabic: "",
      arabic_ascii: "",
      malayalam: "",
      surah_name: selectedSurahObj?.malayalam_name
    });
    setModalMode("add");
    setModalOpen(true);
  };

  const handleModalSave = async (verseData) => {
    try {
      if (modalMode === "add") {
        const { error } = await supabase
          .from("ayahs")
          .insert([{
            ...verseData,
            chapter_no: selectedSurah
          }]);

        if (error) throw error;
        toast.success(`Verse ${verseData.verse_no} added successfully`);
      } else {
        const { error } = await supabase
          .from("ayahs")
          .update(verseData)
          .eq("id", verseData.id);

        if (error) throw error;
        toast.success(`Verse ${verseData.verse_no} updated successfully`);
      }

      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["ayahs", selectedSurah] });
    } catch (error) {
      toast.error(`Failed to ${modalMode} verse`);
      console.error(error);
    }
  };


  const handleExport = () => {
    if (!filteredAyahs.length) {
      toast.warning("No verses to export");
      return;
    }

    const selectedSurahName = surahs.find(s => s.id === selectedSurah)?.malayalam_name || "Chapter";
    const csvContent = [
      ["ID", "Chapter", "Verse", "Juz", "Arabic", "Malayalam"],
      ...filteredAyahs.map(ayah => [
        ayah.id,
        selectedSurah,
        ayah.verse_no,
        ayah.juz_no,
        ayah.arabic,
        ayah.malayalam
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `verses-chapter-${selectedSurah}-${selectedSurahName}.csv`;
    a.click();

    toast.success(`Exported ${filteredAyahs.length} verses`);
  };

  const handleBulkAdd = () => {
    toast.info("Bulk add feature coming soon!");
    // Could open a modal for bulk text paste
  };

  // Get unique Juz numbers for current surah
  const uniqueJuzs = [...new Set(ayahs.map(a => a.juz_no))].sort((a, b) => a - b);

  const selectedSurahObj = surahs.find(s => s.id === selectedSurah);
  const totalVersesInSurah = selectedSurahObj?.verse_count || 0;

  const columns = [
    {
      header: "Verse",
      accessor: "verse_no",
      className: "md:table-cell hidden",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
            {value}
          </div>
          {/* <span className="font-mono text-sm text-gray-500">#{row.id}</span> */}
        </div>
      )
    },
    {
      header: "Details",
      accessor: "details",
      className: "md:hidden table-cell",
      render: (_, row) => (
        <div className="space-y-2">

          {/* Verse + Juz */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
              {row.verse_no}
            </div>

            <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-xs font-medium">
              Juz {row.juz_no}
            </span>
          </div>

          {/* Arabic */}
          <div className="text-right font-arabic text-lg leading-relaxed">
            {row.arabic}
          </div>

          {/* Malayalam */}
          <div className="text-gray-700 text-sm leading-relaxed">
            {row.malayalam}
          </div>

          {/* ASCII (optional, keep small) */}
          <div className="font-mono text-xs text-gray-400 break-all">
            {row.arabic_ascii}
          </div>

        </div>
      )
    },
    {
      header: "Juz",
      accessor: "juz_no",
      className: "md:table-cell hidden",
      render: (value) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold flex flex-row flex-nowrap items-center justify-center min-w-[55px]">
          Juz {value}
        </span>
      )
    },
    {
      header: "Arabic",
      accessor: "arabic",
      className: "md:table-cell hidden",

      render: (value) => (
        <div className="text-right font-arabic text-xl leading-relaxed min-w-[200px]">
          {value}
        </div>
      )
    },
    {
      header: "Arabic (ASCII)",
      accessor: "arabic_ascii",
      className: "md:table-cell hidden",
      render: (value) => (
        <div className="font-mono text-sm text-gray-600 break-all">
          {value}
        </div>
      )
    },
    {
      header: "Malayalam",
      accessor: "malayalam",
      className: "md:table-cell hidden",
      render: (value) => (
        <div className="text-gray-700 leading-relaxed">
          {value}
        </div>
      )
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quran Verses (Ayahs)</h2>
          <p className="text-gray-600 mt-1">Manage verses from all chapters of the Holy Quran</p>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => selectedSurah && window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <button
            onClick={handleAddNew}
            disabled={!selectedSurah}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${!selectedSurah
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            <Plus className="w-4 h-4" />
            Add Verse
          </button>

          <button
            onClick={handleBulkAdd}
            disabled={!selectedSurah}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${!selectedSurah
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
              }`}
          >
            <Layers className="w-4 h-4" />
            Bulk Add
          </button>
        </div>
      </div>

      {/* Surah Selection Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Chapter</h3>
            <p className="text-gray-600 text-sm">
              Choose a chapter to view and manage its verses
            </p>
          </div>

          <div className="w-full md:w-auto">
            <div className="relative">
              <select
                className="w-full md:w-96 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none bg-white"
                value={selectedSurah || ""}
                onChange={(e) => setSelectedSurah(e.target.value ? Number(e.target.value) : null)}
                disabled={surahLoading}
              >
                <option value="">Select a chapter...</option>
                {surahs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}. {s.arabic_name} - {s.malayalam_name} ({s.verse_count} verses)
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {selectedSurahObj && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-gray-800">
                    {selectedSurahObj.arabic_name}
                  </h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm font-semibold">
                    Chapter {selectedSurah}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">
                  {selectedSurahObj.malayalam_name} • {totalVersesInSurah} verses
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Loaded Verses</div>
                <div className="text-2xl font-bold text-blue-600">{ayahs.length}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters Card */}
      {selectedSurah && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setJuzFilter("all");
                  setVerseRange({ start: "", end: "" });
                  setSearchTerm("");
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>

              <button
                onClick={handleExport}
                disabled={!filteredAyahs.length}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${!filteredAyahs.length
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
                  }`}
              >
                <Download className="w-4 h-4" />
                Export ({filteredAyahs.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Juz Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Juz
              </label>
              <select
                value={juzFilter}
                onChange={(e) => setJuzFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="all">All Juz ({uniqueJuzs.length})</option>
                {uniqueJuzs.map(juz => (
                  <option key={juz} value={juz}>
                    Juz {juz}
                  </option>
                ))}
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
                  value={verseRange.start}
                  onChange={(e) => setVerseRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  min="1"
                  max={totalVersesInSurah}
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  placeholder="To"
                  value={verseRange.end}
                  onChange={(e) => setVerseRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  min="1"
                  max={totalVersesInSurah}
                />
              </div>
            </div>

            {/* Search Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Verses
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search in Arabic or Malayalam..."
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
                Showing <span className="font-semibold">{filteredAyahs.length}</span> of <span className="font-semibold">{ayahs.length}</span> verses
                {juzFilter !== "all" && ` in Juz ${juzFilter}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-gray-500">
                  Juz: {uniqueJuzs.join(", ")}
                </div>
                <div className="text-gray-500">
                  Verses: 1-{totalVersesInSurah}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verses Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verses...</p>
        </div>
      ) : selectedSurah ? (
        <Table
          title={`Verses of ${selectedSurahObj?.arabic_name || "Chapter"}`}
          columns={columns}
          data={filteredAyahs}
          pageSize={20}
          showSearch={false} // We have our own search
          showActions={true}
          showRowsPerPage={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          emptyMessage={
            searchTerm || juzFilter !== "all" || verseRange.start || verseRange.end
              ? "No verses match your filters"
              : "No verses found for this chapter"
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Chapter</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Choose a Quran chapter from the dropdown above to view and manage its verses.
          </p>
        </div>
      )}

      {/* Verse Modal for Add/Edit */}
      {modalOpen && (
        <VerseModal
          mode={modalMode}
          verse={selectedVerse}
          surah={selectedSurahObj}
          onSave={handleModalSave}
          onClose={() => setModalOpen(false)}
          open={modalOpen}
        />
      )}
    </div>
  );
}