import os

def write(rel, content):
    full = os.path.abspath(rel)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print(f'[OK] Wrote  {rel} ({len(content)} bytes)')
 