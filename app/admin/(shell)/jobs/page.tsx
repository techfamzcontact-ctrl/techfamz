import type { Metadata } from "next";
import { getJobs } from "../../actions";
import JobsClient from "./JobsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jobs | Admin Dashboard",
};

export default async function AdminJobsPage() {
  const jobs = await getJobs();
  return <JobsClient initialJobs={jobs} />;
}
