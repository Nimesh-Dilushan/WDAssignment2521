# ⚡ Apex Iron Portal - Gym Membership & Workout Tracker

[cite_start]Welcome to the Apex Iron Portal, a dynamic, full-stack Progressive Web Application (PWA) built as part of the COMP50075 Web Development module at the University of Staffordshire[cite: 1, 37].

---

## 🔗 Live Production Deployment
Live Hosted URL: https://webassignment-11507.web.app/
GitHub Repository URL: 
[cite_start] Production Build Status: Deployed via Firebase Hosting with full HTTPS Security.

---

## 🛠️ Core Technology Stack
[cite_start] Frontend Library: React (v18+) using the Vite Toolchain [cite: 9]
[cite_start] Styling Framework: Tailwind CSS (Mobile-First Utility Approach) [cite: 9, 66]
[cite_start] Backend Infrastructure: Google Firebase Services (Cloud Firestore BaaS + Firebase Auth) [cite: 9]
[cite_start] PWA Engine: Background Service Worker (sw.js) + Native Web Manifest App Configuration [cite: 75]

---

## 🚀 Local Installation & Setup Instructions

[cite_start]Follow these step-by-step configuration instructions to run and audit this application locally on your machine:

### 1. Clone the Public Repository
```bash
git clone [https://github.com/Nimesh-Dilushan/WDAssignment2521]
cd WDAssignment2521

2. Install Project Dependencies Run the standard package installation command to pull down all necessary node modules:
Bash npm install

3. Environment Variable Configuration: Create a secure local configuration file named .env in the root of your project directory: 


VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

(Note: Secure API configuration keys are kept hidden from public version control using strict structural rules within our .gitignore file to ensure security best practices). 

 4. Launch the Local Development ServerBoot up the local Vite development network layer by executing:
Bash


npm run dev
Open your web browser and navigate to the displayed local network address (typically http://localhost:5173) to test the dashboard workspace interface locally.

5. Compile the Production Build Target To compile and bundle static optimized files for production deployment into the /dist directory:

Bash npm run build

### Update Your GitHub

Once you save the changes to the file, run these three simple commands in your terminal to overwrite the old text on GitHub with your new, professional layout:

```bash
git add README.md
git commit -m "docs: update default readme with assignment instructions"
git push origin main