import { useState } from 'react';
import { ChevronRight, ChevronDown, Bell, Info, MessageSquarePlus, Menu } from 'lucide-react';
import FeedbackDropdown from './FeedbackDrawer';

const btn = {
  width: 34,
  height: 34,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-secondary)',
  transition: 'color .15s, background .15s',
  cursor: 'pointer',
  flexShrink: 0,
  position: 'relative',
};

function IconBtn({ title, onClick, active, children, style }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...btn,
        background: active || hovered ? 'var(--bg-hover)' : 'none',
        color: active || hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export default function TopBar({ onCommandBar, theme, onToggleTheme }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{
      height: 52,
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: 4,
      flexShrink: 0,
    }}>

      {/* Left — hamburger + avatar + breadcrumb */}
      <IconBtn title="Menú">
        <Menu size={17} />
      </IconBtn>

      <div style={{
        width: 30, height: 30, borderRadius: 7, overflow: 'hidden',
        flexShrink: 0, background: 'var(--bg-elevated)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img src="/Botmaker-iso.svg" alt="Bot" style={{ width: 22, height: 22 }} />
      </div>

      <ChevronRight size={14} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />

      <span style={{
        fontSize: 14, fontWeight: 500,
        color: 'var(--text-primary)',
        whiteSpace: 'nowrap',
      }}>
        Atención al cliente
      </span>

      <button
        onClick={() => setShowTooltip(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 3,
          padding: '2px 8px', borderRadius: 'var(--radius-sm)',
          fontSize: 11, fontWeight: 500,
          color: showTooltip ? 'var(--accent)' : 'var(--text-tertiary)',
          background: showTooltip ? 'var(--accent-dim)' : 'transparent',
          border: `1px solid ${showTooltip ? 'var(--accent-border)' : 'var(--border)'}`,
          cursor: 'pointer', transition: 'all .15s',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}
      >
        Activar tooltip
      </button>

      <div style={{ flex: 1 }} />

      {/* Right — actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>

        {/* Info */}
        <IconBtn title="Información">
          <Info size={17} />
        </IconBtn>

        {/* Workspace selector */}
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 'var(--radius-sm)',
            fontSize: 13, fontWeight: 500,
            color: 'var(--text-primary)',
            transition: 'background .15s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          Demo1
          <ChevronDown size={12} color="var(--text-secondary)" />
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <IconBtn title="Notificaciones">
            <Bell size={17} />
          </IconBtn>
          <div style={{
            position: 'absolute', top: 4, right: 4,
            width: 7, height: 7, borderRadius: '50%',
            background: '#ef4444',
            border: '1.5px solid var(--bg-surface)',
          }} />
        </div>

        {/* Feedback */}
        <div style={{ position: 'relative' }}>
          <IconBtn
            title="Sugerir mejora"
            active={feedbackOpen}
            onClick={() => setFeedbackOpen(v => !v)}
          >
            <MessageSquarePlus size={17} />
          </IconBtn>
          <FeedbackDropdown open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

          {showTooltip && (
            <div
              onAnimationEnd={() => setShowTooltip(false)}
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: 230,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                fontSize: 12,
                lineHeight: 1.5,
                color: 'var(--text-primary)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                zIndex: 50,
                animation: 'tooltip-lifecycle 5s ease forwards',
                transformOrigin: 'top right',
              }}
            >
              <div style={{
                position: 'absolute',
                top: -5, right: 11,
                width: 9, height: 9,
                background: 'var(--bg-elevated)',
                borderTop: '1px solid var(--border-strong)',
                borderLeft: '1px solid var(--border-strong)',
                transform: 'rotate(45deg)',
              }} />
              👋 Recuerda que puedes enviarnos feedback cuando quieras.
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />

        {/* User avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff',
          cursor: 'pointer', flexShrink: 0,
        }}>
          SG
        </div>

        {/* Status */}
        <button
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            padding: '2px 8px', borderRadius: 'var(--radius-sm)',
            cursor: 'pointer', transition: 'background .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.2 }}>Estado</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Disponible</span>
            <ChevronDown size={11} color="var(--text-secondary)" />
          </div>
        </button>

      </div>
    </div>
  );
}
