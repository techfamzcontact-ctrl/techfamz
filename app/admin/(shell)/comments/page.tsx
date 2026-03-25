import { getComments } from "../../actions";
import CommentsClient from "./CommentsClient";

export const metadata = {
  title: "Comments | Admin Dashboard",
};

export default async function AdminCommentsPage() {
  const comments = await getComments();
  return <CommentsClient initialComments={comments} />;
}
