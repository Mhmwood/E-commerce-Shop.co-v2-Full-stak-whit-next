import { supabase } from "../supabase";
import { deleteImage } from "./deleteImg";

export async function updateImage(
  oldUrl: string,
  newFile: File,
  bucket = "avatars"
): Promise<string> {
  try {
    const deleted = await deleteImage(oldUrl, bucket);
    if (!deleted) throw new Error("Failed to delete old image");

    const ext = newFile.name.split(".").pop();
    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(uniqueName, newFile);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(uniqueName);

    return publicUrl.publicUrl;
  } catch (err) {
    console.error("Update failed:", err);
    throw err;
  }
}
