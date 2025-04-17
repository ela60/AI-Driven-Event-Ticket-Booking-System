/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownCircleIcon, 
  Loader2, 
  MessageCircle, 
  Send, 
  X, 
  Sparkles, 
  Bot, 
  User,
  Paperclip,
  Mic
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import ReactMarkdown from "react-markdown";
import React, { ComponentPropsWithoutRef, ReactNode, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
// @ts-ignore
import remarkGfm from "remark-gfm";

type MarkdownCodeProps = {
  inline?: boolean;
  children?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'code'>, 'className' | 'children'>;

type MarkdownListProps = {
  children?: ReactNode;
} & ComponentPropsWithoutRef<'ul' | 'ol'>;

export default function ChatBot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatIcon, setShowChatIcon] = useState(false);
  const [currentlyTypingText, setCurrentlyTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingSpeed] = useState(10); 
  const [typingMessageIndex, setTypingMessageIndex] = useState(-1);
  const [minimized, setMinimized] = useState(false);
  const [audioInput, setAudioInput] = useState(false);
  const [suggestionTopics] = useState([
    "How can I get started?",
    "What features do you offer?",
    "Tell me about pricing",
    "How to contact support?"
  ]);
  
  const chatIconRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowChatIcon(true);
      } else {
        setShowChatIcon(false);
        setIsChatOpen(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fixed comparison with status to match actual possible values
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

  // Improved character-by-character typing effect with variable speed but much faster overall
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
    const charsPerUpdate = 5; // Add 5 characters at once for speed
    const nextIndex = Math.min(currentlyTypingText.length + charsPerUpdate, targetContent.length);
    const nextSegment = targetContent.substring(currentlyTypingText.length, nextIndex);
    
    // Faster timing - very quick for regular text
    const timer = setTimeout(() => {
      setCurrentlyTypingText(prev => prev + nextSegment);
    }, typingSpeed);
    
    return () => clearTimeout(timer);
  }, [isTyping, typingMessageIndex, currentlyTypingText, messages, typingSpeed]);

  // Auto-scroll to bottom on new messages or typing
  useEffect(() => {
    if (scrollRef.current && !minimized) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentlyTypingText, minimized]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
    // Wait for animation to complete before scrolling
    if (minimized) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  };

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
    // Here you would typically implement actual speech recognition
    if (!audioInput) {
      // Mock speech recognition for demonstration
      setTimeout(() => {
        handleInputChange({ target: { value: "Tell me about your features" } } as React.ChangeEvent<HTMLInputElement>);
        setAudioInput(false);
      }, 2000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showChatIcon && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    ref={chatIconRef}
                    onClick={toggleChat}
                    className="rounded-full size-14 p-2 shadow-xl hover:shadow-lg focus:shadow-lg focus:outline-none transition-all"
                    size="lg"
                    variant={theme === "dark" ? "default" : "secondary"}
                  >
                    {!isChatOpen ? (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, repeatDelay: 5 }}
                      >
                        <MessageCircle className="size-6" />
                      </motion.div>
                    ) : (
                      <ArrowDownCircleIcon className="size-6" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Chat with our AI assistant</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-20 w-[95%] md:w-[450px] right-4 z-50"
            style={{ height: minimized ? "auto" : "auto", maxHeight: "70vh" }}
          >
            <Card className={cn(
              "border-2 shadow-xl", 
              minimized ? "pb-0" : "",
              theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white"
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Bot className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    AI Assistant
                  </CardTitle>
                  {isTyping && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full animate-pulse">
                      typing...
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    onClick={toggleMinimize}
                    size="sm"
                    variant="ghost"
                    className="size-8 p-0"
                  >
                    {minimized ? (
                      <Sparkles className="size-4" />
                    ) : (
                      <span className="font-bold">—</span>
                    )}
                    <span className="sr-only">{minimized ? "Expand" : "Minimize"}</span>
                  </Button>
                  <Button
                    onClick={toggleChat}
                    size="sm"
                    variant="ghost"
                    className="size-8 p-0"
                  >
                    <X className="size-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {!minimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="overflow-hidden pt-4" ref={contentRef}>
                      <ScrollArea className="h-[350px] overflow-y-auto pr-4">
                        {messages?.length === 0 && (
                          <div className="w-full mt-32 text-gray-500 items-center justify-center flex gap-3">
                            No messages yet. Start a conversation.
                          </div>
                        )}
                        
                        {messages?.map((message, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`mb-4 flex ${
                              message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            {message.role !== "user" && (
                              <div className="flex flex-shrink-0 items-start mr-2 mt-0.5">
                                <div className="rounded-full bg-primary/10 p-1">
                                  <Bot className="size-4 text-primary" />
                                </div>
                              </div>
                            )}
                            
                            <div
                              className={`inline-block max-w-[80%] rounded-lg ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : theme === "dark" ? "bg-zinc-800" : "bg-muted"
                              } p-3 px-4 shadow-sm`}
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
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              )}
                            </div>
                            
                            {message.role === "user" && (
                              <div className="flex flex-shrink-0 items-start ml-2 mt-0.5">
                                <div className="rounded-full bg-primary p-1">
                                  <User className="size-4 text-white" />
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
                            className="w-full p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg items-center justify-center flex gap-3 my-2"
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
                          <div className="w-full mt-4 mb-2">
                            <p className="text-sm text-gray-500 mb-2">Suggested topics:</p>
                            <div className="flex flex-wrap gap-2">
                              {suggestionTopics.map((topic, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSuggestionClick(topic)}
                                  className="text-sm py-1 px-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-gray-300"
                                >
                                  {topic}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div ref={scrollRef}></div>
                      </ScrollArea>
                    </CardContent>

                    <CardFooter className="border-t pt-3">
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
                              "w-full p-3 pr-16 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all",
                              audioInput ? "bg-primary/10" : "",
                              theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
                            )}
                            disabled={audioInput || isLoading}
                          />
                          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={toggleAudioInput}
                              className={cn(
                                "size-8 p-0",
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
                              className="size-8 p-0"
                              disabled={isLoading || audioInput}
                            >
                              <Paperclip className="size-4" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className={cn(
                            "rounded-full size-10",
                            isLoading ? "opacity-50" : ""
                          )}
                          disabled={isLoading || !input.trim()}
                          size="icon"
                        >
                          {isLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Send className="size-4" />
                          )}
                        </Button>
                      </form>
                    </CardFooter>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}