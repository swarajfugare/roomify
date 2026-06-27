import type { Route } from "./+types/privacy";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy - Roomify" },
    { name: "description", content: "Roomify Privacy Policy" },
  ];
}

export default function Privacy() {
  return (
    <div className="legal-page">
      <Navbar />

      <section className="hero legal-hero">
        <div className="hero-content">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-inner">
          <div className="legal-content">
            <h2>1. Introduction</h2>
            <p>Roomify ("we", "us", "our") operates the Roomify website and application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.</p>

            <h2>2. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our service to you.</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, password, and usage data</li>
              <li><strong>Uploaded Content:</strong> Floor plans and images you upload for processing</li>
              <li><strong>Usage Data:</strong> Log data, including IP address, browser type, pages visited, and time spent</li>
            </ul>

            <h2>3. Use of Data</h2>
            <p>Roomify uses the collected data for various purposes including:</p>
            <ul>
              <li>Providing and maintaining our service</li>
              <li>Processing and storing your architectural projects</li>
              <li>Notifying you about changes to our service</li>
              <li>Detecting and preventing fraudulent transactions and other illegal activities</li>
            </ul>

            <h2>4. Security of Data</h2>
            <p>The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.</p>

            <h2>5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at hello@roomify.com</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
