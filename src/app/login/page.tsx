import type { Metadata } from "next";
import { pageMetadata } from "../lib/seo";
import LoginClient from "./LoginClient";

export const metadata: Metadata = pageMetadata({
  title: "Sign In",
  description: "Sign in to MindHx to save and revisit your check-in history. An account is entirely optional - the check-in itself never requires one.",
  path: "/login",
  noindex: true,
});

export default function Page() {
  return <LoginClient />;
}
