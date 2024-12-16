// src/app/(public)/gdpr/page.tsx

"use client";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useRouter } from 'next/navigation';

export default function GDPR() {
  const router = useRouter();

  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom>
        GDPR - Data Protection
      </Typography>
      <Typography variant="body1" paragraph>
        Your privacy is very important to us. In this document, you will learn how we process and protect your personal data in accordance with the GDPR regulation.
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom>
        Responsibility
      </Typography>
      <Typography variant="body1" paragraph>
        All personal data you provide to us will be used only for the purposes for which they were provided.
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom>
        User Rights
      </Typography>
      <Typography variant="body1" paragraph>
        You have the right to access your data, modify it, or delete it. Contact us at the email address <a href="mailto:kolokolomlynskee@gmail.com">kolokolomlynskee@gmail.com</a>.
      </Typography>
      <Typography variant="body1" paragraph>
        More information can be found in our <a href="/podmienky">Terms of Use</a>.
      </Typography>
      <Button variant="outlined" onClick={() => router.back()}>
        Back
      </Button>
    </Container>
  );
}