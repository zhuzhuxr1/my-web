# Luna Memories

## Run

```powershell
# terminal 1
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# terminal 2 (project root)
npm install
npm run dev
```

Open `http://localhost:3000`. The frontend targets `http://127.0.0.1:8000` by default; override it with `VITE_API_URL` when deploying.

## API

- `POST /api/photos` — multipart field `file`, jpg/png/webp only
- `DELETE /api/photos/{photo_id}`
- `GET /api/messages`
- `POST /api/messages` — `{ "content": "..." }`
- `DELETE /api/messages/{message_id}`

Photos are saved under `backend/uploads/`; messages persist in `backend/messages.json`.
