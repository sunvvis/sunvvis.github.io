"use client";

import { Suspense } from "react";
import GiscusComments from "./GiscusComments";

export default function ClientGiscusComments() {
  return (
    <Suspense
      fallback={
        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      }
    >
      <GiscusComments />
    </Suspense>
  );
}
