import React from 'react';

const ReceiptTemplate = React.forwardRef(({ data }, ref) => {
  const { date, recipientName, amount, currency, amountInWords, receiverName, items } = data;

  return (
    <div ref={ref} className="receipt-container">
      <div className="receipt">
        {/* Header */}
        <div className="header">
          <div className="title">إيصال استلام</div>
          <div className="date-section">
            <span>التاريخ:</span>
            <span>{new Date(date).toLocaleDateString('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {/* Recipient */}
          <div className="row">
            <span className="label">استلمنا من السيد:</span>
            <span className="value">{recipientName}</span>
          </div>

          {/* Amount Section */}
          <div className="amount-section">
            <div className="amount-row">
              <div className="amount-group">
                <span className="label">مبلغ وقدره:</span>
                <div className="amount-box">{amount}</div>
              </div>
              <div className="amount-group">
                <span className="label">العملة:</span>
                <div className="amount-box">{currency}</div>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          {amountInWords && (
            <div className="row">
              <span className="label">المبلغ كتابة:</span>
              <span className="value">{amountInWords}</span>
            </div>
          )}

          {/* Items Table */}
          <div className="items-section">
            <div className="section-title">وذلك عن:</div>
            <table className="items-table">
              <thead>
                <tr>
                  <th className="item-desc">البيان</th>
                  <th className="item-amount">المبلغ ({currency})</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="item-desc">{item.description}</td>
                    <td className="item-amount">{parseFloat(item.amount).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td className="item-desc">المجموع الكلي</td>
                  <td className="item-amount">{amount}</td>
                </tr>
              </tbody>
            </table>
          </div>


        </div>

        {/* Footer */}
        <div className="footer">
          <div>
            <div className="label">اسم المستلم:</div>
            <div className="value">{receiverName}</div>
          </div>
          <div>
            <div className="signature-label">توقيع المستلم</div>
            <div className="value"></div>
          </div>
          
        </div>
      </div>
    </div>
  );
});

ReceiptTemplate.displayName = 'ReceiptTemplate';

export default ReceiptTemplate;
