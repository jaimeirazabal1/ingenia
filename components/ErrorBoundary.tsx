'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div style={{
          padding: '2rem', textAlign: 'center', maxWidth: 400, margin: '2rem auto',
          border: '1px solid rgba(255,107,107,0.3)', borderRadius: '0.75rem',
          background: 'rgba(255,107,107,0.05)',
        }}>
          <AlertTriangle size={32} style={{ color: '#ff6b6b', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Algo salió mal</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {this.state.error?.message || 'Error inesperado'}
          </p>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="btn-primary" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem',
          }}>
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
