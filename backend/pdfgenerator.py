from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def format_date(date_str: str) -> str:
    """
    Converts YYYY-MM-DD to DD-MM-YYYY
    """
    if not date_str:
        return ""
    year, month, day = date_str.split("-")
    return f"{day}-{month}-{year}"


def generate_invoice_pdf(invoice, file_path: str):
    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    y = height - 50

    # ---------- Header ----------
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, f"Invoice Number: {invoice.invoice_number}")
    y -= 20

    formatted_date = format_date(invoice.invoice_date)
    c.drawString(50, y, f"Invoice Date: {formatted_date}")
    y -= 40

    # ---------- Seller & Buyer Labels ----------
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Seller Details")
    c.drawString(300, y, "Buyer Details")
    y -= 15

    # ---------- Seller & Buyer Info ----------
    c.setFont("Helvetica", 9)

    c.drawString(50, y, f"Name: {invoice.seller.name}")
    c.drawString(300, y, f"Name: {invoice.buyer.name}")
    y -= 15

    c.drawString(50, y, f"Address: {invoice.seller.address}")
    c.drawString(300, y, f"Address: {invoice.buyer.address}")
    y -= 15

    c.drawString(50, y, f"GST Number: {invoice.seller.gst_number}")
    c.drawString(300, y, f"GST Number: {invoice.buyer.gst_number}")
    y -= 15

    c.drawString(50, y, f"Phone Number: {invoice.seller.phone_number}")
    c.drawString(300, y, f"Phone Number: {invoice.buyer.phone_number}")
    y -= 30

    # ---------- Table Header ----------
    c.setFont("Helvetica-Bold", 9)
    c.drawString(50, y, "S.No")
    c.drawString(100, y, "Product")
    c.drawString(250, y, "Qty")
    c.drawString(300, y, "Rate")
    c.drawString(360, y, "Tax %")
    c.drawString(430, y, "Amount")
    y -= 15

    # ---------- Table Rows ----------
    total_amount = 0
    c.setFont("Helvetica", 9)

    for idx, item in enumerate(invoice.products, start=1):
        base = item.quantity * item.rate_per_unit
        tax = base * item.tax_percentage / 100
        amount = base + tax
        total_amount += amount

        c.drawString(50, y, str(idx))
        c.drawString(100, y, item.product_name)
        c.drawString(250, y, str(item.quantity))
        c.drawString(300, y, f"{item.rate_per_unit:.2f}")
        c.drawString(360, y, f"{item.tax_percentage:.2f}%")
        c.drawString(430, y, f"{amount:.2f}")

        y -= 15

    # ---------- Grand Total ----------
    y -= 20
    c.setFont("Helvetica-Bold", 10)
    c.drawString(300, y, "Grand Total:")
    c.drawString(430, y, f"{total_amount:.2f}")

    c.save()
