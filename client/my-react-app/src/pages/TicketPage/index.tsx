// src/pages/TicketPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles.css";

const TicketPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [ticket, setTicket] = useState<any>(null);
  const [purchaseTime, setPurchaseTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axiosInstance.get(`/tickets/${uuid}`);
        setTicket(response.data);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [uuid]);

  useEffect(() => {
    if (ticket) {
      const time = new Date(ticket.timeofpurchase);
      setPurchaseTime(time);
    }
  }, [ticket]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return (
    <div className="ticket-page-container">
      <header className="ticket-header">
        {isAuthenticated && user && (
          <p>
            Logged in as: <span> {" " + user.name}</span>
          </p>
        )}
      </header>
      <div className="ticket-section">
        <h1 className="ticket-details">Ticket Details</h1>
        <p>
          VATIN: <span>{ticket.vatin}</span>
        </p>
        <p>
          First Name: <span>{ticket.firstname}</span>
        </p>
        <p>
          Last Name: <span>{ticket.lastname}</span>
        </p>
        <p>
          Time of Purchase:{" "}
          <span>
            {purchaseTime ? purchaseTime.toLocaleTimeString("en-GB") : ""}
          </span>
        </p>
      </div>
    </div>
  );
};

export default TicketPage;
