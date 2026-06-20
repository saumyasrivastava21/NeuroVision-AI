from ultralytics import YOLO
from app.config.settings import MODEL_PATH, CONF_THRESHOLD


class TumorDetector:
    def __init__(self):
        self.model = YOLO(str(MODEL_PATH))

    def predict(self, image_path: str):
        results = self.model(image_path, conf=CONF_THRESHOLD)

        detections = []

        for box in results[0].boxes:
            detections.append({
                "class_id": int(box.cls[0]),
                "class_name": self.model.names[int(box.cls[0])],
                "confidence": float(box.conf[0]),
                "bbox": [float(x) for x in box.xyxy[0].tolist()]
            })

        return results, detections


detector = TumorDetector()