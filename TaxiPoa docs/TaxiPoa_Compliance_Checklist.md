# TAXIPOA LEGAL COMPLIANCE CHECKLIST

**Use this before launch to ensure you're compliant with Kenya DPA, GDPR, and best practices.**

---

## PRE-LAUNCH CHECKLIST (Before Day 1)

### Legal Documentation
- [ ] **Privacy Policy** — Finalized and posted on website footer
- [ ] **Terms of Service** — Finalized and posted on website footer
- [ ] **Data Processing Agreement (DPA)** — Saved for reference
- [ ] **Cookie Policy** (optional but recommended) — Link in footer if using cookies
- [ ] **Disclaimer** — Clear statement that TaxiPoa is NOT tax advice (in signup flow & homepage)

### Business Registration
- [ ] **Business registered** with Huduma (Kenya)
- [ ] **KRA PIN** obtained for TaxiPoa (as a business)
- [ ] **Tax Compliance Certificate** obtained
- [ ] **Business name** registered with appropriate trademark (optional but recommended)
- [ ] **Company details page** on website (address, contact, registered number)

### Data & Security Implementation
- [ ] **AES-256 encryption** implemented for KRA PIN storage
- [ ] **HTTPS/TLS 1.2+** enforced on all pages (no HTTP)
- [ ] **JWT authentication** with 7-day token expiry implemented
- [ ] **Bcrypt password hashing** (saltRounds: 12) implemented
- [ ] **CORS configured** to allow only taxipoa.co.ke (not wildcard *)
- [ ] **Rate limiting** on /api/auth/login (5 attempts per 15 minutes)
- [ ] **Input validation** on all forms (express-validator or similar)

### User Consent & Opt-In
- [ ] **Privacy Policy acceptance** required during signup (checkbox)
- [ ] **Terms of Service acceptance** required during signup (checkbox)
- [ ] **SMS reminder opt-in** is explicit (not pre-checked)
- [ ] **Email reminder opt-in** is explicit (not pre-checked)
- [ ] **Marketing email opt-in** is optional (users can opt-out anytime)
- [ ] **Analytics opt-out mechanism** provided (link in Privacy Policy)
- [ ] **Cookie consent banner** displayed (if using Google Analytics or similar)

### Account & Data Management
- [ ] **"Delete My Account" functionality** implemented in Settings
- [ ] **Account deletion** deletes personal data within 30 days
- [ ] **Data export** feature available (CSV/JSON of income, expenses, filings)
- [ ] **Password reset** functionality implemented
- [ ] **Change password** option in Settings
- [ ] **View personal data** option in Settings (shows what we store)
- [ ] **Contact form** for data access/deletion requests (support@taxipoa.co.ke)

### Third-Party Integrations
- [ ] **Africa's Talking account** set up (SMS reminders)
- [ ] **Cloudinary account** set up (receipt uploads)
- [ ] **Database** hosted on Neon.tech or similar (with encryption)
- [ ] **Backend** hosted on Railway.app or similar
- [ ] **Frontend** hosted on Vercel
- [ ] **Email service** set up (Resend or Gmail SMTP for MVP)
- [ ] **Analytics** set up (Google Analytics or Plausible — with opt-out)

### Communication & Support
- [ ] **Privacy contact email** established (privacy@taxipoa.co.ke)
- [ ] **Support email** established (support@taxipoa.co.ke)
- [ ] **Disputes email** established (disputes@taxipoa.co.ke)
- [ ] **Mailing address** posted on website (physical address for legal notices)
- [ ] **Response SLA** in place (14 days for data requests, 5 days for support)

### Testing & Documentation
- [ ] **Data deletion tested** (confirm personal data is deleted)
- [ ] **Data export tested** (confirm CSV/JSON contains all user data)
- [ ] **Encryption tested** (confirm KRA PIN is encrypted in database)
- [ ] **HTTPS tested** (confirm no mixed HTTP/HTTPS)
- [ ] **Tax calculator tested** against KRA examples (see Part 3)
- [ ] **Breach response plan** documented (who to notify, timeline)
- [ ] **Data retention policy** documented (see Privacy Policy Section 7.3)

---

## OPTIONAL PRE-LAUNCH (But Recommended)

### Legal Review
- [ ] **Kenyan lawyer reviewed Privacy Policy** (KES 5,000–10,000)
  - Verify DPA 2019 compliance
  - Check for gaps in Kenyan-specific requirements
- [ ] **Kenyan lawyer reviewed Terms of Service** (KES 3,000–5,000)
  - Verify liability disclaimers are enforceable
  - Check dispute resolution clause
- [ ] **Accountant reviewed tax calculation logic** (KES 5,000–10,000)
  - Verify progressive tax band algorithm
  - Confirm deductible expense list matches KRA rules
  - Check for surtax or other recent changes

### Insurance & Protection
- [ ] **Cyber liability insurance** quote obtained (optional but smart for startups)
  - Covers data breaches, errors in calculations, liability claims
  - Typical cost: KES 50,000–150,000/year
- [ ] **Professional liability insurance** considered (if offering advisory services)

### Policy Documentation
- [ ] **Incident response plan** documented (breach procedures)
- [ ] **Data retention schedule** documented (who deletes what, when)
- [ ] **Staff access policy** documented (who can see user data, under what conditions)
- [ ] **Backup & recovery plan** documented (backup frequency, restoration tests)
- [ ] **Change log** started (track updates to Privacy Policy, T&Cs, DPA)

---

## POST-LAUNCH: ONGOING COMPLIANCE

### Monthly Tasks
- [ ] **Check for data protection issues** (KDI announcements, legal updates)
- [ ] **Review support emails** for privacy concerns
- [ ] **Verify SMS/email delivery** logs are being kept securely
- [ ] **Monitor analytics** for unusual access patterns (potential breach indicator)

### Quarterly Tasks
- [ ] **Review processor security** (request certifications from Neon, Railway, Vercel, etc.)
- [ ] **Audit data access logs** (who accessed what, when)
- [ ] **Test data deletion** (confirm deletion process still works)
- [ ] **Test data export** (confirm export format is still valid)
- [ ] **Review incident logs** (any security events?)
- [ ] **Confirm backups are restorable** (test restore process)

### Annually Tasks (Before Next Tax Season)
- [ ] **Update Privacy Policy** (reflect any changes in processing)
- [ ] **Update Terms of Service** (reflect new features, pricing, etc.)
- [ ] **Verify tax calculation logic** against current KRA rules
  - Check for surtax updates
  - Confirm tax band thresholds
  - Review deductible expense list
- [ ] **KDI compliance check** (any new Data Protection guidelines?)
- [ ] **GDPR updates** (if serving EU users; updates occur regularly)
- [ ] **Insurance review** (cyber liability, professional liability)
- [ ] **Legal review** (have lawyer review updated docs)

### If You Experience a Data Breach
- [ ] **Identify the breach** (what data, how many users, when discovered)
- [ ] **Contain it immediately** (take affected system offline if needed)
- [ ] **Investigate** (how did it happen, can it happen again)
- [ ] **Notify KDI** (within 72 hours if required)
- [ ] **Notify affected users** (within 72 hours via email)
- [ ] **Document everything** (incident report, timeline, response actions)
- [ ] **Review security** (conduct penetration test, security audit)
- [ ] **Implement fixes** (patch vulnerability, update processes)

---

## STARTUP LAWYER/ACCOUNTANT CONTACTS (Kenya)

### Legal Firms (Startup-Friendly, Budget-Conscious)
- **Strathmore University Legal Clinic** — Offers affordable legal services
- **AfricaNomicS / TechHub Kenya** — Know startup law
- **DLA Piper, CMS, Dentons** — Large firms with startup practices

### Accountants
- **Deloitte Kenya** — Large, KRA-connected
- **Crowe Kenya** — Mid-sized, startup-friendly
- **Local CPAs in Nairobi** — More affordable for small projects

### Data Protection Specialists
- **Office of the Data Protection Commissioner** — Offers guidance (free)
  - www.odpc.or.ke
  - info@odpc.or.ke

---

## TAXIPOA-SPECIFIC COMPLIANCE ACTIONS

### Disclaimer Implementation
**Add prominent disclaimer in these locations:**

1. **Homepage hero section** — "TaxiPoa helps you understand your tax obligations. It is not tax advice. Consult a professional for complex situations."
2. **Signup flow (Step 1)** — "By using TaxiPoa, you acknowledge that calculations may not be accurate for your unique situation."
3. **Before you enter KRA PIN** — "Your KRA PIN will be encrypted. However, we are not liable if it is compromised due to your account being hacked."
4. **Before you submit for filing** — "You are responsible for filing with KRA. We do not submit on your behalf. Verify all calculations before filing."
5. **Tax summary PDF footer** — "This is a reference document. You must file your actual return with KRA via iTax."
6. **Settings page** — "TaxiPoa is not a substitute for a qualified tax professional. Consult a CPA for complex situations."

### Deductible Expense Caution
**For every expense category, add a note:**
- "Only claim expenses you have receipts for."
- "KRA may deny deductions if you cannot prove them."
- "Consult a CPA if you're unsure whether an expense is deductible."

Example:
```
Home Office Deduction
Maximum: Proportional rent + electricity based on % of home used for work
⚠️ CAUTION: Only claim if you have proof (rental agreement, electricity bills).
Consult a CPA if unsure.
```

### Tax Calculation Transparency
**Show your work:**
- Display the exact formula used (e.g., "Tax = 10% of income up to KES 288K, then 25% above that")
- Show progressive band calculation step-by-step
- Clearly show: Income – Deductions = Taxable Income → Tax Before Relief → Tax After Personal Relief → Tax After WHT
- Link to KRA tax bands page for verification

### KRA Updates Warning
**Add a banner (updated quarterly):**
```
⚠️ Tax rules update every year (June 30). The current bands in TaxiPoa reflect 2025/26 rules.
Always verify with KRA (www.kra.go.ke) before filing, as rules may have changed.
```

---

## PRIVACY POLICY CUSTOMIZATION

Before you launch, customize these placeholder sections:

1. **[INSERT DATE OF LAUNCH]** — Replace with your actual launch date
2. **[Your Business Name]** — Replace with your registered company name
3. **[Your Business Address]** — Replace with your physical address
4. **privacy@taxipoa.co.ke** — Replace with your actual email
5. **[Google Analytics / Plausible / Simple Analytics]** — Replace with your chosen analytics tool
6. **[Payment Provider]** — Replace with M-Pesa/Stripe/etc. when you add payments

---

## TERMS OF SERVICE CUSTOMIZATION

Before you launch, customize:

1. **[INSERT DATE OF LAUNCH]** — Replace with your actual launch date
2. **disputes@taxipoa.co.ke** — Replace with your actual email
3. **support@taxipoa.co.ke** — Replace with your actual email
4. **[Your Business Address]** — Replace with your physical address
5. **[Payment Provider]** — Replace when you add M-Pesa
6. **Nairobi, Kenya** — Verify this is your intended jurisdiction

---

## RED FLAGS TO AVOID

### Do NOT Do These (Legal Risk)

❌ **Do NOT:**
- Automate iTax filing (unauthorized automation of government systems)
- Promise "you will owe less tax" (makes specific tax promises)
- Store unencrypted KRA PINs
- Use HTTP (not HTTPS) for login/financial data
- Sell user data to third parties
- Hide your privacy policy or T&Cs
- Delay responding to data deletion requests
- Ignore data breaches (silence is not protection)
- Use users' data for marketing without permission
- Claim to be a "registered tax advisor" if you're not

### Do NOT Forget These (Compliance Risk)

❌ **Do NOT Forget:**
- Obtaining user consent before collecting data
- Encrypting sensitive data (KRA PIN, income details)
- Providing a "delete account" option
- Responding to privacy requests (14-day SLA)
- Notifying users of data breaches (72-hour rule)
- Documenting your security measures
- Having a privacy contact (privacy email)
- Posting your privacy policy (must be findable)
- Keeping records of data processing activities
- Having a breach incident response plan

---

## COMPLIANCE BUDGET (First Year)

| **Item** | **Cost** | **Notes** |
|---|---|---|
| **Legal review (Privacy Policy)** | KES 5,000–10,000 | One-time |
| **Legal review (Terms of Service)** | KES 3,000–5,000 | One-time |
| **Accountant review (tax logic)** | KES 5,000–10,000 | One-time; prevents calculation errors |
| **Cyber liability insurance** | KES 50,000–150,000 | Annual; optional but smart |
| **Business registration** | KES 1,500–2,500 | One-time |
| **Domain (.co.ke)** | KES 1,500–3,000 | Annual |
| **SSL certificate** | KES 0 | Free via Vercel + Railway |
| **Privacy/compliance tools** | KES 0 | Use free tools (GitHub, Notion, Figma) |
| **Total (Essential)** | **~KES 20,000–35,000** | One-time before launch |

**This is a small cost relative to the liability risk of not doing it.**

---

## FINAL SIGN-OFF

Before you launch, confirm:

- [ ] **I have reviewed the Privacy Policy** and customized it
- [ ] **I have reviewed the Terms of Service** and customized it
- [ ] **I understand the liability disclaimers** and agree to them
- [ ] **I have implemented encryption** for KRA PIN
- [ ] **I have implemented HTTPS** on all pages
- [ ] **I have tested data deletion** and it works
- [ ] **I have tested data export** and it works
- [ ] **I have user consent checkboxes** for Privacy Policy & T&Cs
- [ ] **I have a privacy contact email** and will respond within 14 days
- [ ] **I have a breach incident response plan** documented
- [ ] **I will update tax calculation logic** if KRA rules change
- [ ] **I understand TaxiPoa is NOT tax advice** and will emphasize this

**Signed:**
- Name: ___________________________
- Date: ___________________________
- Role: TaxiPoa Founder

---

## RESOURCES

**Kenya Data Protection Act 2019:**
- https://www.odpc.or.ke/ (Office of Data Protection Commissioner)
- PDF: https://www.odpc.or.ke/dpa-2019

**GDPR (if you serve EU users):**
- https://gdpr-info.eu/

**KRA Tax Information:**
- https://www.kra.go.ke/ (Official website)
- https://www.kra.go.ke/itax (iTax portal)
- Search for "KRA tax bands 2025/26" annually

**Startup Resources (Kenya):**
- TechHub Kenya: https://www.techhubkenya.com/
- iHub: https://www.ihub.co.ke/
- Strathmore University: Legal clinic services

---

**END OF COMPLIANCE CHECKLIST**

**Questions? Contact:** privacy@taxipoa.co.ke
