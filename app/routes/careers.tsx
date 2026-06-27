import type { Route } from "./+types/careers";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Careers - Roomify" },
    { name: "description", content: "Join the Roomify team" },
  ];
}

export default function Careers() {
  const jobs = [
    {
      title: "Senior Frontend Engineer",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "AI/ML Engineer",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Product Designer",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "DevOps Engineer",
      location: "Remote",
      type: "Full-time"
    }
  ];

  return (
    <div className="careers-page">
      <Navbar />

      <section className="hero careers-hero">
        <div className="hero-content">
          <h1>Join Our Team</h1>
          <p>Help us revolutionize architectural visualization</p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-inner">
          <div className="content-block">
            <h2>Why Join Roomify?</h2>
            <p>We're a talented team of architects, engineers, and designers working on cutting-edge AI technology. We offer competitive salaries, flexible work arrangements, and the opportunity to work on projects that matter.</p>
          </div>

          <h2>Open Positions</h2>
          <div className="jobs-grid">
            {jobs.map((job, idx) => (
              <div key={idx} className="job-card">
                <h3>{job.title}</h3>
                <div className="job-meta">
                  <span className="location">{job.location}</span>
                  <span className="type">{job.type}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="content-block">
            <h2>Don't see the right role?</h2>
            <p>We're always looking for talented individuals. Feel free to reach out at careers@roomify.com with your resume and let us know how you'd like to contribute.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
