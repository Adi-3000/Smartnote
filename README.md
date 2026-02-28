<div align="center">
  <h1>🧠 SmartNotes AI</h1>
  <p><strong>A beautifully designed, privacy-first, agentic AI workspace that combines local storage with advanced cloud synchronization and artificial intelligence.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-19-blue.svg" alt="React" />
    <img src="https://img.shields.io/badge/Vite-latest-purple.svg" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-latest-38B2AC.svg" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Gemini%20AI-Integration-orange.svg" alt="Gemini" />
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
  </p>
</div>

---

## 🌟 Overview

**SmartNotes AI** is more than just a note-taking app; it's a proactive, intelligent personal workspace. Built with an offline-first architecture, it ensures your data remains yours while extending its capabilities with Google Drive sync and state-of-the-art AI integration. 

Say goodbye to manual organization—let the integrated **Agentic AI Assistant** automatically title your notes, suggest tags, create folders, and seamlessly manage your workspace for you.

---

## ✨ Key Features

### 🤖 Agentic AI Integration
- **Autonomous Workspace Manager**: Powered by **Gemini 2.5 Flash Lite** (with Puter.js fallback). Simply tell the assistant to "Tag all my meeting notes", "Create a Work folder and move related notes", or "Filter out my travel ideas", and it performs precise JSON-based actions directly on your workspace.
- **Smart Auto-Titling**: Start typing, and the AI intelligently analyzes your content to automatically generate a concise title after you pause.
- **Context-Aware Chat**: Converse with the AI about the contents of your notes. The assistant has full context of your last 40 notes and folders.

### 📝 Advanced Editing & Organization
- **Rich Text Editing**: Clean, distraction-free editor supporting inline tags, formatting, lists, and quotes.
- **Drag & Drop Reordering**: Easily reorganize notes on your main grid simply by dragging them.
- **Dynamic Tag Management**: Use inline `#tags` anywhere in your text, which then populate a centralized sidebar filter list for instant searching.
- **Pinning & Selection**: Pin important notes to keep them at the top, or select multiple notes to move, delete, or share them in bulk.
- **Custom Folders**: Create, color-code, and manage endless custom folders to store specific notes.

### ✅ Integrated Task Board
- **Global Checklists**: A dedicated "Task Board" view automatically scans all notes for checkboxes, aggregating every task into one master to-do list.

### 🚀 Cloud Sync & Backup Strategy
- **Local-First & Offline Capable**: All notes securely stored via LocalStorage. Progressive Web App (PWA) compatible so you can run it offline like a native desktop/mobile app.
- **Google Drive Integration**: Secure manual and **hourly auto-backups** to your linked Google Drive account.
- **Smart Restore**: Intelligently merge or overwrite local data with Google Drive backups seamlessly.
- **Flexible Exports**: Export selected notes or your full library to **JSON, Markdown (MD), Plain Text (TXT), or PDF**. Share via the native system dialog.

### 🎨 Premium UI/UX Design
- **Sleek Aesthetic**: A modern interface featuring subtle glassmorphism, responsive grid layouts, and interactive micro-animations.
- **Dark & Light Mode**: Seamlessly toggle between eye-friendly dark mode themes and crisp light mode environments.
- **Live Preview Cards**: Note cards display accurate previews of formatting directly on the dashboard.

---

## 💻 Technology Stack

- **Frontend Framework**: React 19 (via Vite)
- **Styling**: Vanilla CSS + Tailwind CSS (via PostCSS)
- **Icons**: Lucide React
- **AI/LLM**: Google Gemini API (`generativelanguage.googleapis.com`) & Puter.js SDK
- **Backend/Cloud**: Google Drive API v3 (OAuth2 Client)
- **Exports**: `html2pdf.js` & `turndown`

---

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or newer)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smartnotes-ai.git
cd smartnotes-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

You need API credentials from Google for both Gemini AI and Google Drive sync. Create a `.env` file in the root of your project:

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY="your_gemini_api_key_here"

# Google Cloud OAuth 2.0 Client ID (For Google Drive Sync)
VITE_GOOGLE_CLIENT_ID="your_google_oauth_client_id_here"
```
> **Note:** To enable Drive sync, your Google Cloud Console project must have the Google Drive API enabled and your Authorized JavaScript origins configured for your localhost/production URL.

### 4. Run the Development Server

```bash
npm run dev
```

Your app should now be running locally at `http://localhost:5173`.

---

## 📖 Usage Guide

- **Creating a Note**: Click the overarching "New Note" or "Add Task" buttons on the dashboard to get started. 
- **Auto-Titling**: Leave the title as "Untitled Note...", and once you've typed a few sentences, wait 3 seconds—the AI will title it automatically.
- **Using the AI Assistant**: Click the floating "Sparkles" button (or the AI sidebar icon) to open the chat. Type instructions like `"Make a 'Receipts' folder and move note XYZ into it"`.
- **Syncing to Drive**: Open Settings and click "Connect to Google Drive". Once authenticated, you can enable auto-sync or manually push updates.
- **Exporting**: Select one or more notes (long-press/click checkboxes), then click the "Share" button to choose your export format (PDF, Markdown, etc.).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built for speed, privacy, and true AI productivity. 🚀</p>
</div>
