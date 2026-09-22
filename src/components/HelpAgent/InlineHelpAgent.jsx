import React, { useState, useCallback } from 'react';
import useEmbeddedMessaging from './useEmbeddedMessaging';
import SkeletonLoader from './SkeletonLoader';
import { SF_CONFIG } from '../../config/salesforce';
import './InlineHelpAgent.css';

/** SVG oak leaf icon — works reliably across all browsers (no emoji issues) */
const OakLeafIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 4C24 12 12 20 12 36c0 10 8 20 20 24 12-4 20-14 20-24C52 20 40 12 32 4z"
      fill="#2E7D32"
      stroke="#1B5E20"
      strokeWidth="2"
    />
    <path
      d="M32 16v36M32 28c-6-2-10 0-10 0M32 36c6-2 10 0 10 0M32 22c4-1 7 1 7 1M32 44c-5-1-8 1-8 1"
      stroke="#A5D6A7"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * InlineHelpAgent — the "Ask Oakie" inline chat interface.
 *
 * It manages three visual phases:
 *   1. Loading  → shimmer skeleton while SDK boots
 *   2. Welcome  → avatar, canned prompts, input bar (SDK ready, no chat yet)
 *   3. Chatting → Salesforce Messaging iFrame takes over
 *
 * If the SDK fails to load, a graceful fallback is shown with a link to the
 * Experience Cloud site where the agent also lives.
 */
function InlineHelpAgent({ initialPrompt }) {
  const { status, error, launchChat, sendMessage, STATE } = useEmbeddedMessaging();
  const [inputText, setInputText] = useState('');

  // Send a canned prompt or typed message
  const handleSend = useCallback(
    (text) => {
      const message = text || inputText;
      if (!message.trim()) return;
      sendMessage(message);
      launchChat();
      setInputText('');
    },
    [inputText, sendMessage, launchChat]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // If an initial prompt was passed (e.g. from Home page canned prompt link), trigger it
  React.useEffect(() => {
    if (initialPrompt && status === STATE.READY) {
      handleSend(initialPrompt);
    }
  }, [status, initialPrompt, STATE.READY, handleSend]);

  // ── Loading state ────────────────────────────────────────────────
  if (status === STATE.LOADING) {
    return (
      <div className="inline-help-agent">
        <SkeletonLoader />
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────
  if (status === STATE.ERROR) {
    return (
      <div className="inline-help-agent">
        <div className="help-agent-fallback">
          <div className="oakie-avatar-lg">
            <OakLeafIcon size={36} />
          </div>
          <h3>Oakie is having trouble connecting</h3>
          <p>{error || 'Please try refreshing the page.'}</p>
          <a
            href={SF_CONFIG.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Open Help Centre &#8594;
          </a>
        </div>
      </div>
    );
  }

  // ── Chat active — SDK renders in its own iFrame ──────────────────
  if (status === STATE.CHATTING) {
    return (
      <div className="inline-help-agent">
        <div className="help-agent-active">
          <div className="help-agent-active-header">
            <div className="oakie-avatar-sm">
              <OakLeafIcon size={20} />
            </div>
            <div>
              <h3>Ask Oakie</h3>
              <span className="status-dot" />
              <span className="status-text">Connected</span>
            </div>
          </div>
          <p className="help-agent-active-note">
            The chat window should appear. If it doesn't, please check your browser's pop-up settings.
          </p>
        </div>
      </div>
    );
  }

  // ── Ended state — allow restart ─────────────────────────────────
  if (status === STATE.ENDED) {
    return (
      <div className="inline-help-agent">
        <div className="help-agent-ended">
          <div className="oakie-avatar-lg">
            <OakLeafIcon size={36} />
          </div>
          <h3>Chat ended</h3>
          <p>Thank you for reaching out. You can start a new conversation anytime.</p>
          <button className="btn btn-primary" onClick={launchChat}>
            Start a new conversation &#8594;
          </button>
        </div>
      </div>
    );
  }

  // ── Ready state — welcome screen with prompts ───────────────────
  return (
    <div className="inline-help-agent">
      <div className="help-agent-welcome">
        {/* Avatar & greeting */}
        <div className="welcome-header">
          <div className="oakie-avatar-lg">
            <OakLeafIcon size={36} />
          </div>
          <h3>Ask Oakie</h3>
          <p className="welcome-subtitle">Your AI-powered assistant for OAK Foundation</p>
          <p className="welcome-hint">
            Try asking about any of the following — or anything else about how we work:
          </p>
        </div>

        {/* Canned prompts */}
        {SF_CONFIG.chat.showCannedPrompts && (
          <div className="welcome-prompts">
            {SF_CONFIG.chat.cannedPrompts.map((prompt) => (
              <button
                key={prompt}
                className="prompt-btn"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Text input */}
        <div className="welcome-input-area">
          <input
            type="text"
            placeholder="Type your question here..."
            className="welcome-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="welcome-send-btn"
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            aria-label="Send message"
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  );
}

export default InlineHelpAgent;
