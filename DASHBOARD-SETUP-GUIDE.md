# HaadinGlobal Dashboard — Setup Guide (B)

Yeh dashboard system ab **code-complete + build-verified (0 errors)** hai. Ismein hai:

- **Login** (email/password, secure)
- **Roles** — Admin (aap), Manager, Member
- **Team management** — members add/remove, roles, levels, star ratings
- **Member projects** — members kaam upload karein, admin approve/reject kare
- **CRM / Leads** — saari enquiries ek pipeline mein (New → Contacted → Meeting → Won → Lost), notes + value + WhatsApp/call/email quick links
- **Auto lead capture** — website ka contact form ab leads **seedha CRM mein** save karta hai
- **Security** — Row Level Security (log sirf woh dekhein jo unhe allowed hai)

**IMPORTANT — yeh code-level par verified hai (build 0 errors). Lekin "login chalta hai" yeh aap ko Supabase se connect karke KHUD test karna hoga — kyunke woh aap ke Supabase par chalega, jise main access nahi kar sakta.**

---

## Setup — 4 steps (ek-ek karke)

### STEP 1 — Database tables banayein
1. Supabase account → apna project → **SQL Editor** (left menu)
2. Repo ki file `supabase/schema.sql` — uska **poora content copy** karein
3. SQL Editor mein paste → **Run** (green button)
4. "Success" aana chahiye. Yeh saari tables (profiles, projects, leads) + security bana dega.

### STEP 2 — Supabase keys lein
1. Supabase → apna project → **Settings → API**
2. Copy karein:
   - **Project URL** — jaise `https://abcxyz.supabase.co`
   - **anon public key** — lamba code (`eyJ...`)

### STEP 3 — Keys website mein daalein (Vercel)
1. Vercel → apni `testing-phase-2` project → **Settings → Environment Variables**
2. Do variables add karein (dono **Production** ke liye):

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | aap ka Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | aap ka anon key |

3. Save → **Deployments → Redeploy** (cache ka tick hata dein)

### STEP 4 — Apna Owner (Admin) account banayein
1. Supabase → **Authentication → Users → Add user**
   - Email + password daalein (yeh aap ka login hoga)
   - "Auto Confirm User" ✅ tick karein
   - Create
2. Us user ki **ID copy** karein (users list mein dikhegi)
3. Supabase → **SQL Editor** → yeh chalayein (ID aur naam apna daalein):

```sql
insert into public.profiles (id, full_name, role, title, level, stars, is_public)
values ('PASTE-USER-ID-HERE', 'Muhammad Haseeb', 'admin', 'Founder & CEO', 'Lead', 5, true)
on conflict (id) do update set role = 'admin';
```

4. Ho gaya! Ab `haadinglobal.com/login` par apne email/password se login karein → aap admin ho.

---

## Members / Managers kaise add karein

Login ke baad **Dashboard → Manage Team** se:
- Naya member add karein (unka email/password aap set karein — pehle Supabase Authentication mein user banayein, phir dashboard se profile)
- Role set karein (member ya manager)
- Level + star rating

**Ya seedha Supabase se:** Authentication → Add user → phir SQL se profile banayein (upar wala command, `role` ko `'member'` ya `'manager'` kar dein).

---

## Kya abhi hai vs kya baad mein aayega

**✅ Ab ready (is version mein):**
- Login + roles + team management
- Member project uploads + approval
- CRM / Leads pipeline + auto-capture from website
- Basic analytics (counts, won value)

**⏳ Future (agle rounds mein — yeh weeks ka kaam hai):**
- **Client portal** — client login, project progress, messaging
- **Advanced analytics** — full graphs/charts over time
- **Automation** — auto-notifications, WhatsApp API integration
- **Attendance / payments / invoicing**

Yeh honestly ek session mein nahi ban sakta tha. Yeh version aap ka **daily kaam (leads + team)** chala dega. Baaki hum agle sessions mein add karte rahenge.

---

## Test checklist (Supabase connect karne ke baad)

1. `/login` khulta hai, aap login kar sakte ho → ✅
2. Dashboard dikhta hai (admin view) → ✅
3. `/dashboard/leads` — leads pipeline dikhta hai → ✅
4. Website par contact form bharein → woh lead `/dashboard/leads` mein aaye → ✅ (yeh auto-capture test hai)
5. Ek member account banayein → woh sirf apna kaam dekhe (leads nahi) → ✅ (security test)

Koi step fail ho to us step ka screenshot bhejein — main foran fix batavunga.
