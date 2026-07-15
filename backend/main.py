from __future__ import annotations
import json, shutil, uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
# -*- coding: utf-8 -*-
import sys
import shutil
from fastapi.responses import JSONResponse  # 补上这行
sys.stdout.reconfigure(encoding='utf-8')
import sys
import shutil
from fastapi import Form

ROOT = Path(__file__).parent
UPLOAD_DIR = ROOT / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED = {"images/jpeg": ".jpg", "images/png": ".png", "images/webp": ".webp"}
app = FastAPI(title="Luna Memories API")
# 跨域配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.0.37:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# 挂载图片静态资源
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=3000)
MESSAGE_FILE = ROOT / "messages.json"
try:
    messages: list[dict] = json.loads(MESSAGE_FILE.read_text(encoding="utf-8")) if MESSAGE_FILE.exists() else []
except (json.JSONDecodeError, OSError):
    messages = []
def save_messages(): MESSAGE_FILE.write_text(json.dumps(messages, ensure_ascii=False, indent=2), encoding="utf-8")
def ok(data): return {"success": True, "data": data}

@app.get("/")
def root():
    return JSONResponse(
        content={"msg":"情侣纪念网页"},
        media_type="application/json; charset=utf-8"
    )
@app.get("/api/health")
def health(): return ok({"status": "ok"})


@app.post("/api/photos")
async def upload_photo(
    file: Annotated[UploadFile, File(...)],
    text: Annotated[str, Form()] = "美好瞬间"
):
    suffix = ALLOWED.get(file.content_type, ".jpg")
    name = f"{uuid.uuid4().hex}{suffix}"
    try:
        with (UPLOAD_DIR / name).open("wb") as output:
            shutil.copyfileobj(file.file, output)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="图片保存失败") from exc

    save_text = text.strip() if text.strip() else "美好瞬间"
    new_item = {
        "id": str(uuid.uuid4()),
        "url": name,
        "text": save_text
    }

    photo_json = ROOT / "photos.json"
    photo_list = []
    if photo_json.exists():
        with open(photo_json, "r", encoding="utf-8") as f:
            photo_list = json.load(f)
    photo_list.append(new_item)
    with open(photo_json, "w", encoding="utf-8") as f:
        json.dump(photo_list, f, ensure_ascii=False, indent=2)

    return {
        "id": new_item["id"],
        "url": name,
        "text": save_text,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
@app.delete("/api/photos/{photo_id}")
def delete_photo(photo_id: str):
    path = UPLOAD_DIR / Path(photo_id).name
    if not path.exists(): raise HTTPException(404, "图片不存在")
    path.unlink(); return ok({"id": photo_id})
@app.get("/api/messages")
def list_messages(): return ok(messages)
@app.post("/api/messages")
def create_message(payload: MessageCreate):
    item = {"id": uuid.uuid4().hex, "content": payload.content.strip(), "createdAt": datetime.now(timezone.utc).isoformat()}; messages.insert(0, item); save_messages(); return ok(item)
@app.delete("/api/messages/{message_id}")
def delete_message(message_id: str):
    global messages
    old = len(messages); messages = [m for m in messages if m["id"] != message_id]
    if len(messages) == old: raise HTTPException(404, "留言不存在")
    save_messages()
    return ok({"id": message_id})
@app.get("/api/photos")
def get_photos():
    photo_file = ROOT / "photos.json"
    try:
        if not photo_file.exists():
            return []
        with open(photo_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception as e:
        print("读取照片失败:", e)
        return []