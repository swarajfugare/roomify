import type { Route } from "./+types/cookies";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cookie Policy - Roomify" },
    { name: "description", content: "Roomify Cookie Policy" },
  ];
}

export default function Cookies() {
  return (
    <div className="legal-page">
      <Navbar />

      <section className="hero legal-hero">
        <div className="hero-content">
          <h1>Cookie Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-inner">
          <div className="legal-content">
            <h2>What Are Cookies?</h2>
            <p>Cookies are small files of letters and numbers that we store on your browser or the hard drive of your computer. They contain information about your browsing activities on our website.</p>

            <h2>How We Use Cookies</h2>
            <p>We use cookies to:</p>
            <ul>
              <li>Remember your preferences and login information</li>
              <li>Track your usage of our service</li>
              <li>Improve the performance of our website</li>
              <li>Analyze how users interact with our service</li>
              <li>Provide you with personalized content</li>
            </ul>

            <h2>Types of Cookies We Use</h2>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for authentication and security</li>
              <li><strong>Performance Cookies:</strong> Help us understand how you use our service</li>
              <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Analytics Cookies:</strong> Track usage patterns to improve our service</li>
            </ul>

            <h2>Third-Party Cookies</h2>
            <p>We use third-party analytics services that may place cookies on your device. These are used solely to improve our service and understand user behavior.</p>

            <h2>Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. However, blocking cookies may affect the functionality of our website.</p>

            <h2>Contact Us</h2>
            <p>If you have questions about our cookie policy, please contact us at privacy@roomify.com</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
