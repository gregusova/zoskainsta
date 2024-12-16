import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export const metadata = { title: "Registration | ZoškaSnap" };

export default function Registration() {
  return (
    <>
      <Typography>Sign up</Typography>
      <FormControlLabel
        control={<Checkbox name="gdpr" />}
        label="I agree with GDPR and terms of use"
      />
    </>
  );
}