import cv2
import numpy as np

def extract_yolo_detections(results, class_names):
    detections = []

    if not results:
        return detections

    result = results[0]

    if result.boxes is None:
        return detections

    for box in result.boxes:
        xyxy = box.xyxy[0].detach().cpu().numpy().tolist()
        cls_id = int(box.cls[0].detach().cpu().item())
        conf = float(box.conf[0].detach().cpu().item())

        detections.append({
            "class_id": cls_id,
            "class_name": class_names.get(cls_id, str(cls_id)) if isinstance(class_names, dict) else str(cls_id),
            "confidence": conf,
            "box": xyxy
        })

    return detections


def save_detection_image(image_path, detections, save_path):
    image = cv2.imread(str(image_path))
    if image is None:
        raise ValueError(f"Could not read image: {image_path}")

    for det in detections:
        x1, y1, x2, y2 = map(int, det["box"])
        conf = float(det.get("confidence", 0.0))
        class_name = det.get("class_name", "tumor")

        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 255), 2)

        label = f"{class_name} {conf:.2f}"
        cv2.putText(
            image,
            label,
            (x1, max(20, y1 - 8)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 255, 255),
            2,
            cv2.LINE_AA
        )

    cv2.imwrite(str(save_path), image)
    return str(save_path)


def create_tumor_focused_heatmap(image_path, detections, output_path):
    image = cv2.imread(str(image_path))
    if image is None:
        raise ValueError(f"Could not read image: {image_path}")

    h, w = image.shape[:2]
    heatmap = np.zeros((h, w), dtype=np.float32)

    yy, xx = np.mgrid[0:h, 0:w]

    for det in detections:
        x1, y1, x2, y2 = det["box"]
        conf = float(det.get("confidence", 1.0))

        x1 = max(0, min(w - 1, int(x1)))
        y1 = max(0, min(h - 1, int(y1)))
        x2 = max(0, min(w - 1, int(x2)))
        y2 = max(0, min(h - 1, int(y2)))

        if x2 <= x1 or y2 <= y1:
            continue

        cx = (x1 + x2) / 2.0
        cy = (y1 + y2) / 2.0

        box_w = max(1, x2 - x1)
        box_h = max(1, y2 - y1)

        sigma_x = max(8, box_w / 2.5)
        sigma_y = max(8, box_h / 2.5)

        gaussian = np.exp(
            -(
                ((xx - cx) ** 2) / (2 * sigma_x ** 2)
                + ((yy - cy) ** 2) / (2 * sigma_y ** 2)
            )
        )

        # restrict extra attention mostly around the box
        roi_mask = np.zeros((h, w), dtype=np.float32)
        pad_x = int(box_w * 0.4)
        pad_y = int(box_h * 0.4)

        mx1 = max(0, x1 - pad_x)
        my1 = max(0, y1 - pad_y)
        mx2 = min(w, x2 + pad_x)
        my2 = min(h, y2 + pad_y)

        roi_mask[my1:my2, mx1:mx2] = 1.0

        heatmap += gaussian * roi_mask * conf

    if heatmap.max() > 0:
        heatmap = heatmap / heatmap.max()
    else:
        heatmap = np.zeros((h, w), dtype=np.float32)

    heatmap = cv2.GaussianBlur(heatmap, (0, 0), sigmaX=12, sigmaY=12)
    heatmap_uint8 = np.uint8(255 * heatmap)

    colored_heatmap = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(image, 0.62, colored_heatmap, 0.38, 0)

    for det in detections:
        x1, y1, x2, y2 = map(int, det["box"])
        conf = float(det.get("confidence", 0.0))
        class_name = det.get("class_name", "tumor")

        x1 = max(0, min(w - 1, x1))
        y1 = max(0, min(h - 1, y1))
        x2 = max(0, min(w - 1, x2))
        y2 = max(0, min(h - 1, y2))

        cv2.rectangle(overlay, (x1, y1), (x2, y2), (0, 255, 255), 2)

        label = f"{class_name} {conf:.2f}"
        cv2.putText(
            overlay,
            label,
            (x1, max(20, y1 - 8)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 255, 255),
            2,
            cv2.LINE_AA
        )

    cv2.imwrite(str(output_path), overlay)
    return str(output_path)