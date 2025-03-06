import { useChatSpeech } from '../../hooks/useChatSpeech';
import { useChatController } from './ChatBotController';
import { ChatBotUI } from './ChatBotUI';
import { processCommand } from '../../utils/chatHandlers';
import { useEffect, useCallback, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChatMessage } from '../../types/chatbot';
import {  CHAT_RESPONSES } from '../../constants/chatbot';
import SpeechRecognition from 'react-speech-recognition';

const ChatBot = () => {
  const auth = useAuth();

  if (!auth?.user) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: CHAT_RESPONSES.INITIAL, isUser: false }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListeningForActivation, setIsListeningForActivation] = useState(true);

  const {
    transcript,
    listening,
    resetTranscript,
    // browserSupportsSpeechRecognition,
    setIsExplicitlyStopped
  } = useChatSpeech(
    isOpen,
    setIsOpen,
    setMessages,
    isListeningForActivation,
    isProcessing,
    setIsListeningForActivation
  );

  const {
    inputValue,
    setInputValue,
    messagesEndRef,
    inputRef,
    handleSend,
    handleVoiceInput
  } = useChatController(listening, setIsExplicitlyStopped);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsListeningForActivation(true);
    setIsProcessing(false);
    SpeechRecognition.stopListening();
    setIsExplicitlyStopped(true);
    setMessages([{ text: CHAT_RESPONSES.CLOSING, isUser: false }]);
    setTimeout(() => {
      setMessages([{ text: CHAT_RESPONSES.INITIAL, isUser: false }]);
    }, 1000);
  }, []);

  const handleVoiceCommand = useCallback(async (message: string) => {
    if (!message.trim() || isProcessing) return;
    
    const displayMessage = message.trim();
    setMessages(prev => [...prev, { text: displayMessage, isUser: true }]);
    setInputValue('');
    
    // Process the command
    const response = processCommand(displayMessage, {
      handleMicToggle: () => {
        handleVoiceInput();
        setIsExplicitlyStopped(true);
        setMessages(prev => [...prev, { text: CHAT_RESPONSES.MIC_OFF, isUser: false }]);
      },
      handleClose,
      handleSend
    });
    
    if (response) {
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }
    resetTranscript();
  }, [handleSend, isProcessing, setInputValue, resetTranscript, handleClose, handleVoiceInput]);

  // Handle transcript changes
  useEffect(() => {
    if (!transcript || !isOpen || isProcessing) return;

    const timeoutId = setTimeout(() => {
      handleVoiceCommand(transcript);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [transcript, isOpen, isProcessing, handleVoiceCommand]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const container = document.querySelector('.chatbot-container');
      if (isOpen && container && !container.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClose]);

  return (
    <ChatBotUI
      isOpen={isOpen}
      messages={messages}
      inputValue={inputValue}
      isProcessing={isProcessing}
      listening={listening}
      transcript={transcript}
      isListeningForActivation={isListeningForActivation}
      messagesEndRef={messagesEndRef}
      inputRef={inputRef}
      onOpen={() => {
        setIsOpen(true);
        setIsListeningForActivation(false);
        setIsExplicitlyStopped(false);
        handleVoiceInput();
      }}
      onClose={handleClose}
      onSend={() => handleVoiceCommand(transcript || inputValue)}
      onInputChange={setInputValue}
      onVoiceInput={handleVoiceInput}
      setInputValueAndSend={(value) => {
        setInputValue(value);
        handleVoiceCommand(value);
      }}
    />
  );
};

export default ChatBot;