# Invoice PDF Generator

This is a full-stack web application built using ReactJS (frontend) and FastAPI (backend). The application allows users to enter invoice details, preview the invoice in real time, and generate a downloadable PDF invoice.

Tech Stack

Frontend:
- ReactJS
- JavaScript
- React Hook Form
- HTML / CSS (inline styling)

Backend:
- FastAPI (Python)
- Pydantic (request validation)
- ReportLab (PDF generation)

API Communication:
- REST
- JSON

Features

Frontend (ReactJS)
- Responsive invoice form
- Seller details: Name, Address, GST Number, Phone Number
- Buyer details: Name, Address, GST Number, Phone Number
- Invoice information: Invoice Number, Invoice Date
- Dynamic product line items: Product Name, Quantity, Rate per Unit, Tax Percentage
- Ability to add and remove product rows dynamically
- Live invoice preview that matches the generated PDF
- Generate and download invoice as a PDF
- Success and error messages on PDF generation
- Form handling and validation using React Hook Form

Backend (FastAPI)
- POST /generate-invoice endpoint
- Accepts complete invoice data as JSON
- Request validation using Pydantic models
- Tax and total calculations performed on the backend
- Generates a clean, structured PDF invoice
- Returns the generated PDF as a downloadable response

Project Structure

invoice-pdf-generator/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── pdfgenerator.py
│   ├── requirements.txt
│   └── ...
└── README.md

Setup Instructions

Backend Setup (FastAPI)
1. Navigate to the backend directory:
   cd backend
2. Create and activate a virtual environment:
   python -m venv venv
   venv\Scripts\activate
3. Install dependencies:
   pip install -r requirements.txt
4. Start the server:
   uvicorn main:app --reload
Backend will run at http://127.0.0.1:8000

Frontend Setup (ReactJS)
1. Navigate to the frontend directory:
   cd frontend
2. Install dependencies:
   npm install
3. Start the development server:
   npm start
Frontend will run at http://localhost:3000

API Details

Endpoint:
POST /generate-invoice

Request Body (JSON):
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

Response:
PDF file returned as a downloadable response

Invoice Calculation Logic

For each product:
Base Amount = Quantity × Rate per Unit
Tax Amount = Base Amount × (Tax Percentage / 100)
Line Total = Base Amount + Tax Amount
Grand Total is the sum of all line item totals.

PDF Invoice Output

The generated PDF includes invoice number, invoice date, seller details, buyer details, a product table with quantity, rate, tax percentage, calculated amounts, and the grand total. The invoice preview displayed in the frontend closely matches the final PDF output.

Assumptions

- Currency is assumed to be INR
- Tax is applied per product line item
- Single-page invoice layout
- No authentication required
- All values are entered manually by the user

Bonus Features Covered

- React Hook Form for frontend form handling
- Pydantic models for backend request validation
- Proper tax and total calculations
- Invoice preview before PDF download
- Clean and user-friendly UI

Future Improvements

- Improve PDF styling (logo, borders, alignment)
- Add stricter validation rules
- Improve error handling
- Add support for multiple invoice templates
