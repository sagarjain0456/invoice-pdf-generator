from pydantic import BaseModel
from typing import List

class SellerBuyer(BaseModel):
    name: str
    address: str
    gst_number: str
    phone_number: str   # Added phone number

class Product(BaseModel):
    product_name: str
    quantity: int
    rate_per_unit: float
    tax_percentage: float

class InvoiceData(BaseModel):
    invoice_number: str
    invoice_date: str
    seller: SellerBuyer
    buyer: SellerBuyer
    products: List[Product]
