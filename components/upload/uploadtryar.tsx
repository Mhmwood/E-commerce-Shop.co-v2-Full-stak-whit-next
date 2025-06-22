"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase"; // تأكد المسار صحيح

import Image from "next/image";
export default function UploadTryar() {
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (error) {
      console.error("Upload failed:", error.message);
      alert("Upload failed!");
      setLoading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setFileUrl(data.publicUrl);
    setLoading(false);
  };

  console.log("url",fileUrl);
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Upload Avatar</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-4"
      />

      {loading && <p>Uploading...</p>}

      {fileUrl && (
        <div className="mt-4">
          <p className="mb-2">Uploaded Image:</p>
          <Image src={fileUrl} alt="Uploaded Image" width={200} height={200} />
          <p className="text-sm mt-2 break-words">{fileUrl}</p>
        </div>
      )}
    </div>
  );
}
