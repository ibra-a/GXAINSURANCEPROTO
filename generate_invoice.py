#!/usr/bin/env python3
"""Generate professional PDF invoice for GXA"""

from pathlib import Path
from datetime import datetime
from io import BytesIO

def pdf_escape(text):
    return text.replace('\\', r'\\').replace('(', r'\(').replace(')', r'\)')

def draw_text(stream, x, y, text, size=11):
    if not text.strip():
        return
    stream.write(b"BT\n")
    stream.write(f"/F1 {size} Tf\n".encode())
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
margin = 50

stream = BytesIO()
y = page_height - 50

# Header
draw_text(stream, margin, y, "GABOODAI SOLUTIONS", 18)
y -= 25
draw_text(stream, margin, y, "Digital Transformation • Software Engineering", 10)
y -= 15
draw_text(stream, margin, y, "H5F5+MGP, Djibouti | Email: ibrahimm@me.com | Phone: +971 52 799 8111", 9)
y -= 40

# Invoice title
draw_text(stream, margin, y, "INVOICE", 24)
y -= 35

# Invoice details
invoice_num = f"GXA-{datetime.now().year}-001"
invoice_date = datetime.now().strftime("%B %d, %Y")

draw_text(stream, margin, y, f"Invoice #: {invoice_num}", 12)
y -= 18
draw_text(stream, margin, y, f"Date: {invoice_date}", 12)
y -= 18
draw_text(stream, margin, y, "Status: Pending Payment", 12)
y -= 30

# Bill To
draw_text(stream, margin, y, "BILL TO:", 12)
y -= 20
draw_text(stream, margin, y, "GXA Assurances", 11)
y -= 15
draw_text(stream, margin, y, "BP 200", 11)
y -= 15
draw_text(stream, margin, y, "Djibouti", 11)
y -= 30

draw_line(stream, margin, y, page_width - margin, y)
y -= 25

# Itemized charges
draw_text(stream, margin, y, "ITEMIZED CHARGES", 14)
y -= 25

# Table header
draw_text(stream, margin, y, "Item", 11)
draw_text(stream, margin + 100, y, "Description", 11)
draw_text(stream, page_width - margin - 80, y, "Amount", 11)
y -= 15
draw_line(stream, margin, y, page_width - margin, y)
y -= 15

# Items
items = [
    ("1", "Prototype Development", "Working prototype demonstration and proof of concept", "$2,500.00"),
    ("2", "Production Web Application", "Full production system with API integrations, payment gateway, deployment, training", "$12,500.00"),
]

for num, name, desc, amt in items:
    if num:
        draw_text(stream, margin, y, num, 10)
    if name:
        draw_text(stream, margin + 40, y, name, 10)
    if desc:
        # Wrap long descriptions
        if len(desc) > 55:
            desc_parts = [desc[i:i+55] for i in range(0, len(desc), 55)]
            draw_text(stream, margin + 100, y, desc_parts[0], 9)
            y -= 12
            for part in desc_parts[1:]:
                draw_text(stream, margin + 100, y, part, 9)
                y -= 12
            y += 12
        else:
            draw_text(stream, margin + 100, y, desc, 9)
    if amt:
        draw_text(stream, page_width - margin - 80, y, amt, 10)
    y -= 18

y -= 10
draw_line(stream, margin, y, page_width - margin, y)
y -= 15

# Totals
draw_text(stream, page_width - margin - 200, y, "SUBTOTAL:", 11)
draw_text(stream, page_width - margin - 80, y, "$15,000.00", 11)
y -= 15
draw_text(stream, page_width - margin - 200, y, "TAX (if applicable):", 11)
draw_text(stream, page_width - margin - 80, y, "$0.00", 11)
y -= 20
draw_line(stream, margin, y, page_width - margin, y, 1.0)
y -= 20

draw_text(stream, page_width - margin - 200, y, "TOTAL DUE:", 14)
draw_text(stream, page_width - margin - 80, y, "$15,000.00", 14)
y -= 40

# Payment schedule
draw_text(stream, margin, y, "PAYMENT SCHEDULE", 12)
y -= 25

draw_text(stream, margin, y, "OPTION 1: Full Amount Upfront", 11)
y -= 18
draw_text(stream, margin + 20, y, "• Total: $15,000.00 - Due at contract signing", 10)
y -= 20

draw_text(stream, margin, y, "OPTION 2: Phased Payments", 11)
y -= 18
draw_text(stream, margin + 20, y, "A) Pay prototype now ($2,500), then production ($10,000 net after credit):", 10)
y -= 18
payments = [
    ("  Payment 1:", "$2,500.00", "Prototype fee - Due at contract signing"),
    ("  Payment 2 (40%):", "$4,000.00", "Production start (40% of $10,000 net)"),
    ("  Payment 3 (30%):", "$3,000.00", "Due upon Phase 2 completion (30% of $10,000 net)"),
    ("  Payment 4 (20%):", "$2,000.00", "Due upon Phase 3 integration testing (20% of $10,000 net)"),
    ("  Payment 5 (10%):", "$1,000.00", "Due upon production launch (10% of $10,000 net)"),
]
y -= 18
draw_text(stream, margin + 20, y, "B) Or pay full amount ($15,000) in installments without prototype credit:", 10)
y -= 18
payments2 = [
    ("  Payment 1 (40%):", "$6,000.00", "Due at contract signing"),
    ("  Payment 2 (30%):", "$4,500.00", "Due upon Phase 2 completion"),
    ("  Payment 3 (20%):", "$3,000.00", "Due upon Phase 3 integration testing"),
    ("  Payment 4 (10%):", "$1,500.00", "Due upon production launch"),
]

for label, amt, due in payments:
    draw_text(stream, margin, y, f"{label} {amt} - {due}", 10)
    y -= 16
    
for label, amt, due in payments2:
    draw_text(stream, margin, y, f"{label} {amt} - {due}", 10)
    y -= 16

y -= 20
draw_text(stream, margin, y, "Notes:", 11)
y -= 18
draw_text(stream, margin, y, "• Total Investment: $15,000.00 (Prototype $2,500 + Production $12,500)", 10)
y -= 15
draw_text(stream, margin, y, "• If prototype fee ($2,500) paid upfront, it will be credited toward production", 10)
y -= 15
draw_text(stream, margin, y, "• Net production payment after credit: $10,000.00", 10)

# Footer
footer_y = 60
draw_line(stream, margin, footer_y + 20, page_width - margin, footer_y + 20, 0.5)
draw_text(stream, margin, footer_y, "Thank you for your business!", 10)
draw_text(stream, page_width - margin - 250, footer_y, "Gaboodai Solutions • H5F5+MGP Djibouti", 9)

content = stream.getvalue()

# Create PDF structure
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

output_path = Path('contracts/GXA_Invoice.pdf')
output_path.write_bytes(pdf.getvalue())
print(f'✅ Invoice PDF created: {output_path}')
print(f'✅ Invoice #: {invoice_num}')
print(f'✅ Date: {invoice_date}')
print(f'✅ Total Due: $15,000.00')
print('✅ Ready to print!')

