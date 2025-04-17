"use client"
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Bot, 
  Loader2, 
  Mic, 
  Paperclip, 
  Send, 
  User 
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type MarkdownCodeProps = {
  inline?: boolean;
  children?: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<'code'>, 'className' | 'children'>;

type MarkdownListProps = {
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<'ul' | 'ol'>;

export default function MainChatBot() {
  const [currentlyTypingText, setCurrentlyTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingSpeed] = useState(10);
  const [typingMessageIndex, setTypingMessageIndex] = useState(-1);
  const [audioInput, setAudioInput] = useState(false);
  const [suggestionTopics] = useState([
    "How can I get started?",
    "What features do you offer?",
    "Tell me about pricing",
    "How to contact support?"
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    reload,
    status,
    error
  } = useChat({
    api: "/api/gemini",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "👋 Hi there! I'm your AI assistant. How can I help you today?"
      }
    ]
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Focus input on initial load
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);

  // Handle chat status changes
  useEffect(() => {
    if (status === "submitted") {
      setIsLoading(true);
    } else if (status === "ready" && messages.length > 0) {
      setIsLoading(false);
      
      // Find the latest assistant message
      const lastAssistantMessageIndex = [...messages].reverse().findIndex(m => m.role === "assistant");
      if (lastAssistantMessageIndex !== -1) {
        const actualIndex = messages.length - 1 - lastAssistantMessageIndex;
        // Start typing animation for the latest message
        setTypingMessageIndex(actualIndex);
        setCurrentlyTypingText("");
        setIsTyping(true);
      }
    } else {
      setIsLoading(false);
    }
  }, [status, messages]);

  // Character-by-character typing effect
  useEffect(() => {
    if (!isTyping || typingMessageIndex === -1) return;
    
    const targetMessage = messages[typingMessageIndex];
    if (!targetMessage || targetMessage.role !== "assistant") {
      setIsTyping(false);
      return;
    }
    
    const targetContent = targetMessage.content;
    
    if (currentlyTypingText.length >= targetContent.length) {
      setIsTyping(false);
      return;
    }
    
    // Add multiple characters at a time for faster typing
    const charsPerUpdate = 5;
    const nextIndex = Math.min(currentlyTypingText.length + charsPerUpdate, targetContent.length);
    const nextSegment = targetContent.substring(currentlyTypingText.length, nextIndex);
    
    const timer = setTimeout(() => {
      setCurrentlyTypingText(prev => prev + nextSegment);
    }, typingSpeed);
    
    return () => clearTimeout(timer);
  }, [isTyping, typingMessageIndex, currentlyTypingText, messages, typingSpeed]);

  // Auto-scroll to bottom on new messages or typing
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentlyTypingText]);

  const handleSuggestionClick = (suggestion: string) => {
    const formEvent = new Event('submit') as unknown as React.FormEvent<HTMLFormElement>;
    
    // Set the input value
    handleInputChange({ target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>);
    
    // Submit the form after a short delay
    setTimeout(() => {
      handleSubmit(formEvent);
    }, 100);
  };

  const toggleAudioInput = () => {
    setAudioInput(!audioInput);
    // Mock speech recognition for demonstration
    if (!audioInput) {
      setTimeout(() => {
        handleInputChange({ target: { value: "Tell me about your features" } } as React.ChangeEvent<HTMLInputElement>);
        setAudioInput(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <Bot className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
            {isTyping && (
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full animate-pulse">
                typing...
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <Card className="flex-1 border-0 shadow-none flex flex-col">
            <CardContent className="flex-1 overflow-y-auto pt-6 pb-4 px-4" ref={contentRef}>
              <AnimatePresence>
                {messages?.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full h-full flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="rounded-full bg-primary/10 p-6 mb-6">
                      <Bot className="size-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to AI Chat</h2>
                    <p className="text-muted-foreground max-w-md mb-8">
                      Ask me anything or select one of the suggested topics below to get started.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                      {suggestionTopics.map((topic, idx) => (
                        <Button
                          key={`welcome-suggestion-${idx}`}
                          onClick={() => handleSuggestionClick(topic)}
                          variant="outline"
                          className="text-sm"
                        >
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                <div className="space-y-6 pb-6">
                  {messages?.map((message, index) => (
                    <motion.div
                      key={`message-${message.id || index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role !== "user" && (
                        <div className="flex flex-shrink-0 items-start mr-3 mt-1">
                          <div className="rounded-full bg-primary/10 p-1.5">
                            <Bot className="size-5 text-primary" />
                          </div>
                        </div>
                      )}
                      
                      <div
                        className={`inline-block max-w-[80%] rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : theme === "dark" ? "bg-zinc-800" : "bg-muted"
                        } p-4 shadow-sm`}
                      >
                        {message.role === "assistant" && index === typingMessageIndex ? (
                          // Show typing animation for currently typing message
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code: ({ inline, children, ...props }: MarkdownCodeProps) => {
                                if (!children) return null;
                                return inline ? (
                                  <code
                                    {...props}
                                    className="bg-gray-200 dark:bg-zinc-700 px-1 rounded"
                                  >
                                    {children}
                                  </code>
                                ) : (
                                  <pre className="bg-gray-200 dark:bg-zinc-700 p-2 rounded overflow-x-auto">
                                    <code {...props}>{children}</code>
                                  </pre>
                                );
                              },
                              ul: ({ children }: MarkdownListProps) => (
                                <ul className="list-disc ml-4">{children}</ul>
                              ),
                              ol: ({ children }: MarkdownListProps) => (
                                <ol className="list-decimal ml-4">{children}</ol>
                              ),
                            }}
                          >
                            {currentlyTypingText}
                          </ReactMarkdown>
                        ) : (
                          // Show regular message
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code: ({ inline, children, ...props }: MarkdownCodeProps) => {
                                if (!children) return null;
                                return inline ? (
                                  <code
                                    {...props}
                                    className="bg-gray-200 dark:bg-zinc-700 px-1 rounded"
                                  >
                                    {children}
                                  </code>
                                ) : (
                                  <pre className="bg-gray-200 dark:bg-zinc-700 p-2 rounded overflow-x-auto">
                                    <code {...props}>{children}</code>
                                  </pre>
                                );
                              },
                              ul: ({ children }: MarkdownListProps) => (
                                <ul className="list-disc ml-4">{children}</ul>
                              ),
                              ol: ({ children }: MarkdownListProps) => (
                                <ol className="list-decimal ml-4">{children}</ol>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        )}
                        
                        {message.role === "assistant" && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                      
                      {message.role === "user" && (
                        <div className="flex flex-shrink-0 items-start ml-3 mt-1">
                          <div className="rounded-full bg-primary p-1.5">
                            <User className="size-5 text-white" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isLoading && !isTyping && (
                    <div className="w-full my-4 text-gray-500 items-center justify-center flex gap-3">
                      <Loader2 className="animate-spin h-5 w-5 text-primary" />
                      <button
                        className="text-gray-500 text-sm underline"
                        type="button"
                        onClick={() => stop()}
                      >
                        abort...
                      </button>
                    </div>
                  )}
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg items-center justify-center flex gap-3 my-2"
                    >
                      <div>
                        Error: An error occurred while loading the messages.
                      </div>
                      <button
                        className="text-red-600 dark:text-red-300 text-sm underline"
                        type="button"
                        onClick={() => reload()}
                      >
                        Retry
                      </button>
                    </motion.div>
                  )}
  
                  {messages.length > 0 && messages.length < 3 && (
                    <div className="w-full mt-8">
                      <p className="text-sm text-gray-500 mb-2">Suggested topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestionTopics.map((topic, idx) => (
                          <button
                            key={`suggestion-${idx}`}
                            onClick={() => handleSuggestionClick(topic)}
                            className="text-sm py-1.5 px-4 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-gray-300"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div ref={scrollRef}></div>
              </AnimatePresence>
            </CardContent>

            <CardFooter className="border-t py-4">
              <div className="max-w-4xl w-full mx-auto">
                <form
                  onSubmit={handleSubmit}
                  className="flex w-full items-center space-x-2"
                >
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      type="text"
                      placeholder={audioInput ? "Listening..." : "Type your message..."}
                      className={cn(
                        "w-full p-4 pr-20 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all",
                        audioInput ? "bg-primary/10" : "",
                        theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
                      )}
                      disabled={audioInput || isLoading}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={toggleAudioInput}
                        className={cn(
                          "size-9 p-0",
                          audioInput ? "text-primary" : ""
                        )}
                        disabled={isLoading}
                      >
                        <Mic className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="size-9 p-0"
                        disabled={isLoading || audioInput}
                      >
                        <Paperclip className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className={cn(
                      "rounded-full size-12",
                      isLoading ? "opacity-50" : ""
                    )}
                    disabled={isLoading || !input.trim()}
                    size="icon"
                  >
                    {isLoading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Send className="size-5" />
                    )}
                  </Button>
                </form>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}