import { useEffect, useState } from "react";
import { supabase } from "@/libs/createClient";
import { toast } from "sonner";
import { 
  Edit2, 
  Save, 
  X, 
  Plus, 
  RefreshCw, 
  TrendingUp,
  Calendar,
  FileText,
  GitBranch,
  ChevronRight,
  Loader2
} from "lucide-react";

export default function Dashboard() {
  const [versionList, setVersionList] = useState([]);
  const [current, setCurrent] = useState(null);
  const [isEditingCurrent, setIsEditingCurrent] = useState(false);
  const [currentMessageDraft, setCurrentMessageDraft] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVersion, setNewVersion] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    surahs: 0,
    verses: 0,
    tafsirs: 0,
    feedbacks: 0,
  });

  useEffect(() => {
    loadVersions();
    loadStats();
  }, []);

  async function loadVersions() {
    try {
      const { data, error } = await supabase
        .from("db_version")
        .select("*")
        .order("version", { ascending: false });

      if (error) throw error;

      setVersionList(data || []);
      if (data?.length > 0) {
        setCurrent(data[0]);
        setCurrentMessageDraft(data[0].message);
      }
    } catch (error) {
      toast.error("Failed to load versions");
      console.error(error);
    }
  }

  async function loadStats() {
    try {
      // Get counts from all tables
      const [surahs, verses, tafsirs, feedbacks] = await Promise.all([
        supabase.from("surahs").select("id", { count: "exact", head: true }),
        supabase.from("ayahs").select("id", { count: "exact", head: true }),
        supabase.from("thafseers").select("id", { count: "exact", head: true }),
        supabase.from("feedbacks").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        surahs: surahs.count || 0,
        verses: verses.count || 0,
        tafsirs: tafsirs.count || 0,
        feedbacks: feedbacks.count || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }

  async function updateCurrent() {
    if (!currentMessageDraft.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("db_version")
        .update({ 
          message: currentMessageDraft.trim(),
          updated_at: new Date().toISOString()
        })
        .eq("version", current.version);

      if (error) throw error;

      toast.success("Version updated successfully");
      setIsEditingCurrent(false);
      loadVersions();
    } catch (error) {
      toast.error("Failed to update version");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addVersion() {
    if (!newVersion || !newMessage.trim()) {
      toast.warning("Version number and message are required");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("db_version").insert({
        version: Number(newVersion),
        message: newMessage.trim(),
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      toast.success("New version added");
      setNewVersion("");
      setNewMessage("");
      setShowAddForm(false);
      loadVersions();
    } catch (error) {
      toast.error("Failed to add version");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleCancelEdit = () => {
    setIsEditingCurrent(false);
    setCurrentMessageDraft(current?.message || "");
    toast.info("Edit cancelled");
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewVersion("");
    setNewMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview and version control for Quran App
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Chapters</p>
              <p className="text-2xl font-bold text-gray-800">{stats.surahs}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Verses</p>
              <p className="text-2xl font-bold text-gray-800">{stats.verses}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tafsir Entries</p>
              <p className="text-2xl font-bold text-gray-800">{stats.tafsirs}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Book className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Feedbacks</p>
              <p className="text-2xl font-bold text-gray-800">{stats.feedbacks}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Version Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Current Version</h2>
              <p className="text-sm text-gray-500 mt-1">
                The latest version of your database
              </p>
            </div>
            <div className="flex items-center gap-2">
              {current && !isEditingCurrent && (
                <button
                  onClick={() => setIsEditingCurrent(true)}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
              <button
                onClick={loadVersions}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-700"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {current ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                  v{current.version}
                </div>
                <div className="text-sm text-gray-500">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {current.created_at ? new Date(current.created_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              {!isEditingCurrent ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {current.message}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={currentMessageDraft}
                    onChange={(e) => setCurrentMessageDraft(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-y"
                    placeholder="Enter version message..."
                  />
                  
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    
                    <button
                      onClick={updateCurrent}
                      disabled={loading || currentMessageDraft === current.message}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        loading || currentMessageDraft === current.message
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Update Version
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GitBranch className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500">No version information available</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Version Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">Add New Version</h2>
            </div>

            <div className="p-6">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add New Version
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Version Number
                    </label>
                    <input
                      type="number"
                      value={newVersion}
                      onChange={(e) => setNewVersion(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="e.g., 1.2"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Version Message
                    </label>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-y"
                      placeholder="Describe what's new in this version..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={addVersion}
                      disabled={loading || !newVersion || !newMessage.trim()}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                        loading || !newVersion || !newMessage.trim()
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Version
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleCancelAdd}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Version History Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Version History</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    All recorded versions of your database
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Total: {versionList.length} versions
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {versionList.length > 0 ? (
                versionList.map((version) => (
                  <div
                    key={version.version}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                      current?.version === version.version ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          current?.version === version.version
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          <GitBranch className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className={`font-semibold ${
                              current?.version === version.version
                                ? "text-blue-700"
                                : "text-gray-800"
                            }`}>
                              Version {version.version}
                            </span>
                            {current?.version === version.version && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {version.created_at ? new Date(version.created_at).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 whitespace-pre-line">
                          {version.message}
                        </p>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GitBranch className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No version history available</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add your first version to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add these missing icon imports
const BookOpen = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const Book = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const MessageSquare = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);