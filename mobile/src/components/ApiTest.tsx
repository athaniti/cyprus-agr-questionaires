// Simple API Connection Test Component
import { useEffect, useState } from 'react';

const ApiTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const getApiBaseUrl = () => {
      if (window.location.protocol === 'capacitor:' || window.location.protocol === 'ionic:') {
        return 'http://192.168.30.19:5050/api';
      }
      if (window.location.hostname === '192.168.30.19') {
        return 'http://192.168.30.19:5050/api';
      }
      return 'http://localhost:5050/api';
    };

    const testApiUrl = getApiBaseUrl();
    setApiUrl(testApiUrl);

    fetch(`${testApiUrl.replace('/api', '')}/health`)
      .then(response => response.json())
      .then(data => {
        setStatus(`✅ Connected! ${data.status} at ${data.timestamp}`);
      })
      .catch(error => {
        setStatus(`❌ Failed: ${error.message}`);
      });
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>API Test</strong></div>
      <div>URL: {apiUrl}</div>
      <div>Status: {status}</div>
      <div>Location: {window.location.protocol}//{window.location.hostname}:{window.location.port}</div>
    </div>
  );
};

export default ApiTest;