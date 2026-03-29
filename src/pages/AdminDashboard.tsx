import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, KeyRound, Image as ImageIcon, Shield, ArrowLeft, Copy, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ADMIN_PASSWORD = "ADMIN1234";

interface Photo {
  id: string;
  url: string;
  title: string | null;
  created_at: string;
}

interface AccessKey {
  id: string;
  key: string;
  label: string | null;
  expires_at: string | null;
  revoked: boolean;
  created_at: string;
}

const generateKey = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "MART-";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const AdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [keys, setKeys] = useState<AccessKey[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      fetchPhotos();
      fetchKeys();
    }
  }, [authenticated]);

  const handleLogin = () => {
    if (adminPass === ADMIN_PASSWORD) {
      setAuthenticated(true);
      toast.success("Acceso admin concedido ✅");
    } else {
      toast.error("Contraseña incorrecta");
    }
  };

  const fetchPhotos = async () => {
    const { data } = await supabase.from("photos").select("*").order("created_at", { ascending: false });
    setPhotos(data || []);
  };

  const fetchKeys = async () => {
    const { data } = await supabase.from("access_keys").select("*").order("created_at", { ascending: false });
    setKeys(data || []);
  };

  const addPhoto = async () => {
    if (!newPhotoUrl.trim()) { toast.error("URL requerida"); return; }
    const { error } = await supabase.from("photos").insert({ url: newPhotoUrl.trim(), title: newPhotoTitle.trim() || null });
    if (error) { toast.error("Error al añadir foto"); return; }
    toast.success("📸 Foto añadida a la galería");
    setNewPhotoUrl("");
    setNewPhotoTitle("");
    fetchPhotos();
  };

  const deletePhoto = async (id: string) => {
    await supabase.from("photos").delete().eq("id", id);
    toast.success("Foto eliminada");
    fetchPhotos();
  };

  const handleGenerateKey = async () => {
    const newKey = generateKey();
    const { error } = await supabase.from("access_keys").insert({
      key: newKey,
      label: null,
      expires_at: null,
    });
    if (error) {
      toast.error("Error al generar clave, intenta de nuevo");
      return;
    }
    navigator.clipboard.writeText(newKey);
    toast.success(`🔑 Clave generada: ${newKey} (copiada al portapapeles)`);
    fetchKeys();
  };

  const revokeKey = async (id: string) => {
    await supabase.from("access_keys").update({ revoked: true }).eq("id", id);
    toast.success("Clave revocada — acceso cortado ❌");
    fetchKeys();
  };

  const deleteKey = async (id: string) => {
    await supabase.from("access_keys").delete().eq("id", id);
    toast.success("Clave eliminada");
    fetchKeys();
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Clave copiada al portapapeles");
  };

  // Login gate
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-gold glow-gold">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">Acceso restringido</p>
          </div>
          <Input
            type="password"
            placeholder="Master Password..."
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="bg-muted/50 border-border text-foreground mb-4 h-12 text-center tracking-widest"
          />
          <Button onClick={handleLogin} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-base">
            Entrar al Panel
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-gold glow-gold text-lg">🛡️ Admin Dashboard</h1>
          </div>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-3 py-1 rounded-full">
            {photos.length} fotos · {keys.filter(k => !k.revoked).length} claves activas
          </span>
        </div>
      </header>

      <main className="container py-8 space-y-10 max-w-4xl">
        {/* PHOTOS SECTION */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-display font-bold text-foreground mb-5 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" /> Photo Manager
          </h2>

          <div className="glass-card rounded-xl p-6 mb-5">
            <p className="text-sm text-muted-foreground mb-3">Pega la URL directa de una imagen para añadirla a la galería</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="https://example.com/photo.jpg"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="bg-muted/50 border-border text-foreground md:col-span-2 h-11"
              />
              <Input
                placeholder="Título (opcional)"
                value={newPhotoTitle}
                onChange={(e) => setNewPhotoTitle(e.target.value)}
                className="bg-muted/50 border-border text-foreground h-11"
              />
            </div>
            <Button onClick={addPhoto} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold h-11">
              <Plus className="w-4 h-4 mr-2" /> Add to Gallery
            </Button>
          </div>

          {/* Photo list */}
          <div className="space-y-2">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 glass-card rounded-lg p-3"
              >
                <img src={photo.url} alt="" className="w-14 h-14 rounded-lg object-cover bg-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium truncate">{photo.title || "Sin título"}</p>
                  <p className="text-xs text-muted-foreground truncate font-mono">{photo.url}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePhoto(photo.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}
            {photos.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-8">No hay fotos aún — añade la primera arriba</p>
            )}
          </div>
        </motion.section>

        {/* ACCESS KEYS SECTION */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-display font-bold text-foreground mb-5 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" /> User / Key Manager
          </h2>

          <div className="glass-card rounded-xl p-6 mb-5">
            <p className="text-sm text-muted-foreground mb-3">
              Genera claves de acceso únicas para tus miembros VIP. Formato: <span className="font-mono text-primary">MART-XXXX</span>
            </p>
            <Button
              onClick={handleGenerateKey}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold h-11"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> GENERATE NEW KEY
            </Button>
          </div>

          {/* Keys list */}
          <div className="space-y-2">
            {keys.map((k, i) => (
              <motion.div
                key={k.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 glass-card rounded-lg p-4 ${k.revoked ? "opacity-50" : ""}`}
              >
                <KeyRound className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-mono font-semibold text-foreground tracking-wider">{k.key}</span>
                    {k.revoked ? (
                      <span className="text-xs bg-destructive/20 text-destructive px-2.5 py-0.5 rounded-full font-display font-semibold">
                        Inactive
                      </span>
                    ) : (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full font-display font-semibold">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Created: {new Date(k.created_at).toLocaleDateString()}
                    {k.label && ` · ${k.label}`}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyKey(k.key)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {!k.revoked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => revokeKey(k.id)}
                      className="text-accent hover:bg-accent/10 text-xs font-display"
                    >
                      Revoke
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteKey(k.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
            {keys.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-8">No hay claves aún — genera la primera arriba</p>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default AdminDashboard;
