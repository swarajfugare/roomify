import type { Route } from "./+types/community";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Clock, ArrowUpRight, Heart, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjects } from "../../lib/puter.action";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Community - Roomify" },
    { name: "description", content: "Discover inspiring architectural projects from our community" },
  ];
}

export default function Community() {
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunityProjects = async () => {
      try {
        setIsLoading(true);
        const items = await getProjects();
        setProjects(items || []);
      } catch (error) {
        console.error('Failed to fetch community projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityProjects();
  }, []);

  return (
    <div className="community-page">
      <Navbar />

      <section className="hero community-hero">
        <div className="hero-content">
          <h1>Global Community Gallery</h1>
          <p>Discover inspiring architectural projects from creators around the world</p>
        </div>
      </section>

      <section className="community-section">
        <div className="section-inner">
          <div className="section-head">
            <h2>Featured Projects</h2>
            <p>Explore amazing designs and get inspired by our community</p>
          </div>

          {isLoading ? (
            <div className="loading">
              <p>Loading community projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects shared yet. Be the first to share your creation!</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="project-card community-card"
                  onClick={() => navigate(`/visualizer/${project.id}`)}
                >
                  <div className="preview">
                    <img
                      src={project.renderedImage || project.sourceImage}
                      alt={project.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="overlay">
                      <button className="view-btn">
                        View Project <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="card-header">
                      <h3>{project.name}</h3>
                      <div className="actions">
                        <button className="action-btn">
                          <Heart size={16} />
                        </button>
                        <button className="action-btn">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="card-meta">
                      <Clock size={12} />
                      <span>{new Date(project.timestamp).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>By Community</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <h2>Share Your Design with the World</h2>
          <p>Upload your floor plan and let the community see your creation</p>
          <a href="/" className="cta-button">
            Upload Your Project
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
