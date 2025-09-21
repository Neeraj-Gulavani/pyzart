import ast

def safe_exec(user_code: str, allowed_objects: dict):
    """
    - user_code: string from textarea
    - allowed_objects: dictionary of allowed objects/functions
    """
    safe_globals = {"__builtins__": None}  # no dangerous built-ins
    safe_locals = allowed_objects.copy()   # only allowed objects

    # Split input into lines and execute each
    for line in user_code.splitlines():
        line = line.strip()
        if not line:
            continue  # skip empty lines

        # Basic safety check: allow only alphanumeric, dots, parentheses, commas
        import re
        if not re.fullmatch(r"[a-zA-Z0-9_()., \[\]\"']+", line):
           raise ValueError(f"Disallowed characters used in line: {line}")
            
        # Evaluate or execute
        try:
            exec(line, safe_globals, safe_locals)
        except Exception as e:
            raise ValueError(f"Error in line '{line}': {e}")

    return "Success"
