import React from 'react';
import './Card.css';

function Card({ title, description, image, accentColor, tag, onClick }) {
  return (
    <div className="card" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {image && (
        <div className="card-image">
          <img src={image} alt={title} />
          {accentColor && (
            <span className="card-accent" style={{ backgroundColor: accentColor }} />
          )}
        </div>
      )}
      <div className="card-body">
        {tag && <span className="card-tag" style={accentColor ? { color: accentColor } : {}}>{tag}</span>}
        <h3 className="card-title">{title}</h3>
        {description && <p className="card-description">{description}</p>}
      </div>
    </div>
  );
}

export default Card;
