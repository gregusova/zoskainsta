// src/app/prispevok/page.tsx

import Container from '@mui/material/Container';
import AddPostForm from '@/components/AddPostForm';

export const metadata = { title: "Pridať príspevok | ZoškaSnap" }

export default function Add() {
  return (
    <Container>
      <AddPostForm />
    </Container>
  );
}
