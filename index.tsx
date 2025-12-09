import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Menu, X, Check, Sun, Moon, Send, Sparkles } from 'lucide-react';
import Lenis from 'lenis';
import SplitType from 'split-type';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

// --- Hooks ---

const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    window.lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.lenis = undefined;
    };
  }, []);
};

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};

// --- Atomic Components ---

interface CTAButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: 'primary' | 'outline';
  onClick?: () => void;
}

const CTAButton: React.FC<CTAButtonProps> = ({ 
  children, 
  href = "#contact", 
  className = "",
  variant = 'primary',
  onClick
}) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  
  const baseClasses = "inline-flex items-center justify-center rounded-full font-semibold text-base tracking-wide transition-all duration-300 transform font-sans hover:-translate-y-0.5";
  const variants = {
    primary: "bg-coral hover:bg-coral-hover text-[#FCFCF4] shadow-[0_4px_16px_rgba(255,133,82,0.2)] hover:scale-105",
    outline: "border border-charcoal/20 hover:bg-charcoal/5 text-charcoal dark:border-white/20 dark:text-cream dark:hover:bg-white/10"
  };

  return (
    <a
      ref={buttonRef}
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} px-8 py-4 ${className}`}
    >
      {children}
    </a>
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => {
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!labelRef.current) return;

    gsap.from(labelRef.current, {
      y: 16,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: labelRef.current,
        start: 'top 90%'
      }
    });
  }, { scope: labelRef });

  return (
    <span ref={labelRef} className={`inline-block text-xs font-semibold tracking-[0.1em] uppercase text-charcoal dark:text-cream/80 mb-4 opacity-100 font-sans ${className}`}>
      ( {children} )
    </span>
  );
};

const StatMarker: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const statRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={statRef} className="flex items-center gap-2">
      <span className="text-coral text-sm">*</span>
      <span className="text-xs font-semibold tracking-[0.05em] uppercase text-charcoal dark:text-cream font-sans">
        <span className="font-bold">{value}</span> {label}
      </span>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  variant?: 'light' | 'dark';
  icon?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, variant = 'light', icon }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isDark = variant === 'dark';

  useGSAP(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, { scope: cardRef });
  
  return (
    <div 
      ref={cardRef}
      className={`feature-card p-8 md:p-10 rounded-xl transition-all duration-300 ease-out flex flex-col justify-between hover:-translate-y-2 hover:scale-[1.02] ${
        isDark 
          ? 'bg-charcoal text-white shadow-xl dark:bg-white/10 dark:text-white hover:shadow-2xl dark:hover:bg-white/15 group' 
          : 'bg-white text-charcoal shadow-[0_2px_8px_rgba(35,36,40,0.06)] hover:shadow-[0_12px_32px_rgba(35,36,40,0.12)] dark:bg-white/5 dark:text-cream dark:shadow-none dark:hover:bg-white/10'
      }`}
    >
      <div>
        {icon && <div className="text-coral mb-6">{icon}</div>}
        <h4 className={`text-lg md:text-xl font-display font-semibold mb-4 leading-tight ${isDark ? 'text-white' : 'text-charcoal dark:text-cream'}`}>
          {title}
        </h4>
        <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-white/70 group-hover:text-white/90' : 'text-charcoal-muted dark:text-white/60'} transition-colors duration-300`}>
          {description}
        </p>
      </div>
    </div>
  );
};

// --- Liquid Assistant with Scroll Animation ---

// Linear interpolation helper
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

// Smooth step easing function
const smoothStep = (t: number) => t * t * (3 - 2 * t);

interface OrbStyle {
  top: number;
  left: number;
  width: number;
  height: number;
}

const LiquidAssistant: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [orbStyle, setOrbStyle] = useState<OrbStyle | null>(null);
  const [isDockedMode, setIsDockedMode] = useState(false);
  const [hasStartedScrolling, setHasStartedScrolling] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Track visibility for fade-in
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat popup state
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    const updatePosition = () => {
      // Get the phantom anchor positions for different breakpoints
      const desktopAnchor = document.getElementById('orb-hero-target-desktop');
      const tabletAnchor = document.getElementById('orb-hero-target-tablet');
      const mobileAnchor = document.getElementById('orb-hero-target-mobile');
      
      // Determine which anchor to use based on viewport
      let heroTarget: HTMLElement | null = null;
      const vw = window.innerWidth;
      
      if (vw >= 1024 && desktopAnchor) {
        heroTarget = desktopAnchor;
      } else if (vw >= 768 && tabletAnchor) {
        heroTarget = tabletAnchor;
      } else if (mobileAnchor) {
        heroTarget = mobileAnchor;
      }
      
      if (!heroTarget) return;
      
      const rect = heroTarget.getBoundingClientRect();
      
      // Start position (from phantom anchor)
      const start = {
        top: rect.top + window.scrollY,
        left: rect.left,
        width: rect.width,
        height: rect.height
      };
      
      // End position (bottom-right dock)
      const widgetSize = 80;
      const padding = 32;
      // On mobile/tablet, account for bottom navbar (navbar is ~80px from bottom)
      // Add extra padding on smaller screens to position orb above the navbar
      const bottomOffset = vw < 1024 ? 100 : padding; // 100px on mobile/tablet to clear navbar
      const end = {
        top: window.innerHeight - widgetSize - bottomOffset + window.scrollY,
        left: window.innerWidth - widgetSize - padding,
        width: widgetSize,
        height: widgetSize
      };
      
      // Calculate progress based on scroll
      // Transition completes when scrolled 60% of viewport height
      const transitionDistance = window.innerHeight * 0.6;
      const rawProgress = Math.min(Math.max(window.scrollY / transitionDistance, 0), 1);
      
      // Apply smooth step easing
      const t = smoothStep(rawProgress);
      
      // Update docked mode state for label visibility
      setIsDockedMode(t > 0.8);
      
      // The orb should be above sections but below navbar when not fully docked
      // Once docked (t > 0.8), bring it fully to front above navbar
      setHasStartedScrolling(t > 0.8);
      
      // Apply LERP for each property
      setOrbStyle({
        top: lerp(start.top - window.scrollY, end.top - window.scrollY, t),
        left: lerp(start.left, end.left, t),
        width: lerp(start.width, end.width, t),
        height: lerp(start.height, end.height, t)
      });
    };
    
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updatePosition);
    };
    
    // Delay initial position calculation to ensure DOM and GSAP animations are complete
    // The phantom anchor's parent has GSAP animations that need to finish first
    // Use requestAnimationFrame to ensure layout is complete
    const initTimeout = setTimeout(() => {
      // Double RAF to ensure all layout calculations are done
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updatePosition();
          setIsVisible(true);
        });
      });
    }, 500); // Wait for GSAP intro animations to complete
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updatePosition);
    
    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updatePosition);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Don't render until we have calculated position
  if (!orbStyle) return null;

  // z-index logic:
  // - During transition: z-[15] - behind hero title (z-30) but above other hero content (z-[5])
  // - Once fully docked: z-[70] - above all sections AND navbar (z-[60])
  const zIndexClass = hasStartedScrolling ? 'z-[70]' : 'z-[15]';

  const handleOrbClick = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <>
      <div 
        className={`fixed cursor-pointer ${zIndexClass} transition-opacity duration-500`}
        style={{
          top: orbStyle.top,
          left: orbStyle.left,
          width: orbStyle.width,
          height: orbStyle.height,
          opacity: isVisible ? 1 : 0
        }}
        onClick={handleOrbClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {/* The Wobbling Liquid Orb */}
        <div 
          className="absolute inset-0 animate-liquid-orb backdrop-blur-sm"
          style={{
            background: 'linear-gradient(to bottom right, rgba(255, 127, 80, 0.75), rgba(255, 245, 238, 0.6))',
          }}
        />
        
        {/* Hover Label */}
        <div 
          className={`absolute pointer-events-none transition-all duration-300 ease-out z-20 ${isHovered && !isChatOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          style={{
            left: isDockedMode ? '50%' : cursorPos.x,
            top: isDockedMode ? '-10px' : cursorPos.y,
            transform: isDockedMode ? 'translate(-50%, -100%)' : 'translate(-50%, -150%)' 
          }}
        >
          <div className="bg-cream/90 dark:bg-charcoal/90 backdrop-blur-md border border-charcoal/10 dark:border-white/10 px-4 py-2 rounded-full text-xs font-semibold tracking-widest text-charcoal dark:text-cream uppercase whitespace-nowrap shadow-lg">
            {isChatOpen ? 'Close Chat' : 'Chat with Penelope'}
          </div>
        </div>
      </div>
      
      {/* Chat Popup */}
      <ChatPopup 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        isDockedMode={isDockedMode}
        orbPosition={orbStyle}
      />
    </>
  );
};

// Phantom Anchor Component (invisible positioning reference)
const OrbPhantomAnchor: React.FC<{ id: string; className?: string }> = ({ id, className = "" }) => (
  <div id={id} className={`pointer-events-none ${className}`} aria-hidden="true" />
);

// --- Chat Popup Component ---
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isDockedMode: boolean;
  orbPosition: { top: number; left: number; width: number; height: number } | null;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ isOpen, onClose, isDockedMode, orbPosition }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Penelope, your AI assistant. I can help you learn more about ThinkSwift's services, answer questions about AI automation, or help you get started. What would you like to know?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Animate in/out with GSAP
  useGSAP(() => {
    if (!popupRef.current) return;
    
    if (isOpen) {
      // Animate from the direction of the orb
      // In hero mode: orb is to the right, so animate from right
      // In docked mode: orb is bottom-right, so animate from bottom-right
      const transformOrigin = isDockedMode ? 'bottom right' : 'center right';
      
      gsap.fromTo(popupRef.current, 
        { 
          opacity: 0, 
          scale: 0.85, 
          x: isDockedMode ? 20 : 40,
          transformOrigin
        },
        { 
          opacity: 1, 
          scale: 1, 
          x: 0,
          duration: 0.4, 
          ease: 'back.out(1.4)' 
        }
      );
    }
  }, [isOpen, isDockedMode]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Call n8n webhook agent
      const response = await fetch('https://thinkswift.app.n8n.cloud/webhook/d39a8094-c99c-4453-99c5-90edbf796e49', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: messageText,
          sessionId: sessionStorage.getItem('chatSessionId') || (() => {
            const id = `session_${Date.now()}`;
            sessionStorage.setItem('chatSessionId', id);
            return id;
          })()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.output || data.response || data.message || data.text || "I received your message but couldn't process it properly. Please try again.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  // Calculate position based on orb state
  // When in hero (not docked): position to the left of the orb
  // When docked: position above and to the left of the docked orb
  const getPositionStyles = (): React.CSSProperties => {
    if (!orbPosition) {
      // Fallback position
      return {
        bottom: '6rem',
        right: '1rem',
      };
    }

    if (isDockedMode) {
      // Docked mode: position above the orb in bottom-right
      return {
        bottom: '6rem', // Above navbar on mobile
        right: '7rem', // To the left of docked orb
      };
    } else {
      // Hero mode: position to the left of the large orb
      const chatWidth = 400;
      const chatHeight = 500;
      const gap = 24; // Gap between orb and chat
      
      // Position chat to the left of the orb, vertically centered with orb
      const leftPos = Math.max(16, orbPosition.left - chatWidth - gap);
      const topPos = Math.max(100, orbPosition.top + (orbPosition.height / 2) - (chatHeight / 2));
      
      return {
        top: `${topPos}px`,
        left: `${leftPos}px`,
        bottom: 'auto',
        right: 'auto',
      };
    }
  };

  const positionStyles = getPositionStyles();

  return (
    <div 
      ref={popupRef}
      className="fixed w-[calc(100vw-2rem)] max-w-[400px] h-[500px] max-h-[70vh] bg-cream/70 dark:bg-charcoal/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-white/10 flex flex-col overflow-hidden z-[80]"
      style={positionStyles}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-coral/60 flex items-center justify-center shadow-lg">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-charcoal dark:text-cream text-base">Penelope</h3>
            <p className="text-xs text-charcoal-muted dark:text-white/60">AI Assistant</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors text-charcoal dark:text-cream backdrop-blur-sm"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white/10 dark:bg-transparent">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed backdrop-blur-sm ${
                message.sender === 'user' 
                  ? 'bg-coral/90 text-white rounded-br-md shadow-md' 
                  : 'bg-white/50 dark:bg-white/10 text-charcoal dark:text-cream rounded-bl-md shadow-sm'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/50 dark:bg-white/10 px-4 py-3 rounded-2xl rounded-bl-md backdrop-blur-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-charcoal/40 dark:bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-charcoal/40 dark:bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-charcoal/40 dark:bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-white/50 dark:bg-white/10 rounded-full text-sm text-charcoal dark:text-cream placeholder:text-charcoal/40 dark:placeholder:text-white/40 outline-none focus:ring-2 focus:ring-coral/30 transition-all backdrop-blur-sm"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="p-3 rounded-full bg-coral hover:bg-coral-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-charcoal/40 dark:text-white/30 text-center mt-2">
          Powered by ThinkSwift AI
        </p>
      </div>
    </div>
  );
};

// --- Theme Toggle Component ---
const ThemeToggle: React.FC<{ theme: string; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className="fixed top-6 right-6 z-50 p-3 rounded-full bg-cream/80 dark:bg-charcoal/80 backdrop-blur-md hover:scale-110 transition-all duration-300 text-charcoal dark:text-cream group shadow-none border-none"
    aria-label="Toggle Dark Mode"
  >
    {theme === 'dark' ? <Sun size={20} className="group-hover:text-coral transition-colors" /> : <Moon size={20} className="group-hover:text-coral transition-colors" />}
  </button>
);

// --- Section Components ---

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const desktopAssistantRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const split = headlineRef.current ? new SplitType(headlineRef.current, { types: 'chars' }) : null;

    if (split) {
      gsap.from(split.chars, {
        y: 80,
        opacity: 0,
        duration: 1.1,
        stagger: 0.02,
        ease: 'power4.out'
      });
    }

    gsap.from(desktopAssistantRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 1.2,
      ease: 'elastic.out(1, 0.75)',
      delay: 0.2
    });

    if (subtextRef.current) {
      gsap.from(subtextRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.6
      });
    }

    if (statsRef.current) {
      gsap.from(statsRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.8
      });
    }

    if (ctaRef.current) {
      gsap.from(ctaRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1
      });
    }

    return () => {
      split?.revert();
    };
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[90vh] flex flex-col px-6 pt-32 pb-20 justify-center md:justify-start md:pt-32 lg:justify-center lg:pt-40 dark:bg-charcoal transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full relative">
        
        {/* Desktop Phantom Anchor: Absolute Right (same position as before) */}
        <div ref={desktopAssistantRef} className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-0">
          <OrbPhantomAnchor id="orb-hero-target-desktop" className="w-[400px] h-[400px]" />
        </div>
        
        {/* Header Group - high z-index to stay above orb */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left max-w-5xl relative z-[25]">
            <div className="mb-8 w-full">
              <SectionLabel>THE OFFER</SectionLabel>
            </div>
            
            <h1 
              ref={headlineRef} 
              className="text-display-hero font-display font-medium text-charcoal dark:text-cream mb-4 md:mb-12 leading-[0.9] tracking-tighter lowercase transition-colors duration-300"
            >
              your business<br />deserves better
            </h1>
        </div>

        {/* Mobile Phantom Anchor: Centered Stack */}
        <div className="md:hidden relative w-[280px] h-[280px] my-8 mx-auto z-0">
          <OrbPhantomAnchor id="orb-hero-target-mobile" className="w-full h-full" />
        </div>

        {/* Tablet/Desktop Content Container */}
        <div className="flex flex-col md:flex-row lg:items-end justify-between gap-8 md:gap-4 lg:gap-12 mt-8 md:mt-0 lg:mt-24 relative z-[5]">
          
          {/* Left Column (Tablet): Subtext + Stats + CTA */}
          <div className="w-full md:w-1/2 lg:w-auto lg:max-w-xl flex flex-col items-center md:items-start text-center md:text-left">
            <p ref={subtextRef} className="text-xl md:text-2xl font-light text-charcoal-muted dark:text-white/60 leading-relaxed transition-colors duration-300 mb-12 md:mb-16">
              Custom Website + AI Sales Agent. 
              <br className="hidden md:block" />
              Built to last. Priced for growth.
            </p>

            {/* Stats & CTA Group */}
            <div className="flex flex-col gap-8 w-full">
              <div ref={statsRef} className="flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center md:justify-start">
                <StatMarker value="$500" label="ONE-TIME" />
                <StatMarker value="NO" label="MONTHLY FEES" />
                <StatMarker value="2-3" label="WEEKS DELIVERY" />
              </div>
              <div ref={ctaRef}>
                <CTAButton href="#contact">Book Discovery Call</CTAButton>
              </div>
            </div>
          </div>
          
          {/* Tablet Phantom Anchor: Right Column */}
          <div className="hidden md:flex lg:hidden w-1/2 justify-center items-center">
            <OrbPhantomAnchor id="orb-hero-target-tablet" className="w-[350px] h-[350px]" />
          </div>

        </div>
      </div>
    </section>
  );
};

const Problem: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLDivElement>(null);
  const p2Ref = useRef<HTMLDivElement>(null);
  const p3Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=130%',
        scrub: 1,
        pin: true
      }
    });

    gsap.set([p2Ref.current, p3Ref.current], { autoAlpha: 0, y: 30 });

    tl
      .to(p1Ref.current, { autoAlpha: 0, y: -30, duration: 1 })
      .to(p2Ref.current, { autoAlpha: 1, y: 0, duration: 1 }, '<0.2')
      .to({}, { duration: 0.4 })
      .to(p2Ref.current, { autoAlpha: 0, y: -30, duration: 1 })
      .to(p3Ref.current, { autoAlpha: 1, y: 0, duration: 1 }, '<0.2');
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative h-screen bg-cream-dark dark:bg-charcoal transition-colors duration-300">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-6">
        <div className="max-w-4xl mx-auto text-center relative w-full h-full flex items-center justify-center">
          <div ref={p1Ref} className="absolute inset-0 flex items-center justify-center px-6">
            <h2 className="text-display-md font-display font-medium text-charcoal dark:text-cream text-center">
              You didn't start your business to answer the same questions all day.
            </h2>
          </div>
          <div ref={p2Ref} className="absolute inset-0 flex items-center justify-center px-6">
            <h2 className="text-display-md font-display font-medium text-charcoal dark:text-cream text-center">
              You started it to do work you love.
            </h2>
          </div>
          <div ref={p3Ref} className="absolute inset-0 flex items-center justify-center px-6">
            <h2 className="text-display-md font-display font-medium text-charcoal dark:text-cream text-center">
              Your website should handle the rest.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

const Solution: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%'
        }
      });
    }

    if (gridRef.current) {
      const columns = gridRef.current.querySelectorAll('[data-column]');
      gsap.from(columns, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%'
        }
      });
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="system" className="py-32 px-6 bg-cream dark:bg-charcoal transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="mb-20">
          <SectionLabel>THE SOLUTION</SectionLabel>
          <h2 className="text-display-lg font-display font-medium text-charcoal dark:text-cream mt-4 transition-colors duration-300">
            The ThinkSwift Standard
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Column 1: Website */}
          <div data-column="foundation" className="space-y-8">
            <h3 className="text-2xl font-semibold text-charcoal dark:text-cream mb-8 border-b border-charcoal/10 dark:border-white/10 pb-4 font-sans transition-colors duration-300">
              01. The Foundation
            </h3>
            
            <FeatureCard 
              title="Custom Editorial Design" 
              description="No cookie-cutter templates. We build a unique digital identity that elevates your brand authority." 
            />
            <FeatureCard 
              title="Mobile-First Architecture" 
              description="Flawless performance on every device. Fast loading speeds that Google loves." 
            />
            <FeatureCard 
              title="Zero Maintenance Bloat" 
              description="We build on robust stacks that don't break. Say goodbye to constant plugin updates." 
            />
          </div>

          {/* Column 2: AI */}
          <div data-column="intelligence" className="space-y-8 mt-12 lg:mt-0">
             <h3 className="text-2xl font-semibold text-charcoal dark:text-cream mb-8 border-b border-charcoal/10 dark:border-white/10 pb-4 font-sans transition-colors duration-300">
              02. The Intelligence
            </h3>

            <FeatureCard 
              title="24/7 Sales Agent" 
              description="Never miss a lead. Your AI agent engages visitors, answers FAQs, and books appointments while you sleep."
              variant="dark"
            />
            <FeatureCard 
              title="Instant Knowledge" 
              description="Trained on your business data. It speaks your language and follows your rules perfectly."
              variant="dark"
            />
             <FeatureCard 
              title="Personal AI Training" 
              description="Don't just get the tool, master it. We include a 1-on-1 session to teach you exactly how to manage, monitor, and leverage AI in your business."
              variant="dark"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Audience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = [
    "Retail boutiques ready to sell 24/7",
    "Service providers tired of phone tag",
    "Hospitality venues wanting automation",
    "Healthcare practices streamlining intake"
  ];

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from(containerRef.current.children, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%'
      }
    });
  }, { scope: containerRef });

  return (
    <section className="py-20 bg-cream-dark dark:bg-[#1A1B1E] border-y border-charcoal/5 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="mt-1 text-coral bg-coral/10 p-1 rounded-full">
                <Check size={16} />
              </div>
              <span className="text-lg text-charcoal dark:text-cream font-semibold leading-tight font-sans transition-colors duration-300">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (priceRef.current) {
      const counter = { value: 0 };
      priceRef.current.innerText = '$0';

      gsap.to(counter, {
        value: 500,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: priceRef.current,
          start: 'top 80%'
        },
        onUpdate: () => {
          if (priceRef.current) {
            priceRef.current.innerText = `$${Math.round(counter.value)}`;
          }
        }
      });
    }

    if (featuresRef.current) {
      const items = featuresRef.current.querySelectorAll('li');
      gsap.from(featuresRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 85%'
        }
      });

      gsap.from(items, {
        opacity: 0,
        x: -16,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%'
        }
      });
    }
  }, { scope: sectionRef });

  return (
    <section id="pricing" ref={sectionRef} className="py-32 px-6 bg-cream dark:bg-charcoal transition-colors duration-300">
      <div className="max-w-4xl mx-auto text-center">
        <SectionLabel>THE INVESTMENT</SectionLabel>
        
        <div className="mt-12 mb-8">
          <div ref={priceRef} className="text-[6rem] md:text-[10rem] font-display font-normal text-charcoal dark:text-cream leading-none tracking-tight transition-colors duration-300">
            $500
          </div>
          <p className="text-xl md:text-2xl text-charcoal-muted dark:text-white/60 font-light mt-4 transition-colors duration-300">
            One-time build fee. Zero recurring bloat.
          </p>
        </div>

        <div ref={featuresRef} className="max-w-xl mx-auto text-left bg-white dark:bg-white/5 p-8 md:p-12 rounded-2xl shadow-sm dark:shadow-none border border-charcoal/5 dark:border-white/5 transition-all duration-300">
          <h3 className="text-lg font-semibold text-charcoal dark:text-cream mb-6 uppercase tracking-widest text-center font-sans">What's Included</h3>
          <ul className="space-y-4">
            {[
              "Custom Design & Development",
              "AI Chatbot Configuration",
              "1-Hour Personal AI Training",
              "Mobile Responsive Layout",
              "SEO Foundation Setup",
              "Contact Form Integration",
              "1 Month Post-Launch Support"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-coral">✓</span>
                <span className="text-charcoal-muted dark:text-white/70 text-lg">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <CTAButton href="#contact" className="w-full">Get Started Today</CTAButton>
            <p className="text-xs text-charcoal-light dark:text-white/40 mt-4 uppercase tracking-wider font-sans font-semibold">Limited availability per month</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Process: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const steps = [
    { title: "Discovery", desc: "We map your goals and brand voice." },
    { title: "Deposit", desc: "Secure your slot with $250." },
    { title: "Build", desc: "We design and develop your system." },
    { title: "Review", desc: "You refine the look and feel." },
    { title: "Launch", desc: "We go live to the world." },
    { title: "Training", desc: "Handover of your new assets." }
  ];

  useGSAP(() => {
    if (lineRef.current) {
      gsap.from(lineRef.current, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%'
        }
      });
    }

    if (stepsRef.current) {
      const nodes = stepsRef.current.querySelectorAll('.process-step');
      gsap.from(nodes, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top 80%'
        }
      });
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="process" className="py-32 px-6 bg-cream-dark dark:bg-[#1A1B1E] transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16 text-center">
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <h2 className="text-display-md font-display font-medium text-charcoal dark:text-cream mt-4 transition-colors duration-300">Simple. Transparent. Fast.</h2>
        </div>

        <div ref={stepsRef} className="relative pl-8 md:pl-0">
          {/* Vertical Line */}
          <div ref={lineRef} className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-px bg-charcoal/10 dark:bg-white/10 origin-top" />

          {steps.map((step, i) => (
            <div key={i} className={`process-step relative flex items-center mb-16 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              
              {/* Spacer for desktop alignment */}
              <div className="hidden md:block w-1/2" />
              
              {/* Center Node */}
              <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-20 h-20 flex items-center justify-center bg-cream-dark dark:bg-[#1A1B1E] z-10 transition-colors duration-300">
                 <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-[#FCFCF4] text-xs font-bold shadow-md font-sans">
                   {i + 1}
                 </div>
              </div>

              {/* Content */}
              <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                <h4 className="text-xl font-display font-semibold text-charcoal dark:text-cream transition-colors duration-300">{step.title}</h4>
                <p className="text-charcoal-muted dark:text-white/60 mt-2 transition-colors duration-300">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-charcoal text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-display-lg font-display font-medium leading-none mb-8">
              ready to <br/><span className="text-coral">start?</span>
            </h2>
            <CTAButton href="mailto:hello@thinkswift.com" variant="primary" className="bg-white text-charcoal hover:bg-coral hover:text-charcoal">
              Book Discovery Call
            </CTAButton>
          </div>
          
          <div className="flex flex-col gap-8 text-right">
            <div>
              <span className="block text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">Contact</span>
              <a href="mailto:hello@thinkswift.com" className="text-lg hover:text-coral transition-colors">hello@thinkswift.com</a>
            </div>
            <div>
              <span className="block text-xs font-mono text-white/40 mb-2 uppercase tracking-widest">Office</span>
               <p className="text-lg text-white/80">Cremorne, Melbourne</p>
            </div>
            
            <div className="max-w-sm ml-auto text-right">
                <p className="text-xs text-white/30 font-light italic leading-relaxed font-sans">
                ThinkSwift acknowledges the Traditional Custodians of the land, the Wurundjeri Woi Wurrung and Bunurong peoples of the Kulin Nation. We pay our respects to their Elders past and present.
                </p>
            </div>

            <div className="pt-12 mt-12 border-t border-white/10 w-full text-right">
              <p className="text-sm text-white/30 font-mono">© 2024 ThinkSwift. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App Component ---

const ScrollProgress: React.FC = () => {
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!progressRef.current) return;

    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });
  }, { scope: progressRef });

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-coral/20">
      <div ref={progressRef} className="h-full bg-coral w-full origin-left scale-x-0" />
    </div>
  );
};

interface NavbarProps {
  // Theme logic moved to independent component
}

const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(id);
    if (element && window.lenis) {
      window.lenis.scrollTo(element, { duration: 1, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    } else {
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Gradient Scrim Backdrop */}
      <div className="fixed bottom-0 left-0 right-0 h-32 z-40 pointer-events-none">
        <div 
          className="w-full h-full backdrop-blur-3xl"
          style={{
            maskImage: 'linear-gradient(to top, black 0%, black 20%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, black 20%, transparent 95%)'
          }}
        />
      </div>

      <nav 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center justify-center md:justify-between w-[90%] md:w-[60%] lg:w-[50%] xl:w-fit px-6 py-3 bg-cream/80 dark:bg-charcoal/80 backdrop-blur-md border border-charcoal/5 dark:border-white/10 rounded-full shadow-2xl transition-all duration-300 md:px-8 md:py-4 md:max-w-none"
      >
        {/* Brand */}
        <a href="/" className="text-lg font-semibold text-charcoal dark:text-cream tracking-tight font-display whitespace-nowrap">
          ThinkSwift
        </a>
        
        {/* Desktop Links (Hidden on Tablet/Mobile) */}
        <div className="hidden lg:flex items-center gap-6 font-sans text-sm font-medium mx-6">
          <a href="#system" onClick={(e) => scrollToSection(e, '#system')} className="text-charcoal/80 dark:text-cream/80 hover:text-charcoal dark:hover:text-cream transition-colors">Solution</a>
          <a href="#pricing" onClick={(e) => scrollToSection(e, '#pricing')} className="text-charcoal/80 dark:text-cream/80 hover:text-charcoal dark:hover:text-cream transition-colors">Pricing</a>
          <a href="#process" onClick={(e) => scrollToSection(e, '#process')} className="text-charcoal/80 dark:text-cream/80 hover:text-charcoal dark:hover:text-cream transition-colors">Process</a>
        </div>

        {/* Actions Group */}
        <div className="flex items-center gap-3 md:gap-4 ml-auto md:ml-0">
          <CTAButton href="#contact" className="inline-flex !py-2 !px-5 text-sm whitespace-nowrap" onClick={() => setMobileMenuOpen(false)}>
            Book Call
          </CTAButton>

          {/* Mobile Menu Toggle (Visible on Tablet/Mobile) */}
          <button 
            className="lg:hidden text-charcoal dark:text-cream p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-cream/95 dark:bg-charcoal/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center gap-8 p-6 lg:hidden transition-colors duration-300">
           <a href="#system" className="text-3xl font-display font-medium text-charcoal dark:text-cream" onClick={(e) => scrollToSection(e, '#system')}>Solution</a>
           <a href="#pricing" className="text-3xl font-display font-medium text-charcoal dark:text-cream" onClick={(e) => scrollToSection(e, '#pricing')}>Pricing</a>
           <a href="#process" className="text-3xl font-display font-medium text-charcoal dark:text-cream" onClick={(e) => scrollToSection(e, '#process')}>Process</a>
           <CTAButton href="#contact" className="w-full max-w-xs text-center" onClick={() => setMobileMenuOpen(false)}>
            Book Discovery Call
          </CTAButton>
           <button onClick={() => setMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 text-charcoal dark:text-cream">
             <X size={24} />
           </button>
        </div>
      )}
    </>
  );
};

const App: React.FC = () => {
  useSmoothScroll();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal text-charcoal dark:text-cream selection:bg-coral selection:text-charcoal overflow-x-hidden transition-colors duration-300">
      <ScrollProgress />
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <Navbar />
      
      {/* Fixed Liquid Assistant - lives outside sections, animates via scroll */}
      <LiquidAssistant />
      
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Audience />
        <Pricing />
        <Process />
      </main>
      
      <Footer />
    </div>
  );
};

// Render
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}

export default App;