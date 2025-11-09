"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { trpc } from "@/lib/trpc";

// Simple reading time: 200 words per minute
function ReadingTime({ content }: { content: string }) {
  const words = content ? content.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return <span>{minutes} min read</span>;
}

// Dummy posts fallback (only used if DB doesn't have the slug)
const dummyPosts: Post[] = [
  {
    id: 1,
    slug: "technology-workplace",
    title: "The Impact of Technology on the Workplace",
    author: "Tracey Wilson",
    date: "Jan 28, 2023",
    categories: [{ id: 1, name: "Technology" }],
    image: "/images/virtualreality.png",
    content: `
Technology is transforming modern workplaces at an unprecedented pace. Tools like cloud-based collaboration platforms, AI analytics, and automation software are enabling teams to work more efficiently and communicate seamlessly. Remote work has become increasingly feasible, allowing employees flexibility while maintaining productivity. These innovations improve workflow and decision-making, but also bring challenges such as cybersecurity concerns, digital fatigue, and the risk of losing the human touch in communication.

To navigate these changes successfully, organizations must combine technology with thoughtful management strategies. Structured workflows, clear communication, and ongoing employee training ensure that new tools are utilized effectively. Leaders must balance automation with human oversight, fostering creativity and maintaining operational efficiency. By taking a proactive approach, companies can create environments that embrace change without overwhelming employees or sacrificing quality.

Ultimately, technology reshapes not only tasks but also how people collaborate, innovate, and grow professionally. Organizations prioritizing human-centered approaches alongside advanced tools are better positioned to thrive. Investing in both technology and employee well-being creates a workplace where innovation flourishes, productivity is optimized, and employees remain engaged and motivated, ensuring long-term success.`
  },
  {
    id: 2,
    slug: "grid-system-ui",
    title: "Grid Systems for Better UI Design",
    author: "Bill Walsh",
    date: "Jan 25, 2023",
    categories: [{ id: 2, name: "Design" }],
    image: "/images/grid.jpg",
    content: `
A well-structured grid system is the backbone of effective user interface (UI) design. By dividing layouts into consistent rows and columns, designers ensure visual harmony, proper alignment, and better readability. Grids simplify complex interfaces, guiding users’ attention to important content while maintaining balance. Beyond aesthetics, grids are essential for responsive design, ensuring websites and applications look great on any device, from mobile phones to desktops.

Grids also streamline collaboration across teams. Developers, designers, and stakeholders can use the same visual framework to communicate ideas, making projects more efficient. Consistent grid systems reduce cognitive load, improve usability, and enhance the overall user experience. Proper spacing, alignment, and typographic hierarchy further reinforce clarity and professionalism, resulting in interfaces that feel polished and intuitive.

Mastering grid systems allows designers to combine creativity with structure. When used alongside color, typography, and visual hierarchy, grids provide the foundation for designs that are both beautiful and functional. Companies that implement consistent grid frameworks across projects benefit from brand cohesion and improved user engagement, demonstrating the power of organization in UI design.`
  },
  {
    id: 3,
    slug: "business-tools-designers",
    title: "7 Business Tools Every Designer Needs",
    author: "Anna Roberts",
    date: "Jan 20, 2023",
    categories: [{ id: 3, name: "Business" }],
    image: "/images/7designtools.png",
    content: `
In today’s fast-paced business environment, designers require a combination of creativity and efficiency to succeed. Using the right business tools can significantly enhance workflow, collaboration, and productivity. Project management software allows teams to track tasks, deadlines, and deliverables, while communication platforms facilitate seamless discussions and feedback. Version control and cloud storage ensure files are organized and accessible, preventing costly errors and improving team coordination.

Design-specific tools also play a crucial role in executing ideas effectively. Vector editors, prototyping software, and digital asset libraries empower designers to bring concepts to life quickly and accurately. By integrating these tools into their workflow, designers can focus more on creative problem-solving rather than administrative or technical issues. Additionally, analytics tools provide insights into project performance, helping teams make informed decisions and optimize processes.

Understanding and leveraging these seven essential tools equips designers to meet business objectives while maintaining high-quality output. A well-structured toolkit improves efficiency, fosters collaboration, and enables innovation. By combining creativity with the strategic use of business tools, designers can achieve professional growth, deliver exceptional results, and contribute meaningfully to their organization’s success.`
  },
  {
    id: 4,
    slug: "design-thinking",
    title: "Design Thinking for Product Innovation",
    author: "Maria Gomez",
    date: "Feb 10, 2023",
    categories: [{ id: 2, name: "Design" }],
    image: "/images/minimalism.jpg",
    content: `
Design thinking is a human-centered approach to innovation that encourages empathy, creativity, and experimentation. By focusing on users’ needs and experiences, teams can develop solutions that are practical, engaging, and impactful. The methodology involves understanding problems, generating ideas, prototyping solutions, and testing them with real users in iterative cycles to refine outcomes continuously.

Applying design thinking goes beyond product design; it can enhance services, processes, and organizational strategies. Teams embracing this approach foster collaboration, encourage risk-taking, and prioritize creativity. By understanding user pain points and testing multiple solutions, companies reduce costly mistakes and deliver products that truly resonate with their audience. This methodology also encourages adaptability in a rapidly changing market, keeping innovation aligned with real-world needs.

Organizations adopting design thinking cultivate a culture of continuous improvement and user focus. Products developed using this methodology tend to be more intuitive, useful, and widely accepted by end users. By integrating empathy, creativity, and experimentation into workflows, teams can drive meaningful innovation, ensuring long-term success and creating value for both the company and its customers.`
  },
  {
    id: 5,
    slug: "remote-work-success",
    title: "Secrets to Successful Remote Work",
    author: "Tom Hardy",
    date: "Mar 12, 2023",
    categories: [{ id: 1, name: "Technology" }],
    image: "/images/remote.jpg",
    content: `
Remote work has become a defining feature of modern business, offering flexibility, autonomy, and new opportunities for employees and organizations alike. However, successful remote work requires more than a laptop and internet connection. Clear communication, self-discipline, and structured workflows are essential to maintain productivity and team cohesion across distances.

Digital tools such as project management software, cloud storage, and video conferencing platforms enable teams to collaborate effectively despite physical separation. Employees benefit from setting up dedicated workspaces, establishing daily routines, and maintaining boundaries between work and personal life. Regular check-ins, feedback sessions, and recognition help build trust and keep remote employees motivated and connected.

Companies that invest in both technology and employee well-being create environments where remote work can thrive. By fostering engagement, encouraging innovation, and supporting mental health, organizations can harness the benefits of remote work without sacrificing performance. Employees gain autonomy, balance, and satisfaction, while companies enjoy higher productivity and retention, making remote work a sustainable and successful strategy.`
  },
  {
    id: 6,
    slug: "brand-storytelling",
    title: "The Power of Brand Storytelling",
    author: "Lisa Patel",
    date: "Apr 5, 2023",
    categories: [{ id: 3, name: "Business" }],
    image: "/images/productivity.png",
    content: `
Brand storytelling is a powerful way for companies to connect with audiences on a deeper, emotional level. Rather than merely promoting products, effective storytelling engages, informs, and inspires. It allows brands to communicate their mission, values, and journey in a manner that resonates with consumers, fostering trust and loyalty over time.

Authentic stories help brands differentiate themselves in crowded markets by creating memorable and relatable experiences. Whether delivered through social media, advertisements, or content marketing, narratives transform complex ideas into engaging messages. Storytelling encourages interaction, emotional investment, and long-term relationships with audiences, ultimately influencing consumer behavior and decision-making.

By integrating storytelling into their brand strategy, companies build recognizable identities that stand out. A well-crafted narrative strengthens marketing efforts, promotes customer engagement, and cultivates loyalty. Brands that master the art of storytelling combine creativity with strategic communication, turning ordinary messaging into compelling experiences that drive growth and establish enduring connections with their audience.`
  },
];


export default function SinglePostPage() {
  const { slug } = useParams();
  const router = useRouter();

  // Fetch post from DB
  const { data: post, isLoading, error } = trpc.post.getBySlug.useQuery(
    { slug: slug as string },
    { enabled: !!slug }
  );

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-gray-500">Loading post…</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-red-500">Error loading post: {error.message}</p>
      </div>
    );

  // Use DB post if available, otherwise fallback to dummy post
  const safePost =
    post ||
    dummyPosts.find((p) => p.slug === slug) ||
    null;

  if (!safePost)
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p className="text-gray-500">Post not found.</p>
      </div>
    );

  const { title, content, image, author, createdAt, categories } =
    safePost as any;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            ← Back
          </button>
        </div>

        {/* Article */}
        <article className="prose lg:prose-xl mx-auto">
          {image && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-sm">
              <img
                src={image}
                alt={title}
                className="w-full h-[420px] object-cover"
              />
            </div>
          )}

          <header className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  {author || "Unknown"}
                </div>
                <div className="text-xs text-gray-400">
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString()
                    : "—"}{" "}
                  • <ReadingTime content={content} />
                </div>
              </div>
              <div className="ml-auto flex gap-2 items-center">
                {categories?.map((c: any) => (
                  <span
                    key={c.id}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-tight mt-4">{title}</h1>
          </header>

          <section className="mt-6">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 border-t pt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <ReadingTime content={content} /> •{" "}
              {(content || "").trim().split(/\s+/).length} words
            </div>

            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  title
                )}&url=${encodeURIComponent(location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Tweet
              </a>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}
