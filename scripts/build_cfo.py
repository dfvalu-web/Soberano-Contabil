# coding: utf-8
import os

def write_file(path, code):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    real_code = code.replace('__D__', '$')
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(real_code.strip() + '\n')
    print(f'Wrote {path} ({len(real_code)} chars)')

print('build_cfo.py helper ready')
