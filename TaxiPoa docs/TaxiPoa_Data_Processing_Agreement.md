# DATA PROCESSING AGREEMENT (DPA)
## TaxiPoa & Third-Party Service Providers

**Effective Date:** [INSERT DATE OF LAUNCH]  
**Last Updated:** [INSERT DATE]

---

## 1. INTRODUCTION

This Data Processing Agreement ("DPA") governs how TaxiPoa ("Data Controller") and our third-party service providers ("Data Processors") handle personal data.

**Applicable Law:**
- Kenya Data Protection Act, 2019
- General Data Protection Regulation (GDPR) — for EU/UK users
- Standard Contractual Clauses (for EU/US transfers)

---

## 2. DEFINITIONS

| **Term** | **Definition** |
|---|---|
| **Data Controller** | TaxiPoa — decides how and why personal data is processed |
| **Data Processor** | Third-party service (e.g., Neon.tech, Railway, Vercel) — processes data on our behalf |
| **Personal Data** | Any information about a TaxiPoa user (name, email, KRA PIN, income, etc.) |
| **Processing** | Any operation on data (collect, store, encrypt, delete, analyze, share) |
| **Sub-Processor** | A processor's sub-contractor (e.g., AWS hosting Neon.tech's database) |

---

## 3. SCOPE

This DPA applies to all personal data processed through TaxiPoa, specifically:

| **Processor** | **Data Processed** | **Purpose** | **Location** |
|---|---|---|---|
| **Neon.tech** | Database (encrypted) containing account info, tax filings, income, expenses | Data storage & backup | US (PostgreSQL servers) |
| **Railway.app** | Application logs, error traces, API requests/responses | API hosting, debugging | US (hosting infrastructure) |
| **Vercel** | Session cookies, browser logs, analytics events | Frontend hosting, performance monitoring | US, EU (CDN distributed) |
| **Cloudinary** | Receipt images (optional uploads) | File storage | US (distributed globally) |
| **Africa's Talking** | Phone numbers, SMS content, delivery status | SMS reminder delivery | Kenya/Africa |
| **Nodemailer + Gmail/Resend** | Email addresses, message content, send logs | Email reminder delivery | US (Gmail), US (Resend) |
| **Google Analytics / Plausible** | Aggregated user behavior (page views, time on page, device type) | Analytics & performance | US (Google), EU (Plausible) |

---

## 4. ROLES & RESPONSIBILITIES

### 4.1 TaxiPoa as Data Controller

**We are responsible for:**
- Determining what data is collected and why
- Ensuring users consent to data collection (privacy policy)
- Responding to user data access/deletion requests
- Implementing data protection policies
- Instructing processors on data use
- Conducting due diligence on processors

### 4.2 Service Providers as Data Processors

**They are responsible for:**
- Processing data only per our written instructions
- Maintaining confidentiality of user data
- Implementing technical & organizational security measures
- Not using data for their own purposes (except as needed for service delivery)
- Notifying us of data breaches within 72 hours
- Cooperating with us on data subject requests (access, deletion)
- Deleting or returning data when we no longer need it

### 4.3 Our Legal Authority

By using TaxiPoa, you authorize us to:
- Store your personal data with the processors listed above
- Transfer data internationally (to US & EU servers)
- Encrypt, process, and analyze your data
- Share your data with sub-processors (e.g., AWS) to deliver the service

---

## 5. DATA TRANSFERS TO US/EU (STANDARD CONTRACTUAL CLAUSES)

### 5.1 GDPR Compliance (EU/UK Users)

If you access TaxiPoa from the EU/UK:
- Your personal data is transferred to US-based servers (Neon.tech, Railway, Vercel)
- This transfer is authorized under **Standard Contractual Clauses (SCCs)**
- TaxiPoa has signed SCCs with all US processors
- SCCs provide legal safeguards equivalent to GDPR protection

### 5.2 Personal Data Transfers Under Kenya DPA

Kenya DPA does NOT prohibit transfers to the US. However, we implement:
- **Data minimization** — Only collect data necessary for tax filing
- **Encryption** — KRA PIN and sensitive data encrypted (AES-256)
- **Access controls** — Only you and TaxiPoa staff can view your data
- **Contracts** — All processors have data processing agreements

---

## 6. DATA SECURITY MEASURES

### 6.1 Technical Measures

| **Security Control** | **Implementation** |
|---|---|
| **Encryption at rest** | AES-256-CBC for KRA PIN; database encryption on Neon.tech |
| **Encryption in transit** | HTTPS/TLS 1.2+ for all connections |
| **Authentication** | Email + bcrypt-hashed password; JWT tokens (7-day expiry) |
| **Access control** | Role-based; only you see your data |
| **Audit logging** | Access to sensitive data logged & monitored |
| **Backup** | Daily encrypted backups; 90-day retention |
| **Intrusion detection** | Railway & Vercel provide DDoS protection & intrusion detection |

### 6.2 Organizational Measures

| **Measure** | **Details** |
|---|---|
| **Staff training** | All TaxiPoa staff trained on data protection & confidentiality |
| **Need-to-know** | Only staff with legitimate business need access data |
| **Confidentiality agreements** | All staff sign non-disclosure agreements (NDAs) |
| **Incident response** | Breach response plan in place; users notified within 72 hours |
| **Vendor management** | Regular audits of processor security & compliance |
| **Insurance** | Cyber liability insurance in place (details upon request) |

### 6.3 Limitations

No system is 100% secure. We cannot guarantee:
- Protection against zero-day exploits
- Protection against insider threats (malicious employees)
- Recovery from catastrophic data loss
- Protection if your password is compromised by you

---

## 7. DATA RETENTION & DELETION

### 7.1 Retention Schedule

| **Data Type** | **Retention Period** | **Reason** |
|---|---|---|
| **Account information** | While active, then 30 days | For service delivery & legal hold |
| **Tax filings (completed)** | 7 years | Kenya tax law requirement (audits) |
| **Tax filings (draft)** | 2 years of inactivity | User convenience; auto-delete inactive |
| **Expense receipts** | Per user choice | User-owned data; can delete anytime |
| **Session logs** | 90 days | Security monitoring |
| **SMS/email logs** | 1 year | Delivery verification & support |
| **Backup copies** | 90 days | Disaster recovery |

### 7.2 User Deletion Rights

You can request account deletion anytime via Settings → "Delete My Account."

**What we delete:**
- Account profile (name, email, phone)
- Password & authentication tokens
- Personal settings & preferences
- Receipt images (from Cloudinary)
- Session logs & activity history

**What we do NOT delete (per law):**
- Completed tax filings (7-year legal retention)
- Anonymized analytics data

**Timeline:** Deletion completes within **30 days**.

### 7.3 Processor Data Deletion

When you delete your account, we instruct all processors to delete your data:
- **Neon.tech:** Deletes database records within 30 days
- **Railway:** Purges logs within 30 days
- **Vercel:** Clears cookies & analytics within 7 days
- **Cloudinary:** Deletes receipts within 24 hours
- **Africa's Talking:** SMS logs deleted per their policy (contact them)
- **Gmail/Resend:** Email logs deleted per their policy

---

## 8. SUB-PROCESSORS

### 8.1 Authorized Sub-Processors

Our primary processors may use sub-processors:

| **Processor** | **Sub-Processor** | **Service** |
|---|---|---|
| **Neon.tech** | AWS, Terraform Cloud | Database infrastructure, compute |
| **Railway.app** | AWS, CloudFlare | Hosting, DDoS protection |
| **Vercel** | Cloudflare, AWS | CDN, hosting |
| **Google Analytics** | Google Cloud | Data analysis, storage |

### 8.2 Right to Object

If you object to a specific sub-processor, contact us at privacy@taxipoa.co.ke. We will:
- Review your objection within **14 days**
- Attempt to find an alternative if feasible
- Discuss workarounds with you

---

## 9. DATA SUBJECT RIGHTS

### 9.1 Your Rights (Under Kenya DPA & GDPR)

**You have the right to:**

#### Right of Access (Article 15 / Section 47, Kenya DPA)
- Request a copy of your personal data in machine-readable format (CSV, JSON)
- We will provide within **14 days**

#### Right to Rectification (Article 16 / Section 49, Kenya DPA)
- Correct inaccurate data
- Update via Settings anytime, or contact us

#### Right to Erasure (Article 17 / Section 50, Kenya DPA)
- Request deletion of your personal data
- We will delete within **30 days** (except legally-required retention)

#### Right to Data Portability (Article 20 / Section 47(3), Kenya DPA)
- Request your data in standard format for transfer to another service
- We will provide within **14 days**

#### Right to Restrict Processing (Article 18 / Section 48, Kenya DPA)
- Ask us to limit how we use your data while resolving a concern
- We will comply within **14 days**

#### Right to Object (Article 21 / Section 56, Kenya DPA)
- Object to marketing emails (unsubscribe anytime)
- Object to analytics tracking (contact privacy@taxipoa.co.ke)

#### Right to Withdraw Consent (Section 68, Kenya DPA)
- If we rely on your consent, you can withdraw it anytime
- Withdrawal does not affect lawfulness of past processing

### 9.2 How to Exercise Rights

**Email:** privacy@taxipoa.co.ke  
**Subject:** "Data Subject Request — [Type: Access / Deletion / Portability / etc.]"  
**Include:**
- Your full name
- Email address associated with account
- Specific request (what data, why)
- Any supporting documentation

**Response time:** We will respond within **14 days** (extendable to 30 days for complex requests).

---

## 10. DATA BREACH NOTIFICATION

### 10.1 If There's a Breach

If we discover a breach of your personal data (unauthorized access, encryption compromise, etc.):

**We will:**
1. Investigate the breach within **72 hours**
2. Notify **KRA's Office of Data Protection Commissioner** (if required under Kenya DPA)
3. Notify **you directly** via email (if risk is high)

**Notification will include:**
- Date/time of breach
- Data affected (types of information)
- Likely consequences
- Steps we took to contain & investigate
- Your rights (access, deletion, etc.)

### 10.2 Low-Risk Breaches

If the risk to you is minimal (e.g., backup file found in dumpster, immediately recovered), we may notify you together with our investigation report.

---

## 11. INTERNATIONAL DATA TRANSFERS

### 11.1 Where Your Data Goes

| **Data** | **Destination** | **Processor** | **Safeguard** |
|---|---|---|---|
| Account info, tax filings | US | Neon.tech, Railway | DPA + encryption |
| Frontend/analytics | US, EU (Vercel CDN) | Vercel, Cloudflare | DPA + encryption |
| Receipts | US (globally cached) | Cloudinary | DPA + encryption |
| SMS | Kenya/Africa | Africa's Talking | Data Processing Agreement |
| Email | US | Gmail/Resend | DPA + encryption |

### 11.2 Your Consent

By using TaxiPoa, you explicitly consent to international transfers. If you do not consent, you must not use the Service.

---

## 12. COMPLIANCE & AUDITS

### 12.1 Regular Audits

We conduct quarterly reviews of:
- Processor compliance with this DPA
- Security incident logs
- Data protection incident reports
- User data request fulfillment

### 12.2 Processor Audits

We may request security certifications/audits from processors:
- **ISO 27001** (Information Security Management)
- **SOC 2 Type II** (Security & availability controls)
- **PCI DSS** (if processing payments in future)

### 12.3 Your Right to Audit

If you have concerns about our data handling, you can request an audit. We will:
- Grant you limited access to audit relevant practices
- Respond to detailed questionnaires
- Cooperate with third-party auditors (you pay audit costs)

---

## 13. CONTROLLER-TO-CONTROLLER TRANSFERS

### 13.1 If You Share Data With Third Parties

If you export your TaxiPoa data and share it with an accountant or advisor:
- **TaxiPoa is no longer responsible** for how they handle it
- That third party becomes a separate Data Controller
- You should sign a separate DPA with them

---

## 14. AMENDMENTS TO THIS DPA

### 14.1 Changes by TaxiPoa

We may amend this DPA to:
- Reflect changes in law
- Add/remove processors
- Improve security measures

**We will:**
- Email you about significant changes (30 days' notice)
- Post updates here
- Allow you to reject changes (deletion is an option)

### 14.2 Changes by Processors

If a processor changes its practices materially, we will:
- Notify you within **14 days**
- Evaluate alternative processors if needed

---

## 15. DISPUTE RESOLUTION

### 15.1 Processor Disputes

If you have a complaint about how a processor handles your data:

1. **Contact us first:** privacy@taxipoa.co.ke (we may be able to resolve)
2. **Contact the processor directly:** [Processor contact info]
3. **File a complaint:** Kenya's Office of Data Protection Commissioner (www.odpc.or.ke)

### 15.2 TaxiPoa Disputes

See Section 16 of our **Terms of Service** (mediation & arbitration).

---

## 16. THIRD-PARTY BENEFICIARIES

This DPA is between TaxiPoa and our service providers. **You, as a user, are a third-party beneficiary** with the right to enforce data protection obligations if we or a processor breaches this DPA.

---

## 17. SUMMARY OF KEY COMMITMENTS

✅ All your personal data is encrypted in transit & at rest  
✅ We use only reputable, security-conscious processors  
✅ We comply with Kenya DPA 2019 & GDPR (where applicable)  
✅ You can access, correct, delete, or export your data anytime  
✅ We notify you of data breaches within 72 hours  
✅ Tax filings are retained 7 years per law, then deleted  
✅ We delete your account & personal data within 30 days of request  
✅ We do NOT sell your data to third parties  

---

## 18. CONTACT & COMPLAINTS

**Data Protection Questions:**  
Email: privacy@taxipoa.co.ke  
Response time: 14 days  

**Complaints to Regulators:**  
Office of the Data Protection Commissioner (Kenya)  
www.odpc.or.ke  
info@odpc.or.ke  

**GDPR (EU/UK Users):**  
Your local data protection authority  
(e.g., ICO for UK, CNIL for France)

---

**END OF DATA PROCESSING AGREEMENT**

---

## PROCESSOR-SPECIFIC CONTACT INFORMATION

### For Your Reference

| **Processor** | **Contact** | **Privacy Policy** | **DPA** |
|---|---|---|---|
| **Neon.tech** | support@neon.tech | https://neon.tech/privacy | Available upon request |
| **Railway.app** | support@railway.app | https://railway.app/privacy | Available upon request |
| **Vercel** | support@vercel.com | https://vercel.com/legal/privacy | Available upon request |
| **Cloudinary** | support@cloudinary.com | https://cloudinary.com/privacy | Available upon request |
| **Africa's Talking** | support@africastalking.com | https://africastalking.com/privacy | Available upon request |
| **Google Analytics** | analytics-support@google.com | https://policies.google.com/privacy | Google DPA available |
| **Resend** | support@resend.com | https://resend.com/legal/privacy | Available upon request |

---

## ACKNOWLEDGMENT

By using TaxiPoa, you acknowledge that you have read and agree to this Data Processing Agreement.

If you have questions or concerns, please contact privacy@taxipoa.co.ke before using the Service.
