import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, LogOut, Image as ImageIcon, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Photo {
  id: string;
  url: string;
  title: string | null;
  created_at: string;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const hasAccess = sessionStorage.getItem("martina_vip_access");
    if (!hasAccess) {
      navigate("/login");
      return;
    }
    fetchPhotos();
  }, [navigate]);

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });
    setPhotos(data || []);
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("martina_vip_access");
    sessionStorage.removeItem("martina_vip_key");
    navigate("/");
  };

  const navigateFullscreen = useCallback((direction: number) => {
    if (fullscreenIndex === null) return;
    const next = fullscreenIndex + direction;
    if (next >= 0 && next < photos.length) setFullscreenIndex(next);
  }, [fullscreenIndex, photos.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (fullscreenIndex === null) return;
      if (e.key === "Escape") setFullscreenIndex(null);
      if (e.key === "ArrowRight") navigateFullscreen(1);
      if (e.key === "ArrowLeft") navigateFullscreen(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreenIndex, navigateFullscreen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16">
          <h1 className="font-display font-bold text-gold glow-gold text-lg tracking-wide">
            Martina VIP 🔥
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" /> Salir
          </Button>
        </div>
      </header>

      <main className="container py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              El contenido exclusivo estará disponible pronto...
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-xl overflow-hidden bg-card border border-border cursor-pointer"
                onClick={() => setFullscreenIndex(i)}
              >
                <div className="aspect-[3/4]">
                  <img
                    src={photo.url}
                    alt={photo.title || "Foto exclusiva"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium text-foreground">
                      {photo.title || "Sin título"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setFullscreenIndex(i); }}
                        className="p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-colors"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {fullscreenIndex !== null && photos[fullscreenIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setFullscreenIndex(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 p-3 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10"
              onClick={() => setFullscreenIndex(null)}
            >
              <X className="w-6 h-6" />
            </button>


            {/* Navigation */}
            {fullscreenIndex > 0 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); navigateFullscreen(-1); }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {fullscreenIndex < photos.length - 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); navigateFullscreen(1); }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={photos[fullscreenIndex].id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={photos[fullscreenIndex].url}
              alt={photos[fullscreenIndex].title || ""}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground font-display">
              {fullscreenIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
