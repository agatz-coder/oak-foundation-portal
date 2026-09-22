import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/UI/Hero';
import { InlineHelpAgent } from '../components/HelpAgent';
import './Help.css';

function Help() {
  // Support ?prompt=... from canned-prompt links on the Home page
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';

  return (
    <div className="help-page">
      <Hero
        label="Support"
        title="How can we help?"
        subtitle="Ask Oakie a question about grants, reporting, policies, or anything else related to working with OAK Foundation."
      />

      <section className="section">
        <div className="container">
          <div className="help-agent-container">
            <InlineHelpAgent initialPrompt={initialPrompt} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Help;
