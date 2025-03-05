import { useState, useRef, useCallback, useEffect } from 'react';
import { ChatMessage } from '../../types/chatbot';
import { INITIAL_MESSAGE, CHAT_RESPONSES } from '../../constants/chatbot';
import { processCommand } from '../../utils/chatHandlers';
import SpeechRecognition from 'react-speech-recognition';
import { SPEECH_RECOGNITION_CONFIG } from '../../constants/chatbot';

export const useChatController = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: INITIAL_MESSAGE, isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListeningForActivation, setIsListeningForActivation] = useState(true);
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(async (transcript = '') => {
    const messageToSend = (inputValue || transcript).trim();
    if (!messageToSend || isProcessing) return;

    setIsProcessing(true);
    setMessages(prev => [...prev, { text: messageToSend, isUser: true }]);
    
    setInputValue('');
    
    try {
      const botResponse = processCommand(messageToSend);
      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
    } catch (error) {
      console.error('Error processing command:', error);
      setMessages(prev => [...prev, { text: CHAT_RESPONSES.ERROR, isUser: false }]);
    } finally {
      setIsProcessing(false);
    }
  }, [inputValue, isProcessing]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsListeningForActivation(true);
    setIsProcessing(false);
    SpeechRecognition.stopListening();
    setMessages(prev => [...prev, { text: CHAT_RESPONSES.CLOSING, isUser: false }]);
  }, []);

  const handleVoiceInput = useCallback(() => {
    try {
      // Create a state variable to track listening status
      const isCurrentlyListening = SpeechRecognition.browserSupportsSpeechRecognition() && !isProcessing;

      if (isCurrentlyListening) {
        SpeechRecognition.stopListening();
        setMessages(prev => [...prev, { text: CHAT_RESPONSES.PAUSED, isUser: false }]);
      } else {
        setInputValue('');
        SpeechRecognition.startListening(SPEECH_RECOGNITION_CONFIG);
        setMessages(prev => [...prev, { text: CHAT_RESPONSES.MIC_ON, isUser: false }]);
      }
    } catch (error) {
      console.error('Failed to handle voice input:', error);
      setMessages(prev => [...prev, { text: CHAT_RESPONSES.ERROR, isUser: false }]);
    }
  }, []);

  // Add scroll effect for messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return {
    isOpen,
    setIsOpen,
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isProcessing,
    setIsProcessing,
    isListeningForActivation,
    setIsListeningForActivation,
    messagesEndRef,
    inputRef,
    handleSend,
    handleClose,
    handleVoiceInput
  };
};