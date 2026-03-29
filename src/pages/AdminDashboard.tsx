import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, KeyRound, Image as ImageIcon, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ADMIN_PASSWORD = "martina2024";

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

const AdminDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [keys, setKeys] = useState<AccessKey[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyExpiry, setNewKeyExpiry] = useState("");
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
      toast.success("Acceso admin concedido");
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
    toast.success("Foto añadida");
    setNewPhotoUrl("");
    setNewPhotoTitle("");
    fetchPhotos();
  };

  const deletePhoto = async (id: string) => {
    await supabase.from("photos").delete().eq("id", id);
    toast.success("Foto eliminada");
    fetchPhotos();
  };

  const addKey = async () => {
    if (!newKeyValue.trim()) { toast.error("Clave requerida"); return; }
    const { error } = await supabase.from("access_keys").insert({
      key: newKeyValue.trim(),
      label: newKeyLabel.trim() || null,
      expires_at: newKeyExpiry || null,
    });
    if (error) { toast.error("Error: la clave ya existe o hay un problema"); return; }
    toast.success("Clave creada");
    setNewKeyValue("");
    setNewKeyLabel("");
    setNewKeyExpiry("");
    fetchKeys();
  };

  const revokeKey = async (id: string) => {
    await supabase.from("access_keys").update({ revoked: true }).eq("id", id);
    toast.success("Clave revocada");
    fetchKeys();
  };

  const deleteKey = async (id: string) => {
    await supabase.from("access_keys").delete().eq("id", id);
    toast.success("Clave eliminada");
    fetchKeys();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="text-xl font-display font-bold text-gold">Admin Panel</h1>
          </div>
          <Input
            type="password"
            placeholder="Contraseña admin..."
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="bg-muted/50 border-border text-foreground mb-4 h-11"
          />
          <Button onClick={handleLogin} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold">
            Entrar
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-gold text-lg">🛡️ Admin Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-10">
        {/* PHOTOS SECTION */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" /> Gestión de Fotos
          </h2>

          <div className="glass-card rounded-xl p-5 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="URL de la imagen..."
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="bg-muted/50 border-border text-foreground md:col-span-2"
              />
              <Input
                placeholder="Título (opcional)"
                value={newPhotoTitle}
                onChange={(e) => setNewPhotoTitle(e.target.value)}
                className="bg-muted/50 border-border text-foreground"
              />
            </div>
            <Button onClick={addPhoto} className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold">
              <Plus className="w-4 h-4 mr-2" /> Añadir Foto
            </Button>
          </div>

          <div className="space-y-2">
            {photos.map((photo) => (
              <div key={photo.id} className="flex items-center gap-3 glass-card rounded-lg p-3">
                <img src={photo.url} alt="" className="w-12 h-12 rounded-md object-cover bg-muted" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{photo.title || "Sin título"}</p>
                  <p className="text-xs text-muted-foreground truncate">{photo.url}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deletePhoto(photo.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {photos.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-6">No hay fotos aún</p>
            )}
          </div>
        </motion.section>

        {/* ACCESS KEYS SECTION */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" /> Gestión de Claves
          </h2>

          <div className="glass-card rounded-xl p-5 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Clave de acceso..."
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
                className="bg-muted/50 border-border text-foreground"
              />
              <Input
                placeholder="Etiqueta (ej: Maria)"
                value={newKeyLabel}
                onChange={(e) => setNewKeyLabel(e.target.value)}
                className="bg-muted/50 border-border text-foreground"
              />
              <Input
                type="date"
                value={newKeyExpiry}
                onChange={(e) => setNewKeyExpiry(e.target.value)}
                className="bg-muted/50 border-border text-foreground"
              />
            </div>
            <Button onClick={addKey} className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold">
              <Plus className="w-4 h-4 mr-2" /> Crear Clave
            </Button>
          </div>

          <div className="space-y-2">
            {keys.map((k) => (
              <div key={k.id} className={`flex items-center gap-3 glass-card rounded-lg p-3 ${k.revoked ? "opacity-50" : ""}`}>
                <KeyRound className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono text-foreground">{k.key}</p>
                    {k.revoked && <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">Revocada</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {k.label || "Sin etiqueta"} · {k.expires_at ? `Expira: ${new Date(k.expires_at).toLocaleDateString()}` : "Sin expiración"}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!k.revoked && (
                    <Button variant="ghost" size="sm" onClick={() => revokeKey(k.id)} className="text-accent hover:bg-accent/10 text-xs">
                      Revocar
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteKey(k.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {keys.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-6">No hay claves de acceso aún</p>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default AdminDashboard;
