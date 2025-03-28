//import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { getPosts } from "./actions";
import Post from "@/components/Post";

type Post = {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
};

export const metadata = { title: "Zoznam prispevkov | INSTAGRAM" };

export default async function PostsList() {
  const posts = await getPosts();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 3
      }}>
        {posts.map((post: Post) => (
          <Post
            key={post.id}
            id={post.id}
            username={post.user.name || "Anonymous"}
            profilePicture={post.user.image || undefined}
            imageUrl={post.imageUrl}
            likes={post.likes}
            comments={post.comments}
            isLiked={post.isLiked}
          />
        ))}
      </Box>
    </Container>
  );
}