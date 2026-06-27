import type { Route } from "./+types/pricing";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Check } from "lucide-react";
import Button from "../../components/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pricing - Roomify" },
    { name: "description", content: "Affordable pricing plans for architects of all sizes" },
  ];
}

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for individual architects",
      features: [
        "5 projects per month",
        "Basic AI rendering",
        "2D-to-3D visualization",
        "Private project storage",
        "Email support",
        "1GB storage"
      ],
      cta: "Get Started",
      featured: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "For growing design teams",
      features: [
        "Unlimited projects",
        "Advanced AI rendering",
        "Priority processing",
        "Team collaboration",
        "Community sharing",
        "Priority support",
        "50GB storage",
        "Custom exports"
      ],
      cta: "Start Free Trial",
      featured: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom AI models",
        "White-label options",
        "API access",
        "Unlimited storage",
        "24/7 support",
        "SLA guarantee"
      ],
      cta: "Contact Sales",
      featured: false
    }
  ];

  return (
    <div className="pricing-page">
      <Navbar />

      <section className="hero pricing-hero">
        <div className="hero-content">
          <h1>Simple, Transparent Pricing</h1>
          <p>Choose the perfect plan for your architectural needs</p>
        </div>
      </section>

      <section className="pricing-section">
        <div className="section-inner">
          <div className="pricing-grid">
            {plans.map((plan, idx) => (
              <div key={idx} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                <div className="card-header">
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                </div>

                <div className="card-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>

                <button className={`pricing-cta ${plan.featured ? 'primary' : 'secondary'}`}>
                  {plan.cta}
                </button>

                <div className="features-list">
                  {plan.features.map((feature, featureIdx) => (
                    <div key={featureIdx} className="feature-item">
                      <Check size={18} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-inner">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I change plans anytime?</h4>
              <p>Yes, upgrade or downgrade your plan at any time with changes taking effect immediately.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a free trial?</h4>
              <p>Yes, Professional plan includes a 14-day free trial with full access to all features.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a discount for annual billing?</h4>
              <p>Yes, save 20% with annual billing on all plans.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
