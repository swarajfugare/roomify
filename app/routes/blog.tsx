import type { Route } from "./+types/blog";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog - Roomify" },
    { name: "description", content: "Read latest articles about architectural visualization and AI" },
  ];
}

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "The Future of Architectural Visualization",
      excerpt: "AI is revolutionizing how architects visualize their designs. Learn about the latest trends.",
      date: "June 20, 2024",
      author: "Swaraj Fugare"
    },
    {
      id: 2,
      title: "How to Create Better Floor Plans",
      excerpt: "Tips and tricks for creating floor plans that render beautifully with AI tools.",
      date: "June 15, 2024",
      author: "Swaraj Fugare"
    },
    {
      id: 3,
      title: "AI-Powered Design: What's Next?",
      excerpt: "Exploring the possibilities of AI in architectural design and visualization.",
      date: "June 10, 2024",
      author: "Swaraj Fugare"
    }
  ];

  return (
    <div className="blog-page">
      <Navbar />

      <section className="hero blog-hero">
        <div className="hero-content">
          <h1>Roomify Blog</h1>
          <p>Insights on AI, architecture, and design innovation</p>
        </div>
      </section>

      <section className="blog-section">
        <div className="section-inner">
          <div className="blog-grid">
            {posts.map((post) => (
              <article key={post.id} className="blog-card">
                <h2>{post.title}</h2>
                <p className="excerpt">{post.excerpt}</p>
                <div className="meta">
                  <span className="date">{post.date}</span>
                  <span className="author">By {post.author}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
