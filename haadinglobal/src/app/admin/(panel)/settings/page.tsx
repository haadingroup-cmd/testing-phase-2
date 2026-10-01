import { AdminTitle, Card } from "@/components/admin/bits";
import { ActionForm, TextArea, TextField } from "@/components/admin/ui";
import { changePassword, saveSettings } from "@/app/admin/actions";
import { getSettings } from "@/lib/data";

export const metadata = { title: "Settings" };

export default async function AdminSettings() {
  const s = await getSettings();
  return (
    <>
      <AdminTitle title="Site settings" description="Business details used across the website, footer, structured data and WhatsApp buttons." />
      <Card className="mb-6">
        <ActionForm action={saveSettings}>
          <h2 className="font-label-lg text-label-lg">Company</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="companyName" label="Company name" defaultValue={s.companyName} />
            <TextField name="tagline" label="Tagline" defaultValue={s.tagline} />
          </div>
          <TextArea name="description" label="Description" defaultValue={s.description} rows={3} />
          <h2 className="pt-2 font-label-lg text-label-lg">Contact</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <TextField name="email" label="Email" type="email" defaultValue={s.email} />
            <TextField name="phone" label="Phone (display)" defaultValue={s.phone} />
            <TextField name="whatsapp" label="WhatsApp number (digits, with country code)" defaultValue={s.whatsapp} />
            <TextField name="address" label="Address" defaultValue={s.address} />
            <TextField name="city" label="City" defaultValue={s.city} />
            <TextField name="region" label="Region / province" defaultValue={s.region} />
            <TextField name="country" label="Country code" defaultValue={s.country} maxLength={2} />
            <TextField name="responseTime" label="Response time" defaultValue={s.responseTime} />
          </div>
          <TextField name="whatsappMessage" label="Default WhatsApp message" defaultValue={s.whatsappMessage} />
          <TextField name="markets" label="Markets (comma separated)" defaultValue={s.markets.join(", ")} />
          <h2 className="pt-2 font-label-lg text-label-lg">Founder</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <TextField name="founderName" label="Name" defaultValue={s.founderName} />
            <TextField name="founderTitle" label="Title" defaultValue={s.founderTitle} />
            <TextField name="founderImage" label="Photo" defaultValue={s.founderImage} hint="/images/founder.webp" />
          </div>
          <TextArea name="founderQuote" label="Quote" defaultValue={s.founderQuote} rows={2} />
          <h2 className="pt-2 font-label-lg text-label-lg">Homepage stats</h2>
          <TextArea name="stats" label="Stats" hint="One per line: icon | value | label (icons from the Material Symbols list). Only publish figures you can back up." defaultValue={s.stats.map((x) => `${x.icon} | ${x.value} | ${x.label}`).join("\n")} rows={6} mono />
          <h2 className="pt-2 font-label-lg text-label-lg">Social links</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {(["facebook", "instagram", "linkedin", "tiktok", "youtube", "clutch"] as const).map((k) => (
              <TextField key={k} name={k} label={k.charAt(0).toUpperCase() + k.slice(1)} defaultValue={s.social[k]} type="url" hint="Leave empty to hide" />
            ))}
          </div>
        </ActionForm>
      </Card>
      <Card>
        <h2 className="mb-3 font-label-lg text-label-lg">Change password</h2>
        <ActionForm action={changePassword} submitLabel="Update password" className="max-w-md">
          <TextField name="current" label="Current password" type="password" autoComplete="current-password" />
          <TextField name="password" label="New password" type="password" autoComplete="new-password" hint="12+ characters with upper-case, lower-case and a number" />
          <TextField name="confirm" label="Confirm new password" type="password" autoComplete="new-password" />
        </ActionForm>
      </Card>
    </>
  );
}
