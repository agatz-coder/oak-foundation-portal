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

// Timeout in ms — if SDK doesn't become ready within this, show error
const INIT_TIMEOUT = 20000;

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
  const timeoutRef = useRef(null);

  // ── 1. Load SDK script & initialise ──────────────────────────────
  useEffect(() => {
    // Prevent double-init in React Strict Mode
    if (initCalled.current) return;
    initCalled.current = true;

    // Set a timeout to catch cases where the SDK loads but never fires onReady
    timeoutRef.current = setTimeout(() => {
      setStatus((prev) => {
        if (prev === STATE.LOADING) {
          console.warn('[Oakie] SDK init timed out after', INIT_TIMEOUT, 'ms');
          setError(
            'The chat service is taking too long to respond. This may be a configuration issue. Please try refreshing.'
          );
          return STATE.ERROR;
        }
        return prev;
      });
    }, INIT_TIMEOUT);

    const script = document.createElement('script');
    script.src = SDK_SRC;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      try {
        console.log('[Oakie] bootstrap.min.js loaded successfully');

        const esb = window.embeddedservice_bootstrap;
        if (!esb) {
          throw new Error('embeddedservice_bootstrap not found after script load');
        }

        console.log('[Oakie] embeddedservice_bootstrap object found, setting up...');

        // Hide the default floating chat button — we use our own UI
        esb.settings.hideChatButton = true;

        // Register event listeners before init()
        esb.addEventHandler('onEmbeddedMessagingReady', () => {
          console.log('[Oakie] SDK ready — onEmbeddedMessagingReady fired');
          clearTimeout(timeoutRef.current);
          setStatus(STATE.READY);
        });

        esb.addEventHandler('onEmbeddedMessagingChatStarted', () => {
          console.log('[Oakie] Chat started');
          setStatus(STATE.CHATTING);
        });

        esb.addEventHandler('onEmbeddedMessagingChatEnded', () => {
          console.log('[Oakie] Chat ended');
          setStatus(STATE.ENDED);
        });

        // Listen for errors from the SDK itself
        esb.addEventHandler('onEmbeddedMessagingInitError', (err) => {
          console.error('[Oakie] SDK init error event:', err);
          clearTimeout(timeoutRef.current);
          setError('Chat initialisation failed. The deployment may not be configured for external access.');
          setStatus(STATE.ERROR);
        });

        // Catch unhandled errors from the SDK via window error listener
        const sdkErrorHandler = (event) => {
          if (event.filename && event.filename.includes('bootstrap.min.js')) {
            console.error('[Oakie] SDK runtime error:', event.message);
          }
        };
        window.addEventListener('error', sdkErrorHandler);

        console.log('[Oakie] Calling init() with:', {
          orgId: SF_CONFIG.orgId,
          deploymentApiName: SF_CONFIG.deploymentApiName,
          siteUrl: SF_CONFIG.siteUrl,
          scrt2Url: SF_CONFIG.scrt2Url,
        });

        // Initialise the SDK
        esb.init(
          SF_CONFIG.orgId,
          SF_CONFIG.deploymentApiName,
          SF_CONFIG.siteUrl,
          { scrt2URL: SF_CONFIG.scrt2Url }
        );

        console.log('[Oakie] init() called, waiting for onEmbeddedMessagingReady...');
      } catch (err) {
        console.error('[Oakie] Init error:', err);
        clearTimeout(timeoutRef.current);
        setError(err.message);
        setStatus(STATE.ERROR);
      }
    };

    script.onerror = () => {
      clearTimeout(timeoutRef.current);
      setError('Failed to load the chat SDK. Please try again later.');
      setStatus(STATE.ERROR);
    };

    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutRef.current);
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
