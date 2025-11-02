#!/usr/bin/env python3
"""Generate PDF presentation guide for Mobile App Bundle"""

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
margin = 50

def create_page():
    stream = BytesIO()
    y = page_height - 50
    
    # Header
    draw_text(stream, margin, y, "MOBILE APP BUNDLE PRESENTATION GUIDE", 16)
    y -= 25
    draw_text(stream, margin, y, "GXA Insurance Claims Platform", 12)
    y -= 20
    draw_text(stream, margin, y, f"Prepared for: GXA Assurances | Date: {datetime.now().strftime('%B %d, %Y')}", 10)
    y -= 40
    
    return stream, y

stream, y = create_page()

# Primary Offer
draw_text(stream, margin, y, "PRIMARY OFFER: WEB + MOBILE BUNDLE", 14)
y -= 25

draw_text(stream, margin, y, "Since client previously requested mobile apps, present bundle as primary option:", 10)
y -= 20

# Bundle Pricing
draw_text(stream, margin, y, "BUNDLE PRICING:", 12)
y -= 20

pricing_items = [
    ("Web Application:", "$12,500.00"),
    ("Mobile Apps (iOS + Android):", "$8,000.00 (early adopter discount)"),
    ("Subtotal:", "$20,500.00"),
    ("Less Prototype Credit:", "-$2,500.00"),
    ("Less Bundle Discount (10%):", "-$2,050.00"),
    ("NET PAYMENT:", "$15,950.00"),
    ("Total Investment:", "$20,500.00"),
    ("Savings vs Separate:", "$4,550.00"),
]

for label, amount in pricing_items:
    draw_text(stream, margin, y, label, 10)
    draw_text(stream, page_width - margin - 120, y, amount, 10)
    y -= 18

y -= 15

# Payment Schedule
draw_text(stream, margin, y, "PAYMENT SCHEDULE:", 12)
y -= 20

payments = [
    ("Payment 1 (40%):", "$4,000.00", "At contract signing"),
    ("Payment 2 (30%):", "$3,000.00", "Web Phase 2 completion"),
    ("Payment 3 (20%):", "$2,000.00", "Web Phase 3 completion"),
    ("Payment 4 (10%):", "$1,000.00", "Web app launch"),
    ("Payment 5 (Mobile 50%):", "$4,000.00", "Mobile contract signing"),
    ("Payment 6 (Mobile 50%):", "$4,000.00", "Mobile app launch"),
    ("TOTAL:", "$15,950.00", ""),
]

for label, amt, desc in payments:
    if desc:
        draw_text(stream, margin, y, f"{label} {amt} - {desc}", 10)
    else:
        draw_text(stream, margin, y, f"{label} {amt}", 10)
    y -= 16

y -= 15

# Timeline
draw_text(stream, margin, y, "TIMELINE:", 12)
y -= 20
draw_text(stream, margin, y, "• Web Application: 3-4 months", 10)
y -= 16
draw_text(stream, margin, y, "• Mobile Apps: Launch 4-6 weeks after web", 10)
y -= 16
draw_text(stream, margin, y, "• Total: 4-5 months for complete system", 10)

y -= 20

# Presentation Flow
draw_text(stream, margin, y, "PRESENTATION FLOW:", 12)
y -= 20

flow_steps = [
    ("1. Show Web App", "Demo the web application - works on computers and phones"),
    ("2. Address Mobile Request", "Mention: 'You wanted native mobile apps - here's the bundle option'"),
    ("3. Present Bundle", "Lead with bundle pricing: $15,950 net, saves $4,550"),
    ("4. Emphasize Value", "Complete solution: Web for staff, mobile for customers"),
    ("5. Offer Backup", "Web-only option available if budget is tight ($10,000 net)"),
]

for step, desc in flow_steps:
    draw_text(stream, margin, y, step, 10)
    y -= 14
    desc_lines = [desc[i:i+70] for i in range(0, len(desc), 70)]
    for line in desc_lines:
        draw_text(stream, margin + 15, y, line, 9)
        y -= 12
    y -= 8

y -= 10

# Key Messages
draw_text(stream, margin, y, "KEY MESSAGES TO USE:", 12)
y -= 20

messages = [
    "\"Since you wanted mobile apps, I prepared the bundle - saves you $4,550.\"",
    "\"Bundle: Web for staff on computers, mobile for customers on phones.\"",
    "\"Complete solution: $15,950 net vs $25,000 if bought separately.\"",
    "\"Best value: Everything you need in one integrated system.\"",
]

for msg in messages:
    msg_lines = [msg[i:i+70] for i in range(0, len(msg), 70)]
    for line in msg_lines:
        draw_text(stream, margin + 10, y, line, 9)
        y -= 12
    y -= 8

# Check if we need a second page
if y < 150:
    y = page_height - 50
    draw_line(stream, margin, page_height - margin, page_width - margin, page_height - margin)
    draw_text(stream, page_width / 2 - 50, 40, "Page 2", 9)

# Benefits Section
draw_text(stream, margin, y, "BUNDLE BENEFITS:", 12)
y -= 20

benefits = [
    "Save $4,550 vs buying web and mobile separately",
    "One integrated system - same database, seamless experience",
    "Launch together - coordinated timeline",
    "Lower total cost with early adopter discount",
    "Complete solution - everything needed in one package",
]

for benefit in benefits:
    draw_text(stream, margin, y, f"• {benefit}", 10)
    y -= 16

y -= 15

# Comparison Table
draw_text(stream, margin, y, "PRICING COMPARISON:", 12)
y -= 20

draw_text(stream, margin, y, "Option", 10)
draw_text(stream, margin + 150, y, "Total", 10)
draw_text(stream, margin + 250, y, "Net Payment", 10)
draw_text(stream, margin + 380, y, "Savings", 10)
y -= 15
draw_line(stream, margin, y, page_width - margin, y)
y -= 15

comparisons = [
    ("Web + Mobile Bundle", "$20,500", "$15,950", "Save $4,550"),
    ("Web + Mobile Separate", "$25,000", "$23,000", "Baseline"),
    ("Web Only", "$15,000", "$10,000", "Save $5k (no mobile)"),
]

for option, total, net, savings in comparisons:
    draw_text(stream, margin, y, option, 10)
    draw_text(stream, margin + 150, y, total, 10)
    draw_text(stream, margin + 250, y, net, 10)
    draw_text(stream, margin + 380, y, savings, 10)
    y -= 16

y -= 20

# Handling Objections
draw_text(stream, margin, y, "HANDLING COMMON QUESTIONS:", 12)
y -= 20

qas = [
    ("Q: Why both web and mobile?", "A: Web for staff doing detailed work on computers. Mobile for customers submitting claims from accident scenes. Both needed."),
    ("Q: Can we just do mobile?", "A: Staff need computers for paperwork and reports. Web is essential. Mobile is for customer convenience."),
    ("Q: What if we only want web?", "A: Absolutely fine. Web works great on phones. Add mobile later for $8,000 if ordered within 90 days."),
]

for q, a in qas:
    q_lines = [q[i:i+75] for i in range(0, len(q), 75)]
    for line in q_lines:
        draw_text(stream, margin, y, line, 9)
        y -= 12
    a_lines = [a[i:i+75] for i in range(0, len(a), 75)]
    for line in a_lines:
        draw_text(stream, margin + 10, y, line, 9)
        y -= 12
    y -= 10

# Footer
footer_y = 60
draw_line(stream, margin, footer_y + 20, page_width - margin, footer_y + 20, 0.5)
draw_text(stream, margin, footer_y, "Gaboodai Solutions | ibrahimm@me.com | +971 52 799 8111", 9)

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

output_path = Path('contracts/Mobile_App_Bundle_Presentation.pdf')
output_path.write_bytes(pdf.getvalue())
print(f'✅ Bundle Presentation PDF created: {output_path}')
print(f'✅ Includes: Pricing, Payment Schedule, Timeline, Key Messages')
print('✅ Ready to print or view on tablet/laptop!')

