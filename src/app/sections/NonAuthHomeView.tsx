"use client";

import { useRouter } from "next/navigation";
import { Typography, Button, Box } from "@mui/material";

export default function NonAuthHomeView() {
  const router = useRouter();

  return (
    <Box sx={{ textAlign: "center", padding: 4 }}>
      <Typography variant="h4" gutterBottom>Vitaj na ZoškaSnap!</Typography>
      <Typography variant="body1" gutterBottom>Zaregistruj sa a pridaj sa k našej komunite!</Typography>

      {/* Call to Action Buttons */}
      <Button
        variant="contained"
        color="primary"
        sx={{ margin: 1 }}
        onClick={() => router.push('/login')}
      >
        Log In
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ margin: 1 }}
        onClick={() => router.push('/registration')}
      >
        Sign Up
      </Button>
    </Box>
  );
}
