# TAXIPOA PRIVACY POLICY

**Effective Date:** [INSERT DATE OF LAUNCH]  
**Last Updated:** [INSERT DATE]  
**Company:** TaxiPoa (Operating as [Your Business Name])  
**Jurisdiction:** Kenya

---

## 1. INTRODUCTION

TaxiPoa ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (taxipoa.co.ke) and mobile application (collectively, the "Service").

This policy complies with Kenya's **Data Protection Act, 2019** and the **General Data Protection Regulation (GDPR)** for users in the European Union (where applicable).

**Please read this Privacy Policy carefully.** If you do not agree with our data practices, please do not use the Service.

---

## 2. INFORMATION WE COLLECT

### 2.1 Information You Provide Voluntarily

When you register, create a tax filing, or use TaxiPoa, we collect:

#### Registration & Account Information
- Full name
- Email address
- Phone number (for SMS reminders)
- Password (hashed; never stored in plaintext)
- Preferred language (English or Swahili)

#### Tax & Financial Information
- KRA Personal Identification Number (PIN) — encrypted before storage
- Annual income and income sources
- Business/freelance details (client names, income amounts, dates)
- Expense entries (categories, amounts, descriptions, optional receipts)
- Withholding tax certificates
- Previous tax year filings

#### Optional Information
- Receipt photos for expenses (uploaded to Cloudinary)
- Notes or comments on expenses/income

### 2.2 Information Collected Automatically

When you use TaxiPoa, we automatically collect:

#### Device & Access Information
- IP address
- Device type (computer, mobile, tablet)
- Browser type and version
- Operating system
- Approximate geographic location (from IP; not precise)
- Session logs (login time, pages accessed, features used)

#### Analytics Data
- How you interact with the Service (forms completed, buttons clicked, pages viewed)
- Time spent on each page
- Errors or issues encountered
- Referral source (where you came from)

**Analytics Partner:** We use [Google Analytics / Plausible / Simple Analytics] to understand user behavior. [See Section 7 for details].

### 2.3 Information from Third Parties

We may receive information about you from:
- **Africa's Talking API** — SMS delivery status and logs
- **Cloudinary** — File storage metadata for receipt uploads
- **Neon.tech (Database)** — Database hosting logs
- **Your financial institution** — If you reference M-Pesa statements in your filings

---

## 3. HOW WE USE YOUR INFORMATION

### 3.1 To Provide & Improve the Service

- Create and manage your TaxiPoa account
- Calculate your tax liability accurately
- Generate your tax summary PDF
- Send deadline reminders (SMS & email)
- Store your filing history
- Debug errors and provide technical support
- Improve features and user experience

### 3.2 To Communicate With You

- Send account confirmations and password resets
- Send reminder emails/SMS for tax deadlines (June 30, etc.)
- Notify you of service updates, maintenance, or security issues
- Respond to your support inquiries
- Send marketing communications (if you opt-in)

### 3.3 To Comply With Legal Obligations

- Respond to lawful government requests (e.g., KRA subpoena)
- Prevent fraud, abuse, or illegal activity
- Enforce our Terms of Service
- Protect your and our legal rights

### 3.4 To Conduct Business Operations

- Analyze usage patterns to optimize performance
- Conduct internal audits and security assessments
- Process payments (when M-Pesa integration is added)
- Generate anonymized statistical reports

---

## 4. LEGAL BASIS FOR PROCESSING (GDPR & GDPA)

We process your personal data based on:

| **Data Type** | **Legal Basis** | **Why** |
|---|---|---|
| Account information | Contractual necessity | Required to provide the Service |
| Tax & financial data | Contractual necessity | Required to calculate your tax |
| Email/SMS reminders | Consent | You opt-in to reminders |
| Analytics (aggregated) | Legitimate interest | To improve the Service |
| KRA PIN (encrypted) | Contractual necessity | You provide it to receive personalized help |
| Device logs | Legitimate interest | To detect fraud and ensure security |

---

## 5. DATA SHARING & DISCLOSURE

### 5.1 We Do NOT Sell Your Data

We do not sell, rent, or lease your personal information to third parties for their marketing purposes.

### 5.2 Third-Party Service Providers

We share limited information with trusted service providers:

| **Service** | **Data Shared** | **Purpose** | **GDPR/GDPA Compliance** |
|---|---|---|---|
| **Neon.tech** | Database records (encrypted) | Data storage | Data Processing Agreement signed |
| **Railway.app** | Application logs | API hosting | Data Processing Agreement signed |
| **Vercel** | Session cookies, error logs | Frontend hosting | Data Processing Agreement signed |
| **Cloudinary** | Receipt images (optional) | File storage | Data Processing Agreement signed |
| **Africa's Talking** | Phone number, SMS content | SMS delivery | Data Processing Agreement signed |
| **Nodemailer/Resend** | Email address, message content | Email delivery | Data Processing Agreement signed |

All providers are contractually obligated to:
- Use data only for the stated purpose
- Implement security measures equal to ours
- Not disclose data to unauthorized parties
- Delete data when no longer needed

### 5.3 Legal Requests & Law Enforcement

We may disclose your information if required by law or if we believe in good faith that disclosure is necessary to:
- Comply with a KRA audit or investigation
- Prevent fraud or criminal activity
- Protect the safety of TaxiPoa users
- Enforce our Terms of Service

We will provide notice of such requests unless legally prohibited.

### 5.4 Business Transfers

If TaxiPoa is acquired, merged, or sold, your personal information may be transferred as part of that transaction. We will notify you of any such change and any choices you may have.

---

## 6. DATA SECURITY

### 6.1 Encryption & Protection

We implement industry-standard security measures:

**Data at Rest (Stored):**
- KRA PINs: **AES-256-CBC encryption** before storage
- Database: Encrypted on Neon.tech servers
- Passwords: One-way bcrypt hashing (saltRounds: 12)
- Sensitive data: Field-level encryption where applicable

**Data in Transit (Moving):**
- All connections: **HTTPS/TLS 1.2+**
- API endpoints: Require valid JWT authentication token
- No plaintext HTTP; automatic HTTPS redirect

### 6.2 Access Controls

- Authentication: Email + password (hashed)
- Authorization: JWT tokens expire every 7 days (automatic re-login required)
- Role-based access: Only you can view your own data
- Audit logs: Access to sensitive data is logged and monitored

### 6.3 Data Retention & Deletion

| **Data Type** | **Retention Period** | **Deletion** |
|---|---|---|
| Account information | While account is active | Deleted when you request account deletion |
| Tax filings (completed) | 7 years | Per Kenyan tax law requirements |
| Tax filings (draft) | 2 years of inactivity | Auto-deleted |
| Session logs | 90 days | Automatic purge |
| SMS/email records | 1 year | Automatic purge |
| Receipt images (Cloudinary) | Per your choice | Deletable by you anytime |

**You can request deletion of your account and data anytime** via Settings → "Delete My Account." Upon deletion:
- Personal information is permanently removed
- Tax filings are anonymized (retained for 7 years per law)
- Receipt images are deleted from Cloudinary

### 6.4 Security Limitations

No system is 100% secure. While we use industry-standard protections, we cannot guarantee absolute security. **You use TaxiPoa at your own risk.**

---

## 7. THIRD-PARTY ANALYTICS & COOKIES

### 7.1 Analytics

We use **[Google Analytics / Plausible Analytics / Simple Analytics]** to understand how users interact with TaxiPoa. This service:
- Collects aggregated, anonymized data (not tied to individuals by default)
- Tracks page views, time on page, referral sources, device type
- Does NOT track personal information unless you voluntarily enter it

**How to opt-out:**
- Use your browser's privacy settings (Do Not Track)
- [If Google Analytics: Install Google Analytics Opt-Out Browser Extension]
- Contact us at [privacy@taxipoa.co.ke] to request opt-out

### 7.2 Cookies

TaxiPoa uses cookies for:

| **Cookie Type** | **Purpose** | **Duration** |
|---|---|---|
| Session cookie | Keeps you logged in | 7 days |
| Language preference | Remembers your Swahili/English choice | 1 year |
| Analytics cookie | Tracks your usage (anonymized) | 1 year |

**You can disable cookies in your browser settings,** but this may limit TaxiPoa functionality.

---

## 8. YOUR DATA RIGHTS

Under Kenya's **Data Protection Act 2019** and **GDPR**, you have the right to:

### 8.1 Right of Access
You can request a copy of your personal data. We will provide it within **14 days** in a machine-readable format (CSV/JSON).

### 8.2 Right to Rectification
You can correct inaccurate information. Update your profile anytime in Settings, or contact us for help.

### 8.3 Right to Erasure ("Right to be Forgotten")
You can request deletion of your account and personal data. We will delete it within **30 days**, except:
- Data required by Kenyan tax law (7-year retention for completed filings)
- Backup copies (which we may retain for up to 90 days)

### 8.4 Right to Data Portability
You can request your data in a standard format (CSV/JSON) to transfer to another service.

### 8.5 Right to Object
You can object to:
- Marketing emails (unsubscribe link in every email)
- Analytics tracking (via browser settings or contact us)
- Automated decision-making (we do not use automated decisions that affect you)

### 8.6 Right to Restrict Processing
You can ask us to limit how we use your data while you address a concern.

**To exercise any of these rights,** contact us at [privacy@taxipoa.co.ke] with your request. We will respond within **14 days**.

---

## 9. CHILDREN'S PRIVACY

TaxiPoa is not intended for children under 18 years old. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child under 18, we will delete it immediately.

---

## 10. INTERNATIONAL DATA TRANSFERS

Your information may be transferred to, stored in, and processed in countries outside Kenya, including:
- **United States** (Vercel, Railway, Cloudinary servers)
- **European Union** (if you access from EU; data processing complies with GDPR)

By using TaxiPoa, you consent to your data being transferred internationally. We will implement appropriate safeguards (standard contractual clauses, adequacy decisions) to protect your data.

---

## 11. RETENTION OF CRIMINAL/SENSITIVE DATA

**IMPORTANT:** TaxiPoa does NOT intentionally collect:
- Health or medical information
- Genetic data
- Biometric data
- Criminal records
- Sexual orientation or political views

If you voluntarily include such data in notes or descriptions, we will treat it as sensitive and:
- Encrypt it
- Limit access to you only
- Delete it upon request
- Not use it for any purpose other than your filing

---

## 12. CONTACT & COMPLAINTS

### 12.1 Privacy Questions
If you have questions about this Privacy Policy or how we handle your data:

**Email:** privacy@taxipoa.co.ke  
**Mailing Address:**  
TaxiPoa  
[Your Business Address]  
Nairobi, Kenya  

**Response Time:** We will respond within 14 days.

### 12.2 Data Protection Officer

[Optional: If you appoint a DPO]  
**Data Protection Officer:** [Name]  
**Email:** dpo@taxipoa.co.ke  
**Phone:** [Number]

### 12.3 Complaints to Regulators

If you believe your rights have been violated, you can lodge a complaint with:

**Kenya Data Commissioner**  
Office of the Data Protection Commissioner  
Nairobi, Kenya  
Website: www.odpc.or.ke  
Email: info@odpc.or.ke  

**GDPR (EU Users Only):**  
Your local data protection authority (e.g., ICO for UK, CNIL for France)

---

## 13. UPDATES TO THIS POLICY

We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will:
- Post the updated policy on taxipoa.co.ke
- Update the "Last Updated" date
- Notify you via email if changes significantly affect your privacy (e.g., new data sharing)

Your continued use of TaxiPoa after an update constitutes acceptance of the new policy.

---

## 14. SUMMARY OF KEY COMMITMENTS

✅ We encrypt your KRA PIN and sensitive data  
✅ We use HTTPS/TLS for all connections  
✅ We do NOT sell your data  
✅ We comply with Kenya's Data Protection Act 2019  
✅ We give you control over your data (access, delete, export)  
✅ We respond to access requests within 14 days  
✅ We delete your account data within 30 days of request (tax records retained per law)  
✅ We notify you of security breaches within 72 hours  

---

**END OF PRIVACY POLICY**
