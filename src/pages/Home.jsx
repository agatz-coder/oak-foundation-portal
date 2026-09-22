import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/UI/Hero';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import './Home.css';

const PROGRAMMES = [
  { name: 'Environment', description: 'Marine, forest, and freshwater protection.', color: 'var(--oak-environment)' },
  { name: 'Global Climate', description: 'Cutting greenhouse-gas emissions at scale.', color: 'var(--oak-global-climate)' },
  { name: 'Housing & Homelessness', description: 'A safe, secure home for everyone.', color: 'var(--oak-housing)' },
  { name: 'International Human Rights', description: 'Defending freedoms and dignity worldwide.', color: 'var(--oak-human-rights)' },
  { name: 'Issues Affecting Women', description: 'Ending violence against women and girls.', color: 'var(--oak-women)' },
  { name: 'Learning Differences', description: 'Every learner reaches their full potential.', color: 'var(--oak-learning)' },
];

const NEWS = [
  { tag: 'GRANT-MAKING', title: 'New grant cycle opens for Environment programme', color: 'var(--oak-environment)' },
  { tag: 'PROGRAMME', title: 'Safeguarding training now available for all partners', color: 'var(--oak-secondary)' },
  { tag: 'UPDATE', title: 'Reporting portal improvements for Q4 2026', color: 'var(--oak-denmark)' },
];

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <Hero
        label="OAK Foundation - Grantee Portal"
        title="Address issues of global, social, and environmental concern."
        subtitle="Everything the OAK Foundation grantees and partners need — programme knowledge, policies, and support — in one place."
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
      >
        <Button to="/programmes" variant="primary">Explore programmes &#8594;</Button>
        <Button to="/knowledge" variant="white">Find a policy or resource</Button>
      </Hero>

      {/* Ask Oakie Teaser */}
      <section className="section ask-oakie-section">
        <div className="container">
          <div className="ask-oakie-teaser">
            <div className="oakie-avatar">
              <span className="oakie-icon">&#x1F333;</span>
            </div>
            <div className="oakie-content">
              <h3>Ask Oakie</h3>
              <p>Your AI-powered assistant for OAK Foundation</p>
              <p className="oakie-hint">Try asking about any of the following — or anything else about how we work:</p>
              <div className="oakie-prompts">
                <Link to="/help?prompt=How+do+I+apply+for+a+grant%3F" className="oakie-prompt-btn">How do I apply for a grant?</Link>
                <Link to="/help?prompt=What+are+the+reporting+requirements%3F" className="oakie-prompt-btn">What are the reporting requirements?</Link>
                <Link to="/help?prompt=Tell+me+about+OAK%27s+safeguarding+policy" className="oakie-prompt-btn">Tell me about OAK's safeguarding policy</Link>
              </div>
              <Button to="/help" variant="primary" className="oakie-cta">Start a conversation &#8594;</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Programme Areas */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-label">Our Work</span>
              <h2 className="section-title">Programme areas</h2>
            </div>
            <Link to="/programmes" className="section-link">All programmes &#8594;</Link>
          </div>
          <div className="grid grid-3">
            {PROGRAMMES.map((prog) => (
              <Card
                key={prog.name}
                title={prog.name}
                description={prog.description}
                accentColor={prog.color}
                image={`https://images.unsplash.com/photo-${prog.name === 'Environment' ? '1441974231531-c6227db76b6e' : prog.name === 'Global Climate' ? '1477959858617-67f85cf4f1df' : prog.name.includes('Housing') ? '1560518883-ce09059eeffa' : prog.name.includes('Human') ? '1529156069898-49953bc8b86b' : prog.name.includes('Women') ? '1573497620053-ea5300f94f21' : '1503676260728-1c00da094a0b'}?w=600&q=75`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Inside OAK / News */}
      <section className="section section--gray">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-label">Latest</span>
              <h2 className="section-title">Updates for grantees</h2>
            </div>
            <Link to="/knowledge" className="section-link">All updates &#8594;</Link>
          </div>
          <div className="grid grid-3">
            {NEWS.map((item) => (
              <Card
                key={item.title}
                title={item.title}
                tag={item.tag}
                accentColor={item.color}
                image={`https://images.unsplash.com/photo-${item.tag === 'GRANT-MAKING' ? '1497366216548-37526070297c' : item.tag === 'PROGRAMME' ? '1552664730-d307ca884978' : '1454165804606-c3d57bc86b40'}?w=600&q=75`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
