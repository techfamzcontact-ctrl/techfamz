import { getDevelopers } from "../../actions";
import DevelopersClient from "./DevelopersClient";

export const metadata = {
  title: "Developers & TIDs | Admin Dashboard",
  description: "View and manage Techfamz Identity (TID) holders.",
};

export const dynamic = "force-dynamic";

export default async function AdminDevelopersPage() {
  const developers = await getDevelopers();
  return <DevelopersClient initialDevelopers={developers} />;
}
