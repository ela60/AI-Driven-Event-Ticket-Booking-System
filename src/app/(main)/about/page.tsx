'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Shield, Cpu, TagIcon, HeadsetIcon } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 50,
      damping: 20 
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function AboutUs() {
  const [stats, setStats] = useState({ 
    users: 0, 
    events: 0, 
    tickets: 0,
    organizers: 0
  });
  
  // Simulating stats counter animation
  useEffect(() => {
    const targetStats = { users: 15000, events: 4500, tickets: 68000, organizers: 850 };
    const duration = 2000; // ms
    const steps = 50;
    const interval = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep += 1;
      const progress = Math.min(currentStep / steps, 1);
      
      setStats({
        users: Math.floor(targetStats.users * progress),
        events: Math.floor(targetStats.events * progress),
        tickets: Math.floor(targetStats.tickets * progress),
        organizers: Math.floor(targetStats.organizers * progress)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const teamMembers = [
    {
      name: "Jahidul Hossain Mekat",
      role: "CEO & Founder",
      image: "/team/team1.jpg",
      description: "Tech visionary with over 10 years in SaaS and event management."
    },
    {
      name: "Sorno",
      role: "CTO",
      image: "/team/team2.jpg",
      description: "AI specialist with expertise in machine learning algorithms."
    },
    {
      name: "Ali Akhbar",
      role: "Head of Product",
      image: "/team/team3.jpg",
      description: "UX expert crafting seamless event booking experiences."
    },
    {
      name: "Sanjida",
      role: "Chief Data Scientist",
      image: "/team/team4.jpg",
      description: "PhD in AI, leading our dynamic pricing algorithms."
    }
  ];

  return (
    <div className="bg-white" style={{
      '--color-primary': '#2de718',
      '--color-secondary': '#D218E7'
    } as React.CSSProperties}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 opacity-10">
          <Image 
            src="/patterns/circuit-board.svg" 
            alt="Tech Pattern" 
            width={600} 
            height={600}
            className="dark:invert"
          />
        </div>
        
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ 
              backgroundImage: 'linear-gradient(to right, var(--color-primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Revolutionizing Event Ticketing with AI
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Were on a mission to transform how people discover, book, and experience events through intelligent technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 rounded-full text-white font-medium transition-all shadow-lg hover:shadow-xl" 
                style={{ backgroundColor: 'var(--color-primary)' }}>
                Explore Events
              </button>
              <button className="px-8 py-3 rounded-full bg-white border font-medium transition-all shadow-lg hover:shadow-xl" 
                style={{ borderColor: 'var(--color-secondary)', color: 'var(--color-secondary)' }}>
                Become an Organizer
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative"
            >
              <div className="absolute inset-0 rounded-3xl transform rotate-3" 
                style={{ backgroundColor: 'rgba(210, 24, 231, 0.2)' }}></div>
              <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
                <Image 
                  src="/about/our-story.jpg" 
                  alt="Our team working together" 
                  width={600} 
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-xl"
                style={{ color: 'var(--color-primary)' }}>
                <p className="text-lg font-bold">Est. 2025</p>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-6">
                Founded in 2025, our AI-driven event ticketing platform was born from a simple observation: event discovery and ticketing hadnt fundamentally changed in decades, despite advances in AI and machine learning.
              </p>
              <p className="text-gray-700 mb-6">
                Our team of technologists, event enthusiasts, and AI specialists came together with a shared vision: to create a platform that doesnt just process ticket sales, but fundamentally enhances how people discover and experience events.
              </p>
              <p className="text-gray-700">
                Today, we serve thousands of event organizers and millions of attendees, using cutting-edge AI to match people with experiences theyll love while helping organizers maximize their reach and revenue.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'rgba(45, 231, 24, 0.05)' }}>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our AI-Driven Platform?
            </h2>
            <p className="text-lg text-gray-700">
              Our technology goes beyond traditional ticketing to create exceptional experiences for both attendees and organizers.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
               className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
              variants={fadeInUp}
            >
              <div className="rounded-full w-16 h-16 flex items-center justify-center mb-6" 
                   style={{ backgroundColor: 'rgba(45, 231, 24, 0.1)' }}>
                <Cpu style={{ color: 'var(--color-primary)' }} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personalized Experience</h3>
              <p className="text-gray-700">
                Our AI tailors event recommendations based on your preferences, past attendance, and browsing behavior.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
              variants={fadeInUp}
            >
              <div className="rounded-full w-16 h-16 flex items-center justify-center mb-6"
                   style={{ backgroundColor: 'rgba(45, 231, 24, 0.1)' }}>
                <TagIcon style={{ color: 'var(--color-primary)' }} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Dynamic Pricing</h3>
              <p className="text-gray-700">
                Smart pricing algorithms ensure maximum revenue for organizers while offering fair deals to attendees.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
              variants={fadeInUp}
            >
              <div className="rounded-full w-16 h-16 flex items-center justify-center mb-6"
                   style={{ backgroundColor: 'rgba(45, 231, 24, 0.1)' }}>
                <Shield style={{ color: 'var(--color-primary)' }} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enhanced Security</h3>
              <p className="text-gray-700">
                AI fraud detection prevents scams and ticket scalping, keeping the platform safe for everyone.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
              variants={fadeInUp}
            >
              <div className="rounded-full w-16 h-16 flex items-center justify-center mb-6"
                   style={{ backgroundColor: 'rgba(45, 231, 24, 0.1)' }}>
                <HeadsetIcon style={{ color: 'var(--color-primary)' }} className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Chatbot Assistance</h3>
              <p className="text-gray-700">
                24/7 support from our intelligent chatbot that helps with bookings, queries, and recommendations.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                {stats.users.toLocaleString()}+
              </p>
              <p className="text-lg text-gray-700">Active Users</p>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                {stats.events.toLocaleString()}+
              </p>
              <p className="text-lg text-gray-700">Events Hosted</p>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                {stats.tickets.toLocaleString()}+
              </p>
              <p className="text-lg text-gray-700">Tickets Sold</p>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                {stats.organizers.toLocaleString()}+
              </p>
              <p className="text-lg text-gray-700">Event Organizers</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'rgba(210, 24, 231, 0.05)' }}>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Leadership Team
            </h2>
            <p className="text-lg text-gray-700">
              A diverse group of innovators passionate about events and technology.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                variants={fadeInUp}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="mb-3" style={{ color: 'var(--color-secondary)' }}>{member.role}</p>
                  <p className="text-gray-700 text-sm">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Vision for the Future</h2>
              <p className="text-gray-700 mb-6">
                We are building a future where finding the perfect event is effortless, where event organizers can focus on creating amazing experiences rather than worrying about ticket sales, and where AI serves as the bridge connecting people with unforgettable memories.
              </p>
              <p className="text-gray-700 mb-6">
                Our roadmap includes expanding our AI capabilities to predict emerging event trends, further personalizing the user experience, and developing tools that help organizers create more successful events.
              </p>
              <div className="mt-8">
                <button className="px-8 py-3 rounded-full text-white font-medium transition-all shadow-lg hover:shadow-xl"
                       style={{ backgroundColor: 'var(--color-secondary)' }}>
                  Join Our Journey
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative"
            >
              <div className="absolute inset-0 rounded-3xl transform -rotate-3" 
                style={{ backgroundColor: 'rgba(45, 231, 24, 0.2)' }}></div>
              <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
                <Image 
                  src="/about/vision.jpg" 
                  alt="Future vision concept" 
                  width={600} 
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                <p className="text-lg font-bold" style={{ color: 'var(--color-secondary)' }}>The Future</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24" style={{ 
        background: 'linear-gradient(to right, var(--color-primary))'
      }}>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience the Future of Event Ticketing?
            </h2>
            <p className="text-xl text-white mb-8 opacity-90">
              Join thousands of event-goers and organizers on our platform today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 rounded-full bg-white font-medium transition-all shadow-lg hover:shadow-xl"
                      style={{ color: 'var(--color-primary)' }}>
                Find Events
              </button>
              <button className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-medium transition-all shadow-lg hover:shadow-xl">
                List Your Event
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}