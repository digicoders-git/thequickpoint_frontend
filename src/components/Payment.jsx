import { useState, useEffect } from "react";
import { MdPayment, MdDelete, MdHistory, MdVisibility, MdAttachMoney } from "react-icons/md";
import Swal from "sweetalert2";
import "./Payment.css";

export default function Payment({ onPaymentUpdate }) {
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = () => {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    setPaymentHistory(payments.reverse()); // Show latest first
  };



  const viewPaymentDetails = (payment) => {
    const itemsList = payment.items.map(item => 
      `${item.name} x${item.quantity} = ₹${item.price * item.quantity}`
    ).join('<br>');

    Swal.fire({
      title: `Payment #${payment.id}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Customer:</strong> ${payment.customer.name}</p>
          <p><strong>Phone:</strong> ${payment.customer.phone}</p>
          <p><strong>Date:</strong> ${payment.date} at ${payment.time}</p>
          <p><strong>Payment Method:</strong> ${payment.paymentMethod}</p>
          <hr>
          <p><strong>Items:</strong></p>
          <div style="margin-left: 10px;">${itemsList}</div>
          <hr>
          <p><strong>Subtotal:</strong> ₹${payment.subtotal}</p>
          <p><strong>Discount:</strong> ₹${payment.discount}</p>
          <p><strong>Total:</strong> ₹${payment.total}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close'
    });
  };

  const deletePayment = async (paymentId) => {
    const result = await Swal.fire({
      title: 'Delete Payment?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete!'
    });

    if (result.isConfirmed) {
      const updatedPayments = paymentHistory.filter(payment => payment.id !== paymentId);
      localStorage.setItem('payments', JSON.stringify(updatedPayments.reverse()));
      
      // Trigger dashboard update
      if (onPaymentUpdate) onPaymentUpdate();
      window.dispatchEvent(new Event('paymentUpdate'));
      
      loadPaymentHistory();
      Swal.fire('Deleted!', 'Payment record has been deleted.', 'success');
    }
  };

  const getTotalPayments = () => {
    return paymentHistory.reduce((total, payment) => total + payment.total, 0);
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2><MdPayment /> Payment Management</h2>
        <div className="total-payment-display">
          <div className="total-payment-card">
            <MdAttachMoney className="payment-icon" />
            <div className="payment-info">
              <h3>₹{getTotalPayments()}</h3>
              <p>Total Payments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="payment-history-section">
        <h3><MdHistory /> Payment History</h3>
        {paymentHistory.length === 0 ? (
          <div className="no-payments">
            <p>No payment history available</p>
          </div>
        ) : (
          <div className="payment-history-table">
            <table>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id}>
                    <td>#{payment.id}</td>
                    <td>{payment.customer.name}</td>
                    <td>{payment.items.length} items</td>
                    <td>₹{payment.total}</td>
                    <td>
                      <span className="payment-method-badge">
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td>{payment.date}</td>
                    <td>
                      <div className="actions-container">
                        <button 
                          onClick={() => viewPaymentDetails(payment)} 
                          className="action-btn view-btn" 
                          title="View Details"
                        >
                          <MdVisibility style={{fontSize: '16px'}} />
                        </button>
                        <button 
                          onClick={() => deletePayment(payment.id)} 
                          className="action-btn delete-btn" 
                          title="Delete"
                        >
                          <MdDelete style={{fontSize: '16px'}} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}