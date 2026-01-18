import { useEffect } from "react";
import { HudFrame } from "../hud-frame";
import { usePrivy } from "@privy-io/react-auth";

export function LoginPopup() {
  const { login } = usePrivy();

  useEffect(() => {
    login();
  }, [login]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <HudFrame>
        <div className="flex flex-col items-center gap-6 min-w-[320px] max-w-sm">
          <div className="text-2xl font-bold text-primary mb-2 text-center">Welcome to key manager!</div>
          <div className="text-foreground text-center mb-2 flex items-center justify-center">
            <span>Checking if you are logged in</span>
            <span className="dot-ellipsis">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
        </div>
      </HudFrame>
    </div>
  );
} 