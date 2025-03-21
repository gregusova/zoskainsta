import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Post from "@/components/Post";
import { getPosts } from "../app/(private)/prispevok/actions";
import { useSession } from "next-auth/react";

type PostFromServer = {
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

type PostType = PostFromServer;

const PostListClient: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchPosts() {
      const posts = await getPosts();
      const formattedPosts = posts.map(post => ({
        ...post,
        likes: post.likes || 0,
        comments: post.comments || 0,
        isLiked: post.isLiked || false
      }));
      setPosts(formattedPosts);
    }
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    await fetch(`/posts/${postId}/like`, { method: 'POST' });
    // Update the UI accordingly
    setPosts(posts.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post));
  };

  const handleAddComment = async (postId: string, content: string) => {
    await fetch(`/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    // Update the UI accordingly
    setPosts(posts.map(post => post.id === postId ? { ...post, comments: post.comments + 1 } : post));
  };

  const handleDeleteComment = async (commentId: string) => {
    await fetch(`/posts/comment/${commentId}`, { method: 'DELETE' });
    // Update the UI accordingly
    // This is a simplified example, you might need to adjust it based on your actual data structure
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 3
      }}>
        {posts.map((post: PostType) => (
          <Post
            key={post.id}
            id={post.id}
            username={post.user.name || "Anonymous"}
            profilePicture={post.user.image || undefined}
            imageUrl={post.imageUrl}
            likes={post.likes}
            comments={post.comments}
            isLiked={post.isLiked}
            onLike={() => handleLike(post.id)}
            onAddComment={(content: string) => handleAddComment(post.id, content)}
            onDeleteComment={handleDeleteComment}
          />
        ))}
      </Box>
    </Container>
  );
};

export default PostListClient;