// src/sections/SignUpView.tsx

"use client";

import React, { useState } from 'react';
import {
  Button,
  Container,
  Typography,
} from "@mui/material";
import { signIn } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";

export default function SignUpView() {
  const [agreed, setAgreed] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(event.target.checked);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 5,
        p: 3,
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      {/* Logo / Title */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Registrácia
      </Typography>

      {/* Sign-in link */}
      <Typography variant="body1" sx={{ mb: 6 }}>
        Already have an account? <a href="/auth/prihlasenie">Sign In</a>
      </Typography>
      
      <div style={{ marginBottom: '16px' }}>
        <input
          type="checkbox"
          id="gdpr"
          checked={agreed}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="gdpr">
          I agree with <a href="/gdpr">GDPR</a> and <a href="/podmienky">terms of use</a>
        </label>
      </div>
      
      {/* Google Sign Up */}
      <Button
        variant="outlined"
        fullWidth
        startIcon={<GoogleIcon />}
        onClick={() => signIn("google")}
        sx={{ mb: 1 }}
      >
        Registrovať sa účtom Google
      </Button>
    </Container>
  );
}
