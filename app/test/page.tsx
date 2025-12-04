'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('Test page mounted');
    console.log('localStorage token:', localStorage.getItem('auth_token'));
    console.log('Cookies:', document.cookie);
  }, []);

  const clearAll = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    window.location.reload();
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <div className="space-y-4">
        <div>
          <p>localStorage token: {localStorage.getItem('auth_token') || 'None'}</p>
          <p>Cookies: {document.cookie || 'None'}</p>
        </div>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear All Storage & Reload
        </button>
        <div>
          <a href="/" className="text-blue-500 underline">Go to Home</a>
        </div>
        <div>
          <a href="/auth/signin" className="text-blue-500 underline">Go to Sign In</a>
        </div>
      </div>
    </div>
  );
}


