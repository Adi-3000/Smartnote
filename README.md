# 🧠 SmartNotes AI

Welcome to **SmartNotes AI**, a beautifully designed, highly functional workspace combining native local speed with advanced Cloud Synchronization and Artificial Intelligence!

![SmartNotes AI](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/book.svg)

## ✨ Core Features

### 🚀 Google Drive Cloud Synchronization
Experience ultra-fast, cross-device compatibility directly from your own personal Google Account! 
- **Auto-Syncing**: When connected, SmartNotes silently backs up your entire workspace natively to your Drive every 60 minutes.
- **Intelligent Restoration**: Re-installing or shifting to your mobile phone? Click *Restore Backup* from Settings! Choose between:
  - **Clean Slate**: Overwrite your local cache strictly to what you uploaded.
  - **Merge Backup**: Flawlessly inject only the missing files without deleting any newly created notes currently in your browser cache!

### 🤖 Gemini AI Assistant
A context-aware smart companion powered by Google Gemini. Just pop open the right-side sliding drawer and fire away.
- It actively reads your active text and can summarize or rewrite your complex thoughts.
- Fast, secure markdown rendering.

### 📝 Next-Gen Rich Text Editor
Write without limitations using a hyper-modern clean layout:
- Supports formatting, block-quotes, images, lists, and headings natively.
- Drag-and-drop the resulting note cards around your customizable grid screen.

### 🔒 Privacy-First Architecture
This app **has no database**. 
Your data stays entirely on your physical storage disk within your local browser cache (`localStorage`) unless you explicitly hit the "Backup to Drive" button. 

---

## 💻 Tech Stack
- Frontend Framework: **Vite** + **React 19**
- Styling: **Tailwind CSS v4** + Custom CSS Animations
- Icons: **Lucide React**
- AI Backend: **Google Gemini API** (`@google/generative-ai`)
- Cloud Connect: **Google Identity Services + Drive API v3**

---

## 🛠️ Installation & Setup

Want to run SmartNotes AI on your own machine? 

### 1️⃣ Clone & Install
\`\`\`bash
git clone https://github.com/your-username/smartnotes-ai.git
cd smartnotes-ai
npm install
\`\`\`

### 2️⃣ Setting Up Environment Variables
Create a `.env` file at the exact root of your directory with the following configuration:

\`\`\`env
# Optional: Get from Google AI Studio
VITE_GEMINI_API_KEY="your-gemini-key-here"

# Optional: Get from Google Cloud Console -> APIs & Services -> Credentials
VITE_GOOGLE_CLIENT_ID="your-oauth-web-client-id-here.apps.googleusercontent.com"
\`\`\`

*(Note: To get the Google Client ID, head to Google Cloud, create an OAuth 2.0 Client ID for a **Web Application**, and add `http://localhost:5173` into the Authorized JavaScript Origins block).*

### 3️⃣ Run Locally
\`\`\`bash
npm run dev
\`\`\`
The beautiful app should launch instantly at \`http://localhost:5173\`! Enjoy your new private workspace.

---

Built meticulously using bleeding-edge React architectures!
