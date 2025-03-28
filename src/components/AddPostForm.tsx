"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Box, Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';
import { createPost } from '@/app/(private)/pridat/actions';

export default function AddPostForm() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', caption);
      formData.append('tags', tags);

      const result = await createPost(formData);

      if (result.success) {
        router.push('/prispevok');
        router.refresh();
      } else {
        setError(result.error || 'Failed to create post');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New Post
      </Typography>

      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          mb: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider'
        }}
      >
        <input {...getInputProps()} />
        {preview ? (
          <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
            <Image
              src={preview}
              alt="Preview"
              fill
              style={{ objectFit: 'contain' }}
            />
          </Box>
        ) : (
          <Box sx={{ py: 5 }}>
            <CloudUploadIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
            <Typography>
              {isDragActive
                ? 'Drop the image here'
                : 'Drag and drop an image here, or click to select'}
            </Typography>
          </Box>
        )}
      </Paper>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="nature, photography, lifestyle"
        sx={{ mb: 3 }}
      />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting || !file}
        sx={{ mb: 2 }}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Post'}
      </Button>

      {preview && (
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            setPreview(null);
            setFile(null);
          }}
        >
          Remove Image
        </Button>
      )}
    </Box>
  );
} 