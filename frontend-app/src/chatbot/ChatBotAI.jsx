import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiBookOpen, FiArrowLeft } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function ChatBotAI() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const askQuestion = async () => {
    if (!question.trim()) {
      toast.warning('Please enter a question');
      return;
    }

    const newMessages = [...messages, { sender: 'user', text: question }];
    setMessages(newMessages);
    setQuestion('');
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:8000/ask', { question });

      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: res.data.answer,
          sources: res.data.sources || [],
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { sender: 'bot', text: 'Sorry, I encountered an error processing your request. Please try again.' },
      ]);
      toast.error('Failed to get response from AI');
    } finally {
      setIsTyping(false);
    }
  };

  const formatSourceName = (source) => {
    if (!source.metadata) return 'Medical Reference';
    
    const cleanSource = source.metadata.source
      .replace(/^.*[\\\/]/, '') // Remove path
      .replace(/_/g, ' ')
      .replace('.pdf', '')
      .replace('.txt', '');
    
    return cleanSource.length > 30 
      ? `${cleanSource.substring(0, 30)}...` 
      : cleanSource;
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className=" ">
      <div className="max-w-6xl mx-auto">
        {/* Header Section with Back Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-">
          <div className="flex items-center">
            <button 
              onClick={handleGoBack}
              className="mr-4 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors md:hidden"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="text-indigo-600">Medical</span> AI Assistant
              </h1>
              <p className="mt-1 text-gray-600 text-sm">
                Evidence-based clinical decision support powered by AI
              </p>
            </div>
          </div>
          <button 
            onClick={handleGoBack}
            className="hidden md:flex items-center px-4 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[60vh] overflow-y-auto p-6 space-y-6  ">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <FiBookOpen className="h-12 w-12 mb-4 text-indigo-200" />
                <p className="text-lg font-medium">Ask me anything about clinical hematology</p>
                <p className="mt-1 text-sm">I can provide evidence-based answers from medical literature</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-4 ${msg.sender === 'user' ? 'bg-indigo-50 text-indigo-900' : 'bg-gray-50 text-gray-800'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                        {msg.sender === 'user' ? '👤' : '🤖'}
                      </div>
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        
                        {/* Enhanced Sources Section with Hover Effect */}
                        {msg.sender === 'bot' && msg.sources && msg.sources.length > 0 && (
                          <div className="mt-4 border-t pt-3 border-gray-100">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">References</h4>
                            <div className="space-y-2">
                              {msg.sources.map((src, i) => (
                                <div 
                                  key={i} 
                                  className="group relative bg-white p-3 rounded-md border border-gray-100 shadow-xs hover:shadow-md transition-all"
                                >
                                  <div className="flex items-start">
                                    <div className="bg-indigo-50 p-1 rounded mr-3">
                                      <FiBookOpen className="h-4 w-4 text-indigo-500" />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-sm font-medium text-gray-700">
                                        {formatSourceName(src)}
                                        {src.metadata?.page && (
                                          <span className="ml-2 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                            pg. {src.metadata.page}
                                          </span>
                                        )}
                                      </h5>
                                      <div className="relative overflow-hidden">
                                        <p className="mt-1 text-xs text-gray-500 line-clamp-2 group-hover:line-clamp-none transition-all duration-200">
                                          {src.content}
                                        </p>
                                        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-200"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                      🤖
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
                placeholder="Ask a clinical question..."
                className="flex-1 p-3 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={askQuestion}
                disabled={isTyping}
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm disabled:opacity-50"
              >
                <FiSend className="mr-2" />
                Send
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Ask about hematology parameters, clinical interpretations, or treatment guidelines
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default ChatBotAI;