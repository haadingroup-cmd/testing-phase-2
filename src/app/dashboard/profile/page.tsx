import { requireProfile } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase-server";
import ProfileEditor, { type MediaItem } from "@/components/dashboard/ProfileEditor";

export const metadata = { title: "My Profile", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function MyProfilePage() {
  const me = await requireProfile();
  const supabase = supabaseServer();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, title, bio, photo_url, linkedin, website, skills, is_public")
    .eq("id", me.id)
    .single();

  const { data: media } = await supabase
    .from("profile_media")
    .select("id, kind, title, url, body, file_path, sort_order")
    .eq("profile_id", me.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-black text-white text-2xl mb-1">My Profile</h1>
      <p className="text-slate-400 text-sm mb-8">
        Edit your public profile and add portfolio media. Changes appear on your public team page.
      </p>
      <ProfileEditor
        profileId={me.id}
        initial={{
          full_name: profile?.full_name ?? me.full_name,
          title: profile?.title ?? "",
          bio: profile?.bio ?? "",
          photo_url: profile?.photo_url ?? "",
          linkedin: profile?.linkedin ?? "",
          website: (profile as { website?: string })?.website ?? "",
          skills: profile?.skills ?? [],
          is_public: profile?.is_public ?? false,
        }}
        media={(media as MediaItem[]) ?? []}
      />
    </div>
  );
}
