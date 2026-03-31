import { useEffect, useState } from "react";
import { supabase } from "@/libs/createClient";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AboutContactPage() {
  const [contents, setContents] = useState({
    1: { title: "", description: "" }, // About
    2: { title: "", description: "" }, // Contact
  });

  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("about_app")
        .select("*")
        .in("id", [1, 2]);

      if (error) throw error;

      const formatted = {
        1: { title: "", description: "" },
        2: { title: "", description: "" },
      };

      data.forEach((item) => {
        formatted[item.id] = item;
      });

      setContents(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(id, field, value) {
    setContents((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  }

  async function saveData(id) {
    const item = contents[id];

    if (!item.title.trim() || !item.description.trim()) {
      toast.error("Title and description required");
      return;
    }

    try {
      setSavingId(id);

      const { error } = await supabase.from("about_app").upsert({
        id,
        title: item.title.trim(),
        description: item.description.trim(),
        // updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast.success(`${id === 1 ? "About" : "Contact"} saved`);
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        <p className="mt-3 text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          About App
        </h1>
        <p className="text-gray-500 mt-2">
          Edit the content for the About and Contact sections of the app.
        </p>
      </div>

      <SectionCard
        title="About"
        data={contents[1]}
        onChange={(field, value) => handleChange(1, field, value)}
        onSave={() => saveData(1)}
        saving={savingId === 1}
        isEditing={editingId === 1}
        onEdit={() => setEditingId(1)}
        onCancel={() => setEditingId(null)}
      />

      <SectionCard
        title="Contact"
        data={contents[2]}
        onChange={(field, value) => handleChange(2, field, value)}
        onSave={() => saveData(2)}
        saving={savingId === 2}
        isEditing={editingId === 2}
        onEdit={() => setEditingId(2)}
        onCancel={() => setEditingId(null)}
      />

    </div>
  );
}

/* ---------------- COMPONENT ---------------- */
function SectionCard({
  title,
  data,
  onChange,
  onSave,
  saving,
  isEditing,
  onEdit,
  onCancel
}) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-300 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

        {!isEditing ? (
          <button
            onClick={onEdit}
            className="text-blue-600 text-sm font-medium"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={onCancel}
            className="text-gray-500 text-sm"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        {isEditing ? (
          <>

            {/* Title */}
            <input
              type="text"
              value={data?.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-400 rounded-lg ${isEditing ? "bg-white" : "bg-gray-50"
                }`}
            />

            {/* Description */}
            <textarea
              value={data?.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              disabled={!isEditing}
              rows={6}
              className={`w-full px-4 py-3 border border-gray-400 rounded-lg ${isEditing ? "bg-white" : "bg-gray-50"
                }`}
            />
          </>) : (
          <>
            {/* Preview */}
            {data?.title && (
              <div className=" pt-4">
                <h3 className="text-sm text-gray-500 mb-2">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">{data.title}</h4>
                  {data.description.split("\n").map((line, i) => (
                    <p key={i} className="text-sm text-gray-600 mb-1">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </>)}
        {/* Save */}
        {isEditing && (
          <div className="flex justify-end">
            <button
              onClick={onSave}
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

