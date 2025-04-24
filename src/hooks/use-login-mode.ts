
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export type LoginMode = "staff" | "guest" | null;

export const useLoginMode = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const modeParam = (searchParams.get("mode") === "guest" || searchParams.get("mode") === "staff")
    ? searchParams.get("mode") as LoginMode
    : null;
  
  const [mode, setMode] = useState<LoginMode>(modeParam);

  useEffect(() => {
    if (!modeParam) {
      navigate("/login?mode=staff", { replace: true });
    } else {
      setMode(modeParam);
    }
  }, [modeParam, navigate]);

  const switchMode = (newMode: LoginMode) => {
    if (newMode) {
      navigate(`/login?mode=${newMode}`, { replace: true });
      setMode(newMode);
    }
  };

  return { mode, switchMode };
};
