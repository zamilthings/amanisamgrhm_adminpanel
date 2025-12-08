// components/FeedbackModal.jsx
import { useState, useEffect } from "react";
import { 
  X, 
  Save, 
  User, 
  Mail, 
  Calendar, 
  MessageSquare,
  CheckCircle,
  Clock,
  Reply as ReplyIcon,
  MailOpen,
  Phone
} from "lucide-react";

export default function FeedbackModal({ 
  feedback, 
  replyMode, 
  onSave, 
  onClose, 
  open,
  onMarkAsRead,
  onMarkAsReplied
}) {
  const [replyMessage, setReplyMessage] = useState("");
  const [status, setStatus] = useState(feedback?.status || 'pending');

  useEffect(() => {
    if (feedback?.reply_message) {
      setReplyMessage(feedback.reply_message);
    }
    if (feedback?.status) {
      setStatus(feedback.status);
    }
  }, [feedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (replyMode && !replyMessage.trim()) {
      alert("Reply message is required");
      return;
    }

    const dataToSave = {
      ...feedback,
      ...(replyMode && { reply_message: replyMessage.trim() }),
      status: status
    };

    await onSave(dataToSave);
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    const dataToSave = {
      ...feedback,
      status: newStatus
    };
    await onSave(dataToSave);
  };

  if (!open || !feedback) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const isEmail = feedback.contact?.includes('@');
  const isPhone = /^[\+]?[1-9][\d]{0,15}$/.test(feedback.contact?.replace(/[\s\-\(\)\.]/g, ''));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {replyMode ? "Reply to Feedback" : "Feedback Details"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {replyMode ? "Send a response to the user" : "View and manage feedback"}
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
          <div className="space-y-6">
            {/* User Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {feedback.name || "Anonymous User"}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      feedback.status === 'read' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {feedback.status === 'pending' && <Clock className="w-4 h-4" />}
                      {feedback.status === 'read' && <MailOpen className="w-4 h-4" />}
                      {feedback.status === 'replied' && <CheckCircle className="w-4 h-4" />}
                      {feedback.status === 'pending' ? 'Pending' :
                       feedback.status === 'read' ? 'Read' : 'Replied'}
                    </span>
                  </div>
                  
                  {feedback.contact && (
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        {isEmail ? (
                          <Mail className="w-4 h-4" />
                        ) : isPhone ? (
                          <Phone className="w-4 h-4" />
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                        <span>{feedback.contact}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Submitted: {formatDate(feedback.created_at)}
                  </div>
                </div>
              </div>
            </div>

            {/* Original Message */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Original Message
              </h4>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap">
                {feedback.message}
              </div>
            </div>

            {/* Previous Reply (if exists) */}
            {feedback.reply_message && !replyMode && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ReplyIcon className="w-4 h-4" />
                  Previous Reply
                  {feedback.replied_at && (
                    <span className="text-xs text-gray-500 ml-auto">
                      {formatDate(feedback.replied_at)}
                    </span>
                  )}
                </h4>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 whitespace-pre-wrap">
                  {feedback.reply_message}
                </div>
              </div>
            )}

            {/* Reply Form */}
            {replyMode && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Write Your Reply
                </h4>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-y"
                  placeholder="Type your response here..."
                  required
                />
                <div className="mt-2 text-sm text-gray-500">
                  {replyMessage.length} characters • {replyMessage.split(/\s+/).filter(w => w.length > 0).length} words
                </div>
              </div>
            )}

            {/* Status Actions (only in view mode) */}
            {!replyMode && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Status Actions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {feedback.status !== 'read' && feedback.status !== 'replied' && (
                    <button
                      onClick={() => handleStatusChange('read')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <MailOpen className="w-4 h-4" />
                      Mark as Read
                    </button>
                  )}
                  
                  {feedback.status !== 'replied' && (
                    <button
                      onClick={() => {
                        setReplyMessage("");
                        // Switch to reply mode
                        // You might want to handle this differently
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <ReplyIcon className="w-4 h-4" />
                      Reply
                    </button>
                  )}
                  
                  {feedback.status === 'read' && !feedback.reply_message && (
                    <button
                      onClick={() => handleStatusChange('replied')}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Replied
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Close
            </button>
            
            {replyMode && (
              <button
                onClick={handleSubmit}
                disabled={!replyMessage.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                Send Reply
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}