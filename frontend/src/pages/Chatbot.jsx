import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

function Chatbot({ user }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [language, setLanguage] = useState('en')
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    loadLanguages()
    // Add initial greeting
    addBotMessage(getGreeting(language))
    
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom()
  }, [messages])

  const loadLanguages = async () => {
    try {
      const response = await api.getChatbotLanguages()
      setLanguages(response.data.languages)
    } catch (error) {
      console.error('Error loading languages:', error)
      // Fallback languages
      setLanguages([
        { code: 'en', name: 'English', native: 'English' },
        { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
        { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' }
      ])
    }
  }

  const getGreeting = (lang) => {
    const greetings = {
      en: "Hello! I'm here to help you with hedging and oilseed price information. How can I assist you today?",
      hi: "नमस्ते! मैं हेजिंग और तिलहन मूल्य जानकारी में आपकी मदद के लिए यहाँ हूँ। आज मैं आपकी कैसे सहायता कर सकता हूँ?",
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਹੈਜਿੰਗ ਅਤੇ ਤਿਲਹਣ ਕੀਮਤ ਜਾਣਕਾਰੀ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਸਹਾਇਤਾ ਕਰ ਸਕਦਾ ਹਾਂ?",
      ta: "வணக்கம்! நான் ஹெட்ஜிங் மற்றும் எண்ணெய் விதை விலை தகவல்களில் உங்களுக்கு உதவ இங்கே இருக்கிறேன். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
      bn: "নমস্কার! আমি হেজিং এবং তৈলবীজের মূল্য তথ্যে আপনাকে সাহায্য করতে এখানে আছি। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
      gu: "નમસ્તે! હું હેજિંગ અને તેલીબિયાંના ભાવ માહિતીમાં તમને મદદ કરવા અહીં છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?"
    }
    return greetings[lang] || greetings['en']
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: text,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const handleLanguageChange = (e) => {
    const newLang = e.target.value
    setLanguage(newLang)
    // Clear messages and add new greeting
    setMessages([])
    addBotMessage(getGreeting(newLang))
    
    // Update speech recognition language
    if (recognitionRef.current) {
      const langMap = {
        en: 'en-US',
        hi: 'hi-IN',
        pa: 'pa-IN',
        ta: 'ta-IN',
        bn: 'bn-IN',
        gu: 'gu-IN'
      }
      recognitionRef.current.lang = langMap[newLang] || 'en-US'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim()) return

    const userMsg = inputMessage.trim()
    setInputMessage('')
    addUserMessage(userMsg)
    setLoading(true)

    try {
      const response = await api.sendChatMessage({
        message: userMsg,
        language: language,
        userId: user?.id
      })

      addBotMessage(response.data.message)
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessages = {
        en: "Sorry, I'm having trouble connecting. Please try again.",
        hi: "क्षमा करें, मुझे कनेक्ट करने में समस्या हो रही है। कृपया पुनः प्रयास करें।",
        pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਕਨੈਕਟ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਹੋ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
        ta: "மன்னிக்கவும், இணைப்பதில் சிரமம் உள்ளது. தயவு செய்து மீண்டும் முயற்சிக்கவும்.",
        bn: "দুঃখিত, আমার কনেক্ট করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        gu: "માફી, મને કનેક્ટ કરવામાં સમસ્યા આવી રહી છે. કૃપયા કરીને ફરીથી પ્રયાસ કરો."
      }
      addBotMessage(errorMessages[language] || errorMessages['en'])
    } finally {
      setLoading(false)
    }
  }

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }
    
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      const langMap = {
        en: 'en-US',
        hi: 'hi-IN',
        pa: 'pa-IN',
        ta: 'ta-IN',
        bn: 'bn-IN',
        gu: 'gu-IN'
      }
      recognitionRef.current.lang = langMap[language] || 'en-US'
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const quickQuestions = {
    en: [
      "What is hedging?",
      "Show current prices",
      "How to trade?",
      "Set price alert"
    ],
    hi: [
      "हेजिंग क्या है?",
      "वर्तमान कीमतें दिखाएं",
      "ट्रेड कैसे करें?",
      "मूल्य अलर्ट सेट करें"
    ],
    pa: [
      "ਹੈਜਿੰਗ ਕੀ ਹੈ?",
      "ਮੌਜੂਦਾ ਕੀਮਤਾਂ ਦਿਖਾਓ",
      "ਵਪਾਰ ਕਿਵੇਂ ਕਰੀਏ?",
      "ਕੀਮਤ ਅਲਰਟ ਸੈਟ ਕਰੋ"
    ],
    ta: [
      "ஹெட்ஜிங் என்றால் என்ன?",
      "தற்போதைய விலைகளை காட்டு",
      "எப்படி வர்த்தகம் செய்வது?",
      "விலை எச்சரிக்கை"
    ],
    bn: [
      "হেজিং কি?",
      "বর্তমান মূল্য দেখান",
      "কিভাবে ট্রেড করবেন?",
      "মূল্য সতর্কতা"
    ],
    gu: [
      "હેજિંગ શું છે?",
      "વર્તમાન ભાવ દર્શાવો",
      "કેવી રીતે વેપાર કરવો?",
      "ભાવ ચેતવણી"
    ]
  }

  const handleQuickQuestion = (question) => {
    setInputMessage(question)
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>AI Assistant</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Language:</label>
          <select 
            value={language} 
            onChange={handleLanguageChange}
            style={{
              padding: '8px 12px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.native}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chatbot-container">
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div className="message-content">
                <div className="message-text">{msg.text}</div>
                <div className="message-time">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-message bot">
              <div className="message-content">
                <div className="message-text">
                  <span className="typing-indicator">●●●</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-questions">
          <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: '#666' }}>
            Quick questions:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(quickQuestions[language] || quickQuestions['en']).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q)}
                className="quick-question-btn"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="chat-input-form">
          <button
            type="button"
            onClick={toggleVoiceInput}
            className="voice-btn"
            disabled={loading}
            title={isListening ? 'Stop recording' : 'Start voice input'}
          >
            {isListening ? '🔴' : '🎤'}
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              language === 'hi' ? 'अपना संदेश टाइप करें...' :
              language === 'pa' ? 'ਆਪਣਾ ਸੁਨੇਹਾ ਟਾਈਪ ਕਰੋ...' :
              language === 'ta' ? 'உங்கள் செய்தியை டைப் செய்யவும்...' :
              language === 'bn' ? 'আপনার বার্তা টাইপ করুন...' :
              language === 'gu' ? 'તમારો સંદેશ ટાઇપ કરો...' :
              'Type your message...'
            }
            className="chat-input"
            disabled={loading}
          />
          <button type="submit" className="chat-send-btn" disabled={loading || !inputMessage.trim()}>
            {language === 'hi' ? 'भेजें' : language === 'pa' ? 'ਭੇਜੋ' : language === 'ta' ? 'அனுப்பு' : language === 'bn' ? 'পাঠান' : language === 'gu' ? 'પાઠવો' : 'Send'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .chatbot-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          height: 600px;
          overflow: hidden;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-message {
          display: flex;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chat-message.user {
          justify-content: flex-end;
        }

        .chat-message.bot {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 18px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .chat-message.user .message-content {
          background: #2563eb;
          color: white;
        }

        .chat-message.bot .message-content {
          background: #f3f4f6;
          color: #1f2937;
        }

        .message-text {
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .message-time {
          font-size: 11px;
          margin-top: 4px;
          opacity: 0.7;
        }

        .typing-indicator {
          animation: blink 1.4s infinite;
          font-size: 20px;
          letter-spacing: 2px;
        }

        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .quick-questions {
          padding: 12px 20px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .quick-question-btn {
          padding: 6px 12px;
          border-radius: 15px;
          border: 1px solid #d1d5db;
          background: white;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-question-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .chat-input-form {
          display: flex;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          gap: 10px;
          background: white;
          align-items: center;
        }

        .voice-btn {
          padding: 10px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .voice-btn:hover:not(:disabled) {
          background: #059669;
          transform: scale(1.05);
        }

        .voice-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .chat-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 25px;
          font-size: 14px;
          outline: none;
        }

        .chat-input:focus {
          border-color: #2563eb;
        }

        .chat-send-btn {
          padding: 12px 24px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .chat-send-btn:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .chat-send-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

export default Chatbot
