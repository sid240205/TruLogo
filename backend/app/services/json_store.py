import json
import os
from datetime import datetime
from pathlib import Path
import uuid

DATA_DIR = Path("data")
DATA_FILE = DATA_DIR / "history.json"

class JsonStore:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(JsonStore, cls).__new__(cls)
            cls._instance._ensure_file()
        return cls._instance

    def _ensure_file(self):
        if not DATA_DIR.exists():
            DATA_DIR.mkdir()
        if not DATA_FILE.exists():
            with open(DATA_FILE, "w") as f:
                json.dump([], f)

    def _load(self):
        try:
            with open(DATA_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []

    def _save(self, data):
        with open(DATA_FILE, "w") as f:
            json.dump(data, f, indent=2, default=str)

    def add_scan(self, brand_name, risk_level, risk_score, metadata=None):
        data = self._load()
        record = {
            "id": str(uuid.uuid4()),
            "brand_name": brand_name,
            "risk_level": risk_level,
            "risk_score": risk_score,
            "created_at": datetime.now().isoformat(),
            "metadata": metadata or {}
        }
        data.append(record)
        # Keep only last 100 records to keep it lightweight
        if len(data) > 100:
            data = data[-100:]
        self._save(data)
        return record

    def get_stats(self):
        data = self._load()
        safe = sum(1 for r in data if r.get("risk_level") == "Low")
        risky = sum(1 for r in data if r.get("risk_level") != "Low")
        return {
            "safeScans": safe,
            "riskAlerts": risky,
            "pendingFilings": 1 # Mock
        }

    def get_recent(self, limit=5):
        data = self._load()
        # Sort by created_at desc
        sorted_data = sorted(data, key=lambda x: x.get("created_at") or "", reverse=True)
        return sorted_data[:limit]

json_store = JsonStore()
