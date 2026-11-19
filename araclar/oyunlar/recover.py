import json

log_path = r"C:\Users\mehme\.gemini\antigravity\brain\a7b85352-99aa-477a-a725-bd7a0e13671f\.system_generated\logs\transcript_full.jsonl"
target_file = r"c:\Users\mehme\Desktop\kelimearasi.com\oyunlar\sekizle.html"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE':
                for call in data.get('tool_calls', []):
                    if call.get('name') == 'write_to_file' or call.get('name') == 'default_api:write_to_file':
                        args = call.get('args', call.get('arguments', {}))
                        if "sekizle.html" in args.get('TargetFile', '').lower():
                            best_content = args.get('CodeContent')
                            if best_content:
                                with open(target_file, 'w', encoding='utf-8') as outf:
                                    outf.write(best_content)
                                print("Wrote!")
        except Exception as e:
            pass
