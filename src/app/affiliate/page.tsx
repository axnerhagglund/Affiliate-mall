import { StaticPage, staticPageMetadata } from "@/components/StaticPage";

export const metadata = staticPageMetadata("affiliate");

export default function Page() {
  return <StaticPage slug="affiliate" />;
}
