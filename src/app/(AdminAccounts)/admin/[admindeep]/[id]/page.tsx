import AdminDashboard from "@/DashboardComponents/AdminAccount/AdminDashboard/AdminDashboard";
import React from "react";

export default async function Page({ params }: { params: Promise<{ id: string; admindeep: string }> }) {
  const { id, admindeep } = await params;
  const courseId = parseInt(id); 

  return <AdminDashboard deeppage={admindeep} deepid={courseId} />;
}