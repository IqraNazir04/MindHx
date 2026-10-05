import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";
import AdminLoginClient from "./AdminLoginClient";

export const metadata: Metadata = pageMetadata({
  title: "Admin sign in",
  description: "MindHx admin panel sign-in.",
  path: "/admin/login",
  noindex: true,
});

export default function Page() {
  return <AdminLoginClient />;
}
