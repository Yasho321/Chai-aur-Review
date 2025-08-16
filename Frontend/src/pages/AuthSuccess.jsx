import { Loader2 } from "lucide-react";
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

  return  (
<div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex justify-center">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
      </div>
    </div>
    ) 
}

export default AuthSuccess;
