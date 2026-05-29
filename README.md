# GPTai

GPTai is a chat application with a React frontend and an Express/MongoDB backend that forwards prompts to Gemini.

## Project Structure

- `Backend/` - Express API, MongoDB models, and Gemini integration
- `Frontend/` - Vite + React UI

## Environment Variables

Backend:

- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB_NAME` - Optional explicit MongoDB database name. If omitted and the URI has no database path, the backend uses `gptai_local` outside production and `gptai_prod` in production.
- `GEMINI_API_KEY` - Google Gemini API key
- `PORT` - Server port, defaults to `8080`
- `CORS_ORIGIN` - Optional comma-separated list of allowed frontend origins

Frontend:

- `VITE_API_URL` - Optional backend base URL for production

## Local Development

Install dependencies:

```bash
cd Backend
npm install
cd ../Frontend
npm install
```

Run the backend:

```bash
cd Backend
npm run dev
```

Run the frontend:

```bash
cd Frontend
npm run dev
```

## Production Notes

- The frontend uses `VITE_API_URL` when it is set.
- If `VITE_API_URL` is not set, the app falls back to the current host in production and `http://localhost:8080` in local development.
- The backend serves the built frontend from `Frontend/dist` when `NODE_ENV=production`.
- To keep local and live data separate, use a different `MONGODB_DB_NAME` or a different MongoDB URI per environment.
