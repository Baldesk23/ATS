import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, HelpCircle, LogOut, Trash2, ExternalLink, FileText, Briefcase, Search, Download } from 'lucide-react';
import { storage, db, ref, uploadBytes, getDownloadURL, collection, addDoc, serverTimestamp } from '@/lib/firebase';
import { onSnapshot, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { deleteObject } from 'firebase/storage';

interface UploadItem {
  id: string;
  filename: string;
  url?: string;
  createdAt?: any;
}

interface OfferItem {
  id: string;
  description: string;
  createdAt?: any;
}

export default function Home() {
  const [isModerator, setIsModerator] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [logoVisible, setLogoVisible] = useState(true);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [jobOffer, setJobOffer] = useState('');
  const [activeTab, setActiveTab] = useState<'cvs' | 'offers'>('cvs');
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [search, setSearch] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCvFile(file);
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleCvSubmit = async () => {
    if (!cvFile) return;
    setStatus('Subiendo tu CV a Firebase...');
    try {
      const fileRef = ref(storage, `cvs/${Date.now()}_${cvFile.name}`);
      await uploadBytes(fileRef, cvFile);
      const url = await getDownloadURL(fileRef);
      await addDoc(collection(db, 'uploads'), {
        filename: cvFile.name,
        url,
        createdAt: serverTimestamp(),
      });
      setStatus('¡CV enviado correctamente!');
      setTimeout(() => {
        setStatus('');
        setCvFile(null);
        setPreview(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus('Error al subir el CV.');
    }
  };

  const handlePasswordSubmit = () => {
    if (password === 'Sanro') {
      setIsModerator(true);
      setShowPasswordPrompt(false);
    } else {
      alert('Contraseña incorrecta');
      setPassword('');
    }
  };

  const handlePublishOffer = async () => {
    if (!jobOffer.trim()) {
      alert('Por favor, describe la oferta laboral antes de publicar.');
      return;
    }
    try {
      await addDoc(collection(db, 'joboffers'), {
        description: jobOffer.trim(),
        createdAt: serverTimestamp(),
      });
      alert('Oferta publicada exitosamente.');
      setJobOffer('');
      setActiveTab('offers');
    } catch (err) {
      console.error(err);
      alert('Error al publicar la oferta.');
    }
  };

  const downloadCv = async (item: UploadItem) => {
    if (!item.url) return;
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.filename || 'cv.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('No se pudo descargar el CV.');
    }
  };

  const deleteCv = async (item: UploadItem) => {
    const ok = confirm(`¿Eliminar el CV "${item.filename}"?`);
    if (!ok) return;
    try {
      await deleteDoc(doc(db, 'uploads', item.id));
      if (item.url) {
        const fileRef = ref(storage, item.url);
        await deleteObject(fileRef);
      }
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar el CV.');
    }
  };

  const deleteOffer = async (item: OfferItem) => {
    const ok = confirm('¿Eliminar esta oferta laboral?');
    if (!ok) return;
    try {
      await deleteDoc(doc(db, 'joboffers', item.id));
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la oferta.');
    }
  };

  useEffect(() => {
    if (!isModerator) return;
    const qUploads = query(collection(db, 'uploads'), orderBy('createdAt', 'desc'));
    const qOffers = query(collection(db, 'joboffers'), orderBy('createdAt', 'desc'));
    const unsub1 = onSnapshot(qUploads, (snap) =>
      setUploads(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as UploadItem[])
    );
    const unsub2 = onSnapshot(qOffers, (snap) =>
      setOffers(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as OfferItem[])
    );
    return () => {
      unsub1();
      unsub2();
    };
  }, [isModerator]);

  const formatDate = (ts?: any) => (ts?.seconds ? new Date(ts.seconds * 1000).toLocaleString() : '—');
  const filteredUploads = uploads.filter((u) => u.filename?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#f9fafb,#e5e7eb)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        {logoVisible ? (
          <img
            src="/escudo.png"
            alt="Escudo San Roque"
            width="80"
            height="80"
            style={{ marginBottom: 8 }}
            onError={() => setLogoVisible(false)}
            data-testid="img-logo"
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 999,
              background: '#e5e7eb',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
              fontWeight: 700,
            }}
            data-testid="logo-fallback"
          >
            SR
          </div>
        )}
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1f2937' }} data-testid="text-app-title">
          Filtro ATS
        </h1>
      </motion.div>

      {/* Vista de usuario */}
      {!isModerator && !showPasswordPrompt && (
        <div
          style={{
            width: '100%',
            maxWidth: 640,
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#374151', marginBottom: 16 }}>
              Sube tu CV
            </h2>
            <button
              onClick={() => setShowPasswordPrompt(true)}
              title="Acceso moderador"
              style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}
              data-testid="button-moderator-access"
            >
              <HelpCircle />
            </button>
          </div>

          <label
            style={{
              width: '100%',
              cursor: 'pointer',
              border: '2px dashed #9ca3af',
              borderRadius: 16,
              padding: 24,
              textAlign: 'center',
              background: '#f9fafb',
              display: 'block',
            }}
            data-testid="dropzone-cv"
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Upload style={{ marginBottom: 12 }} />
              <span style={{ color: '#6b7280' }}>Haz clic o arrastra tu CV aquí</span>
            </div>
            <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} data-testid="input-file" />
          </label>

          {preview && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={preview}
              alt="Vista previa del CV"
              style={{
                marginTop: 24,
                borderRadius: 12,
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                maxHeight: 380,
                objectFit: 'contain',
                width: '100%',
              }}
              data-testid="img-preview"
            />
          )}

          {cvFile && (
            <button
              onClick={handleCvSubmit}
              style={{
                marginTop: 24,
                width: '100%',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                padding: '12px 16px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              data-testid="button-submit-cv"
            >
              Enviar CV a Firebase
            </button>
          )}
          {status && (
            <p style={{ marginTop: 16, color: '#6b7280', fontSize: 14 }} data-testid="text-status">
              {status}
            </p>
          )}
        </div>
      )}

      {/* Password prompt */}
      {showPasswordPrompt && !isModerator && (
        <div
          style={{
            marginTop: 24,
            width: '100%',
            maxWidth: 420,
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#374151', marginBottom: 16 }}>
            Acceso Moderador
          </h2>
          <input
            type="password"
            placeholder="Ingresa la contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8, marginBottom: 16 }}
            data-testid="input-password"
          />
          <button
            onClick={handlePasswordSubmit}
            style={{
              width: '100%',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              padding: '12px 16px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            data-testid="button-submit-password"
          >
            Entrar
          </button>
        </div>
      )}

      {/* Vista de moderador */}
      {isModerator && (
        <div style={{ marginTop: 24, width: '100%', maxWidth: 980, display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('cvs')}
              style={{
                padding: '10px 14px',
                borderRadius: 999,
                background: activeTab === 'cvs' ? '#1f2937' : '#fff',
                color: activeTab === 'cvs' ? '#fff' : '#111827',
                border: '1px solid #e5e7eb',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              data-testid="tab-cvs"
            >
              <FileText size={16} /> CVs Subidos
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              style={{
                padding: '10px 14px',
                borderRadius: 999,
                background: activeTab === 'offers' ? '#1f2937' : '#fff',
                color: activeTab === 'offers' ? '#fff' : '#111827',
                border: '1px solid #e5e7eb',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              data-testid="tab-offers"
            >
              <Briefcase size={16} /> Ofertas Laborales
            </button>
            <button
              onClick={() => {
                setIsModerator(false);
                setShowPasswordPrompt(false);
              }}
              title="Cerrar sesión"
              style={{
                marginLeft: 'auto',
                border: '1px solid #ef4444',
                background: 'white',
                color: '#ef4444',
                borderRadius: 999,
                padding: '8px 12px',
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              data-testid="button-logout"
            >
              <LogOut size={16} /> Cerrar
            </button>
          </div>

          {activeTab === 'cvs' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ flex: 1, padding: 8, border: '1px solid #ccc', borderRadius: 8 }}
                  data-testid="input-search"
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 16,
                }}
              >
                {filteredUploads.length === 0 && (
                  <p style={{ color: '#6b7280' }}>No hay CVs que coincidan.</p>
                )}
                {filteredUploads.map((u) => (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      padding: 16,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                    }}
                    data-testid={`card-cv-${u.id}`}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{u.filename || '(sin nombre)'}</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
                      {formatDate(u.createdAt)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {u.url && (
                        <a
                          href={u.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            textAlign: 'center',
                            background: '#111827',
                            color: '#fff',
                            borderRadius: 10,
                            padding: '8px',
                            textDecoration: 'none',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                          }}
                          data-testid={`button-view-${u.id}`}
                        >
                          <ExternalLink size={16} /> Ver
                        </a>
                      )}
                      {u.url && (
                        <button
                          onClick={() => downloadCv(u)}
                          style={{
                            background: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 10,
                            padding: '8px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                          }}
                          data-testid={`button-download-${u.id}`}
                        >
                          <Download size={16} /> Descargar
                        </button>
                      )}
                      <button
                        onClick={() => deleteCv(u)}
                        style={{
                          background: '#fff',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          borderRadius: 10,
                          padding: '8px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                        data-testid={`button-delete-${u.id}`}
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'offers' && (
            <div style={{ display: 'grid', gap: 16 }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                }}
              >
                <h3 style={{ marginBottom: 8, color: '#111827', fontWeight: 800 }}>
                  Cargar Oferta Laboral
                </h3>
                <textarea
                  placeholder="Describe la oferta laboral..."
                  value={jobOffer}
                  onChange={(e) => setJobOffer(e.target.value)}
                  rows={5}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                  data-testid="textarea-job-offer"
                />
                <button
                  onClick={handlePublishOffer}
                  style={{
                    width: '100%',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px 16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  data-testid="button-publish-offer"
                >
                  Publicar Oferta
                </button>
              </div>

              {offers.length === 0 && <p style={{ color: '#6b7280' }}>No hay ofertas aún.</p>}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 16,
                }}
              >
                {offers.map((o) => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      padding: 16,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                    }}
                    data-testid={`card-offer-${o.id}`}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Oferta Laboral</div>
                    <div
                      style={{
                        fontSize: 14,
                        color: '#374151',
                        whiteSpace: 'pre-wrap',
                        marginBottom: 8,
                      }}
                    >
                      {o.description}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
                      {formatDate(o.createdAt)}
                    </div>
                    <button
                      onClick={() => deleteOffer(o)}
                      style={{
                        width: '100%',
                        background: '#fff',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: 10,
                        padding: '8px 10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                      data-testid={`button-delete-offer-${o.id}`}
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
