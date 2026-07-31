import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your message has been received. Our team will reach out shortly.",
  robots: { index: false, follow: false },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
