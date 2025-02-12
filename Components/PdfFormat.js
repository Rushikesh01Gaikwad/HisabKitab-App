export const generateCustomerInvoiceHTML = (data) => {
    const {
      name = 'N/A',
      mobile = 'N/A',
      rate = '0.00',
      quantity = '0',
      discount = '0',
      isDiscountPercentage = true,
      description = 'N/A',
      total = '0.00',
    } = data;
  
    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h1 {
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            table, th, td {
              border: 1px solid #ccc;
            }
            th, td {
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .total {
              font-weight: bold;
              color: #28a745;
            }
          </style>
        </head>
        <body>
          <h1>Customer Invoice</h1>
          <table>
            <tr>
              <th>Name</th>
              <td>${name}</td>
            </tr>
            <tr>
              <th>Mobile</th>
              <td>${mobile}</td>
            </tr>
            <tr>
              <th>Rate</th>
              <td>₹${rate}</td>
            </tr>
            <tr>
              <th>Quantity</th>
              <td>${quantity}</td>
            </tr>
            <tr>
              <th>Discount</th>
              <td>${discount} ${isDiscountPercentage ? '%' : '₹'}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>${description}</td>
            </tr>
            <tr class="total">
              <th>Total</th>
              <td>₹${total}</td>
            </tr>
          </table>
        </body>
      </html>
    `;
  };
  