// src/app/profil/page.tsx

import { Suspense } from 'react';
import { Container } from '@mui/material';
import ProfileContent from './ProfileContent';
import LoadingProfile from './LoadingProfile';

export const metadata = { title: "Profil | ZoškaSnap" };

export default function ProfilePage() {
  return (
    <Container maxWidth={false} disableGutters>
      <Suspense fallback={<LoadingProfile />}>
        <ProfileContent />
      </Suspense>
    </Container>
  );
}
