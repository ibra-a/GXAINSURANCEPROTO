#!/usr/bin/env python3
"""Generate One-Page Presentation Summary"""

from pathlib import Path
from datetime import datetime
from io import BytesIO

def pdf_escape(text):
    return text.replace('\\', r'\\').replace('(', r'\(').replace(')', r'\)')

def draw_text(stream, x, y, text, size=11, font="/F1"):
    if not text.strip():
        return
    stream.write(b"BT\n")
    stream.write(f"{font} {size} Tf\n".encode())
    stream.write(f"1 0 0 1 {x:.2f} {y:.2f} Tm\n".encode())
    stream.write(f"({pdf_escape(text)}) Tj\n".encode())
    stream.write(b"ET\n")

def draw_line(stream, x1, y1, x2, y2, width=0.5):
    stream.write(f"{width} w\n".encode())
    stream.write(f"{x1:.2f} {y1:.2f} m\n".encode())
    stream.write(f"{x2:.2f} {y2:.2f} l\n".encode())
    stream.write(b"S\n")

page_width = 595.28
page_height = 841.89
margin = 40

stream = BytesIO()
y = page_height - 40

# Title
draw_text(stream, page_width/2 - 100, y, "GXA PRESENTATION - QUICK REFERENCE", 14)
y -= 30

# Bundle Pricing Section
draw_text(stream, margin, y, "PRIMARY OFFER: WEB + MOBILE BUNDLE", 12)
y -= 20

draw_text(stream, margin, y, "Net Payment: $15,950 | Total Investment: $20,500 | Save: $4,550", 10)
y -= 25

# Pricing Breakdown
pricing_left = margin
pricing_right = page_width/2 + 20

draw_text(stream, pricing_left, y, "Breakdown:", 10)
y -= 15
draw_text(stream, pricing_left, y, "Web App: $12,500", 9)
draw_text(stream, pricing_right, y, "Mobile Apps: $8,000", 9)
y -= 14
draw_text(stream, pricing_left, y, "Prototype Credit: -$2,500", 9)
draw_text(stream, pricing_right, y, "Bundle Discount: -$2,050", 9)
y -= 14
draw_text(stream, pricing_left, y, "NET: $15,950", 10)

y -= 25

# Payment Schedule
draw_text(stream, margin, y, "PAYMENT SCHEDULE:", 11)
y -= 18

pay_col1 = margin
pay_col2 = margin + 120
pay_col3 = margin + 280

draw_text(stream, pay_col1, y, "1. $4,000 (40%)", 9)
draw_text(stream, pay_col2, y, "Contract signing", 9)
y -= 14
draw_text(stream, pay_col1, y, "2. $3,000 (30%)", 9)
draw_text(stream, pay_col2, y, "Phase 2 completion", 9)
y -= 14
draw_text(stream, pay_col1, y, "3. $2,000 (20%)", 9)
draw_text(stream, pay_col2, y, "Phase 3 completion", 9)
y -= 14
draw_text(stream, pay_col1, y, "4. $1,000 (10%)", 9)
draw_text(stream, pay_col2, y, "Web launch", 9)
y -= 14
draw_text(stream, pay_col1, y, "5. $4,000 (Mobile)", 9)
draw_text(stream, pay_col2, y, "Mobile contract", 9)
y -= 14
draw_text(stream, pay_col1, y, "6. $4,000 (Mobile)", 9)
draw_text(stream, pay_col2, y, "Mobile launch", 9)

y -= 20
draw_line(stream, margin, y, page_width - margin, y, 0.5)
y -= 15

# Value Proposition
draw_text(stream, margin, y, "VALUE PROPOSITION:", 11)
y -= 18

draw_text(stream, margin, y, "Annual Savings: $35,000 - $80,000", 10)
y -= 14
draw_text(stream, margin, y, "ROI: Pays for itself in 2-3 months", 10)
y -= 14
draw_text(stream, margin, y, "Timeline: Web (3-4 months) + Mobile (+4-6 weeks)", 10)

y -= 20
draw_line(stream, margin, y, page_width - margin, y, 0.5)
y -= 15

# Key Talking Points
draw_text(stream, margin, y, "KEY TALKING POINTS:", 11)
y -= 18

messages = [
    "\"Since you wanted mobile apps, bundle saves $4,550\"",
    "\"Web for staff on computers, mobile for customers on phones\"",
    "\"Complete solution: $15,950 vs $25,000 separately\"",
    "\"Saves $35k-80k per year - pays for itself in 2-3 months\"",
]

for msg in messages:
    msg_short = msg[:85] if len(msg) > 85 else msg
    draw_text(stream, margin + 5, y, msg_short, 9)
    y -= 13

y -= 15
draw_line(stream, margin, y, page_width - margin, y, 0.5)
y -= 15

# Presentation Flow
draw_text(stream, margin, y, "PRESENTATION FLOW:", 11)
y -= 18

flow = [
    "1. Demo web app (3-4 min)",
    "2. Address mobile request (30 sec)",
    "3. Present bundle: $15,950 net (1 min)",
    "4. Show value: $35k-80k savings (1 min)",
    "5. Close: \"What questions?\" (30 sec)",
]

for step in flow:
    draw_text(stream, margin + 5, y, step, 9)
    y -= 13

y -= 15
draw_line(stream, margin, y, page_width - margin, y, 0.5)
y -= 15

# Quick Numbers
col1 = margin
col2 = page_width/2

draw_text(stream, col1, y, "QUICK NUMBERS:", 11)
draw_text(stream, col2, y, "BACKUP OPTION:", 11)
y -= 18

draw_text(stream, col1, y, "Bundle: $15,950 net", 9)
y -= 13
draw_text(stream, col1, y, "Web Only: $10,000 net", 9)
y -= 13
draw_text(stream, col1, y, "Savings: $35k-80k/year", 9)
y -= 13
draw_text(stream, col1, y, "ROI: 2-3 months", 9)
y -= 13
draw_text(stream, col1, y, "Timeline: 4-5 months", 9)

backup_y = y + 65
draw_text(stream, col2, backup_y, "Web Only:", 9)
backup_y -= 13
draw_text(stream, col2, backup_y, "$10,000 net", 9)
backup_y -= 13
draw_text(stream, col2, backup_y, "Mobile later:", 9)
backup_y -= 13
draw_text(stream, col2, backup_y, "$8,000 (90 days)", 9)

y = backup_y - 20

# Footer
draw_line(stream, margin, y, page_width - margin, y, 0.5)
y -= 15
draw_text(stream, margin, y, "Gaboodai Solutions | ibrahimm@me.com | +971 52 799 8111", 8)

content = stream.getvalue()

# Create PDF
objects = {}
objects[1] = b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
content_id = 3
page_id = 4
font_id = 5

objects[content_id] = f"{content_id} 0 obj\n<< /Length {len(content)} >>\nstream\n".encode() + content + b"\nendstream\nendobj\n"
objects[page_id] = f"{page_id} 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 {font_id} 0 R >> >> /MediaBox [0 0 {page_width:.2f} {page_height:.2f}] /Contents {content_id} 0 R >>\nendobj\n".encode()
objects[2] = b"2 0 obj\n<< /Type /Pages /Kids [4 0 R] /Count 1 >>\nendobj\n"
objects[font_id] = b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"

pdf = BytesIO()
pdf.write(b"%PDF-1.4\n")
offsets = [0]
for obj_id in sorted(objects.keys()):
    offsets.append(pdf.tell())
    pdf.write(objects[obj_id])

xref_pos = pdf.tell()
pdf.write(f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n".encode())
for off in offsets[1:]:
    pdf.write(f"{off:010d} 00000 n \n".encode())

pdf.write(f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF".encode())

output_path = Path('contracts/Presentation_One_Page_Summary.pdf')
output_path.write_bytes(pdf.getvalue())
print(f'✅ One-Page Summary PDF created: {output_path}')
print(f'✅ Includes: Pricing, Payments, Value, Talking Points, Flow')
print('✅ Perfect for quick reference during presentation!')

