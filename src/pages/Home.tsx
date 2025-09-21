import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Sparkles, 
  Video, 
  Image, 
  MessageCircle, 
  Brain, 
  Zap,
  Play,
  Star,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const [currentService, setCurrentService] = useState(0);

  const services = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "AI Video Generation",
      description: "Create stunning videos from text prompts with cutting-edge AI technology",
      features: ["4K Quality", "Custom Styles", "Instant Generation"],
      action: "Generate Video"
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: "AI Image Creation",
      description: "Transform your imagination into breathtaking visuals",
      features: ["Ultra HD", "Multiple Styles", "Lightning Fast"],
      action: "Create Image"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Smart AI Chat",
      description: "Engage with the most advanced AI assistant",
      features: ["Context Aware", "Multi-Modal", "24/7 Available"],
      action: "Start Chat"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Analysis",
      description: "Analyze and understand any content with AI precision",
      features: ["Deep Learning", "Real-time", "Accurate Results"],
      action: "Analyze Now"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      text: "DarkAI revolutionized my content creation process!",
      avatar: "SC"
    },
    {
      name: "Mike Rodriguez",
      role: "Digital Artist",
      text: "The AI video generation is absolutely mind-blowing.",
      avatar: "MR"
    },
    {
      name: "Emma Johnson",
      role: "Marketing Director",
      text: "Best AI platform I've ever used for business.",
      avatar: "EJ"
    }
  ];

  const openTelegram = (username: string) => {
    window.open(`https://t.me/${username}`, '_blank');
  };

  const handleServiceTry = (serviceName: string) => {
    // Redirect to app which will show auth if not logged in
    window.location.href = '/app';
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(217,204,187,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(217,204,187,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/80" />
      </div>

      {/* Glassy Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 p-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="glass-effect rounded-2xl px-6 py-4 mx-4 sm:mx-8">
            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-black text-primary font-orbitron"
                style={{ fontWeight: 900 }}
              >
                DARK AI
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/app'}
                className="control-button rounded-full p-3"
              >
                <User className="w-5 h-5 text-primary" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-8">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Next-Gen AI Platform</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight font-orbitron">
                Unleash the Power of
                <br />
                <span className="text-foreground font-orbitron">Dark AI</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Experience the future of artificial intelligence with our cutting-edge platform. 
                Create, analyze, and innovate like never before.
              </p>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 rounded-full shadow-glow hover:shadow-dramatic transition-all duration-300"
                  onClick={() => window.location.href = '/app'}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Creating Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Powerful AI Services
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover our comprehensive suite of AI-powered tools designed to transform your creativity
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card className="glass-effect border-0 h-full group cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        {service.icon}
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 text-foreground">
                        {service.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {service.description}
                      </p>
                      
                      <div className="space-y-2 mb-6">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 text-primary" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                        onClick={() => handleServiceTry(service.title)}
                      >
                        {service.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Testimonials Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent to-background/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Video Generation Magic
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                Watch how our AI transforms ideas into stunning visual stories
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Video Showcase */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-dramatic group glass-effect">
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-80 object-cover"
                  >
                    <source src="https://cdn.snapzion.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/appGallery-videos/JRpnsJcYkNJ9hMT-X2doW-VID_20250919_075204_809.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">AI Video Generation</h3>
                    <p className="text-white/80 mb-4">Transform text into stunning videos</p>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button size="lg" className="rounded-full" onClick={() => window.location.href = '/app'}>
                      <Play className="w-6 h-6 mr-2" />
                      Try Video AI
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Testimonials */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-effect border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                            {testimonial.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="text-foreground mb-2 italic">
                              "{testimonial.text}"
                            </p>
                            <div className="text-sm text-muted-foreground">
                              <div className="font-semibold">{testimonial.name}</div>
                              <div>{testimonial.role}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-orbitron">
                Ready to Experience Dark AI?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of creators already using our platform to bring their ideas to life
              </p>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="text-lg px-12 py-4 rounded-full shadow-glow hover:shadow-dramatic transition-all duration-300"
                  onClick={() => window.location.href = '/app'}
                >
                  Get Started Free
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-primary font-orbitron">
                DARK AI
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                The most advanced AI platform for creators, innovators, and dreamers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
              <div className="space-y-3">
                <button
                  onClick={() => openTelegram('youssofxmoussa')}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Developer
                </button>
                <button
                  onClick={() => openTelegram('zDarkAI')}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Support
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Community</h4>
              <div className="space-y-3">
                <button
                  onClick={() => openTelegram('DarkAIx')}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Channel
                </button>
                <button
                  onClick={() => window.open('https://t.me/boost/DarkAIx', '_blank')}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Boost
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 DarkAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;