from fastapi import APIRouter
from app.services.json_store import json_store

router = APIRouter()

@router.get("/dashboard/stats")
async def get_dashboard_stats():
    """
    Returns aggregated stats for the dashboard.
    """
    return {
        "stats": json_store.get_stats()
    }

@router.get("/dashboard/recent")
async def get_recent_scans(limit: int = 5):
    """
    Returns recent activity log.
    """
    scans = json_store.get_recent(limit)
    
    logs = []
    for scan in scans:
        # Determine status color/text
        status = "SAFE"
        color = "text-emerald-400"
        
        risk_level = scan.get("risk_level")
        
        if risk_level == "High" or risk_level == "Critical":
            status = "CRITICAL"
            color = "text-red-400"
        elif risk_level == "Medium":
            status = "WARNING"
            color = "text-yellow-400"
            
        logs.append({
            "action": f"Scan: '{scan.get('brand_name') or 'Unknown'}'",
            "date": "Just now", # formatting relative time in frontend is better but simple for now
            "status": status,
            "color": color
        })
        
    return {
        "recentLogs": logs
    }
