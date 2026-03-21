def get_interview_flow():
    flow = {
        "nodes": [
            {"id": "aptitude", "title": "Aptitude Round"},
            {"id": "technical", "title": "Technical Round"},
            {"id": "hr", "title": "HR Round"}
        ],
        "edges": [
            {"source": "aptitude", "target": "technical"},
            {"source": "technical", "target": "hr"}
        ]
    }
    
    try:
        from langgraph import StateGraph
        return {"use": "langgraph", "graph": str(flow)}
    except ImportError:
        pass
    
    return {"use": "fallback", "flow": flow}