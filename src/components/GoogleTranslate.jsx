import React, { useEffect, useRef } from 'react';

/**
 * GoogleTranslate
 * Lightweight wrapper for the Google Website Translator widget as per
 * https://www.w3schools.com/howto/howto_google_translate.asp
 *
 * Notes:
 * - Loads the Google Translate script once and initializes the widget
 *   inside this component's container.
 * - Uses pageLanguage 'en' by default and limits languages to app focus.
 * - Opens inline selector that machine-translates rendered content.
 */
const GoogleTranslate = ({ className }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const containerId = 'google_translate_element';

    // Ensure the container has the expected id and is empty before init
    if (containerRef.current) {
      containerRef.current.id = containerId;
      containerRef.current.innerHTML = '';
    }

    const initTranslate = () => {
      try {
        if (
          window.google &&
          window.google.translate &&
          typeof window.google.translate.TranslateElement === 'function'
        ) {
          // Avoid creating multiple elements on hot reloads/mounts
          if (containerRef.current && containerRef.current.childElementCount === 0) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,hi,mr,gu,pa',
                autoDisplay: false,
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              },
              containerId
            );
          }
        } else {
          // Retry if script hasn't finished yet
          setTimeout(initTranslate, 300);
        }
      } catch (e) {
        // Retry on failure after short delay
        setTimeout(initTranslate, 500);
      }
    };

    // Expose init callback globally as required by the script's cb param
    window.googleTranslateElementInit = initTranslate;

    // Load the script once
    if (!window.__googleTranslateScriptAdded) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onload = initTranslate;
      document.body.appendChild(script);
      window.__googleTranslateScriptAdded = true;
    } else {
      // Script is already present; try initializing directly on next tick
      const t = setTimeout(initTranslate, 0);
      return () => clearTimeout(t);
    }

    // Cleanup: clear container to avoid duplicates on unmount/remount
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <>
      {/* Style overrides to normalize Google widget height & appearance */}
      <style>{`
        .translate-wrapper .goog-te-gadget {
          font-size:0 !important; /* hide default text label */
          line-height:1 !important;
          display:flex;
          align-items:center;
          height:100%;
        }
        .translate-wrapper .goog-te-gadget .goog-te-combo {
          font-size:0.875rem !important;
          padding:0.50rem 0.75rem !important;
          height:2.5rem !important; /* ~40px to match other buttons */
          line-height:1.25rem !important;
          border-radius:0.75rem !important;
          border:1px solid #A7F3D0 !important;
          background:#ECFDF5 !important;
          color:#065F46 !important;
          outline:none !important;
          width:100% !important; /* stretch to wrapper width */
        }
        .translate-wrapper .goog-te-gadget .goog-te-combo:focus {
          box-shadow:0 0 0 2px rgba(16,185,129,.35);
          border-color:#10B981 !important;
        }
        /* Hide Google branding link only (leave spans in place to avoid breaking events) */
        .translate-wrapper .goog-logo-link { display:none !important; }
      `}</style>
      <div
        ref={containerRef}
        className={`translate-wrapper relative z-10 flex items-center h-10 bg-white/70 rounded-xl border border-green-200 shadow-sm px-2 min-w-[10rem] sm:min-w-[12rem] ${className || ''}`}
      />
    </>
  );
};

export default GoogleTranslate;
