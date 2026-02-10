import React from 'react';
import { Button } from '../ui/button';
import { Zap } from 'lucide-react';

const HeroSection = () => {
  const scrollToChat = () => {
    document.querySelector('.chat-interface')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <Zap className="w-4 h-4" />
          AI-Powered Recovery
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          ALMATIQ
        </h1>
        <p className="text-xl text-gray-400 mb-4 max-w-2xl mx-auto">
          Advanced muscle recovery technology. Ask KAIRA, your AI recovery assistant.
        </p>
        <Button onClick={scrollToChat} size="lg" className="mt-4">
          Start Conversation
        </Button>
        <div className="flex justify-center gap-12 mt-16 text-sm text-gray-500">
          <div>
            <span className="block text-2xl font-semibold text-white">30min</span>
            <span>Recovery Session</span>
          </div>
          <div>
            <span className="block text-2xl font-semibold text-white">AI</span>
            <span>Powered</span>
          </div>
          <div>
            <span className="block text-2xl font-semibold text-white">24/7</span>
            <span>Available</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
