import { motion } from "framer-motion";
import { Lock, Flame, Camera, MessageCircle, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-martina.jpg";
import teaserBlur from "@/assets/teaser-blur.jpg";

const teasers = [
  { label: "Fotos sin censura", icon: Camera },
  { label: "Vídeos exclusivos", icon: Play },
  { label: "Chat directo", icon: MessageCircle },
  { label: "Día a día", icon: Flame },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Full-width Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Martina VIP"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>

        {/* Ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

        {/* Content overlay */}
        <div className="relative z-10 text-center px-4 pt-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-display font-semibold mb-6 tracking-widest uppercase backdrop-blur-sm"
            >
              <Flame className="w-4 h-4" />
              VIP Exclusive Club
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight mb-4 leading-tight">
              <span className="text-gold glow-gold">El lado privado</span>
              <br />
              <span className="text-foreground">de Martina</span>
              <span className="ml-3 text-3xl md:text-5xl">🇪🇸</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-lg md:text-xl mb-10 max-w-md mx-auto leading-relaxed"
            >
              Contenido exclusivo, sin filtros y lo que el algoritmo censura.
              <span className="text-primary font-semibold"> Accede ahora.</span>
            </motion.p>
          </motion.div>

          {/* Teaser Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-10"
          >
            {teasers.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="relative rounded-xl overflow-hidden aspect-square group cursor-pointer"
              >
                {/* Blurred teaser image */}
                <img
                  src={teaserBlur}
                  alt=""
                  className="w-full h-full object-cover blur-xl scale-110 brightness-50 group-hover:brightness-75 transition-all duration-500"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-background/40" />
                {/* Lock icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Lock className="w-8 h-8 text-primary drop-shadow-lg" />
                  <span className="text-xs text-foreground/80 font-display font-semibold tracking-wide">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="pb-12"
          >
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="text-lg md:text-xl font-display font-bold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 glow-orange animate-pulse-glow px-10 py-7 rounded-xl"
            >
              ENTRAR AL CLUB VIP 🔑
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
