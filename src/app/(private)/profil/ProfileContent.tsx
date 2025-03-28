"use client";

import { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Button, Dialog, TextField, IconButton, Grid, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Image from 'next/image';
import { getUserProfile, updateProfile } from './actions';
import { useRouter } from 'next/navigation';

export default function ProfileContent() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [editData, setEditData] = useState<{
    name: string;
    bio: string;
    location: string;
    interests: string;
  } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
    loadProfile();
  }, []);

  const handleEdit = () => {
    if (!profile) return;
    
    setEditData({
      name: profile.name || '',
      bio: profile.profile?.bio || '',
      location: profile.profile?.location || '',
      interests: profile.profile?.interests?.join(', ') || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editData) return;

    const formData = new FormData();
    formData.append('name', editData.name);
    formData.append('bio', editData.bio);
    formData.append('location', editData.location);
    formData.append('interests', editData.interests);

    try {
      await updateProfile(formData);
      setIsEditing(false);
      const updatedProfile = await getUserProfile();
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile) return null;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Profile Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        mb: 6, 
        gap: 4,
        flexWrap: { xs: 'wrap', md: 'nowrap' }
      }}>
        <Avatar
          src={profile.image || undefined}
          alt={profile.name || 'Profile'}
          sx={{
            width: 150,
            height: 150,
            boxShadow: 3,
          }}
        />
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              {profile.name}
            </Typography>
            <IconButton onClick={handleEdit} sx={{ ml: 2 }}>
              <EditIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {profile.email}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 4, 
            mb: 3,
            flexWrap: 'wrap'
          }}>
            <Box>
              <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                {profile.stats.posts}
              </Typography>
              <Typography color="text.secondary" sx={{ ml: 1 }} component="span">
                príspevkov
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                {profile.stats.followers}
              </Typography>
              <Typography color="text.secondary" sx={{ ml: 1 }} component="span">
                sledovateľov
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                {profile.stats.following}
              </Typography>
              <Typography color="text.secondary" sx={{ ml: 1 }} component="span">
                sledovaných
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {profile.profile?.bio}
            </Typography>
            {profile.profile?.location && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                📍 {profile.profile.location}
              </Typography>
            )}
          </Box>

          {profile.profile?.interests && profile.profile.interests.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {profile.profile.interests.map((interest: string, index: number) => (
                <Chip
                  key={index}
                  label={interest}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Posts Grid */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 2
      }}>
        {profile.posts.map((post: any) => (
          <Box
            key={post.id}
            sx={{
              position: 'relative',
              paddingTop: '100%',
              cursor: 'pointer',
              '&:hover': {
                '& .overlay': {
                  opacity: 1,
                },
              },
            }}
            onClick={() => router.push(`/prispevok/${post.id}`)}
          >
            <Image
              src={post.imageUrl}
              alt={post.caption || 'Post image'}
              fill
              style={{
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            <Box
              className="overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
                borderRadius: '8px',
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>❤️</Typography>
                  <Typography fontWeight="bold">{post.likesCount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>💬</Typography>
                  <Typography fontWeight="bold">{post.commentsCount}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Upraviť profil
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meno"
                value={editData?.name || ''}
                onChange={(e) => setEditData(prev => ({ ...prev!, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bio"
                value={editData?.bio || ''}
                onChange={(e) => setEditData(prev => ({ ...prev!, bio: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lokalita"
                value={editData?.location || ''}
                onChange={(e) => setEditData(prev => ({ ...prev!, location: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Zaujímavosti (oddelené čiarkou)"
                value={editData?.interests || ''}
                onChange={(e) => setEditData(prev => ({ ...prev!, interests: e.target.value }))}
                helperText="Napríklad: fotografia, cestovanie, umenie"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={() => setIsEditing(false)}>
              Zrušiť
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Uložiť zmeny
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
} 