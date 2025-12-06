import { useState, useEffect } from 'react';

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onEmailChange: (email: string) => void;
  storageKey?: string;
}

export default function OTPVerification({ email, onVerified, onEmailChange, storageKey = 'otpVerification' }: OTPVerificationProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        if (data.timestamp && data.timestamp > fiveMinutesAgo) {
          if (data.email) {
            onEmailChange(data.email);
          }
          if (data.step === 'otp') {
            setStep('otp');
          }
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch (e) {
        localStorage.removeItem(storageKey);
      }
    }
    setInitialized(true);
  }, [storageKey, onEmailChange]);

  useEffect(() => {
    if (initialized && step === 'otp' && email) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          email,
          step,
          timestamp: Date.now()
        }));
      } catch (e) {
      }
    }
  }, [step, email, storageKey, initialized]);

  const clearStorage = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
    }
  };

  const checkAndVerify = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    const normalizedEmail = email.toLowerCase();
    onEmailChange(normalizedEmail);

    setLoading(true);
    setError('');

    try {
      const checkRes = await fetch('/api/check-verified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const checkData = await checkRes.json();

      if (checkRes.ok && checkData.verified) {
        setSuccess('Email already verified! Logging in...');
        clearStorage();
        setTimeout(() => onVerified(), 500);
        return;
      }

      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setSuccess('OTP sent to your email!');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    const normalizedEmail = email.toLowerCase();

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, code: otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setSuccess('Email verified successfully!');
      clearStorage();
      onVerified();
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {step === 'email' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base"
              placeholder="your@email.com"
            />
          </div>
          <button
            onClick={checkAndVerify}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-medium shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 disabled:opacity-50 transition-all text-sm sm:text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Sending...
              </span>
            ) : (
              'Send Verification Code →'
            )}
          </button>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-xl sm:text-2xl tracking-[0.3em] sm:tracking-[0.5em] font-mono transition-all"
              placeholder="------"
              maxLength={6}
            />
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 sm:mt-2 text-center">
              Enter the 6-digit code sent to <strong className="text-slate-700 break-all">{email}</strong>
            </p>
          </div>
          <button
            onClick={verifyOTP}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-medium shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 disabled:opacity-50 transition-all text-sm sm:text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Verifying...
              </span>
            ) : (
              'Verify Code →'
            )}
          </button>
          <button
            onClick={() => {
              setStep('email');
              setOtp('');
              setError('');
              clearStorage();
            }}
            className="w-full text-slate-500 py-2 hover:text-indigo-600 font-medium transition-colors text-sm"
          >
            ← Change Email
          </button>
        </>
      )}

      {error && (
        <div className="p-3 sm:p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 sm:p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg sm:rounded-xl text-xs sm:text-sm flex items-center gap-2">
          <span>✅</span>
          {success}
        </div>
      )}
    </div>
  );
}
