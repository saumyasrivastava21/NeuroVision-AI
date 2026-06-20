from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "Brain_Tumour.pt"

UPLOAD_DIR = BASE_DIR / "static" / "uploads"
RESULT_DIR = BASE_DIR / "static" / "results"
REPORT_DIR = BASE_DIR / "static" / "reports"

CONF_THRESHOLD = 0.25
IMAGE_SIZE = 640