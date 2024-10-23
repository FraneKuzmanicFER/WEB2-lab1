// src/pages/TicketPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axios";

const TicketPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return (
    <div>
      <h1>Ticket Details</h1>
      <p>VATIN: {ticket.vatin}</p>
      <p>First Name: {ticket.firstname}</p>
      <p>Last Name: {ticket.lastname}</p>
      <p>Time of Purchase: {ticket.timeofpurchase}</p>
    </div>
  );
};

export default TicketPage;
