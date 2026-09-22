import React from 'react';
import './Hero.css';

function Hero({ label, title, subtitle, children, backgroundImage, overlay = true }) {
  const style = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <section className={`hero ${overlay ? 'hero--overlay' : ''}`} style={style}>
      <div className="container hero-content">
        {label && <span className="hero-label">{label}</span>}
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {children && <div className="hero-actions">{children}</div>}
      </div>
    </section>
  );
}

export default Hero;
