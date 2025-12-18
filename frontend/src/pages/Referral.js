// File: src/pages/Referral.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Referral() {
    const { user } = useAuth();
    const [link, setLink] = useState('');
    const [message, setMessage] = useState('');

    const showTempMessage = (msg, ms = 2500) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), ms);
    };

    const deriveReferralCode = (u) => {
        if (!u) return '';
        // common field names used in the app: referral_uuid, referralId, referral
        return u.referral_uuid || u.referralId || u.referral || u.referral_code || '';
    };

    useEffect(() => {
        // Try auth context first, then fallback to localStorage 'user'
        let currentUser = user;
        if (!currentUser) {
            try {
                const raw = localStorage.getItem('user');
                if (raw) currentUser = JSON.parse(raw);
            } catch (e) {
                // ignore
            }
        }

        const code = deriveReferralCode(currentUser);
        if (code) {
            setLink(`${window.location.origin}/register?ref=${code}`);
        } else {
            setLink('');
            showTempMessage('No referral code found for your account');
        }
    }, [user]);

    const handleCopy = async () => {
        if (!link) return showTempMessage('No referral link to copy');
        try {
            await navigator.clipboard.writeText(link);
            showTempMessage('Referral link copied to clipboard');
        } catch (err) {
            showTempMessage('Copy failed');
        }
    };

    return (
        <main className="p-6">
            <h3 className="text-xl font-semibold mb-4">Referral</h3>

            <div className="space-y-4 max-w-md">
                <p className="text-sm text-gray-700">Share your referral link so friends can sign up and you can earn rewards.</p>

                <div className="flex items-center gap-2">
                    {link ? (
                        <>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="text-sm bg-gray-200 px-3 py-1 rounded"
                            >
                                Copy
                            </button>
                        </>
                    ) : (
                        <span className="text-sm text-gray-500">No referral link available</span>
                    )}
                </div>

                {message && <p className="text-sm text-green-600">{message}</p>}
                {link && <p className="text-sm text-gray-700 break-all">{link}</p>}
            </div>
        </main>
    );
}

export default Referral;
