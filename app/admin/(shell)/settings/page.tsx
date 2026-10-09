import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSystemHealth } from "@/app/admin/actions";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Settings | Admin Dashboard",
  description: "Change the admin password and check the health of the site's services.",
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
