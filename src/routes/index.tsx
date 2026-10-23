import { createFileRoute } from "@tanstack/react-router";
import { Ee663582OS } from "@/os/Ee663582OS";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EE663582.OS" },
      {
        name: "description",
        content:
          "A fictional operating system. Boot it, open the folders, and find out whose computer this is.",
      },
      { property: "og:title", content: "EE663582.OS" },
      {
        property: "og:description",
        content:
          "A fictional operating system. Boot it, open the folders, and find out whose computer this is.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Ee663582OS />;
}
