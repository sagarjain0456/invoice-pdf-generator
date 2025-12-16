import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

function InvoiceForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      invoice_number: "",
      invoice_date: "",
      seller: { name: "", address: "", gst_number: "", phone_number: "" },
      buyer: { name: "", address: "", gst_number: "", phone_number: "" },
      products: [
        { product_name: "", quantity: 1, rate_per_unit: 0, tax_percentage: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const formData = watch();
  const [successMessage, setSuccessMessage] = React.useState("");

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const calculateAmount = (product) => {
    return (
      product.quantity *
      product.rate_per_unit *
      (1 + product.tax_percentage / 100)
    );
  };

  const grandTotal = formData.products?.reduce(
    (sum, p) => sum + calculateAmount(p),
    0
  );

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.invoice_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setSuccessMessage("✅ Invoice generated successfully!");
      reset(data);
    } catch (err) {
      setSuccessMessage("❌ Error generating invoice.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "6px",
    margin: "4px 0 12px 0",
    boxSizing: "border-box",
    borderRadius: "4px",
    border: "1px solid #ccc",
  };

  const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "4px",
  };

  const sectionStyle = { marginBottom: "20px" };

  const productBoxStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
    gap: "10px",
    alignItems: "end",
    marginBottom: "10px",
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Invoice PDF Generator
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Seller Info */}
        <div style={sectionStyle}>
          <h2>Seller Info</h2>
          <label style={labelStyle}>Name</label>
          <input style={inputStyle} {...register("seller.name")} required />

          <label style={labelStyle}>Address</label>
          <input style={inputStyle} {...register("seller.address")} required />

          <label style={labelStyle}>GST Number</label>
          <input style={inputStyle} {...register("seller.gst_number")} />

          <label style={labelStyle}>Phone Number</label>
          <input style={inputStyle} {...register("seller.phone_number")} />
        </div>

        {/* Buyer Info */}
        <div style={sectionStyle}>
          <h2>Buyer Info</h2>
          <label style={labelStyle}>Name</label>
          <input style={inputStyle} {...register("buyer.name")} required />

          <label style={labelStyle}>Address</label>
          <input style={inputStyle} {...register("buyer.address")} required />

          <label style={labelStyle}>GST Number</label>
          <input style={inputStyle} {...register("buyer.gst_number")} />

          <label style={labelStyle}>Phone Number</label>
          <input style={inputStyle} {...register("buyer.phone_number")} />
        </div>

        {/* Invoice Info */}
        <div style={sectionStyle}>
          <h2>Invoice Info</h2>
          <label style={labelStyle}>Invoice Number</label>
          <input style={inputStyle} {...register("invoice_number")} required />

          <label style={labelStyle}>Invoice Date</label>
          <input
            style={inputStyle}
            type="date"
            {...register("invoice_date")}
            required
          />
        </div>

        {/* Products */}
        <div style={sectionStyle}>
          <h2>Products</h2>
          {fields.map((field, index) => (
            <div key={field.id} style={productBoxStyle}>
              <div>
                <label style={labelStyle}>Product Name</label>
                <input
                  style={inputStyle}
                  {...register(`products.${index}.product_name`)}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Quantity</label>
                <input
                  style={inputStyle}
                  type="number"
                  {...register(`products.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Rate</label>
                <input
                  style={inputStyle}
                  type="number"
                  {...register(`products.${index}.rate_per_unit`, {
                    valueAsNumber: true,
                  })}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Tax %</label>
                <input
                  style={inputStyle}
                  type="number"
                  {...register(`products.${index}.tax_percentage`, {
                    valueAsNumber: true,
                  })}
                  required
                />
              </div>

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  style={{ height: "35px" }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              append({
                product_name: "",
                quantity: 1,
                rate_per_unit: 0,
                tax_percentage: 0,
              })
            }
            style={{ marginBottom: "20px", padding: "8px 15px" }}
          >
            Add Product
          </button>
        </div>

        <button
          type="submit"
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Generate PDF
        </button>
      </form>

      {successMessage && (
        <p
          style={{
            fontWeight: "bold",
            color: successMessage.includes("✅") ? "green" : "red",
            marginTop: "20px",
          }}
        >
          {successMessage}
        </p>
      )}

      {/* Invoice Preview */}
      <div style={{ marginTop: "30px" }}>
        <h2>Invoice Preview</h2>
        <p>
          <strong>Invoice Number:</strong> {formData.invoice_number}
        </p>
        <p>
          <strong>Invoice Date:</strong>{" "}
          {formatDate(formData.invoice_date)}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <h3>Seller</h3>
            <p>Name: {formData.seller?.name}</p>
            <p>Address: {formData.seller?.address}</p>
            <p>GST: {formData.seller?.gst_number}</p>
            <p>Phone: {formData.seller?.phone_number}</p>
          </div>

          <div>
            <h3>Buyer</h3>
            <p>Name: {formData.buyer?.name}</p>
            <p>Address: {formData.buyer?.address}</p>
            <p>GST: {formData.buyer?.gst_number}</p>
            <p>Phone: {formData.buyer?.phone_number}</p>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ccc", padding: "5px" }}>#</th>
              <th style={{ border: "1px solid #ccc", padding: "5px" }}>
                Product
              </th>
              <th style={{ border: "1px solid #ccc", padding: "5px" }}>
                Qty
              </th>
              <th style={{ border: "1px solid #ccc", padding: "5px" }}>
                Rate
              </th>
              <th style={{ border: "1px solid #ccc", padding: "5px" }}>
                Tax %
              </th>
              <th style={{ border: "1px solid #ccc", padding: "5px" }}>
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {formData.products?.map((p, i) => {
              const amount = calculateAmount(p);
              return (
                <tr key={i}>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    {i + 1}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "5px" }}>
                    {p.product_name}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    {p.quantity}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "5px",
                      textAlign: "right",
                    }}
                  >
                    {p.rate_per_unit.toFixed(2)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    {p.tax_percentage.toFixed(2)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "5px",
                      textAlign: "right",
                    }}
                  >
                    {amount.toFixed(2)}
                  </td>
                </tr>
              );
            })}

            <tr>
              <td
                colSpan="5"
                style={{
                  border: "1px solid #ccc",
                  padding: "5px",
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                Grand Total
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "5px",
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                {grandTotal?.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InvoiceForm;
