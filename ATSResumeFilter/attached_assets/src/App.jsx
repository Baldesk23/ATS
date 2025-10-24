import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, HelpCircle, LogOut } from 'lucide-react'
import { storage, db, ref, uploadBytes, getDownloadURL, collection, addDoc, serverTimestamp } from './firebaseConfig'

export default function App() {
  const [isModerator, setIsModerator] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [password, setPassword] = useState('')
  const [jobOffer, setJobOffer] = useState('')
  const [cvFile, setCvFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('')
  const [logoVisible, setLogoVisible] = useState(true)

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0] || null
    setCvFile(file)
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  const handlePasswordSubmit = () => {
    if (password === 'Sanro') {
      setIsModerator(true)
      setShowPasswordPrompt(false)
    } else {
      alert('Contraseña incorrecta')
    }
  }

  const handleCvSubmit = async () => {
    if (!cvFile) return
    setStatus('Subiendo tu CV a Firebase...')

    try {
      const fileRef = ref(storage, `cvs/${Date.now()}_${cvFile.name}`)
      await uploadBytes(fileRef, cvFile)
      const url = await getDownloadURL(fileRef)

      await addDoc(collection(db, 'uploads'), {
        filename: cvFile.name,
        mimetype: cvFile.type,
        size: cvFile.size,
        url,
        createdAt: serverTimestamp(),
      })

      setStatus('¡CV enviado correctamente!')
    } catch (err) {
      console.error(err)
      setStatus('Error al subir el CV.')
    }

    setCvFile(null)
    setPreview(null)
  }

  const handlePublishOffer = async () => {
    if (!jobOffer.trim()) {
      alert('Por favor, describe la oferta laboral antes de publicar.')
      return
    }
    try {
      await addDoc(collection(db, 'joboffers'), {
        description: jobOffer.trim(),
        createdAt: serverTimestamp(),
      })
      alert('Oferta publicada exitosamente.')
      setJobOffer('')
    } catch (err) {
      console.error(err)
      alert('Error al publicar la oferta.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f9fafb,#e5e7eb)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
        {logoVisible ? (
          <img src='/escudo.png' alt='Escudo San Roque' width='80' height='80' style={{ marginBottom: 8 }} onError={() => setLogoVisible(false)} />
        ) : (
          <div style={{ width: 80, height: 80, borderRadius: 999, background: '#e5e7eb', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontWeight: 700 }}>SR</div>
        )}
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1f2937' }}>Filtro ATS</h1>
      </motion.div>

      {!isModerator && !showPasswordPrompt && (
        <div style={{ width: '100%', maxWidth: 640, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#374151', marginBottom: 16 }}>Sube tu CV</h2>
            <button onClick={() => setShowPasswordPrompt(true)} title='Acceso moderador' style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
              <HelpCircle />
            </button>
          </div>

          <label style={{ width: '100%', cursor: 'pointer', border: '2px dashed #9ca3af', borderRadius: 16, padding: 24, textAlign: 'center', background: '#f9fafb' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Upload style={{ marginBottom: 12 }} />
              <span style={{ color: '#6b7280' }}>Haz clic o arrastra tu CV aquí</span>
            </div>
            <input type='file' style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>

          {preview && (
            <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={preview} alt='Vista previa del CV' style={{ marginTop: 24, borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.08)', maxHeight: 380, objectFit: 'contain', width: '100%' }} />
          )}

          {cvFile && (
            <button onClick={handleCvSubmit} style={{ marginTop: 24, width: '100%', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>
              Enviar CV a Firebase
            </button>
          )}
          {status && <p style={{ marginTop: 16, color: '#6b7280', fontSize: 14 }}>{status}</p>}
        </div>
      )}

      {showPasswordPrompt && !isModerator && (
        <div style={{ marginTop: 24, width: '100%', maxWidth: 420, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#374151', marginBottom: 16 }}>Acceso Moderador</h2>
          <input type='password' placeholder='Ingresa la contraseña' value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8, marginBottom: 16 }} />
          <button onClick={handlePasswordSubmit} style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>
            Entrar
          </button>
        </div>
      )}

      {isModerator && (
        <div style={{ marginTop: 24, width: '100%', maxWidth: 640, background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#374151' }}>Cargar Oferta Laboral</h2>
            <button onClick={() => setIsModerator(false)} title='Cerrar sesión' style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <LogOut />
            </button>
          </div>
          <textarea placeholder='Describe la oferta laboral...' value={jobOffer} onChange={(e) => setJobOffer(e.target.value)} rows={6} style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8, marginBottom: 16 }} />
          <button onClick={handlePublishOffer} style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>
            Publicar Oferta
          </button>
        </div>
      )}
    </div>
  )
}
