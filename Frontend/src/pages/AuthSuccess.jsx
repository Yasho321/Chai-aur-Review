import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // read token from query params
    const params = new URLSearchParams(window.location.search);
    const token = params.get("code");

    if (token) {
      // store in localStorage
      localStorage.setItem("authToken", token);

      // clear query params for cleaner URL
      window.history.replaceState({}, document.title, "/");
    }

    navigate("/");
  }, [navigate]);

  return <p>Logging you in...</p>;
}

export default AuthSuccess;
