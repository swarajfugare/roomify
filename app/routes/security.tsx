import type { Route } from "./+types/security";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Security - Roomify" },
    { name: "description", content: "Roomify Security Information" },
  ];
}

export default function Security() {
  return (
    <div className="legal-page">
      <Navbar />

      <section className="hero legal-hero">
        <div className="hero-content">
          <h1>Security</h1>
          <p>Your data security is our top priority</p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-inner">
          <div className="legal-content">
            <h2>Security Measures</h2>
            <p>Roomify is committed to protecting your information with industry-leading security practices.</p>

            <h2>Data Encryption</h2>
            <p>All data transmitted between your browser and our servers is encrypted using HTTPS/TLS encryption protocols. Your uploaded files are encrypted at rest on our secure servers.</p>

            <h2>Access Control</h2>
            <p>We implement strict access controls to ensure that only authorized personnel can access your personal data. All access is logged and monitored.</p>

            <h2>Regular Audits</h2>
            <p>We conduct regular security audits and penetration testing to identify and address potential vulnerabilities in our systems.</p>

            <h2>Secure Infrastructure</h2>
            <p>Our infrastructure is hosted on secure cloud providers with enterprise-grade security measures including firewalls, intrusion detection, and DDoS protection.</p>

            <h2>Password Security</h2>
            <p>We use industry-standard password hashing algorithms to store passwords securely. We recommend using strong, unique passwords for your account.</p>

            <h2>Two-Factor Authentication</h2>
            <p>We support two-factor authentication (2FA) to add an extra layer of security to your account. We encourage all users to enable 2FA.</p>

            <h2>Incident Response</h2>
            <p>In the unlikely event of a security incident, we have a dedicated incident response team that will notify affected users promptly.</p>

            <h2>Report a Vulnerability</h2>
            <p>If you discover a security vulnerability in Roomify, please email us at security@roomify.com with details. We appreciate responsible disclosure.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
