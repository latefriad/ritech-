import { useState, useRef } from "react";
import { uploadImage } from "../../services/storage";

export default function ImageUpload({ value, onChange, label = "صورة المنتج" }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("الرجاء اختيار صورة فقط");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("الصورة يجب أن تكون أقل من 5MB");
      return;
    }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // Upload to Firebase Storage
    setUploading(true);
    try {
      const url = await uploadImage(file, "products");
      onChange(url);
      setPreview(url);
      URL.revokeObjectURL(localUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ فشل الرفع: " + err.message);
      setPreview(value || "");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleRemove = () => {
    onChange("");
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
        {label}
      </label>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "#453ec1" : "#e5e7eb"}`,
          borderRadius: 10,
          padding: preview ? 0 : 20,
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? "#eeedfe" : "#f9fafb",
          transition: "all 0.2s",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {preview ? (
          <div style={{ position: "relative" }}>
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
            />
            <button
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "none",
                background: "#e24b4a",
                color: "white",
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>
              {uploading ? "⏳ جاري الرفع..." : "اسحب الصورة هنا أو اضغط للاختيار"}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
              PNG, JPG, WEBP — حد أقصى 5MB
            </div>
          </div>
        )}
      </div>

      {/* Manual URL Input */}
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>أو رابط:</span>
        <input
          type="url"
          value={value || ""}
          onChange={(e) => { onChange(e.target.value); setPreview(e.target.value); }}
          placeholder="https://..."
          style={{
            flex: 1,
            padding: "6px 10px",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            fontFamily: "Cairo, sans-serif",
            fontSize: 12,
            outline: "none",
            direction: "ltr",
          }}
        />
      </div>
    </div>
  );
}
