import React, { useState } from "react";

function InvoiceForm() {
  const [formData, setFormData] = useState({
    invoice_number: "",
    invoice_date: "",
    seller: { name: "", address: "", gst_number: "", phone_number: "" },
    buyer: { name: "", address: "", gst_number: "", phone_number: "" },
    products: [{ product_name: "", quantity: 1, rate_per_unit: 0, tax_percentage: 0 }],
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e, section, index) => {
    const { name, value } = e.target;
    if (section) {
      if (section === "products") {
        const products = [...formData.products];
        products[index][name] = name === "product_name" ? value : Number(value);
        setFormData({ ...formData, products });
      } else {
        setFormData({ ...formData, [section]: { ...formData[section], [name]: value } });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product_name: "", quantity: 1, rate_per_unit: 0, tax_percentage: 0 }],
    });
  };

  const removeProduct = (index) => {
    const products = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to generate invoice");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.invoice_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setSuccessMessage("✅ Invoice generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setSuccessMessage("❌ Error generating invoice.");
    }
  };

  const calculateAmount = (product) => {
    return product.quantity * product.rate_per_unit * (1 + product.tax_percentage / 100);
  };

  const grandTotal = formData.products.reduce((sum, p) => sum + calculateAmount(p), 0);

  const inputStyle = {
    width: "100%",
    padding: "6px",
    margin: "4px 0 12px 0",
    boxSizing: "border-box",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const labelStyle = { display: "block", fontWeight: "bold", marginBottom: "4px" };
  const sectionStyle = { marginBottom: "20px" };
  const productBoxStyle = { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "10px", alignItems: "end", marginBottom: "10px" };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Invoice PDF Generator</h1>

      <form onSubmit={handleSubmit}>
        {/* Seller Info */}
        <div style={sectionStyle}>
          <h2>Seller Info</h2>
          <label style={labelStyle}>Name</label>
          <input style={inputStyle} name="name" placeholder="Seller Name" value={formData.seller.name} onChange={(e) => handleChange(e, "seller")} required />
          <label style={labelStyle}>Address</label>
          <input style={inputStyle} name="address" placeholder="Seller Address" value={formData.seller.address} onChange={(e) => handleChange(e, "seller")} required />
          <label style={labelStyle}>GST Number</label>
          <input style={inputStyle} name="gst_number" placeholder="Seller GST Number" value={formData.seller.gst_number} onChange={(e) => handleChange(e, "seller")} />
          <label style={labelStyle}>Phone Number</label>
          <input style={inputStyle} name="phone_number" placeholder="Seller Phone Number" value={formData.seller.phone_number} onChange={(e) => handleChange(e, "seller")} />
        </div>

        {/* Buyer Info */}
        <div style={sectionStyle}>
          <h2>Buyer Info</h2>
          <label style={labelStyle}>Name</label>
          <input style={inputStyle} name="name" placeholder="Buyer Name" value={formData.buyer.name} onChange={(e) => handleChange(e, "buyer")} required />
          <label style={labelStyle}>Address</label>
          <input style={inputStyle} name="address" placeholder="Buyer Address" value={formData.buyer.address} onChange={(e) => handleChange(e, "buyer")} required />
          <label style={labelStyle}>GST Number</label>
          <input style={inputStyle} name="gst_number" placeholder="Buyer GST Number" value={formData.buyer.gst_number} onChange={(e) => handleChange(e, "buyer")} />
          <label style={labelStyle}>Phone Number</label>
          <input style={inputStyle} name="phone_number" placeholder="Buyer Phone Number" value={formData.buyer.phone_number} onChange={(e) => handleChange(e, "buyer")} />
        </div>

        {/* Invoice Info */}
        <div style={sectionStyle}>
          <h2>Invoice Info</h2>
          <label style={labelStyle}>Invoice Number</label>
          <input style={inputStyle} name="invoice_number" placeholder="Invoice Number" value={formData.invoice_number} onChange={handleChange} required />
          <label style={labelStyle}>Invoice Date</label>
          <input style={inputStyle} type="date" name="invoice_date" value={formData.invoice_date} onChange={handleChange} required />
        </div>

        {/* Products */}
        <div style={sectionStyle}>
          <h2>Products</h2>
          {formData.products.map((p, index) => (
            <div key={index} style={productBoxStyle}>
              <div>
                <label style={labelStyle}>Product Name</label>
                <input style={inputStyle} name="product_name" placeholder="Product Name" value={p.product_name} onChange={(e) => handleChange(e, "products", index)} required />
              </div>
              <div>
                <label style={labelStyle}>Quantity</label>
                <input style={inputStyle} type="number" name="quantity" placeholder="Qty" value={p.quantity} onChange={(e) => handleChange(e, "products", index)} required />
              </div>
              <div>
                <label style={labelStyle}>Rate</label>
                <input style={inputStyle} type="number" name="rate_per_unit" placeholder="Rate" value={p.rate_per_unit} onChange={(e) => handleChange(e, "products", index)} required />
              </div>
              <div>
                <label style={labelStyle}>Tax %</label>
                <input style={inputStyle} type="number" name="tax_percentage" placeholder="Tax %" value={p.tax_percentage} onChange={(e) => handleChange(e, "products", index)} required />
              </div>
              {index > 0 && <button type="button" onClick={() => removeProduct(index)} style={{ height: "35px" }}>Remove</button>}
            </div>
          ))}
          <button type="button" onClick={addProduct} style={{ marginBottom: "20px", padding: "8px 15px" }}>Add Product</button>
        </div>

        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>Generate PDF</button>
      </form>

      {successMessage && <p style={{ fontWeight: "bold", color: successMessage.includes("✅") ? "green" : "red", marginTop: "20px" }}>{successMessage}</p>}

      {/* Invoice Preview */}
      <div style={{ marginTop: "30px" }}>
        <h2>Invoice Preview</h2>
        <p><strong>Invoice Number:</strong> {formData.invoice_number}</p>
        <p><strong>Invoice Date:</strong> {formatDate(formData.invoice_date)}</p>
        

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h3>Seller</h3>
            <p>Name: {formData.seller.name}</p>
            <p>Address: {formData.seller.address}</p>
            <p>GST: {formData.seller.gst_number}</p>
            <p>Phone: {formData.seller.phone_number}</p>
          </div>
          <div>
            <h3>Buyer</h3>
            <p>Name: {formData.buyer.name}</p>
            <p>Address: {formData.buyer.address}</p>
            <p>GST: {formData.buyer.gst_number}</p>
            <p>Phone: {formData.buyer.phone_number}</p>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ccc", padding: "5px" }}>#</th>
              <th style={{ border: "1px solid #ccc", padding: "5px" }}>Product</th>
              <th style={{ border: "1px solid #ccc", padding: "5px" }}>Qty</th>
              <th style={{ border: "1px solid #ccc", padding: "5px" }}>Rate</th>
              <th style={{ border: "1px solid #ccc", padding: "5px" }}>Tax %</th>
              <th style={{ border: "1px solid #ccc", padding: "5px" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {formData.products.map((p, i) => {
              const amount = calculateAmount(p);
              return (
                <tr key={i}>
                  <td style={{ border: "1px solid #ccc", padding: "5px", textAlign: "center" }}>{i + 1}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px" }}>{p.product_name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px", textAlign: "center" }}>{p.quantity}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px", textAlign: "right" }}>{p.rate_per_unit.toFixed(2)}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px", textAlign: "center" }}>{p.tax_percentage.toFixed(2)}</td>
                  <td style={{ border: "1px solid #ccc", padding: "5px", textAlign: "right" }}>{amount.toFixed(2)}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan="5" style={{ border: "1px solid #ccc", padding: "5px", textAlign: "right", fontWeight: "bold" }}>Grand Total</td>
              <td style={{ border: "1px solid #ccc", padding: "5px", textAlign: "right", fontWeight: "bold" }}>{grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InvoiceForm;
