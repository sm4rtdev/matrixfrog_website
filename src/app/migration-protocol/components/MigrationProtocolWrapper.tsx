// app/migration-protocol/MigrationProtocolWrapper.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import the actual client component
const MigrationProtocolClient = dynamic(
  () => import("./MigrationProtocolClient"),
  { ssr: false }
);

export default function MigrationProtocolWrapper() {
  return <MigrationProtocolClient />;
}
