import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import "./styles.css";
import ticketsImage from "../../assets/tickets.png";
import { useAuth0 } from "@auth0/auth0-react";
4;
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [tickets, setTickets] = useState<number>(0);
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const navigate = useNavigate();

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

  useEffect(() => {
    if (isAuthenticated && window.location.pathname.includes("/ticket/")) {
      navigate(window.location.pathname);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="home-page-container">
      <header className="ticket-section-header">
        {isAuthenticated ? (
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Logout
          </button>
        ) : (
          <button onClick={() => loginWithRedirect()}>Login</button>
        )}
      </header>
      <div className="ticket-section">
        <div className="ticket-img-container">
          <img src={ticketsImage} alt="ticket" />
        </div>
        <div className="ticket-text-container">
          <h1>Get your tickets now!</h1>
          <p>
            Number of tickets generated:
            <span className="ticket-number">{tickets}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
