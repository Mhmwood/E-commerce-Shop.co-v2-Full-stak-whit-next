import { supabase } from "../supabase";

export async function uploadImage(
  file: File,
  path: string,
  bucket = "avatars"
): Promise<string> {



  const ext = file.name.split(".").pop();
  const uniqueName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}.${ext}`;
  const filePath = `${path}/${uniqueName}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
}
