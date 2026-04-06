"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthRedirectButtonProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A button that sends unauthenticated users to /login,
 * and authenticated users to /dashboard?tab=upload.
 */
export default function AuthRedirectButton({
  children,
  style,
  className,
  onMouseEnter,
  onMouseLeave,
}: AuthRedirectButtonProps) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setLoggedIn(!!data.user);
        setChecked(true);
      })
      .catch(() => {
        setChecked(true);
      });
  }, []);

  const handleClick = () => {
    if (!checked) return; // still loading
    if (loggedIn) {
      router.push("/dashboard?tab=upload");
    } else {
      // Store intended destination so login can redirect back
      router.push("/login?redirect=/dashboard?tab=upload");
    }
  };

  return (
    <button
      className={className}
      style={style}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );
}
