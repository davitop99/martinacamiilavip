import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Flame, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Access = () => {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAccess = async () => {
    if (!key.trim()) {
      toast.error("Introduce tu clave de acceso");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("access_keys")
        .select("*")
        .eq("key", key.trim())
        .eq("revoked", false)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error("Clave inválida o revocada");
        setLoading(false);
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast.error("Tu clave ha expirado");
        setLoading(false);
        return;
      }

      // Store access in sessionStorage
      sessionStorage.setItem("martina_vip_access", "true");
      sessionStorage.setItem("martina_vip_key", key.trim());
      toast.success("¡Bienvenida al club! 🔥");
      navigate("/gallery");
    } catch {
      toast.error("Error al verificar la clave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-2xl p-8 md:p-10 w-full max-w-md relative z-10"
      >
        <button
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground transition-colors mb-6 flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gold glow-gold mb-2">
            Acceso VIP
          </h1>
          <p className="text-muted-foreground text-sm">
            Introduce tu clave exclusiva para desbloquear el contenido
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Tu clave de acceso..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAccess()}
            className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground h-12 text-center text-lg tracking-widest"
          />

          <Button
            onClick={handleAccess}
            disabled={loading}
            className="w-full h-12 text-base font-display font-bold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 glow-orange"
          >
            {loading ? (
              "Verificando..."
            ) : (
              <>
                DESBLOQUEAR MI ACCESO <Flame className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Access;
