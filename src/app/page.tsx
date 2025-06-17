import {
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div>
      home
    <SignUpButton>Signup</SignUpButton>
      <SignInButton>Signin</SignInButton>
      <SignedOut>Signout</SignedOut>
      <UserButton>User</UserButton>
    </div>
  );
}
