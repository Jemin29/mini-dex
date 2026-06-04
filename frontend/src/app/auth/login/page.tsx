import { redirect } from "next/navigation";

// Redirect /auth/login to /login for consistency
export default function AuthLoginPage() {
  redirect("/login");
}
