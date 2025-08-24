import { supabase } from "../supabase";

export async function deleteImage(Url: string, bucket: string) {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
    const path = Url.replace(baseUrl, "");

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Error deleting image:", error.message);
      throw new Error(error.message);
    }

    console.log("Deleted:", path);
    return true;
  } catch (err) {
    console.error("Delete failed:", err);
    return false;
  }
}
