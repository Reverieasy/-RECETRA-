import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import Layout from '../components/Layout';

type UserRole = 'Admin' | 'Encoder' | 'Viewer';
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}
interface FAQChatbotScreenProps {
  userRole?: UserRole;
}
const FAQChatbotScreen: React.FC<FAQChatbotScreenProps> = ({
  userRole = 'Viewer',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your RECETRA assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const quickQuestions = [
    'How do I issue a receipt?',
    'How to verify a receipt?',
    'What are the different user roles?',
    'How to use QR codes?',
    'Contact support',
  ];

   const faqResponses: { [key: string]: (role: UserRole) => string } = {
    'how do i issue a receipt': (role) => {
      if (role === 'Admin' || role === 'Encoder') {
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
      if (role === 'Viewer') {
        return 'As a Viewer, you can use the QR code to quickly access receipt details and verify authenticity.';
      }
      return 'QR codes are automatically generated for each receipt. You can scan them using the verification feature to quickly access receipt details and verify authenticity.';
    },
    'contact support': (_) =>
      "For technical support, please contact the system administrator or your organization's IT department.",
  };

 const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

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
    if (
      lowerMessage.includes('role') ||
      lowerMessage.includes('admin') ||
      lowerMessage.includes('encoder')
    ) {
      return faqResponses['what are the different user roles'](userRole);
    }
    if (lowerMessage.includes('qr') || lowerMessage.includes('scan')) {
      return faqResponses['how to use qr codes'](userRole);
    }
    if (
      lowerMessage.includes('help') ||
      lowerMessage.includes('support') ||
      lowerMessage.includes('contact')
    ) {
      return faqResponses['contact support'](userRole);
    }

    return "I'm not sure I understand. Could you please rephrase your question or try one of the quick questions below?";
  };


  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

     setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
       setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.botMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userText : styles.botText,
          ]}
        >
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <Layout title="FAQ Chatbot" showBackButton={true}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >


        {/* Chat Messages */}
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />

          {isTyping && (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>Assistant is typing...</Text>
            </View>
          )}
        </View>

        {/* Quick Questions */}
        <View style={styles.quickQuestionsContainer}>
          <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.quickQuestionsRow}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion(question)}
                >
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <Text style={{ marginTop: 10, fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>
            Current Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Text>
        </View>

        {/* Input Area */}
         <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your question..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#1e3a8a',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#374151',
  },
  timestamp: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    padding: 12,
    alignItems: 'flex-start',
  },
  typingText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  quickQuestionsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  quickQuestionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickQuestionButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickQuestionText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    backgroundColor: 'white',
  },
  sendButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FAQChatbotScreen;