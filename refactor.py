import os
import re

files_to_process = [
    r"d:\KP-PRODI\resources\js\Pages\Mahasiswa\Penilaian\Index.tsx",
    r"d:\KP-PRODI\resources\js\Pages\Mahasiswa\StatusPengajuan.tsx",
    r"d:\KP-PRODI\resources\js\Pages\Prodi\PembagianPL\Index.tsx",
    r"d:\KP-PRODI\resources\js\Pages\Prodi\SupervisorPlotting.tsx",
    r"d:\KP-PRODI\resources\js\Pages\Prodi\Students.tsx",
    r"d:\KP-PRODI\resources\js\Pages\Instansi\Monitoring\Index.tsx",
    r"d:\KP-PRODI\resources\js\Pages\Instansi\Evaluation.tsx",
    r"d:\KP-PRODI\resources\js\Pages\Dosen\ReviewProposal.tsx",
]

imports_to_add = """import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';
"""

replacements = {
    r"<table[^>]*>": "<ModernTable>",
    r"</table>": "</ModernTable>",
    r"<thead[^>]*>": "<ModernTableHeader>",
    r"</thead>": "</ModernTableHeader>",
    r"<tbody[^>]*>": "<ModernTableBody>",
    r"</tbody>": "</ModernTableBody>",
    r"<th(?:\s+className=\"[^\"]*\")?[^>]*>": "<ModernTableTh>",
    r"</th>": "</ModernTableTh>",
    r"<td(?:\s+className=\"[^\"]*\")?[^>]*>": "<ModernTableTd>",
    r"</td>": "</ModernTableTd>"
}

for filepath in files_to_process:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} (does not exist)")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Check if already processed
    if "ModernTable" in content:
        print(f"Skipping {filepath} (already contains ModernTable)")
        continue
        
    # Add imports after the last import statement
    import_match = list(re.finditer(r"^import .*?;?\n", content, re.MULTILINE))
    if import_match:
        last_import = import_match[-1]
        insert_pos = last_import.end()
        content = content[:insert_pos] + imports_to_add + content[insert_pos:]
    else:
        content = imports_to_add + content
        
    # Replace table tags (ignoring attributes, keeping it simple for now)
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)
        
    # Wrapping with space-y-6 is tricky to do automatically without breaking layout, 
    # but we can look for main containers if needed. For now, replacing the tables is 90% of the work.
    # Often, they have `className="... p-6 ... mx-auto ..."` 
    # We can try to add `space-y-6` to the main div.
    content = re.sub(r'className="([^"]*max-w-[^"]* mx-auto[^"]*)"', lambda m: f'className="{m.group(1)} space-y-6"' if 'space-y-6' not in m.group(1) else m.group(0), content)
    content = re.sub(r'className="([^"]*p-6[^"]* mx-auto[^"]*)"', lambda m: f'className="{m.group(1)} space-y-6"' if 'space-y-6' not in m.group(1) else m.group(0), content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Processed {filepath}")
