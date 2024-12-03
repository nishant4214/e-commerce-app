import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Import QRCodeCanvas

const PaymentComponent = ({ amountProps }) => {
  const [amount, setAmount] = useState(amountProps);
  const payeeName = 'Nishant Sudam Pande'; // Payee name
  const upiID = 'nishant.pande123-3@okaxis'; // UPI ID
  const transactionNote = 'Order'; // Transaction Note

  // Function to generate UPI QR link
  const generateUPIQRLink = () => {
    const upi = {
      pa: upiID, // UPI ID
      pn: payeeName, // Payee Name
      tn: transactionNote, // Transaction Note
      am: amount, // Amount
      cu: 'INR', // Currency
    };

    // Return the UPI link with encoded parameters
    return `upi://pay?${new URLSearchParams(upi).toString()}`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Make payment</h2>

      {/* Display the QR Code if amount is entered */}
      {amount && (
        <div style={styles.qrCodeContainer}>
          <h3>Scan this QR code to pay</h3>
          <QRCodeCanvas value={generateUPIQRLink()} size={256} />
        </div>
      )}

      {/* Payee Name and Amount Display */}
      <div style={styles.infoContainer}>
        <h3>Payee Name: {payeeName}</h3>
        <h2>Amount: ₹{amount}</h2>
      </div>

    </div>
  );
};

// Styling for the component
const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    margin: 'auto',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
    fontWeight: '600',
  },
  infoContainer: {
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  qrCodeContainer: {
    marginTop: '20px',
  },
};

export default PaymentComponent;
