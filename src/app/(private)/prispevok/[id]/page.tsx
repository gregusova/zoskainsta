// src/app/prispevok/[id]/page.tsx

import { getPost } from '../actions';
import { Container, Box, Typography } from '@mui/material';
import DetailedPost from '@/components/DetailedPost';

export const metadata = {
  title: 'Detail príspevku | ZoškaSnap',
};

export default async function PostDetail({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '50vh' 
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Príspevok nebol nájdený
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <DetailedPost {...post} />
    </Container>
  );
}