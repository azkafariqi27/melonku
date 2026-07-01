from base64 import b64encode
from io import BytesIO
from pathlib import Path
from typing import Dict, List

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageDraw, ImageFont
from ultralytics import YOLO


MODEL_PATH = Path(__file__).with_name("best.pt")
IMAGE_SIZE = 416

NAMA_KELAS: Dict[int, str] = {
    0: "Daun Sehat",
    1: "Layu Fusarium",
    2: "Keriting Daun",
    3: "Bercak Kuning",
}

REKOMENDASI: Dict[str, str] = {
    "Daun Sehat": "Lanjutkan perawatan rutin dan pemantauan berkala minimal 2x seminggu.",
    "Layu Fusarium": "Cabut tanaman terinfeksi, perbaiki drainase, aplikasikan fungisida sistemik Carbendazim.",
    "Keriting Daun": "Kendalikan kutu daun/thrips dengan insektisida sistemik, gunakan mulsa plastik perak.",
    "Bercak Kuning": "Kurangi kelembaban, aplikasikan fungisida Mankozeb, perbaiki sirkulasi udara greenhouse.",
}

BOX_COLORS: Dict[str, str] = {
    "Daun Sehat": "#43A047",
    "Layu Fusarium": "#D32F2F",
    "Keriting Daun": "#FFC107",
    "Bercak Kuning": "#FFC107",
}


app = FastAPI(title="MelonKu API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO(str(MODEL_PATH))


@app.get("/")
def root():
    return {"status": "ok", "model": "MelonKu YOLOv8n"}


@app.post("/deteksi")
async def deteksi(
    file: UploadFile = File(...),
    confidence: float = Form(0.5),
):
    if not 0 <= confidence <= 1:
        raise HTTPException(status_code=400, detail="confidence harus berada di rentang 0 sampai 1")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="file harus berupa gambar")

    try:
        image_bytes = await file.read()
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="gambar tidak dapat dibaca") from exc

    results = model.predict(source=image, conf=confidence, imgsz=IMAGE_SIZE, verbose=False)
    detections: List[dict] = []
    annotated = image.copy()
    draw = ImageDraw.Draw(annotated)

    for result in results:
        for box in result.boxes:
            cls_id = int(box.cls[0])
            class_name = NAMA_KELAS.get(cls_id, result.names.get(cls_id, f"Kelas {cls_id}"))
            conf = round(float(box.conf[0]), 4)
            bbox = [round(float(value), 1) for value in box.xyxy[0].tolist()]

            detections.append(
                {
                    "kelas": class_name,
                    "confidence": conf,
                    "bbox": bbox,
                }
            )
            draw_box(draw, bbox, class_name, conf)

    buffer = BytesIO()
    annotated.save(buffer, format="JPEG", quality=92)
    encoded_image = b64encode(buffer.getvalue()).decode("utf-8")

    recommendation = build_recommendation(detections)

    return {
        "jumlah_deteksi": len(detections),
        "hasil": detections,
        "gambar_hasil": encoded_image,
        "rekomendasi": recommendation,
    }


def draw_box(draw: ImageDraw.ImageDraw, bbox: List[float], class_name: str, confidence: float) -> None:
    x1, y1, x2, y2 = bbox
    color = BOX_COLORS.get(class_name, "#2E7D32")
    label = f"{class_name} {confidence * 100:.0f}%"

    for offset in range(3):
        draw.rounded_rectangle(
            [x1 - offset, y1 - offset, x2 + offset, y2 + offset],
            radius=4,
            outline=color,
            width=1,
        )

    font = ImageFont.load_default()
    label_bbox = draw.textbbox((x1, y1), label, font=font)
    label_width = label_bbox[2] - label_bbox[0] + 12
    label_height = label_bbox[3] - label_bbox[1] + 8
    label_top = max(0, y1 - label_height - 4)

    draw.rounded_rectangle(
        [x1, label_top, x1 + label_width, label_top + label_height],
        radius=4,
        fill=color,
    )
    draw.text((x1 + 6, label_top + 4), label, fill="#FFFFFF", font=font)


def build_recommendation(detections: List[dict]) -> str:
    if not detections:
        return "Tidak ada objek yang terdeteksi. Coba gunakan foto daun yang lebih jelas, terang, dan memenuhi area gambar."

    unique_classes = []
    for item in sorted(detections, key=lambda value: value["confidence"], reverse=True):
        if item["kelas"] not in unique_classes:
            unique_classes.append(item["kelas"])

    return " ".join(REKOMENDASI.get(class_name, "") for class_name in unique_classes).strip()
