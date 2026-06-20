import cv2
import torch
import numpy as np


class YOLOGradCAM:
    def __init__(self, yolo_model):
        self.yolo = yolo_model
        self.model = yolo_model.model
        self.activations = None

        # Try to use a late conv layer for CAM
        try:
            self.target_layer = self.model.model[-4]
            self.target_layer.register_forward_hook(self.save_activation)
        except Exception as e:
            print("Error registering hook:", e)

    def save_activation(self, module, input, output):
        if isinstance(output, tuple):
            output = output[0]
        self.activations = output.detach()

    def generate_and_save(self, image_path, detections, save_path):
        self.activations = None

        _ = self.yolo(image_path, conf=0.25, verbose=False)

        original = cv2.imread(image_path)
        h, w = original.shape[:2]

        if self.activations is None:
            # Fallback if activations failed to capture
            return self._fallback_heatmap(original, detections, save_path)

        fmap = self.activations[0].cpu().numpy()  # C,H,W
        C, fH, fW = fmap.shape

        # SVD-based EigenCAM
        reshaped_fmap = fmap.reshape(C, -1).T # (H*W, C)
        reshaped_fmap = reshaped_fmap - reshaped_fmap.mean(axis=0)
        
        # Calculate SVD
        U, S, VT = np.linalg.svd(reshaped_fmap, full_matrices=False)
        
        # Project onto first principal component
        cam = reshaped_fmap @ VT[0, :]
        cam = cam.reshape(fH, fW)
        
        # Sometimes the sign is flipped; we can assume the object is the positive cluster 
        # or just take the absolute value. Usually max activation is the object.
        # But if mean(cam) < 0, maybe flip? Let's just use maximum(cam, 0) like standard GradCAM
        if np.mean(cam) < 0:
            cam = -cam
            
        cam = np.maximum(cam, 0)
        cam = cv2.GaussianBlur(cam, (21, 21), 0)

        cam = cam - cam.min()
        cam = cam / (cam.max() + 1e-8)
        cam = np.uint8(255 * cam)
        cam = cv2.resize(cam, (w, h))

        # We do not apply a hard bounding box mask anymore. 
        # But we do want to constrain it slightly if it's too noisy,
        # or we just rely on the alpha blending.
        
        # Apply colormap
        heatmap_color = cv2.applyColorMap(cam, cv2.COLORMAP_JET)
        
        # Alpha blending based on cam intensity to avoid blue background
        alpha = cam.astype(float) / 255.0
        # Curve the alpha so low values are transparent
        alpha = np.power(alpha, 1.5)
        alpha_3d = np.expand_dims(alpha, axis=2)
        
        # Blend
        overlay = (heatmap_color * alpha_3d * 0.8 + original * (1 - alpha_3d * 0.8)).astype(np.uint8)
        
        # Draw bounding boxes
        if detections:
            for det in detections:
                x1, y1, x2, y2 = map(int, det["bbox"])
                label = f"{det['class_name']} {det['confidence']:.2f}"
                cv2.rectangle(overlay, (x1, y1), (x2, y2), (0, 255, 255), 2)
                cv2.putText(
                    overlay,
                    label,
                    (x1, max(25, y1 - 8)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 255, 255),
                    2
                )
                
        cv2.imwrite(save_path, overlay)
        return save_path

    def _fallback_heatmap(self, image, detections, save_path):
        # The fallback logic using gaussian blob
        h, w = image.shape[:2]
        heatmap = np.zeros((h, w), dtype=np.float32)

        for det in detections:
            x1, y1, x2, y2 = map(int, det["bbox"])
            x1, y1, x2, y2 = max(0, x1), max(0, y1), min(w, x2), min(h, y2)
            bw, bh = x2 - x1, y2 - y1
            if bw <= 0 or bh <= 0:
                continue
            cx, cy = x1 + bw // 2, y1 + bh // 2
            # Make the blob fit the box smoothly
            sigma_x, sigma_y = max(bw / 4, 10), max(bh / 4, 10)
            yy, xx = np.mgrid[0:h, 0:w]
            gaussian = np.exp(-(((xx - cx) ** 2) / (2 * sigma_x ** 2) + ((yy - cy) ** 2) / (2 * sigma_y ** 2)))
            heatmap = np.maximum(heatmap, gaussian)

        # Normalize to 0-255
        cam = np.uint8(255 * heatmap)
        heatmap_color = cv2.applyColorMap(cam, cv2.COLORMAP_JET)

        # Alpha blending
        alpha = heatmap
        alpha = np.power(alpha, 1.2)
        alpha_3d = np.expand_dims(alpha, axis=2)

        overlay = (heatmap_color * alpha_3d * 0.8 + image * (1 - alpha_3d * 0.8)).astype(np.uint8)

        for det in detections:
            x1, y1, x2, y2 = map(int, det["bbox"])
            label = f"{det['class_name']} {det['confidence']:.2f}"
            cv2.rectangle(overlay, (x1, y1), (x2, y2), (0, 255, 255), 2)
            cv2.putText(overlay, label, (x1, max(25, y1 - 8)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

        cv2.imwrite(save_path, overlay)
        return save_path