import { useChatSpeech } from '../../hooks/useChatSpeech';
import { useChatController } from './ChatBotController';
import { ChatBotUI } from './ChatBotUI';
import { processVoiceCommand } from '../../utils/chatHandlers';
import { useEffect } from 'react';

const ChatBot = () => {
  const {
    isOpen,
    setIsOpen,
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isProcessing,
    isListeningForActivation,
    setIsListeningForActivation,
    messagesEndRef,
    inputRef,
    handleSend,
    handleClose,
    handleVoiceInput
  } = useChatController();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useChatSpeech(
    isOpen,
    setIsOpen,
    setMessages,
    isListeningForActivation,
    isProcessing,
    setIsListeningForActivation
  );
  // Process voice commands
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
  
    if (transcript && isOpen && !isProcessing) {
      timeoutId = setTimeout(() => {
        const response = processVoiceCommand(transcript, {
          handleMicToggle: handleVoiceInput,
          handleClose,
          handleSend: (message) => {
            setInputValue(message);
            handleSend(message);
          }
        });
        
        if (response) {
          setMessages(prev => [...prev, { text: response, isUser: false }]);
          resetTranscript();
        }
      }, 1000); // Add delay to allow for complete voice input
    }
  
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [transcript, isOpen, isProcessing, handleVoiceInput, handleClose, handleSend, setInputValue, setMessages, resetTranscript]);
  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const setInputValueAndSend = (value: string) => {
    setInputValue(value);
    handleSend(value);
  };

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
      onOpen={() => setIsOpen(true)}
      onClose={handleClose}
      onSend={() => handleSend(transcript)}
      onInputChange={setInputValue}
      onVoiceInput={handleVoiceInput}
      setInputValueAndSend={setInputValueAndSend}
    />
  );
};

export default ChatBot;