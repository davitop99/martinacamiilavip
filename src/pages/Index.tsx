import { motion } from "framer-motion";
import { Lock, Flame, Camera, MessageCircle, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const teasers = [
  { label: "Fotos sin censura", icon: Camera },
  { label: "Vídeos exclusivos", icon: Play },
  { label: "Chat directo", icon: MessageCircle },
  { label: "Día a día", icon: Flame },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-lg mx-auto relative z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-display font-semibold mb-8 tracking-wider uppercase"
        >
          <Flame className="w-4 h-4" />
          VIP Exclusive
        </motion.div>

        {/* Hero portrait placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-48 h-72 mx-auto mb-8 rounded-2xl bg-secondary border border-border overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-12 h-12 text-muted-foreground/50" />
          </div>
        </motion.div>

        {/* Headline */}
        <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight mb-4">
          <span className="text-gold glow-gold">El lado privado</span>
          <br />
          <span className="text-foreground">de Martina</span>
          <span className="ml-2 text-2xl">🇪🇸</span>
        </h1>

        <p className="text-muted-foreground text-base md:text-lg mb-10 max-w-sm mx-auto leading-relaxed">
          Contenido exclusivo, sin filtros y lo que el algoritmo censura.
          <span className="text-primary font-medium"> Accede ahora.</span>
        </p>

        {/* Teaser grid */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {teasers.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center blur-sm relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg" />
              </div>
              <Lock className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-2" />
              <span className="text-xs text-muted-foreground font-medium relative z-10 mt-1">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            onClick={() => navigate("/access")}
            size="lg"
            className="w-full text-lg font-display font-bold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 glow-orange animate-pulse-glow py-6"
          >
            ENTRAR AL CLUB VIP 🔑
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
