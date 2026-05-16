import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { aiService } from '../api/aiService';

const FloatingButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background: '#0d6efd',
      color: 'white',
      border: 'none',
      boxShadow: '0 6px 14px rgba(13,110,253,0.3)',
      cursor: 'pointer',
      fontSize: '22px'
    }}
    title="AI Assistant (Ctrl+K)"
  >
    ⚡
  </button>
);

const AiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const inputRef = useRef(null);

  // Add CSS animation for spinner
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const context = useMemo(() => ({
    route: location.pathname
  }), [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(v => !v);
        setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const { reply } = await aiService.chat(trimmed, context);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      console.error('AI Assistant Error:', e);
      let errorMessage = 'Error contacting AI service. Please try again later.';
      
      if (e.response?.status === 500) {
        if (e.response?.data?.error?.includes('OPENAI_API_KEY')) {
          errorMessage = 'AI Assistant is not configured. Please contact your administrator to set up the OpenAI API key.';
        } else {
          errorMessage = 'AI service error. Please try again later.';
        }
      } else if (e.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your message and try again.';
      } else if (e.code === 'NETWORK_ERROR' || e.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const panel = (
    <div
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '86px',
        width: '380px',
        maxHeight: '60vh',
        background: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '12px',
        boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '10px 12px', borderBottom: '1px solid #eee', fontWeight: 600 }}>AI Assistant</div>
      <div style={{ padding: '12px', gap: '8px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {messages.length === 0 && (
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            Ask about data, routes, or get summaries. Press Ctrl+K to toggle.
            <br />
            <small style={{ color: '#999', fontSize: '0.8rem' }}>
              Note: AI Assistant requires OpenAI API key configuration
            </small>
          </div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            background: m.role === 'user' ? '#e7f1ff' : '#f8f9fa',
            color: '#222',
            padding: '8px 10px',
            borderRadius: '10px',
            maxWidth: '85%'
          }}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div style={{ 
            color: '#888', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontStyle: 'italic'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #0d6efd',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Thinking…
          </div>
        )}
      </div>
      <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #eee', gap: '8px' }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '8px 10px', border: '1px solid #ccc', borderRadius: '8px' }}
        />
        <button onClick={send} disabled={loading} style={{ padding: '8px 12px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '8px' }}>Send</button>
      </div>
    </div>
  );

  return (
    <>
      {open && panel}
      <FloatingButton onClick={() => setOpen(v => !v)} />
    </>
  );
};

export default AiAssistant;


