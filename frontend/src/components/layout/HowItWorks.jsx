import React from 'react';
import { MessageCircle, Zap, Calendar } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: MessageCircle,
      title: "Chat with KAIRA",
      description: "Ask questions about recovery, services, or book sessions directly through our AI assistant.",
    },
    {
      icon: Zap,
      title: "Smart Technology",
      description: "Our technology uses advanced algorithms to optimize your recovery experience.",
    },
    {
      icon: Calendar,
      title: "Book Sessions",
      description: "Schedule your recovery sessions in seconds with KAIRA's help.",
    },
  ];

  return (
    <section className="px-6 py-24 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Three simple steps to start your recovery journey
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="p-8 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
