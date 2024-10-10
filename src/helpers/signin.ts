import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/config/firebase/firebase";
import axios from "axios";

const googleAuthProvider = new GoogleAuthProvider();
export async function signInWithGoogle() {
  const result=await signInWithPopup(auth, googleAuthProvider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (credential === null) {
    throw new Error("No credential");
  }
  const idToken=await auth.currentUser?.getIdToken();
  const res=await axios.post("/api/login", { idToken });
  return res.data;
}