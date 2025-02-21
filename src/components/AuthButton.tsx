import { Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import "./AuthButton.scss";

const AuthButton = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <>
      {user ? (
        <Button variant="contained" color="error" onClick={signOut}>
          Logout
        </Button>
      ) : (
        <>
          <Button  size="small" variant="contained" color="primary">
            Sign Up
          </Button>

        <Button size="small" variant="contained" color="primary" onClick={signInWithGoogle}>
          Sign In
        </Button>
      </>
      )}
    </>
  );
};

export default AuthButton;
 