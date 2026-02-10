import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import { Phone, Square } from 'lucide-react';
import { Button } from '../components/ui/button';
import HeroSection from '../components/layout/HeroSection';
import HowItWorks from '../components/layout/HowItWorks';
import Footer from '../components/common/Footer';

const LandingPage = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Listen for messages from Anam AI iframe
  React.useEffect(() => {
    const handleMessage = (event) => {
      // Log all messages to help identify Anam events
      console.log("Received message from iframe:", event.data);

      // Heuristic: Check for common event patterns
      // If we find a "start" event, we can auto-trigger the session
      if (typeof event.data === 'string') {
        if (event.data.includes('start') || event.data.includes('active')) {
          console.log("Detected start event!");
          // setIsSessionActive(true); // Uncomment once confirmed
        }
      } else if (typeof event.data === 'object') {
        // Check for specific Anam event structure if known
        if (event.data.type === 'avatar_started' || event.data.event === 'start') {
          console.log("Detected start event (object)!");
          // setIsSessionActive(true);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#0A0A0A] flex flex-col items-center p-4 overflow-hidden">

      {/* Branding Header */}
      <div className="text-center space-y-2 mt-2 mb-4 shrink-0 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">ALMATIQ</h1>
        <p className="text-lg md:text-xl text-gray-400 font-light tracking-wide">AI-Powered Muscle Recovery Assistant</p>
      </div>

      <div className="w-full max-w-[1600px] flex flex-col md:flex-row items-stretch justify-center gap-6 flex-1 min-h-0 pb-4">
        {/* Avatar Section (Left) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center h-full">
          <div className={`w-full aspect-square md:aspect-video rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-black relative ring-1 ring-white/10`}>
            <iframe
              src="https://lab.anam.ai/frame/8f1LcS3D_JYuKuNzYhqm-?theme=dark"
              width="100%"
              height="100%"
              allow="microphone"
              allowTransparency="true"
              title="Anam AI Avatar"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Chat Section (Right - Always Visible) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center h-full">
          <div className="w-full h-full border border-gray-800 rounded-2xl overflow-hidden shadow-2xl bg-[#09090b] relative flex flex-col">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
