"use client";

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardHeader, 
  CardMedia, 
  CardActions, 
  CardContent, 
  TextField,
  IconButton, 
  Box, 
  Typography, 
  Avatar, 
  Button,
  Divider
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDistanceToNow } from 'date-fns';
import { sk } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface DetailedPostProps {
  id: string;
  username: string;
  profilePicture?: string;
  imageUrl: string;
  caption?: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags?: string[];
}

export default function DetailedPost({ 
  id, 
  username, 
  profilePicture, 
  imageUrl, 
  caption,
  createdAt,
  likes = 0, 
  comments = [], 
  isLiked = false,
  isBookmarked = false,
  tags = []
}: DetailedPostProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPostLiked, setIsPostLiked] = useState(isLiked);
  const [isPostBookmarked, setIsPostBookmarked] = useState(isBookmarked);
  const [likeCount, setLikeCount] = useState(likes);
  const [postComments, setPostComments] = useState<Comment[]>(comments);
  const [newComment, setNewComment] = useState('');

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
      });
      const data = await response.json();
      setIsPostLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await fetch(`/api/posts/${id}/bookmark`, {
        method: 'POST',
      });
      const data = await response.json();
      setIsPostBookmarked(data.bookmarked);
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await response.json();
      setPostComments(prev => [data, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      setPostComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <Card sx={{ 
      width: '100%',
      maxWidth: 800,
      mx: 'auto',
      bgcolor: 'background.paper',
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      <CardHeader
        avatar={
          <Avatar 
            src={profilePicture} 
            alt={username}
            sx={{ width: 40, height: 40 }}
            onClick={() => router.push(`/profil/${username}`)}
            style={{ cursor: 'pointer' }}
          />
        }
        title={
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onClick={() => router.push(`/profil/${username}`)}
          >
            {username}
          </Typography>
        }
        subheader={formatDistanceToNow(new Date(createdAt), { 
          addSuffix: true,
          locale: sk 
        })}
      />
      <CardMedia
        component="img"
        image={imageUrl}
        alt="Post image"
        sx={{ 
          width: '100%',
          maxWidth: '800px',
          height: 'auto',
          objectFit: 'contain',
          aspectRatio: '1',
          margin: '0 auto',
          backgroundColor: 'rgb(250, 250, 250)'
        }}
      />
      <CardActions disableSpacing>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          width: '100%',
          justifyContent: 'space-between',
          px: 2
        }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleLike} color={isPostLiked ? 'error' : 'default'}>
              {isPostLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton>
              <ChatBubbleOutlineIcon />
            </IconButton>
          </Box>
          <IconButton onClick={handleBookmark}>
            {isPostBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Box>
      </CardActions>
      <CardContent>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          {likeCount} páči sa používateľom
        </Typography>
        
        {caption && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
              {username}
            </Typography>
            <Typography variant="body2" component="span">
              {caption}
            </Typography>
          </Box>
        )}

        {tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {tags.map((tag) => (
              <Typography
                key={tag}
                variant="body2"
                component="span"
                sx={{
                  color: 'primary.main',
                  mr: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => router.push(`/tag/${tag}`)}
              >
                #{tag}
              </Typography>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {postComments.map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <Avatar
                src={comment.user.image || undefined}
                alt={comment.user.name || 'User'}
                sx={{ width: 32, height: 32 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
                  {comment.user.name}
                </Typography>
                <Typography variant="body2" component="span">
                  {comment.content}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                  {formatDistanceToNow(new Date(comment.createdAt), { 
                    addSuffix: true,
                    locale: sk 
                  })}
                </Typography>
              </Box>
              {session?.user?.email && comment.user.name === session.user.name && (
                <IconButton
                  size="small"
                  onClick={() => handleDeleteComment(comment.id)}
                  sx={{ ml: 'auto' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <form onSubmit={handleAddComment}>
          <TextField
            fullWidth
            size="small"
            placeholder="Pridať komentár..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 1 }}
          />
        </form>
      </CardContent>
    </Card>
  );
} 