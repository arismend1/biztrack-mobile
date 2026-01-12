import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const generateInvoicePDF = async (invoice, companySettings) => {
    const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .title { font-size: 40px; font-weight: bold; color: #2c3e50; }
            .company-info { text-align: right; }
            .invoice-details { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 10px; border-bottom: 2px solid #eee; }
            td { padding: 10px; border-bottom: 1px solid #eee; }
            .totals { float: right; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; }
            .status { font-weight: bold; text-transform: uppercase; color: ${invoice.status === 'PAID' ? 'green' : 'red'}; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">INVOICE</div>
            <div>#${invoice.number}</div>
            <div class="status">${invoice.status}</div>
          </div>
          <div class="company-info">
            <h2>${companySettings.name || 'Your Company'}</h2>
            <p>${companySettings.address || ''}<br>${companySettings.city || ''}, ${companySettings.state || ''} ${companySettings.zip || ''}</p>
            <p>${companySettings.email || ''} | ${companySettings.phone || ''}</p>
          </div>
        </div>

        <div class="invoice-details">
          <strong>Bill To:</strong><br>
          ${invoice.client?.name}<br>
          ${invoice.client?.email || ''}<br>
          ${invoice.client?.address || ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: right;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items?.map(item => `
              <tr>
                <td>
                    <b>${item.name}</b><br>
                    <small>${item.description || ''}</small>
                </td>
                <td style="text-align: right;">${item.quantity}</td>
                <td style="text-align: right;">$${item.price.toFixed(2)}</td>
                <td style="text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>$${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>Tax Amount:</span>
            <span>$${invoice.taxAmount.toFixed(2)}</span>
          </div>
          <div class="totals-row grand-total">
            <span>Total:</span>
            <span>$${invoice.total.toFixed(2)}</span>
          </div>
           <div class="totals-row" style="color: green; margin-top: 10px;">
            <span>Amount Paid:</span>
            <span>$${invoice.amountPaid.toFixed(2)}</span>
          </div>
           <div class="totals-row" style="color: red; font-weight: bold;">
            <span>Balance Due:</span>
            <span>$${invoice.balanceDue.toFixed(2)}</span>
          </div>
        </div>

        <div style="clear: both; margin-top: 50px; font-size: 12px; color: #999; text-align: center;">
            Thank you for your business!
        </div>
      </body>
    </html>
  `;

    try {
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
};
