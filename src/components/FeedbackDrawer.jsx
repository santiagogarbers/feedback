import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ImagePlus } from 'lucide-react';

const IMPORTANCE_OPTIONS = [
  'Solo una nota',
  'Estaría bueno tenerlo',
  'Importante',
  'Muy importante',
];

const HELP_CENTER_URL = 'https://help.botmaker.com/es/support';

export default function FeedbackDropdown({ open, onClose }) {
  const [request, setRequest] = useState('');
  const [importance, setImportance] = useState('');
  const [images, setImages] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(120, el.scrollHeight)}px`;
  }, [request]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    }
    // Delay so the opening click doesn't immediately close
    const t = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  function addFiles(files) {
    Array.from(files).filter(f => f.type.startsWith('image/')).forEach(file => {
      const url = URL.createObjectURL(file);
      setImages(prev => [...prev, { url, name: file.name }]);
    });
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function removeImage(idx) {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  }

  function handleSubmit() {
    if (!request.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRequest('');
      setImportance('');
      images.forEach(img => URL.revokeObjectURL(img.url));
      setImages([]);
      onClose();
    }, 1500);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          key="feedback-dropdown"
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: 360,
            zIndex: 200,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 3 }}>
                  Sugerí una mejora
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  ¿Qué funcionalidad o experiencia te gustaría tener en la plataforma?
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 22, height: 22, borderRadius: 4, marginTop: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-secondary)', flexShrink: 0,
                  transition: 'background .15s, color .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '70vh', overflowY: 'auto' }}>

            {/* Request */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Tu idea
              </label>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                style={{
                  border: `1px solid ${dragging ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  background: dragging ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                  transition: 'border-color .15s, background .15s',
                  overflow: 'hidden',
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={request}
                  onChange={e => setRequest(e.target.value)}
                  placeholder="Contanos qué te gustaría poder hacer, o qué experiencia mejorarías..."
                  style={{
                    width: '100%', minHeight: 100, padding: '10px 12px',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: 13, lineHeight: 1.5,
                    resize: 'none', outline: 'none',
                    display: 'block', overflow: 'hidden',
                  }}
                />

                {images.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 10px 10px' }}>
                    {images.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: 56, height: 56, borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <button
                          onClick={() => removeImage(idx)}
                          style={{
                            position: 'absolute', top: 2, right: 2,
                            width: 15, height: 15, borderRadius: '50%',
                            background: 'rgba(0,0,0,0.65)', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', border: 'none', padding: 0,
                          }}
                        >
                          <X size={8} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', padding: '5px 8px', borderTop: '1px solid var(--border)' }}>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                    onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    title="Adjuntar imagen"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 11, color: 'var(--text-secondary)',
                      padding: '3px 6px', borderRadius: 4,
                      transition: 'background .15s, color .15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <ImagePlus size={12} />
                    Adjuntar imagen
                  </button>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-tertiary)' }}>o arrastrá acá</span>
                </div>
              </div>
            </div>

            {/* Importance */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Importancia
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {IMPORTANCE_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setImportance(opt)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 12px',
                      border: `1px solid ${importance === opt ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      background: importance === opt ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                      color: 'var(--text-primary)',
                      textAlign: 'left', width: '100%',
                      cursor: 'pointer', transition: 'border-color .15s, background .15s',
                    }}
                  >
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${importance === opt ? 'var(--accent)' : 'var(--border-strong)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'border-color .15s',
                    }}>
                      {importance === opt && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />}
                    </div>
                    <span style={{ fontSize: 12 }}>{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hint */}
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
              Leemos todas las sugerencias para priorizar mejoras, pero no recibirás una respuesta a cada una.
            </div>

            {/* Bug redirect */}
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
              🐞 ¿Encontraste un error?{' '}
              <a
                href={HELP_CENTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'underline' }}
              >
                Reportalo en el Help Center
              </a>{' '}
              para que un técnico especialista lo revise.
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSubmit}
              disabled={!request.trim()}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius-md)',
                background: submitted ? 'var(--green)' : '#2563eb',
                color: '#fff',
                fontWeight: 600, fontSize: 12,
                cursor: request.trim() ? 'pointer' : 'not-allowed',
                opacity: request.trim() ? 1 : 0.5,
                transition: 'background .2s, opacity .15s',
              }}
            >
              {submitted ? '¡Gracias por tu idea!' : 'Enviar idea'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
