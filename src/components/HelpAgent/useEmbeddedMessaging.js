/**
 * useEmbeddedMessaging — React hook to manage the Salesforce Embedded Messaging SDK lifecycle.
 *
 * Supports both WebV1 (MIAW) and WebV2 (Agentforce Chat) deployments.
 * The SDK dispatches CustomEvents on the window object for state tracking.
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

// Use init.min.js directly — WebV2 deployments redirect bootstrap.min.js to init.min.js
const SDK_SRC = `${SF_CONFIG.siteUrl}/assets/js/bootstrap.min.js`;

// Timeout in ms — if SDK doesn't become ready within this, show error
const INIT_TIMEOUT = 30000;

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

    // ── Register window-level event listeners BEFORE loading the script ──
    const onReady = () => {
      console.log('[Oakie] SDK ready — onEmbeddedMessagingReady fired');
      clearTimeout(timeoutRef.current);
      setStatus(STATE.READY);
    };

    const onInitSuccess = () => {
      console.log('[Oakie] SDK init success — onEmbeddedMessagingInitSuccess fired');
      clearTimeout(timeoutRef.current);
      setStatus(STATE.READY);
    };

    const onInitError = (e) => {
      console.error('[Oakie] SDK init error:', e.detail || e);
      clearTimeout(timeoutRef.current);
      setError('Chat initialisation failed. The deployment may not be configured for external access.');
      setStatus(STATE.ERROR);
    };

    const onConversationStarted = () => {
      console.log('[Oakie] Conversation started');
      setStatus(STATE.CHATTING);
    };

    const onConversationOpened = () => {
      console.log('[Oakie] Conversation opened');
      setStatus(STATE.CHATTING);
    };

    const onWindowMinimized = () => {
      console.log('[Oakie] Window minimized');
    };

    const onButtonCreated = () => {
      console.log('[Oakie] Chat button created');
      clearTimeout(timeoutRef.current);
      setStatus(STATE.READY);
    };

    // Listen for both MIAW and Agentforce Chat events
    window.addEventListener('onEmbeddedMessagingReady', onReady);
    window.addEventListener('onEmbeddedMessagingInitSuccess', onInitSuccess);
    window.addEventListener('onEmbeddedMessagingInitError', onInitError);
    window.addEventListener('onEmbeddedMessagingConversationStarted', onConversationStarted);
    window.addEventListener('onEmbeddedMessagingConversationOpened', onConversationOpened);
    window.addEventListener('onEmbeddedMessagingWindowMinimized', onWindowMinimized);
    window.addEventListener('onEmbeddedMessagingButtonCreated', onButtonCreated);

    // ── Load the SDK script ──
    const script = document.createElement('script');
    script.src = SDK_SRC;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      try {
        console.log('[Oakie] SDK script loaded successfully');

        // Always use embeddedservice_bootstrap — works for both WebV1 and WebV2
        const esb = window.embeddedservice_bootstrap;
        if (!esb) {
          throw new Error('embeddedservice_bootstrap not found after script load');
        }

        console.log('[Oakie] embeddedservice_bootstrap object found');
        console.log('[Oakie] ESB properties:', Object.keys(esb).join(', '));

        // Also log if agentforce_messaging is available
        if (window.agentforce_messaging) {
          console.log('[Oakie] agentforce_messaging also present (WebV2 deployment)');
        }

        // Hide the default floating chat button — we use our own UI
        esb.settings.hideChatButton = true;

        console.log('[Oakie] Calling init() with:', {
          orgId: SF_CONFIG.orgId,
          deploymentApiName: SF_CONFIG.deploymentApiName,
          siteUrl: SF_CONFIG.siteUrl,
          scrt2Url: SF_CONFIG.scrt2Url,
        });

        // Use the standard MIAW init signature — works for Web deployments (V1 and V2)
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
      window.removeEventListener('onEmbeddedMessagingReady', onReady);
      window.removeEventListener('onEmbeddedMessagingInitSuccess', onInitSuccess);
      window.removeEventListener('onEmbeddedMessagingInitError', onInitError);
      window.removeEventListener('onEmbeddedMessagingConversationStarted', onConversationStarted);
      window.removeEventListener('onEmbeddedMessagingConversationOpened', onConversationOpened);
      window.removeEventListener('onEmbeddedMessagingWindowMinimized', onWindowMinimized);
      window.removeEventListener('onEmbeddedMessagingButtonCreated', onButtonCreated);
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
      esb.utilAPI.launchChat();
    } catch (err) {
      console.error('[Oakie] launchChat error:', err);
      try {
        esb.showChatButton();
        setTimeout(() => {
          const chatBtn = document.querySelector('.embeddedMessagingConversationButton') ||
                          document.querySelector('[class*="embeddedMessaging"]');
          if (chatBtn) chatBtn.click();
        }, 300);
      } catch (err2) {
        console.error('[Oakie] launchChat fallback error:', err2);
      }
    }
  }, []);

  // ── 3. Send a message into the chat ──────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const esb = window.embeddedservice_bootstrap;
    if (!esb || !text) return;
    try {
      if (esb.prechatAPI && esb.prechatAPI.setHiddenPrechatFields) {
        await esb.prechatAPI.setHiddenPrechatFields({ Question: text });
      }
    } catch (err) {
      console.error('[Oakie] sendMessage error:', err);
    }
  }, []);

  return { status, error, launchChat, sendMessage, STATE };
}
