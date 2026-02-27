# SmartNotes AI

SmartNotes AI is a modern, privacy-first, fully responsive web application that supercharges your note-taking via rich text formatting, local offline storage, and an integrated Google Gemini AI assistant. 

![SmartNotes UI](./public/favicon.svg)

## ✨ Features

- **Rich Text Editor**: Fully featured WYSIWYG editor supporting Bold, Italic, Headers, Lists, Blockquotes, and inline Image uploads.
- **AI Assistant Integration**: Chat seamlessly with Google's Gemini AI directly within your workspace without context switching.
- **Privacy First (Local Storage)**: All your notes, folders, and settings are saved securely within your browser's local storage. Not a single note touches an external database.
- **Daily Auto-Backup**: Protects you from accidental data loss by taking daily snapshot backups locally, which you can restore at any point.
- **Responsive Mobile Layout**: Beautiful, tailored slide-out sidebar layouts mimicking native mobile apps flawlessly.
- **Data Portability**: Full support to Export and Import your entire workspace via `.json` files, or download/share single notes directly.
- **Folder Management & Drag-and-Drop**: Organize effortlessly with customizable color-coded folders and drag-and-drop grid sorting.
- **Dark Mode Native**: Complete automatic adaptivity between Sleek Dark themes and Clean Light themes.

## 🚀 Getting Started

Provide a local or deployed environment. SmartNotes relies on Vite + React. 

### Prerequisites

Ensure you have Node.js installed.
- [Node.js](https://nodejs.org/)
- Need a FREE Google Gemini API Key from Google AI Studio.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/smartnotes-ai.git
   cd smartnotes-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Model**: Google Gemini API (`gemini-2.5-flash-lite`)

## 🚢 Deployment

SmartNotes is optimized to run as a purely static site. It can be hosted entirely for free on platforms like **Netlify**, **Vercel**, or **GitHub Pages**.

Make sure to add your `VITE_GEMINI_API_KEY` to the Environment Variables of your hosting provider before building!

```bash
npm run build
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/your-username/smartnotes-ai/issues).

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
