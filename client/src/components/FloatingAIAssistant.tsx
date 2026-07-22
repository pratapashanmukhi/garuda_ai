import { useState } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { api } from '../data/api';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI investigation assistant. Ask me anything about fraud detection, transaction analysis, or case management.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    'Why was this transaction flagged?',
    'Summarize this case',
    'Generate report',
    'Suggest next investigation',
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const historyPayload = messages.map((msg) => ({
      role: msg.type === 'user' ? 'user' : 'model',
      content: msg.content,
    }));

    const apiKey = localStorage.getItem('garuda_gemini_api_key') || undefined;

    api.chatWithCopilot(text, historyPayload, apiKey).then((reply) => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-icon"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          zIndex: 50,
          background: isOpen ? 'var(--neon-red)' : 'linear-gradient(135deg, var(--neon-blue), var(--neon-cyan-light))',
          border: '1px solid transparent',
          boxShadow: isOpen
            ? 'none'
            : '0 0 25px rgba(0, 217, 255, 0.4), 0 8px 32px rgba(0, 217, 255, 0.2)',
          animation: isOpen ? 'none' : 'float 3s ease-in-out infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          color: isOpen ? 'white' : 'var(--brand-primary)',
        }}
        title="AI Assistant"
      >
        {isOpen ? <FiX /> : <FiMessageCircle />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            width: '380px',
            height: '500px',
            background: 'rgba(8, 18, 41, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 51,
            animation: 'slideInUp 0.3s ease-out',
            maxHeight: '80vh',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-primary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h4 style={{ marginBottom: '2px' }}>GARUDA AI Assistant</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>Always online</p>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'slideInUp 0.3s ease-out',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background:
                      msg.type === 'user'
                        ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(0, 217, 255, 0.2))'
                        : 'rgba(0, 217, 255, 0.1)',
                    border: `1px solid ${msg.type === 'user' ? 'rgba(0, 217, 255, 0.3)' : 'var(--border-secondary)'}`,
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  animation: 'slideInUp 0.3s ease-out',
                }}
              >
                <div style={{ padding: '10px 14px', display: 'flex', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-cyan)', animation: 'pulse 1.4s ease-in-out infinite' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-cyan)', animation: 'pulse 1.4s ease-in-out infinite 0.2s' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-cyan)', animation: 'pulse 1.4s ease-in-out infinite 0.4s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div style={{ padding: '12px', borderTop: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0, marginBottom: '4px' }}>Suggested:</p>
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(0, 217, 255, 0.1)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: '6px',
                    color: 'var(--neon-cyan-light)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 0.15)';
                    e.currentTarget.style.borderColor = 'var(--neon-cyan)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 217, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'var(--border-secondary)';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-primary)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSendMessage(input);
                }
              }}
              placeholder="Ask me anything..."
              style={{ flex: 1 }}
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="btn-icon"
              style={{
                opacity: isLoading || !input.trim() ? 0.5 : 1,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingAIAssistant;
