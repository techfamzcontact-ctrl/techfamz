import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSystemHealth } from "@/app/admin/actions";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Admin Settings & Operations | Techfamz",
  description: "Manage admin password, account security, and inspect platform integrations.",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const health = await getSystemHealth();

  return (
    <SettingsClient
      userEmail={session.user.email}
      initialHealth={health}
    />
  );
}
