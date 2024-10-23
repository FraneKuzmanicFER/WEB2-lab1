import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import HomePage from "./pages/HomePage";
import TicketPage from "./pages/TicketPage";
import ProtectedRoute from "./ProtectedRoute";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/ticket/:uuid",
    element: (
      <ProtectedRoute>
        <TicketPage />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-vvufctniwl0ae1qu.us.auth0.com"
      clientId="pMetcpCmh7NuClOf8qhB1oOP4MpKEUP0"
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
);
