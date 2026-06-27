import { Box, Send, MessageCircle, Code2, MailOpen } from "lucide-react";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-content">
                    <div className="footer-section footer-brand">
                        <div className="brand">
                            <Box className="logo" />
                            <span className="name">Roomify</span>
                        </div>
                        <p>Transform architectural vision into reality with AI-powered 3D visualization.</p>
                        <p className="creator">Created by <strong>Swaraj Fugare</strong></p>
                        <a href="https://portfolio.matoshreecollection.in/" target="_blank" rel="noopener noreferrer" className="portfolio-link">Portfolio</a>
                        <div className="social">
                            <a href="#" target="_blank" rel="noopener noreferrer" title="Twitter">
                                <Send size={16} />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                                <MessageCircle size={16} />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" title="GitHub">
                                <Code2 size={16} />
                            </a>
                            <a href="mailto:hello@roomify.com" title="Email">
                                <MailOpen size={16} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Product</h4>
                        <ul>
                            <li><a href="/product">Features</a></li>
                            <li><a href="/pricing">Pricing</a></li>
                            <li><a href="/community">Community</a></li>
                            <li><a href="/enterprise">Enterprise</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="/about">About</a></li>
                            <li><a href="/blog">Blog</a></li>
                            <li><a href="/careers">Careers</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="/privacy">Privacy</a></li>
                            <li><a href="/terms">Terms</a></li>
                            <li><a href="/security">Security</a></li>
                            <li><a href="/cookies">Cookies</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-divider">
                    <div className="footer-bottom">
                        <p className="copyright">© 2024 Roomify. All rights reserved.</p>
                        <div className="links">
                            <a href="/privacy">Privacy Policy</a>
                            <a href="/terms">Terms of Service</a>
                            <a href="/security">Security</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
