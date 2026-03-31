import { useEffect, useState } from "react";
import { supabase } from "@/libs/createClient";
import { toast } from "sonner";
import Table from "@/components/Table";
import FeedbackModal from "@/components/Modal/FeedbackModal";
import { 
  Mail, 
  User, 
  Calendar, 
  Phone, 
  MessageSquare,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  Trash2,
  Eye,
  Reply,
  Download,
  Star,
  AlertCircle,
  TrendingUp,
  MailOpen
} from "lucide-react";

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMode, setReplyMode] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    loadFeedbacks();
  }, []);

  async function loadFeedbacks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Add status field if not exists
      const feedbacksWithStatus = (data || []).map(fb => ({
        ...fb,
        status: fb.status || 'pending',
        replied_at: fb.replied_at || null,
        reply_message: fb.reply_message || null
      }));
      
      setFeedbacks(feedbacksWithStatus);
      setFilteredFeedbacks(feedbacksWithStatus);
      
      toast.success(`Loaded ${feedbacksWithStatus.length} feedbacks`);
    } catch (error) {
      toast.error("Failed to load feedbacks");
      console.error(error);
      setFeedbacks([]);
      setFilteredFeedbacks([]);
    } finally {
      setLoading(false);
    }
  }

  // Apply filters
  useEffect(() => {
    let result = [...feedbacks];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(fb => fb.status === statusFilter);
    }

    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      
      let endDate;
      if (dateRange.end) {
        endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
      } else {
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
      }
      
      result = result.filter(fb => {
        const fbDate = new Date(fb.created_at);
        return fbDate >= startDate && fbDate <= endDate;
      });
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(fb => 
        fb.name?.toLowerCase().includes(term) ||
        fb.contact?.toLowerCase().includes(term) ||
        fb.message?.toLowerCase().includes(term) ||
        fb.reply_message?.toLowerCase().includes(term)
      );
    }

    setFilteredFeedbacks(result);
  }, [feedbacks, statusFilter, dateRange.start, dateRange.end, searchTerm]);

  const handleView = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyMode(false);
    setModalOpen(true);
  };

  const handleReply = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyMode(true);
    setModalOpen(true);
  };

  const handleDelete = async (feedback) => {
    if (!window.confirm(`Are you sure you want to delete feedback from ${feedback.name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("feedbacks")
        .delete()
        .eq("id", feedback.id);

      if (error) throw error;

      toast.success(`Feedback from ${feedback.name} deleted successfully`);
      await loadFeedbacks(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete feedback: " + error.message);
      console.error(error);
    }
  };

  const handleMarkAsRead = async (feedback) => {
    try {
      const { error } = await supabase
        .from("feedbacks")
        .update({ 
          status: 'read',
          // read_at: new Date().toISOString()
        })
        .eq("id", feedback.id);

      if (error) throw error;

      toast.success(`Marked as read successfully`);
      await loadFeedbacks(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update status: " + error.message);
      console.error(error);
    }
  };

  const handleMarkAsReplied = async (feedback) => {
    try {
      const { error } = await supabase
        .from("feedbacks")
        .update({ 
          status: 'replied',
          // replied_at: new Date().toISOString()
        })
        .eq("id", feedback.id);

      if (error) throw error;

      toast.success(`Marked as replied successfully`);
      await loadFeedbacks(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update status: " + error.message);
      console.error(error);
    }
  };

  const handleModalSave = async (feedbackData) => {
    try {
      if (replyMode && feedbackData.reply_message) {
        // Send reply
        const { error } = await supabase
          .from("feedbacks")
          .update({ 
            status: 'replied',
            reply_message: feedbackData.reply_message,
            replied_at: new Date().toISOString(),
            // replied_by: 'admin'
          })
          .eq("id", feedbackData.id);

        if (error) throw error;

        toast.success(`Reply sent to ${feedbackData.name}`);
        
        // Here you would typically send an email notification
        console.log(`Reply sent to ${feedbackData.contact}:`, feedbackData.reply_message);
      } else if (!replyMode && feedbackData.status) {
        // Update status only
        const updateData = {
          status: feedbackData.status
        };
        
        if (feedbackData.status === 'read') {
          updateData.read_at = new Date().toISOString();
        }
        
        const { error } = await supabase
          .from("feedbacks")
          .update(updateData)
          .eq("id", feedbackData.id);

        if (error) throw error;

        toast.success(`Status updated to ${feedbackData.status}`);
      }

      setModalOpen(false);
      await loadFeedbacks(); // Refresh the list
    } catch (error) {
      toast.error(`Failed to update feedback: ${error.message}`);
      console.error(error);
    }
  };

  const handleExport = () => {
    if (!filteredFeedbacks.length) {
      toast.warning("No feedbacks to export");
      return;
    }

    const csvContent = [
      ["ID", "Name", "Contact", "Message", "Status", "Created At", "Replied At", "Reply Message"],
      ...filteredFeedbacks.map(fb => [
        fb.id,
        `"${fb.name?.replace(/"/g, '""') || ''}"`,
        `"${fb.contact?.replace(/"/g, '""') || ''}"`,
        `"${fb.message?.replace(/"/g, '""') || ''}"`,
        fb.status,
        new Date(fb.created_at).toISOString(),
        fb.replied_at ? new Date(fb.replied_at).toISOString() : '',
        `"${fb.reply_message?.replace(/"/g, '""') || ''}"`
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedbacks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success(`Exported ${filteredFeedbacks.length} feedbacks`);
    window.URL.revokeObjectURL(url);
  };

  const handleBulkAction = (action) => {
    if (action === 'mark_all_read') {
      // Implement bulk mark as read
      toast.info("Bulk action: Mark all as read");
    } else if (action === 'delete_all_pending') {
      // Implement bulk delete pending
      toast.info("Bulk action: Delete all pending");
    }
  };

  // Statistics
  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'pending').length,
    read: feedbacks.filter(f => f.status === 'read').length,
    replied: feedbacks.filter(f => f.status === 'replied').length,
    today: feedbacks.filter(f => {
      const today = new Date();
      const fbDate = new Date(f.created_at);
      return fbDate.toDateString() === today.toDateString();
    }).length,
    thisWeek: feedbacks.filter(f => {
      const now = new Date();
      const fbDate = new Date(f.created_at);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return fbDate >= weekAgo;
    }).length
  };

  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-600", icon: Clock, label: "Pending" },
    read: { color: "bg-blue-100 text-blue-600", icon: MailOpen, label: "Read" },
    replied: { color: "bg-green-100 text-green-600", icon: CheckCircle, label: "Replied" }
  };

  const columns = [
    { 
      header: "ID", 
      accessor: "id",
      render: (value) => (
        <span className="font-mono font-semibold text-gray-600">#{value}</span>
      )
    },
    {
  header: "Details",
  accessor: "details",
  className: "md:hidden",
  render: (_, row) => {
    const config = statusConfig[row.status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div className="space-y-2">

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-800 text-sm">
              {row.name || "Anonymous"}
            </div>
            {row.contact && (
              <div className="text-xs text-gray-500">
                {row.contact}
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        {/* <div className="text-sm text-gray-700 line-clamp-2">
          {row.message}
        </div> */}

        {/* Status + Date */}
        <div className="flex items-center justify-between text-xs">
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded ${config.color}`}>
            <Icon className="w-3 h-3" />
            {config.label}
          </span>

          <span className="text-gray-400">
            {new Date(row.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Actions */}
        {/* <div className="flex gap-2 pt-1">
          <button onClick={() => handleView(row)} className="text-blue-600 text-xs">View</button>

          {row.status !== "replied" && (
            <button onClick={() => handleReply(row)} className="text-green-600 text-xs">
              Reply
            </button>
          )}

          {row.status === "pending" && (
            <button onClick={() => handleMarkAsRead(row)} className="text-blue-600 text-xs">
              Read
            </button>
          )}

          <button onClick={() => handleDelete(row)} className="text-red-600 text-xs">
            Delete
          </button>
        </div> */}

      </div>
    );
  }
},
    { 
      header: "User", 
      accessor: "name",
      className: "hidden md:table-cell",
      render: (value, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-800">{value || "Anonymous"}</div>
              {row.contact && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {row.contact}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    { 
      header: "Message", 
      accessor: "message",
      className: "hidden md:table-cell",
      render: (value) => (
        <div className="max-w-xs">
          <div className="text-gray-700 line-clamp-2 text-sm">
            {value}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {value?.length || 0} characters
          </div>
        </div>
      )
    },
    { 
      header: "Status", 
      accessor: "status",
      className: "hidden md:table-cell",
      render: (value) => {
        const config = statusConfig[value] || statusConfig.pending;
        const Icon = config.icon;
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
            <Icon className="w-4 h-4" />
            {config.label}
          </span>
        );
      }
    },
    { 
      header: "Date", 
      accessor: "created_at",
      className: "hidden md:table-cell",
      render: (value) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-800">
            {new Date(value).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      )
    },
    { 
      header: "Actions", 
      accessor: "actions",
      render: (value, row) => (
        <div className="flex items-center space-x-1 justify-end flex-col md:flex-row">
          <button
            onClick={() => handleView(row)}
            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {/* {row.status !== 'replied' && (
            <button
              onClick={() => handleReply(row)}
              className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
              title="Reply"
            >
              <Reply className="w-4 h-4" />
            </button>
          )} */}
          
          {row.status === 'pending' && (
            <button
              onClick={() => handleMarkAsRead(row)}
              className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
              title="Mark as Read"
            >
              <MailOpen className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Feedbacks</h2>
          <p className="text-gray-600 mt-1">Manage user feedback, suggestions, and inquiries</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={loadFeedbacks}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          
          <button
            onClick={handleExport}
            disabled={!filteredFeedbacks.length}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              !filteredFeedbacks.length
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <Download className="w-4 h-4" />
            Export ({filteredFeedbacks.length})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Feedbacks</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Read</p>
              <p className="text-2xl font-bold text-blue-600">{stats.read}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <MailOpen className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Replied</p>
              <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Today</p>
              <p className="text-2xl font-bold text-purple-600">{stats.today}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">This Week</p>
              <p className="text-2xl font-bold text-orange-600">{stats.thisWeek}</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800">Filters & Actions</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setStatusFilter("all");
                setDateRange({ start: "", end: "" });
                setSearchTerm("");
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
            
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                className="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                defaultValue=""
              >
                <option value="" disabled>Bulk Actions</option>
                <option value="mark_all_read">Mark All as Read</option>
                <option value="delete_all_pending">Delete All Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setStatusFilter("read")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === "read"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                Read ({stats.read})
              </button>
              <button
                onClick={() => setStatusFilter("replied")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === "replied"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-600 hover:bg-green-200"
                }`}
              >
                Replied ({stats.replied})
              </button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="flex items-center gap-2 flex-col md:flex-row">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Feedback
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search by name, contact, or message..."
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
              Showing <span className="font-semibold">{filteredFeedbacks.length}</span> of <span className="font-semibold">{feedbacks.length}</span> feedbacks
              {statusFilter !== "all" && ` with status: ${statusFilter}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
            
            <div className="text-gray-500">
              Response rate: {feedbacks.length > 0 ? Math.round((stats.replied / feedbacks.length) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedbacks...</p>
        </div>
      ) : filteredFeedbacks.length > 0 ? (
        <Table
          title="User Feedbacks"
          columns={columns}
          data={filteredFeedbacks}
          pageSize={15}
          showSearch={false} // We have our own search
          showActions={false} // We have custom actions in our column
          showRowsPerPage={true}
          onEdit={null} // Using custom actions
          onDelete={null} // Using custom actions
          onView={null} // Using custom actions
          emptyMessage={
            searchTerm || statusFilter !== "all" || dateRange.start || dateRange.end
              ? "No feedbacks match your filters"
              : "No feedbacks found"
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Feedbacks Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            User feedbacks will appear here when submitted through your app's feedback form.
          </p>
        </div>
      )}

      {/* Feedback Modal for View/Reply */}
      {modalOpen && (
        <FeedbackModal
          feedback={selectedFeedback}
          replyMode={replyMode}
          onSave={handleModalSave}
          onClose={() => setModalOpen(false)}
          open={modalOpen}
          onMarkAsRead={handleMarkAsRead}
          onMarkAsReplied={handleMarkAsReplied}
        />
      )}
    </div>
  );
}