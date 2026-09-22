import React from 'react';
import Hero from '../components/UI/Hero';

function About() {
  return (
    <div className="about-page">
      <Hero
        label="About OAK Foundation"
        title="Contributing to a safer, fairer, and more sustainable world."
        subtitle="Through our grant-making, we address issues of global, social, and environmental concern, particularly those that have a major impact on the lives of the disadvantaged."
      />

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '720px' }}>
            <h2>Our Mission</h2>
            <p>
              OAK Foundation commits its resources to address issues of global, social, and
              environmental concern, particularly those that have a major impact on the lives
              of the disadvantaged. Through our grant-making, we seek to be a responsible
              contributor to building a world that is safer, fairer, and more sustainable.
            </p>

            <h2 style={{ marginTop: 'var(--space-2xl)' }}>How We Work</h2>
            <p>
              We fund programmes in Environment, Global Climate, Housing & Homelessness,
              International Human Rights, Issues Affecting Women, and Learning Differences,
              with additional country-based programmes in Brazil, Denmark, India, and Zimbabwe.
            </p>
            <p>
              OAK Foundation was established in 1983 and is based in Geneva, Switzerland.
              We have made over 5,000 grants to organisations across the globe.
            </p>

            <h2 style={{ marginTop: 'var(--space-2xl)' }}>Safeguarding</h2>
            <p>
              We are committed to safeguarding all individuals we come into contact with through
              our work. This includes protecting children, young people, and vulnerable adults
              from any form of harm, abuse, neglect, or exploitation. All partner organisations
              are expected to uphold these principles.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
