import React from 'react';
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
 *   2. Welcome  → avatar, canned prompts that open the SDK's native chat widget
 *   3. Chatting → SDK's native chat widget is open (shown in bottom-right)
 *
 * The SDK's native widget handles all messaging. Our React UI is just
 * a branded trigger — clicking any prompt or the "Start" button calls
 * launchChat() which opens the SDK's chat widget.
 */
function InlineHelpAgent() {
  const { status, error, launchChat, STATE } = useEmbeddedMessaging();

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

  // ── Chat active — SDK's native widget is handling the conversation ──
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
            Your conversation is open in the chat window below. If you don't see it, click the chat icon in the bottom-right corner.
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

  // ── Ready state — welcome screen with launch buttons ─────────────
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
        </div>

        {/* Start conversation button */}
        <button className="btn btn-primary start-chat-btn" onClick={launchChat}>
          Start a conversation &#8594;
        </button>

        {/* Suggested topics */}
        {SF_CONFIG.chat.showCannedPrompts && (
          <div className="welcome-prompts">
            <p className="welcome-hint">Or try asking about:</p>
            {SF_CONFIG.chat.cannedPrompts.map((prompt) => (
              <button
                key={prompt}
                className="prompt-btn"
                onClick={launchChat}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InlineHelpAgent;
