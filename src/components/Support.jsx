import { useState } from "react";
import { MdSupport, MdReply, MdClose, MdCheckCircle } from "react-icons/md";

export default function Support() {
  const [tickets] = useState([
    { id: 1, user: "John Doe", subject: "Login Issue", priority: "High", status: "Open", date: "2024-01-15" },
    { id: 2, user: "Jane Smith", subject: "Payment Problem", priority: "Medium", status: "In Progress", date: "2024-01-14" },
    { id: 3, user: "Bob Johnson", subject: "Feature Request", priority: "Low", status: "Closed", date: "2024-01-13" }
  ]);

  return (
    <div className="support-container">
      <div className="support-header">
        <h2><MdSupport /> Support Center</h2>
        <button className="add-btn">Create Ticket</button>
      </div>
      
      <div className="support-stats">
        <div className="stat-card">
          <h3>12</h3>
          <p>Open Tickets</p>
        </div>
        <div className="stat-card">
          <h3>8</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card">
          <h3>45</h3>
          <p>Resolved</p>
        </div>
      </div>

      <div className="support-table">
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>User</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>{ticket.user}</td>
                <td>{ticket.subject}</td>
                <td>
                  <span className={`priority ${ticket.priority.toLowerCase()}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td>
                  <span className={`status ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>{ticket.date}</td>
                <td>
                  <button className="action-btn reply-btn" title="Reply">
                    <MdReply />
                  </button>
                  <button className="action-btn resolve-btn" title="Resolve">
                    <MdCheckCircle />
                  </button>
                  <button className="action-btn close-btn" title="Close">
                    <MdClose />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}