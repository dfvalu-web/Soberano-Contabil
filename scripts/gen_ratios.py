# coding: utf-8
lines = []
def add(line):
    lines.append(line)

def save(path):
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(lines) + '\n')
    print('Saved', path, len(lines), 'lines')
