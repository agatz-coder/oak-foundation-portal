/**
 * useEmbeddedMessaging — React hook to manage the MIAW (Messaging for In-App & Web) SDK lifecycle.
 *
 * States:
 *   loading  → SDK script is being loaded
 *   ready    → SDK is loaded and init() has been called; chat can be started
 *   chatting → A chat session is active
 *   ended    → Chat session has ended (can restart)
 *   error    → Something went wrong
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { SF_CONFIG } from '../../config/salesforce';

const SDK_SRC = `${SF_CONFIG.siteUrl}/assets/js/bootstrap.min.js`;

// Possible hook states
const STATE = {
  LOADING: 'loading',
  READY: 'ready',
  CHATTING: 'chatting',
  ENDED: 'ended',
  ERROR: 'error',
};

export default function useEmbeddedMessaging() {
  const [status, setStatus] = useState(STATE.LOADING);
  const [error, setError] = useState(null);
  const initCalled = useRef(false);

  // ── 1. Load SDK script & initialise ──────────────────────────────
  useEffect(() => {
    // Prevent double-init in React Strict Mode
    if (initCalled.current) return;
    initCalled.current = true;

    const script = document.createElement('script');
    script.src = SDK_SRC;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      try {
        const esb = window.embeddedservice_bootstrap;
        if (!esb) {
          throw new Error('embeddedservice_bootstrap not found after script load');
        }

        // Hide the default floating chat button — we use our own UI
        esb.settings.hideChatButton = true;

        // Register event listeners before init()
        esb.addEventHandler('onEmbeddedMessagingReady', () => {
          if (SF_CONFIG.chat.enableDebugLogs) {
            console.log('[Oakie] SDK ready');
          }
          setStatus(STATE.READY);
        });

        esb.addEventHandler('onEmbeddedMessagingChatStarted', () => {
          if (SF_CONFIG.chat.enableDebugLogs) {
            console.log('[Oakie] Chat started');
          }
          setStatus(STATE.CHATTING);
        });

        esb.addEventHandler('onEmbeddedMessagingChatEnded', () => {
          if (SF_CONFIG.chat.enableDebugLogs) {
            console.log('[Oakie] Chat ended');
          }
          setStatus(STATE.ENDED);
        });

        // Initialise the SDK
        esb.init(
          SF_CONFIG.orgId,
          SF_CONFIG.deploymentApiName,
          SF_CONFIG.siteUrl,
          { scrt2URL: SF_CONFIG.scrt2Url }
        );
      } catch (err) {
        console.error('[Oakie] Init error:', err);
        setError(err.message);
        setStatus(STATE.ERROR);
      }
    };

    script.onerror = () => {
      setError('Failed to load the chat SDK. Please try again later.');
      setStatus(STATE.ERROR);
    };

    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      try {
        document.body.removeChild(script);
      } catch {
        // Script may already be gone
      }
    };
  }, []);

  // ── 2. Launch / open the chat ────────────────────────────────────
  const launchChat = useCallback(() => {
    const esb = window.embeddedservice_bootstrap;
    if (!esb) return;
    try {
      esb.showChatButton();
      // Trigger the chat to open programmatically
      const chatBtn = document.querySelector('.embeddedMessagingFrame') ||
                      document.querySelector('[id*="embeddedMessaging"]');
      if (chatBtn) chatBtn.click();
    } catch (err) {
      console.error('[Oakie] launchChat error:', err);
    }
  }, []);

  // ── 3. Send a message into the chat ──────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const esb = window.embeddedservice_bootstrap;
    if (!esb || !text) return;
    try {
      await esb.prechatAPI.setHiddenPrechatFields({ Question: text });
      esb.showChatButton();
    } catch (err) {
      console.error('[Oakie] sendMessage error:', err);
    }
  }, []);

  return { status, error, launchChat, sendMessage, STATE };
}
