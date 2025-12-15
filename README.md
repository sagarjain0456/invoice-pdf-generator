# Invoice PDF Generator

A full-stack web application built using **ReactJS (Frontend)** and **FastAPI (Backend)** that allows users to enter invoice details, preview the invoice, and download a professionally formatted PDF invoice.

---

## 🚀 Tech Stack
### Frontend
- ReactJS
- JavaScript
- HTML / CSS (inline styling)

### Backend
- FastAPI (Python)
- ReportLab (PDF generation)

### API Communication
- REST API
- JSON
---

## ✨ Features
### Frontend (ReactJS)
- Responsive invoice form
- Seller details:
  - Name
  - Address
  - GST Number
  - Phone Number
- Buyer details:
  - Name
  - Address
  - GST Number
  - Phone Number
- Invoice information:
  - Invoice Number
  - Invoice Date
- Dynamic product line items:
  - Product Name
  - Quantity
  - Rate per Unit
  - Tax Percentage (%)
- Ability to add and remove product rows dynamically
- Live invoice preview (matches the PDF layout)
- Generate and download invoice as a PDF
- Success / error message on PDF generation
---

### Backend (FastAPI)
- `POST /generate-invoice` endpoint
- Accepts full invoice data as JSON
- Performs tax and total calculations
- Generates a clean and structured PDF invoice
- Returns the generated PDF as a downloadable file
---

## 📁 Project Structure
invoice-pdf-generator/
├── frontend/
│ ├── src/
│ ├── package.json
│ └── ...
│
├── backend/
│ ├── main.py
│ ├── pdfgenerator.py
│ ├── models.py
│ └── ...
│
└── README.md


## ⚙️ Setup Instructions
### 1️⃣ Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn main:app --reload

Backend will run at:
http://127.0.0.1:8000

2️⃣ Frontend Setup (ReactJS)
cd frontend
npm install
npm start

Frontend will run at:
http://localhost:3000


📡 API Details
Generate Invoice PDF
Endpoint
POST /generate-invoice

Request Body (JSON)
{
  "invoice_number": "INV-001",
  "invoice_date": "2025-12-30",
  "seller": {
    "name": "Seller Name",
    "address": "Seller Address",
    "gst_number": "GST123",
    "phone_number": "9876543210"
  },
  "buyer": {
    "name": "Buyer Name",
    "address": "Buyer Address",
    "gst_number": "GST456",
    "phone_number": "9876543211"
  },
  "products": [
    {
      "product_name": "Product A",
      "quantity": 2,
      "rate_per_unit": 100,
      "tax_percentage": 18
    }
  ]
}

Response
PDF file returned as a downloadable response
🧾 Invoice Calculation Logic
For each product:

Base Amount = Quantity × Rate per Unit
Tax Amount  = Base Amount × (Tax Percentage / 100)
Total       = Base Amount + Tax Amount
Grand Total is the sum of all product totals.

📄 PDF Invoice Template
The generated PDF includes:
Invoice Number and Invoice Date
Seller details (Name, Address, GST, Phone)
Buyer details (Name, Address, GST, Phone)
Product table with:
Quantity
Rate
Tax percentage
Calculated amount

Grand Total
The invoice preview shown in the frontend closely matches the final PDF output.

📝 Assumptions
Currency is assumed to be INR
Tax is applied per product line item
Single-page invoice layout
No authentication required
All values are entered manually by the user

✅ Bonus Features Covered
Proper tax and total calculations
Invoice preview before PDF download
Clean and user-friendly UI

🔮 Future Improvements
Use React Hook Form or Formik for form management
Use Pydantic models for advanced backend validation
Improve PDF styling (logo, borders, alignment)
Enhanced error handling and validations