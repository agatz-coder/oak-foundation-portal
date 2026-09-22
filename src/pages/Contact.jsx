import React from 'react';
import Hero from '../components/UI/Hero';
import Button from '../components/UI/Button';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      <Hero
        label="Get in Touch"
        title="Contact us"
        subtitle="Have a question about your grant, reporting, or anything else? We're here to help."
      />

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-form-section">
              <h2>Send us a message</h2>
              <p>Fill out the form below and a member of the OAK Foundation team will get back to you.</p>

              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" placeholder="you@organisation.org" />
                </div>
                <div className="form-group">
                  <label htmlFor="org">Organisation</label>
                  <input type="text" id="org" placeholder="Your organisation name" />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject">
                    <option value="">Select a topic...</option>
                    <option value="grant-inquiry">Grant Inquiry</option>
                    <option value="reporting">Reporting Question</option>
                    <option value="safeguarding">Safeguarding Concern</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" rows="5" placeholder="How can we help?"></textarea>
                </div>
                <Button variant="primary" onClick={() => {}}>Send Message &#8594;</Button>
              </form>
            </div>

            <div className="contact-info-section">
              <div className="contact-card">
                <h3>OAK Foundation</h3>
                <p>
                  Rue de Lausanne 78<br />
                  1202 Geneva<br />
                  Switzerland
                </p>
              </div>

              <div className="contact-card">
                <h3>Need quick help?</h3>
                <p>
                  Try our AI-powered assistant <strong>Ask Oakie</strong> for instant answers
                  about grants, reporting, and policies.
                </p>
                <Button to="/help" variant="outline">Ask Oakie &#8594;</Button>
              </div>

              <div className="contact-card">
                <h3>Safeguarding concerns</h3>
                <p>
                  If you need to report a safeguarding concern, please visit our
                  dedicated safeguarding page for confidential reporting options.
                </p>
                <Button href="https://oakfnd.org/safeguarding/" variant="outline">
                  Safeguarding &#8594;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
