import { getPosts } from "../../actions";
import PostsClient from "./PostsClient";

export const metadata = {
  title: "Posts | Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await getPosts();
  return <PostsClient initialPosts={posts} />;
}
