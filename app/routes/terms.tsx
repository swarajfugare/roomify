import type { Route } from "./+types/terms";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms of Service - Roomify" },
    { name: "description", content: "Roomify Terms of Service" },
  ];
}

export default function Terms() {
  return (
    <div className="legal-page">
      <Navbar />

      <section className="hero legal-hero">
        <div className="hero-content">
          <h1>Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-inner">
          <div className="legal-content">
            <h2>1. Agreement to Terms</h2>
            <p>By accessing and using the Roomify website and application, you accept and agree to be bound by the terms and provision of this agreement.</p>

            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on Roomify for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>

            <h2>3. Disclaimer</h2>
            <p>The materials on Roomify are provided on an "as is" basis. Roomify makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

            <h2>4. Limitations</h2>
            <p>In no event shall Roomify or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Roomify.</p>

            <h2>5. Accuracy of Materials</h2>
            <p>The materials appearing on Roomify could include technical, typographical, or photographic errors. Roomify does not warrant that any of the materials on the website are accurate, complete, or current.</p>

            <h2>6. Links</h2>
            <p>Roomify has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Roomify of the site. Use of any such linked website is at the user's own risk.</p>

            <h2>7. Modifications</h2>
            <p>Roomify may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>

            <h2>8. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Roomify operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
