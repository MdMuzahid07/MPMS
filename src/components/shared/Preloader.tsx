"use client";

import Loading from "@/app/loading";
import { useEffect, useState } from "react";

export default function Preloader({
  children,
  hasVisited,
}: {
  children: React.ReactNode;
  hasVisited: boolean;
}) {
  const [showLoader, setShowLoader] = useState(!hasVisited);

  useEffect(() => {
    if (!hasVisited) {
      // Set the flag in cookie so the server knows on next reload!
      document.cookie = "onyx_first_visit=true; path=/; max-age=31536000";

      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasVisited]);

  if (showLoader) {
    return <Loading />;
  }

  return <>{children}</>;
}
