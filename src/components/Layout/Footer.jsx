import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img
              src={process.env.PUBLIC_URL + '/oak-logo.svg'}
              alt="OAK Foundation"
              className="footer-logo"
            />
            <p className="footer-tagline">
              Contributing to a safer, fairer, and more sustainable world.
            </p>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Quick Links</h4>
            <Link to="/about">About Us</Link>
            <Link to="/programmes">Programmes</Link>
            <Link to="/knowledge">Knowledge Base</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">For Grantees</h4>
            <Link to="/knowledge">Grant Application Guide</Link>
            <Link to="/knowledge">Reporting Requirements</Link>
            <Link to="/help">Ask Oakie</Link>
            <Link to="/contact">Get Support</Link>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Connect</h4>
            <a href="https://www.linkedin.com/company/oak-foundation/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://www.youtube.com/@oakfoundation" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
            <a href="https://www.instagram.com/oakfoundation/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} OAK Foundation. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="https://oakfnd.org/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <a href="https://oakfnd.org/safeguarding/" target="_blank" rel="noopener noreferrer">Safeguarding</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
