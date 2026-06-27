import type { Route } from "./+types/product";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Check, Zap, Lightbulb, Share2, Lock, Gauge } from "lucide-react";
import Button from "../../components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Product - Roomify" },
    { name: "description", content: "Explore Roomify's powerful features for architectural visualization" },
  ];
}

export default function Product() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "2D-to-3D Visualization",
      description: "Instantly transform flat floor plans into photorealistic 3D models using state-of-the-art AI"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "AI-Powered Rendering",
      description: "Powered by Claude and Gemini AI models for intelligent architectural transformations"
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Global Community Feed",
      description: "Share your projects with the world and discover inspiring architectural designs"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Privacy Controls",
      description: "Granular public and private toggles for complete control over your data"
    },
    {
      icon: <Gauge className="w-6 h-6" />,
      title: "High-Performance Hosting",
      description: "Permanent file storage with instant loading and metadata persistence"
    },
    {
      icon: <Check className="w-6 h-6" />,
      title: "One-Click Export",
      description: "Download and integrate renders into your presentations and workflows"
    }
  ];

  return (
    <div className="product-page">
      <Navbar />

      <section className="hero product-hero">
        <div className="hero-content">
          <h1>Powerful Features for Modern Architects</h1>
          <p>Everything you need to transform your architectural vision into reality</p>
        </div>
      </section>

      <section className="features-section">
        <div className="section-inner">
          <div className="section-head">
            <h2>Why Choose Roomify?</h2>
            <p>Industry-leading AI technology meets intuitive design</p>
          </div>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to Transform Your Designs?</h2>
          <p>Join thousands of architects already using Roomify</p>
          <a href="/" className="cta-button">
            Start Building Now
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
