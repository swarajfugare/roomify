import type { Route } from "./+types/about";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About - Roomify" },
    { name: "description", content: "Learn about Roomify and our mission" },
  ];
}

export default function About() {
  return (
    <div className="about-page">
      <Navbar />

      <section className="hero about-hero">
        <div className="hero-content">
          <h1>About Roomify</h1>
          <p>Revolutionizing architectural visualization with AI</p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-inner">
          <div className="content-block">
            <h2>Our Mission</h2>
            <p>At Roomify, we believe that architectural visualization should be fast, affordable, and accessible to everyone. We're building the future of design with AI-powered 3D rendering that transforms 2D floor plans into photorealistic visualizations in minutes, not days.</p>
          </div>

          <div className="content-block">
            <h2>Our Story</h2>
            <p>Founded by a team of architects and AI engineers, Roomify was born from frustration with existing visualization tools. We saw an opportunity to combine cutting-edge AI technology with modern web platforms to create something truly revolutionary.</p>
          </div>

          <div className="content-block">
            <h2>Our Team</h2>
            <p>Our diverse team includes architects, software engineers, AI specialists, and product designers working together to deliver exceptional results. We're passionate about using technology to solve real problems in the architecture and design industry.</p>
          </div>

          <div className="content-block">
            <h2>Creator</h2>
            <p>Roomify is developed by <strong>Swaraj Fugare</strong></p>
            <p><a href="https://portfolio.matoshreecollection.in/" target="_blank" rel="noopener noreferrer" className="link">Visit Portfolio</a></p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
