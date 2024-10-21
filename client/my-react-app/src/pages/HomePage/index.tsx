import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import "./styles.css";
import ticketsImage from "../../assets/tickets.png";

const HomePage: React.FC = () => {
  const [tickets, setTickets] = useState<number>(0);

  useEffect(() => {
    axiosInstance
      .get("/tickets")
      .then((response) => {
        setTickets(response.data.count);
      })
      .catch((error) => {
        console.error("There was an error fetching the ticket count!", error);
      });
  }, []);

  return (
    <div className="home-page-container">
      <div className="ticket-section">
        <div className="ticket-img-container">
          <img src={ticketsImage} alt="ticket" />
        </div>
        <div className="ticket-text-container">
          <h1>Get your tickets now!</h1>
          <p>
            Number of tickets generated:{" "}
            <span className="ticket-number">{tickets}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
