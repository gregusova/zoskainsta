"use client";

import { Box, Skeleton } from '@mui/material';

export default function LoadingProfile() {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 6, gap: 4, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
        <Skeleton variant="circular" width={150} height={150} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
            <Skeleton variant="text" width={100} height={24} />
            <Skeleton variant="text" width={100} height={24} />
            <Skeleton variant="text" width={100} height={24} />
          </Box>
          <Skeleton variant="text" width="80%" height={60} />
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} variant="rectangular" sx={{ paddingTop: '100%', borderRadius: 1 }} />
        ))}
      </Box>
    </Box>
  );
} 