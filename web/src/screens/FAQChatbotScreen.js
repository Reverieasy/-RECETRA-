import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';

/**
 * FAQ Chatbot Screen Component
 * Provides an interactive chatbot interface for user support, with role-based answers
 * 
 * Features:
 * - Chat interface with message history
 * - Quick question buttons for common queries
 * - Intelligent response generation (role-based)
 * - Typing indicators
 * - Responsive design
 */
const FAQChatbotScreen = ({ userRole = 'viewer' }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I\'m your RECETRA assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Add some debugging
  // console.log('FAQChatbotScreen rendering, userRole:', userRole);

  const quickQuestions = [
    'How do I issue a receipt?',
    'How to verify a receipt?',
    'What are the different user roles?',
    'How to use QR codes?',
    'Contact support',
  ];

  // Role-based FAQ responses
  const faqResponses = {
    'how do i issue a receipt': (role) => {
      if (role === 'admin' || role === 'encoder') {
        return 'To issue a receipt, go to the "Issue Receipt" section, fill in the payer details, amount, purpose, select a category and template, then submit the form. The system will generate a unique receipt number and QR code.';
      } else {
        return 'Issuing receipts is only available to Admin and Encoder roles. You have read-only access.';
      }
    },
    'how to verify a receipt': (_) =>
      'You can verify a receipt by scanning its QR code or manually entering the receipt number in the "Receipt Verification" section. This will show you all the receipt details and confirm its authenticity.',
    'what are the different user roles': (_) =>
      'There are three roles: Admin (full system access), Encoder (can issue receipts), and Viewer (read-only access to view and verify receipts).',
    'how to use qr codes': (role) => {
      if (role === 'viewer') {
        return 'As a Viewer, you can use the QR code to quickly access receipt details and verify authenticity.';
      }
      return 'QR codes are automatically generated for each receipt. You can scan them using the verification feature to quickly access receipt details and verify authenticity.';
    },
    'contact support': (_) =>
      'For technical support, please contact the system administrator or your organization\'s IT department.',
  };

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for exact matches
    for (const [question, answerFn] of Object.entries(faqResponses)) {
      if (lowerMessage.includes(question)) {
        return answerFn(userRole);
      }
    }

    // Check for keywords
    if (lowerMessage.includes('receipt') && lowerMessage.includes('issue')) {
      return faqResponses['how do i issue a receipt'](userRole);
    }
    if (lowerMessage.includes('verify') || lowerMessage.includes('check')) {
      return faqResponses['how to verify a receipt'](userRole);
    }
    if (lowerMessage.includes('role') || lowerMessage.includes('admin') || lowerMessage.includes('encoder')) {
      return faqResponses['what are the different user roles'](userRole);
    }
    if (lowerMessage.includes('qr') || lowerMessage.includes('scan')) {
      return faqResponses['how to use qr codes'](userRole);
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('contact')) {
      return faqResponses['contact support'](userRole);
    }

    return 'I\'m not sure I understand. Could you please rephrase your question or try one of the quick questions below?';
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(text);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  // Check if we're in a standalone context (no Layout wrapper)
  const isStandalone = !document.querySelector('[data-layout]');

  if (isStandalone) {
    // Render standalone version without Layout
    return (
      <div style={standaloneStyles.container}>
        <div style={standaloneStyles.header}>
          <h1 style={standaloneStyles.title}>FAQ Chatbot</h1>
          <p style={standaloneStyles.subtitle}>RECETRA Assistant</p>
        </div>
        <div style={styles.container}>
          {/* Chat Messages */}
          <div style={styles.chatContainer}>
            <div style={styles.messagesList}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    ...styles.messageContainer,
                    ...(message.isUser ? styles.userMessage : styles.botMessage)
                  }}
                >
                  <div style={{
                    ...styles.messageBubble,
                    ...(message.isUser ? styles.userBubble : styles.botBubble)
                  }}>
                    <span style={{
                      ...styles.messageText,
                      ...(message.isUser ? styles.userText : styles.botText)
                    }}>
                      {message.text}
                    </span>
                    <span style={styles.timestamp}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={styles.typingContainer}>
                  <span style={styles.typingText}>Assistant is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Questions */}
          <div style={styles.quickQuestionsContainer}>
            <span style={styles.quickQuestionsTitle}>Quick Questions:</span>
            <div style={styles.quickQuestionsRow}>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  style={styles.quickQuestionButton}
                  onClick={() => handleQuickQuestion(question)}
                >
                  <span style={styles.quickQuestionText}>{question}</span>
                </button>
              ))}
            </div>
            <span style={{ marginTop: 10, fontSize: 12, color: '#9ca3af', fontStyle: 'italic', display: 'block' }}>
              Current Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          </div>

          {/* Input Area */}
          <div style={styles.inputContainer}>
            <textarea
              style={styles.textInput}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question..."
              maxLength={500}
              rows={1}
            />
            <button
              style={{
                ...styles.sendButton,
                ...(!inputText.trim() && styles.sendButtonDisabled)
              }}
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
            >
              <span style={styles.sendButtonText}>Send</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal render with Layout
  return (
    <Layout title="FAQ Chatbot" showBackButton={true}>
      <div style={styles.container}>
        {/* Chat Messages */}
        <div style={styles.chatContainer}>
          <div style={styles.messagesList}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...styles.messageContainer,
                  ...(message.isUser ? styles.userMessage : styles.botMessage)
                }}
              >
                <div style={{
                  ...styles.messageBubble,
                  ...(message.isUser ? styles.userBubble : styles.botBubble)
                }}>
                  <span style={{
                    ...styles.messageText,
                    ...(message.isUser ? styles.userText : styles.botText)
                  }}>
                    {message.text}
                  </span>
                  <span style={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={styles.typingContainer}>
                <span style={styles.typingText}>Assistant is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Questions */}
        <div style={styles.quickQuestionsContainer}>
          <span style={styles.quickQuestionsTitle}>Quick Questions:</span>
          <div style={styles.quickQuestionsRow}>
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                style={styles.quickQuestionButton}
                onClick={() => handleQuickQuestion(question)}
              >
                <span style={styles.quickQuestionText}>{question}</span>
              </button>
            ))}
          </div>
          <span style={{ marginTop: 10, fontSize: 12, color: '#9ca3af', fontStyle: 'italic', display: 'block' }}>
            Current Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </span>
        </div>

        {/* Input Area */}
        <div style={styles.inputContainer}>
          <textarea
            style={styles.textInput}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            maxLength={500}
            rows={1}
          />
          <button
            style={{
              ...styles.sendButton,
              ...(!inputText.trim() && styles.sendButtonDisabled)
            }}
            onClick={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
          >
            <span style={styles.sendButtonText}>Send</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

// Standalone styles for when not using Layout
const standaloneStyles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
    padding: '20px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    borderRadius: '12px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    margin: 0,
    opacity: 0.9,
  },
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 120px)',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  messagesList: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 300px)',
  },
  messageContainer: {
    marginBottom: '12px',
  },
  userMessage: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  botMessage: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: '12px',
    borderRadius: '16px',
  },
  userBubble: {
    backgroundColor: '#1e3a8a',
    borderBottomRightRadius: '4px',
  },
  botBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  messageText: {
    fontSize: '14px',
    lineHeight: '20px',
    display: 'block',
    wordWrap: 'break-word',
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#374151',
  },
  timestamp: {
    fontSize: '10px',
    color: '#9ca3af',
    marginTop: '4px',
    display: 'block',
    textAlign: 'right',
  },
  typingContainer: {
    padding: '12px',
    display: 'flex',
    alignItems: 'flex-start',
  },
  typingText: {
    fontSize: '12px',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    backgroundColor: 'white',
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
  },
  quickQuestionsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    display: 'block',
  },
  quickQuestionsRow: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  quickQuestionButton: {
    backgroundColor: '#f3f4f6',
    padding: '8px 12px',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: '#374151',
    transition: 'background-color 0.2s',
  },
  quickQuestionText: {
    fontSize: '12px',
    color: '#374151',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    padding: '16px',
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    alignItems: 'flex-end',
    gap: '8px',
  },
  textInput: {
    flex: 1,
    border: '1px solid #d1d5db',
    borderRadius: '20px',
    padding: '10px 16px',
    fontSize: '14px',
    maxHeight: '100px',
    backgroundColor: 'white',
    resize: 'none',
    fontFamily: 'inherit',
  },
  sendButton: {
    backgroundColor: '#1e3a8a',
    padding: '10px 16px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  sendButtonText: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
  },
};

export default FAQChatbotScreen;