# Bazi Prompt Generator

八字Prompt生成器 - Generate formatted Bazi data for AI model prompts.

## 📄 License & Attribution

This project is based on [bazi-mcp](https://github.com/cantian-ai/bazi-mcp) by [cantian-ai](https://github.com/cantian-ai), licensed under the ISC License.

**Original Project**: https://github.com/cantian-ai/bazi-mcp

This project maintains the same ISC License. See [LICENSE](LICENSE) file for details.

## 🚀 Quick Start

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── app/              # Next.js App Router
│   ├── api/         # API routes
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Home page
│   └── globals.css  # Global styles
├── src/              # Source code
│   ├── lib/         # Bazi calculation libraries
│   └── index.ts     # Main export
├── public/           # Static assets
└── dist/             # Legacy compiled files (optional)
```

## 🛠️ Local Hosting Scripts

### Start Server
```bash
.\start-server.bat
```
Starts the Next.js development server on port 3000.

### Start with Public Access (ngrok)
```bash
.\start-public.bat
```
Starts the server and ngrok tunnel automatically.

### Start ngrok Only
```bash
.\start-ngrok.bat
```
Starts ngrok tunnel (server must be running separately).

### Start ngrok with Fixed Domain
```bash
.\start-ngrok-fixed.bat
```
Edit the file first to set your ngrok fixed domain.

## 📚 Documentation

- `NGROK_GUIDE.md` - Complete guide for using ngrok
- `PUBLIC_ACCESS.md` - Methods to make your website publicly accessible

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run dev:legacy` - Run legacy Express server
- `npm run tunnel` - Start ngrok tunnel

## 📦 Requirements

- Node.js 18.17 or higher
- npm

