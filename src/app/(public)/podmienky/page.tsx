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
      <Typography variant="h5" gutterBottom>
        Terms of Use
      </Typography>
      <Typography variant="body1" paragraph>
        These terms govern the use of the ZoskaInsta app. Please read these terms carefully before using our application.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Use of the App
      </Typography>
      <Typography variant="body1" paragraph>
        The user agrees to use the application in accordance with the law and good morals.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Data Protection
      </Typography>
      <Typography variant="body1" paragraph>
        Your data is processed in accordance with our privacy policy.
      </Typography>
      <Typography variant="body1" paragraph>
        Thank you for complying with the terms of use of our application.
      </Typography>
      <Button variant="outlined" onClick={() => router.back()}>
        Back
      </Button>
    </Container>
  );
}