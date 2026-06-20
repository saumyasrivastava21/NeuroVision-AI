from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime


def generate_pdf_report(report_path, detections, detection_img, gradcam_img):
    c = canvas.Canvas(report_path, pagesize=A4)

    width, height = A4

    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 50, "Explainable Brain Tumor Detection Report")

    c.setFont("Helvetica", 11)
    c.drawString(50, height - 80, f"Generated At: {datetime.now()}")

    y = height - 120

    if detections:
        for i, det in enumerate(detections):
            c.drawString(50, y, f"Detection {i + 1}")
            y -= 20
            c.drawString(70, y, f"Class: {det['class_name']}")
            y -= 20
            c.drawString(70, y, f"Confidence: {det['confidence']:.4f}")
            y -= 20
            c.drawString(70, y, f"Bounding Box: {det.get('bbox', det.get('box'))}")
            y -= 40
    else:
        c.drawString(50, y, "No tumor detected.")
        y -= 40

    c.drawString(50, y, "Detection Image:")
    y -= 220
    c.drawImage(detection_img, 50, y, width=220, height=180)

    c.drawString(300, y + 200, "Grad-CAM Explanation:")
    c.drawImage(gradcam_img, 300, y, width=220, height=180)

    c.save()

    return report_path