# 🧠 AI Chat App (Next.js + n8n + Grok)

A lightweight AI chat application inspired by ChatGPT / Perplexity that allows users to ask questions and receive intelligent responses powered by Grok via n8n workflows.

---

## 🚀 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend / AI Layer
- n8n (workflow automation)
- Grok (LLM for generating responses)
- Webhooks (communication between frontend and n8n)

### Deployment
- Vercel (frontend)
- Docker (n8n)

---

## 🧩 Architecture Overview

```
User Input (Next.js UI)
↓
POST /api/chat
↓
n8n Webhook (http://localhost:5678/webhook/chat)
↓
Grok LLM (via n8n)
↓
n8n processes response
↓
Return JSON response
↓
Next.js renders formatted output
```

---

## ✨ Features

- 💬 Chat-style interface (Enter to send, Shift+Enter for newline)
- 🎨 Light / Dark mode toggle
- ⚡ Fast, responsive UI with Tailwind CSS
- 🧠 AI-powered responses via Grok
- 🔄 n8n workflow automation for AI orchestration
- 📦 Clean formatting (**bold**, paragraphs, line breaks)
- 📜 Auto-scroll to latest message

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-chat-app.git
cd ai-chat-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Next.js App

```bash
npm run dev
```

App runs at: http://localhost:3000

### 4. Set Up n8n (Docker)

Make sure Docker is installed, then run:

```bash
docker run -it --rm \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=password \
  n8nio/n8n
```

n8n will be available at: http://localhost:5678

### 5. Configure n8n Workflow

Create a workflow with:

- **Webhook Node**
  - Method: `POST`
  - Path: `/chat`
- **Grok / AI Node**
  - Pass user input into the LLM
  - Generate response
- **Response Node** — return JSON:

```json
{
  "reply": "AI response here"
}
```

### 6. Connect Frontend to n8n

Ensure your API route (`/api/chat`) sends requests to:

```
http://localhost:5678/webhook/chat
```

---

## 📡 API Example

**Request**

```http
POST /api/chat
Content-Type: application/json

{
  "message": "Explain React useEffect simply"
}
```

**Response**

```json
{
  "reply": "useEffect is a React hook that..."
}
```

---

## 📁 Project Structure

```
/app
  /components
    Chat.tsx
  /api
    /chat
      route.ts
/public
/styles
```

---

## 🎨 UI Behavior

- Press **Enter** → Send message
- Press **Shift + Enter** → New line
- AI responses support:
  - `**bold**` formatting
  - Paragraph spacing
  - Line breaks

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
vercel
```

- Configure environment variables
- Update API endpoint to your deployed n8n instance

### n8n Deployment Options

- Docker (recommended)
- n8n Cloud
- VPS (AWS, DigitalOcean, etc.)

Ensure the webhook is publicly accessible:

```
https://your-n8n-instance.com/webhook/chat
```

---

## 🔐 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5678/webhook/chat
```

---

## ⚠️ Notes

- Configure CORS properly in n8n
- Do not expose unsecured n8n instances publicly
- Use authentication for production workflows
- Consider rate limiting for API routes

---

## 📈 Future Improvements

- Streaming responses (real-time typing effect)
- Chat history persistence (database)
- Authentication (user sessions)
- Multi-model support (OpenAI, Anthropic, etc.)
- Prompt templates / system instructions
- Vector search (RAG)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

MIT

---

## 💡 Overview

This project demonstrates how to combine a modern frontend (Next.js) with workflow automation (n8n) and LLM capabilities (Grok) to build a simple but powerful AI-powered application.