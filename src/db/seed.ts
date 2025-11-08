import { db } from "./index";
import { posts, categories } from "./schema";

async function seed() {
  await db.insert(categories).values([
    { name: "Technology", slug: "technology", description: "Tech trends" },
    { name: "Design", slug: "design", description: "Design insights" },
  ]);

  await db.insert(posts).values([
    {
      title: "The Rise of AI in Content Creation",
      content: "AI is transforming how we write and edit content...",
      slug: "ai-in-content",
      published: true,
    },
    {
      title: "Minimalism Wins in Web Design",
      content: "Less is more in modern UI design...",
      slug: "minimalism-design",
      published: true,
    },
  ]);

  console.log("✅ Seed completed");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
