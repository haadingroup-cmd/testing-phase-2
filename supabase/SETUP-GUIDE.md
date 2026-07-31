# HaadinGlobal — Supabase Setup (Phase 2: Team Login & Dashboard)

Yeh guide team login + dashboard ko **live** karta hai. Ek-ek step follow karo.
(Website Phase 1 ke saath already chal rahi hai — yeh sirf dashboard on karta hai.)

---

## STEP 1 — Database tables banao
1. Supabase dashboard kholo → left menu → **SQL Editor** → **New query**.
2. Is project ke andar `supabase/schema.sql` file kholo, uska **poora text copy** karo.
3. SQL Editor mein paste karo → **Run** (neeche right).
4. "Success" aa jaye to tables ban gaye. ✅

## STEP 2 — Naye API keys banao (secure) + Vercel mein daalo
1. Supabase → **Settings → API Keys** → **Publishable and secret** tab.
2. **Publishable** key copy karo, aur **Secret** key copy karo (Reveal dabao).
3. (Recommended) Legacy keys ko **Disable** kar do — purani leaked key band ho jayegi.
4. Vercel → apna project → **Settings → Environment Variables** → yeh 3 add karo:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wrwcyilvmmustqgshkyp.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key |

5. Vercel → **Deployments** → latest par **Redeploy** (taake keys apply ho).

## STEP 3 — Apna ADMIN (CEO) account banao
Pehla admin manually banega (baaki aap dashboard se banaoge):

1. Supabase → **Authentication → Users → Add user → Create new user**.
   - Email: `haadinglobal@gmail.com` (ya jo aap chaho)
   - Password: ek strong password set karo → **Create user**.
2. Us naye user par click karo → uska **User UID** copy karo (lamba id).
3. Supabase → **SQL Editor** → New query → yeh chala do (UID paste karke):

```sql
insert into public.profiles (id, full_name, role, title, level, email, is_public, stars)
values ('PASTE-USER-UID-HERE', 'Muhammad Haseeb', 'admin', 'Founder & CEO', 'Lead', 'haadinglobal@gmail.com', true, 5);
```

4. Ab `https://www.haadinglobal.com/login` par apne email + password se login karo.
   Aapko **admin dashboard** dikhega. 🎉

## STEP 4 — Baaki team dashboard se add karo
Dashboard → **Manage Team → Add Member**. Har member ke liye:
- Naam, title, login email, password (aap set karte ho), role, level → **Create Account**.
- Member ko email + password de do — wo `/login` se andar aa jayega.
- Uske baad aap stars/level set kar sakte ho, wo apne projects upload kar sakta hai.

> Tip: Members ki photos abhi placeholder hain. Photo change karne ke liye abhi
> Supabase → **Table Editor → profiles → photo_url** mein image URL daal sakte ho
> (ya Phase 3 mein main photo-upload bhi dashboard mein daal dunga).

---

## Roles ka matlab
- **Admin (aap):** sab kuch — members add/remove, roles, levels, stars, projects review.
- **Manager:** team dekhe, levels/stars set kare, projects approve/reject kare — lekin
  accounts add/remove ya role change nahi kar sakta. (Kal ko kisi ko manager bana do.)
- **Member:** apna profile + apne projects upload/manage kare.

## Security (already built-in)
- Har member sirf apna data dekh/badal sakta hai (Row Level Security).
- Secret key sirf server par, browser mein kabhi nahi jaati.
- `/dashboard` bina login khulta hi nahi — seedha `/login` par bhej deta hai.
- Passwords Supabase mein hashed store hote hain (plain nahi).
