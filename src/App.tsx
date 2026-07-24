import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { isLoggedIn, logout } from "./lib/auth";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  if (!loggedIn) {
    return <Login onSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <Dashboard
      onLogout={() => {
        logout();
        setLoggedIn(false);
      }}
    />
  );
}
