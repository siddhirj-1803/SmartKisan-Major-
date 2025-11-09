import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

// Refactored: single "Translate" button with custom dropdown for internal i18n languages.
// Removed external Google Translate button & widget per request.
const LanguageSelector = () => {
  const { currentLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(currentLanguage || 'en');

  const currentName = languages.find(l => l.code === selectedLang)?.name || 'Translate';

  const openGoogleTranslate = (code) => {
    try {
      const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${encodeURIComponent(code)}&u=${encodeURIComponent(window.location.href)}`;
      window.open(translateUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      window.open('https://translate.google.com', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m6 16h-6m3-2v2M21 21v-2a4 4 0 00-4-4H9" />
        </svg>
        <span className="font-semibold tracking-wide">{currentName}</span>
        <svg className={`h-4 w-4 transform transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
        <span className="absolute inset-0 rounded-xl ring-0 ring-emerald-400/0 group-hover:ring-2 group-hover:ring-emerald-400/40 transition" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            key="lang-dropdown"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-emerald-100 overflow-hidden z-50"
          >
            {languages.map(l => (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => { setSelectedLang(l.code); setOpen(false); openGoogleTranslate(l.code); }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors ${
                    l.code === selectedLang
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-emerald-800 hover:bg-emerald-50'
                  }`}
                  role="option"
                  aria-selected={l.code === selectedLang}
                >
                  <span>{l.name}</span>
                  {l.code === selectedLang && (
                    <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;