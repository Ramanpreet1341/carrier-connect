import { useEffect, useState } from "react";
import { Shield, Sparkles, Zap, Users, Video, CheckCircle2 } from "lucide-react";

const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const features = [
    { icon: Sparkles, text: "AI-Powered Matching", color: "from-yellow-400 to-orange-500" },
    { icon: Video, text: "Video Interviews", color: "from-blue-400 to-purple-500" },
    { icon: Users, text: "Smart Networking", color: "from-pink-400 to-rose-500" },
    { icon: Zap, text: "Instant Connections", color: "from-cyan-400 to-blue-500" },
  ];

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);

    // Simulate loading progress with stages
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.5;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return next;
      });
    }, 25);

    // Cycle through features
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 800);

    // Start fade out after progress completes
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Hide preloader completely after fade out
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(featureInterval);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  const CurrentIcon = features[currentFeature].icon;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center transition-all duration-700 ${
        isFadingOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/10 blur-sm animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-purple-500/20 rounded-full filter blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 bg-blue-500/20 rounded-full filter blur-3xl animate-float-slow" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 right-1/3 h-72 w-72 bg-pink-500/20 rounded-full filter blur-3xl animate-float-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-12 px-4">
        {/* Logo with 3D effect */}
        <div className="flex flex-col items-center space-y-6 animate-fade-in-up">
          <div className="relative">
            {/* Glowing rings */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full blur-xl opacity-40 animate-spin-slow"></div>
            
            {/* Main logo container */}
            <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-white/20 rounded-3xl backdrop-blur-sm"></div>
              <Shield className="h-20 w-20 text-white relative z-10 animate-bounce-slow" />
            </div>
          </div>

          {/* Title with gradient text */}
          <div className="text-center space-y-2">
            <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              CareerConnect
            </h1>
            <p className="text-xl md:text-2xl text-purple-200/90 font-medium animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Your Gateway to Dream Careers
            </p>
          </div>
        </div>

        {/* Feature showcase */}
        <div className="flex flex-col items-center space-y-6 w-full max-w-md animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="relative w-full h-24 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            <div className="flex items-center space-x-4 z-10">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${features[currentFeature].color} shadow-lg transform transition-all duration-500 ${
                isFadingOut ? "scale-0 rotate-180" : "scale-100 rotate-0"
              }`}>
                <CurrentIcon className="h-8 w-8 text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-white/90 font-semibold text-lg">{features[currentFeature].text}</p>
                <div className="flex space-x-1 mt-1">
                  {features.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentFeature ? "w-8 bg-white" : "w-1.5 bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col items-center space-y-4 w-full max-w-md animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2 w-2 bg-white rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "0.8s",
                  }}
                />
              ))}
            </div>
            <span className="text-white/70 text-sm font-medium ml-2">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Loading stages */}
        <div className="flex items-center space-x-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          {[
            { text: "Initializing", done: progress > 25 },
            { text: "Loading Assets", done: progress > 50 },
            { text: "Almost Ready", done: progress > 75 },
          ].map((stage, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              {stage.done ? (
                <CheckCircle2 className="h-5 w-5 text-green-400 animate-scale-in" />
              ) : (
                <div className="h-5 w-5 border-2 border-white/30 rounded-full animate-pulse" />
              )}
              <span className={`text-sm font-medium transition-colors ${
                stage.done ? "text-green-400" : "text-white/50"
              }`}>
                {stage.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <p className="text-sm md:text-base text-white/60 font-medium">
            Made with <span className="text-red-400 animate-pulse">❤️</span> by{" "}
            <span className="text-purple-300 font-semibold">Ramanpreet Singh</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Preloader;

