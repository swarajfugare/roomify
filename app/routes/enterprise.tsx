import type { Route } from "./+types/enterprise";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Users, Shield, Zap, BarChart3, CheckCircle } from "lucide-react";
import Button from "../../components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Enterprise - Roomify" },
    { name: "description", content: "Enterprise solutions for large organizations and teams" },
  ];
}

export default function Enterprise() {
  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Seamless collaboration tools for large architectural teams"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Advanced security features including SSO, 2FA, and role-based access"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Custom Integration",
      description: "API access and custom integrations with your existing tools"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Comprehensive analytics and reporting dashboards"
    }
  ];

  const useCases = [
    {
      title: "Architecture Firms",
      description: "Streamline your design workflow and collaborate with teams across offices"
    },
    {
      title: "Real Estate Development",
      description: "Accelerate project visualization and client presentations"
    },
    {
      title: "Interior Design Studios",
      description: "Transform 2D floor plans into stunning 3D visualizations instantly"
    },
    {
      title: "Construction Companies",
      description: "Improve project planning and stakeholder communication"
    }
  ];

  return (
    <div className="enterprise-page">
      <Navbar />

      <section className="hero enterprise-hero">
        <div className="hero-content">
          <h1>Enterprise Solutions for Large Organizations</h1>
          <p>Powerful tools and dedicated support for teams that demand the best</p>
          <Button size="lg" className="cta-button">
            Schedule a Demo
          </Button>
        </div>
      </section>

      <section className="benefits-section">
        <div className="section-inner">
          <h2>Enterprise Benefits</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="benefit-card">
                <div className="benefit-icon">
                  {benefit.icon}
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="use-cases-section">
        <div className="section-inner">
          <h2>Who Uses Roomify Enterprise?</h2>
          <div className="use-cases-grid">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="use-case-card">
                <CheckCircle className="check-icon" />
                <h3>{useCase.title}</h3>
                <p>{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-table-section">
        <div className="section-inner">
          <h2>Enterprise Features</h2>
          <table className="features-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Professional</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Team Members</td>
                <td>Up to 5</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>API Access</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Custom Branding</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>SSO Authentication</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>Dedicated Support</td>
                <td>Email</td>
                <td>24/7 Phone & Email</td>
              </tr>
              <tr>
                <td>SLA Guarantee</td>
                <td>No</td>
                <td>99.9% Uptime</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="pricing-section">
        <div className="section-inner">
          <h2>Custom Pricing</h2>
          <p>Contact our sales team for a customized pricing plan based on your organization's needs</p>
          <Button size="lg" className="contact-button">
            Contact Sales Team
          </Button>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="section-inner">
          <h2>What Enterprise Clients Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="quote">"Roomify has transformed how we visualize architectural designs for our clients. The time savings are incredible."</p>
              <p className="author">- John Smith, Principal Architect at Premier Design Studio</p>
            </div>
            <div className="testimonial-card">
              <p className="quote">"The team collaboration features have made it easy for our distributed offices to work together seamlessly."</p>
              <p className="author">- Sarah Johnson, Director of Operations at Global Construction Inc.</p>
            </div>
            <div className="testimonial-card">
              <p className="quote">"Enterprise support is fantastic. They've helped us integrate Roomify perfectly into our workflow."</p>
              <p className="author">- Michael Chen, CTO at Urban Development Partners</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to Transform Your Organization?</h2>
          <p>Let's talk about how Roomify Enterprise can accelerate your business</p>
          <Button size="lg" className="cta-button">
            Schedule a Demo
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
