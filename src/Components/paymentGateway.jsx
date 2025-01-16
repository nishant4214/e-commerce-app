import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Import QRCodeCanvas
import createOrder from '../netlify/createOrder';

const PaymentComponent = ({ amountProps, cgst, sgst,shippingAddress,isBuyNow,productId,file_id }) => {
  const [amount, setAmount] = useState(amountProps);
  const payeeName = 'Nishant Sudam Pande'; // Payee name
  const upiID = 'nishant.pande123-3@okaxis'; // UPI ID
  const transactionNote = 'Order'; // Transaction Note
  const [transactionId, setTransactionId] = useState(''); // State for transaction ID
  
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user); 
  // Function to generate UPI QR link
  const generateUPIQRLink = () => {
    const upi = {
      pa: upiID, // UPI ID
      pn: payeeName, // Payee Name
      tn: transactionNote, // Transaction Note
      am: amount, // Amount
      cu: 'INR', // Currency
    };

    return `upi://pay?${new URLSearchParams(upi).toString()}`;
  };

  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value); // Update transaction ID state
  };

   // Handle form submission of transaction ID
  const handleSubmitTransactionId = async () => {
    if (transactionId) {

      alert(file_id)
      const  uniqueOrderNumber = await createOrder(userObj.id, cgst, sgst, amountProps, shippingAddress, transactionId, isBuyNow,productId,file_id);
      console.log(userObj.id, cgst, sgst, amountProps, shippingAddress, transactionId, isBuyNow,productId,file_id)
      console.log( JSON.stringify({
        customer_id: Number(userObj.id),
        address_id: Number(shippingAddress),
        total_amount: amountProps,
        cgst,
        sgst,
        transaction_id: transactionId,
        order_number: uniqueOrderNumber,
        buynow: isBuyNow,
        product_id_ref : Number(productId),
        file_id_ref: file_id
    }))
      if(!uniqueOrderNumber){
        alert(`error submitting order: ${transactionId}`);
        return;
      }
        alert(`Transaction ID submitted: ${transactionId}`);
        // Reset the input field after submission
        setTransactionId('');
      } else {
        alert('Please enter a valid transaction ID');
      }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        Please scan below QR code for payment. After successful transaction, enter the Transaction ID and submit.
      </h2>

      <div style={styles.row}>
        {/* Left column - QR Code */}
        <div style={styles.qrCodeContainer}>
          <h3>Scan this QR code to pay</h3>
          <QRCodeCanvas value={generateUPIQRLink()} size={256} />
          <h2 style={styles.heading}>Make payment</h2>
          <div style={styles.infoContainer}>
            <h3>Payee Name: {payeeName}</h3>
            <h2>Amount: ₹{amount}</h2>
          </div>
        </div>

        {/* Right column - Transaction ID Input */}
        <div style={styles.transactionInputContainer}>
          <h3 style={styles.transactionHeading}>Enter Transaction ID:</h3>
          <input
            type="text"
            placeholder="Transaction ID"
            value={transactionId}
            onChange={handleTransactionIdChange}
            style={styles.input}
          />
          <button style={styles.submitButton} onClick={handleSubmitTransactionId}>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '900px', // Adjust width for two-column layout
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
  qrCodeContainer: {
    textAlign: 'center',
    marginRight: '20px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  transactionInputContainer: {
    width: '45%',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  transactionHeading: {
    fontSize: '20px',
    marginBottom: '15px',
    fontWeight: '500',
  },
  input: {
    padding: '12px',
    width: '80%',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    width: '100%',
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
};

export default PaymentComponent;