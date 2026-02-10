import re

file_path = r"c:\Users\Jarold\Desktop\CAMPUS\cursos\induccion-sst.html"

def fix_broken_js_strings(content):
    lines = content.split('\n')
    fixed_lines = []
    
    current_line = ""
    in_single_quote = False
    in_double_quote = False
    in_template_quote = False
    
    # We will process line by line, but if we detect an unclosed string at the end of a line
    # (that is NOT a backtick), we append the next line to it.
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check for unclosed quotes in this line combined with previous accumulated line parts
        # This is a simplified check. A robust parser is hard, but we target specific known issues.
        # We know the issues are with single quotes ' spanning multiple lines.
        
        # Heuristic: Count unescaped single quotes
        # Remove escaped quotes first for counting
        clean_line = line.replace("\\'", "")
        single_quote_count = clean_line.count("'")
        
        # If we have an odd number of quotes, it's likely broken, UNLESS it's a comment?
        # Comments // ... 
        # If // appears before the last quote, we should be careful. 
        # But in this file, the broken lines are inside an object definition, no comments inline.
        
        if (single_quote_count % 2 != 0):
            # Broken line! Join with next line
            if i + 1 < len(lines):
                next_line = lines[i+1]
                # We join with a space to preserve word separation
                combined = line.strip() + " " + next_line.strip()
                lines[i+1] = combined # Modify next line to process it in next iteration? 
                # No, better to just merge and continue check.
                
                # Actually, let's just accumulate
                line = line.rstrip() + " " + lines[i+1].lstrip()
                lines[i] = line
                # Delete lines[i+1] so we don't process it again
                del lines[i+1]
                # Stay at same index i to check if it's still broken (e.g. multi-line span)
                continue
        
        fixed_lines.append(line)
        i += 1
        
    return '\n'.join(fixed_lines)

# Read file
try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
except UnicodeDecodeError:
    with open(file_path, 'r', encoding='latin-1') as f:
        content = f.read()

# Apply fix
new_content = fix_broken_js_strings(content)

# Save file
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Fixed broken JS strings.")
