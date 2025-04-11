import AdminDashboard from "@/DashboardComponents/AdminAccount/AdminDashboard/AdminDashboard";
import React from "react";

export default async function Page({ params }: { params: Promise<{ admindeep: string }> }) {
  const { admindeep } = await params;
  return <AdminDashboard deeppage={admindeep} />;
}