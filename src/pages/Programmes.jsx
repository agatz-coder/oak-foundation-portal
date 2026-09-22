import React from 'react';
import Hero from '../components/UI/Hero';
import Card from '../components/UI/Card';
import './Programmes.css';

const PROGRAMMES = [
  {
    name: 'Environment',
    description: 'We support efforts to protect marine, forest, and freshwater ecosystems, and promote sustainable land use and fisheries management.',
    color: 'var(--oak-environment)',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=75',
  },
  {
    name: 'Global Climate',
    description: 'We fund initiatives that reduce greenhouse gas emissions at scale and accelerate the transition to clean energy systems.',
    color: 'var(--oak-global-climate)',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=75',
  },
  {
    name: 'Housing & Homelessness',
    description: 'We work to ensure everyone has access to a safe, secure, and affordable home, with a focus on prevention and systemic change.',
    color: 'var(--oak-housing)',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=75',
  },
  {
    name: 'International Human Rights',
    description: 'We defend the rights and dignity of individuals and communities, supporting those who challenge injustice and hold power to account.',
    color: 'var(--oak-human-rights)',
    image: 'https://images.unsplash.com/photo-1529156069898-49953bc8b86b?w=600&q=75',
  },
  {
    name: 'Issues Affecting Women',
    description: 'We fund efforts to end violence against women and girls and to advance gender equality worldwide.',
    color: 'var(--oak-women)',
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&q=75',
  },
  {
    name: 'Learning Differences',
    description: 'We invest in research, advocacy, and practice to help every learner reach their full potential, regardless of how they learn.',
    color: 'var(--oak-learning)',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=75',
  },
];

function Programmes() {
  return (
    <div className="programmes-page">
      <Hero
        label="Our Work"
        title="Programme areas"
        subtitle="OAK Foundation funds programmes addressing critical global challenges. Learn about our focus areas and how we support change."
      />

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {PROGRAMMES.map((prog) => (
              <Card
                key={prog.name}
                title={prog.name}
                description={prog.description}
                accentColor={prog.color}
                image={prog.image}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Programmes;
