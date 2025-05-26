"use client";

import Header from "@/components/Header";
import React from "react";
import formStyles from "@/styles/Form.module.scss";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className={formStyles.container}>
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
