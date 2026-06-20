import uuid
import shutil
import traceback
from fastapi import APIRouter, UploadFile, File

from app.config.settings import UPLOAD_DIR, RESULT_DIR, REPORT_DIR
from app.services.detector import detector
from app.services.visualization import (
    save_detection_image, 
    create_tumor_focused_heatmap, 
    extract_yolo_detections
)
from app.services.report_generator import generate_pdf_report

router = APIRouter()


@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        file_id = str(uuid.uuid4())

        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        RESULT_DIR.mkdir(parents=True, exist_ok=True)
        REPORT_DIR.mkdir(parents=True, exist_ok=True)

        upload_path = UPLOAD_DIR / f"{file_id}.jpg"
        detection_path = RESULT_DIR / f"{file_id}_detection.jpg"
        gradcam_path = RESULT_DIR / f"{file_id}_gradcam.jpg"
        report_path = REPORT_DIR / f"{file_id}_report.pdf"

        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run YOLO detection
        results = detector.model(str(upload_path))
        
        # Extract predictions correctly
        detections = extract_yolo_detections(results, detector.model.names)

        if not detections:
            # If no detection, save original image as gradcam path and detection path
            shutil.copy(str(upload_path), str(detection_path))
            shutil.copy(str(upload_path), str(gradcam_path))
            gradcam_status = "no tumor detected"
        else:
            save_detection_image(str(upload_path), detections, str(detection_path))

            try:
                create_tumor_focused_heatmap(
                    image_path=str(upload_path),
                    detections=detections,
                    output_path=str(gradcam_path)
                )
                gradcam_status = "success"
            except Exception as e:
                gradcam_status = f"failed: {str(e)}"
                shutil.copy(str(detection_path), str(gradcam_path))

        generate_pdf_report(
            report_path=str(report_path),
            detections=detections,
            detection_img=str(detection_path),
            gradcam_img=str(gradcam_path)
        )

        # For backward compatibility with the frontend format
        # Replace 'class_id' and 'box' to match the frontend expectations:
        formatted_detections = []
        for det in detections:
            formatted_detections.append({
                "class_id": det.get("class_id", 0),
                "class_name": det["class_name"],
                "confidence": det["confidence"],
                "bbox": det["box"]
            })

        return {
            "status": "success",
            "detections": formatted_detections,
            "xai_status": gradcam_status,
            "detection_image": f"/static/results/{file_id}_detection.jpg",
            "gradcam_image": f"/static/results/{file_id}_gradcam.jpg",
            "report": f"/static/reports/{file_id}_report.pdf"
        }

    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc()
        }