import sys, base64, os

if len(sys.argv) < 3:
    print('Usage: python safe_writer.py <dest_path> <base64_content_file>')
    sys.exit(1)

dest = sys.argv[1]
b64_file = sys.argv[2]

os.makedirs(os.path.dirname(os.path.abspath(dest)), exist_ok=True)
with open(b64_file, 'r', encoding='utf-8') as f:
    b64_str = f.read().strip()

content = base64.b64decode(b64_str).decode('utf-8')
with open(dest, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print(f'Successfully wrote {dest} ({len(content)} chars)')
