import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';

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

  const quickQuestions = [
    'How do I issue a receipt?',
    'How to verify a receipt?',
    'What are the different user roles?',
    'How to use QR codes?',
    'Contact support',
  ];

  // --- Responses ---
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

    for (const [question, answerFn] of Object.entries(faqResponses)) {
      if (lowerMessage.includes(question)) {
        return answerFn(userRole);
      }
    }

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

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
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

  return (
    <Layout title="FAQ Chatbot" showBackButton={true}>
      <div style={styles.chatWrapper}>


        {/* Messages */}
        <div style={styles.messagesList}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                ...styles.messageContainer,
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
              }}
            >
              {!message.isUser && <div style={styles.avatar}>🤖</div>}
              <div
                style={{
                  ...styles.messageBubble,
                  ...(message.isUser ? styles.userBubble : styles.botBubble),
                }}
              >
                <span style={styles.messageText}>{message.text}</span>
                <span style={styles.timestamp}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
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

        {/* Quick Questions */}
        <div style={styles.quickQuestionsContainer}>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              style={styles.quickQuestionButton}
              onClick={() => handleQuickQuestion(q)}
            >
              {q}
            </button>
          ))}
          <span style={styles.roleText}>
            Current Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </span>
        </div>

        {/* Input */}
        <div style={styles.inputContainer}>
          <textarea
            style={styles.textInput}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
          />
          <button
            style={{
              ...styles.sendButton,
              ...(!inputText.trim() && styles.sendButtonDisabled),
            }}
            onClick={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </Layout>
  );
};

// Messenger-style design
const styles = {
  chatWrapper: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f2f5',
    borderRadius: '12px',
    height: 'calc(100vh - 120px)',
    position: 'relative',
  },

  messagesList: {
    flex: 1,
    padding: '16px',
    paddingBottom: '160px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'auto',
  },
  messageContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '6px',
  },
  avatar: {
    fontSize: '20px',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '10px 14px',
    borderRadius: '18px',
    fontSize: '14px',
    lineHeight: '18px',
  },
  userBubble: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    borderBottomRightRadius: '6px',
  },
  botBubble: {
    backgroundColor: 'white',
    color: '#374151',
    borderBottomLeftRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  messageText: {
    display: 'block',
  },
  timestamp: {
    fontSize: '10px',
    color: '#9ca3af',
    marginTop: '4px',
    display: 'block',
  },
  typingContainer: {
    padding: '8px',
    fontStyle: 'italic',
    fontSize: '12px',
    color: '#6b7280',
  },
  quickQuestionsContainer: {
    position: 'absolute',
    bottom: '80px',
    left: '0',
    right: '0',
    padding: '10px',
    backgroundColor: '#fff',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    borderRadius: '12px 12px 0 0',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  quickQuestionButton: {
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  roleText: {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '6px',
    display: 'block',
  },
  inputContainer: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    padding: '16px 20px',
    backgroundColor: '#fff',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderRadius: '12px 12px 0 0',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  textInput: {
    flex: 1,
    border: '1px solid #d1d5db',
    borderRadius: '20px',
    padding: '10px 14px',
    fontSize: '14px',
    resize: 'none',
  },
  sendButton: {
    backgroundColor: '#1e3a8a',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
};

export default FAQChatbotScreen;
