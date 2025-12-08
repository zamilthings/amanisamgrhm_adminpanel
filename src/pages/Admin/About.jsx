import { useEffect, useState } from "react";
import { supabase } from "@/libs/createClient";
import { toast } from "sonner";
import { Edit, Save, X, Loader2 } from "lucide-react";

export default function About() {
  const [about, setAbout] = useState({
    id: 1,
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    loadAboutData();
  }, []);

  async function loadAboutData() {
    try {
      const { data, error } = await supabase
        .from("about_app")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) throw error;

      if (data) {
        setAbout(data);
        setInitialData(data);
      }
    } catch (error) {
      toast.error("Failed to load about data");
      console.error(error);
    }
  }

  async function saveAbout() {
    if (!about.title.trim() || !about.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("about_app")
        .upsert({
          id: 1,
          title: about.title.trim(),
          description: about.description.trim(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("About page updated successfully!");
      setIsEditing(false);
      setInitialData(about);
    } catch (error) {
      toast.error("Failed to update about page");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function startEdit() {
    setIsEditing(true);
  }

  function cancelEdit() {
    setAbout(initialData);
    setIsEditing(false);
    toast.info("Changes discarded");
  }

  const hasChanges = 
    about.title !== initialData.title || 
    about.description !== initialData.description;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">About App</h1>
          <p className="text-gray-600 mt-1">
            Manage the about page content for your application
          </p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Content
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            Editing Mode
          </div>
        )}
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            About Page Content
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            This content will be displayed on the public about page
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={about.title}
                onChange={(e) => setAbout({ ...about, title: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "border-gray-200 bg-gray-50"
                } transition-colors outline-none`}
                placeholder="Enter about page title..."
              />
              {isEditing && (
                <p className="text-sm text-gray-500 mt-1">
                  This will be the main heading of your about page
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={about.description}
                onChange={(e) => setAbout({ ...about, description: e.target.value })}
                disabled={!isEditing}
                rows={8}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    : "border-gray-200 bg-gray-50"
                } transition-colors outline-none resize-y`}
                placeholder="Write about your application here..."
              />
              {isEditing && (
                <p className="text-sm text-gray-500 mt-1">
                  You can use Markdown or HTML for formatting
                </p>
              )}
            </div>

            {/* Preview Section (Read-only) */}
            {!isEditing && about.title && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Preview</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {about.title}
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    {about.description.split('\n').map((line, index) => (
                      <p key={index} className="mb-3">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm">
                  {hasChanges ? (
                    <span className="text-yellow-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      You have unsaved changes
                    </span>
                  ) : (
                    <span className="text-gray-500">No changes made</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={cancelEdit}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  
                  <button
                    onClick={saveAbout}
                    disabled={loading || !hasChanges}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      loading || !hasChanges
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500">
              Last updated: {about.updated_at ? new Date(about.updated_at).toLocaleDateString() : 'Never'}
            </div>
            <div className="text-gray-500">
              Character count: {about.description?.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">i</span>
            </div>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Tips for writing your about page:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Keep it concise and engaging</li>
              <li>Highlight key features and benefits</li>
              <li>Include contact information if needed</li>
              <li>Update regularly with new features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}