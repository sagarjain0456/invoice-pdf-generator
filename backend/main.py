from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.responses import FileResponse
import uuid
import os

from models import InvoiceData
from pdfgenerator import generate_invoice_pdf

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/generate-invoice")
def generate_invoice(invoice: InvoiceData):
    filename = f"invoice_{uuid.uuid4()}.pdf"
    file_path = os.path.join(os.getcwd(), filename)

    generate_invoice_pdf(invoice, file_path)

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename
    )
