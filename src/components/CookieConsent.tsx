import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };

  const handleClose = () => {
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 sm:p-6 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Cookie Consent</h3>
            <p className="text-sm text-gray-300">
              We use cookies to enhance your experience, analyze site traffic, and deliver personalized content. 
              By clicking "Accept", you agree to our{' '}
              <a href="#" className="underline hover:text-blue-400">Cookie Policy</a> and{' '}
              <a href="#" className="underline hover:text-blue-400">Privacy Policy</a>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="px-6 py-2 text-sm font-medium rounded-lg border border-gray-600 hover:border-gray-400 transition-colors whitespace-nowrap"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
