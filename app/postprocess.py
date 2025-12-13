import json
import re
from typing import List, Dict, Any, Tuple


def _extract_json(text: str) -> str:
    """Try to extract the first JSON object from a text blob."""
    # First try direct load
    try:
        json.loads(text)
        return text
    except Exception:
        pass

    # Try to find a {...} block (simple heuristic)
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        return match.group(0)

    # Try to find a [...] block
    match = re.search(r"\[[\s\S]*\]", text)
    if match:
        return match.group(0)

    # As last resort, return original
    return text


def parse_actions_and_summary(raw_output: str) -> Tuple[List[Dict[str, Any]], str, str]:
    """Parse the LLM raw output into (actions, summary, error).

    Returns a tuple: (actions_list, summary_text, error_message_or_empty).
    """
    candidate = _extract_json(raw_output)
    try:
        parsed = json.loads(candidate)
    except Exception as e:
        return [], "", f"json_parse_error: {str(e)}"

    # Expect top-level to be object with actions and summary
    if isinstance(parsed, dict):
        actions = parsed.get("actions") or []
        summary = parsed.get("summary") or ""
    else:
        return [], "", "unexpected_top_level"

    normalized = []
    for a in actions:
        if not isinstance(a, dict):
            continue
        item = {
            "task": a.get("task") or a.get("action") or "",
            "owner": a.get("owner") or a.get("assignee") or None,
            "deadline": a.get("deadline") or a.get("due") or None,
            "priority": a.get("priority") or "Medium",
            "confidence": float(a.get("confidence")) if a.get("confidence") is not None else None
        }
        normalized.append(item)

    return normalized, summary, ""
