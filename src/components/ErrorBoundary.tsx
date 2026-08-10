import React from 'react'

type Props = { children: React.ReactNode }

type State = { hasError: boolean }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any) {
    // Log to an external service if configured
    try {
      // eslint-disable-next-line no-console
      console.error('Uncaught error:', error, info)
    } catch (e) {
      // swallow
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#fff' }}>
          <div style={{ maxWidth: 720, textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Manrope', fontSize: '1.6rem', marginBottom: '0.5rem' }}>Something went wrong</h1>
            <p style={{ fontFamily: 'Inter', color: '#444', marginBottom: '1.25rem' }}>An unexpected error occurred. Try refreshing the page or contact the site administrator.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => location.reload()} style={{ padding: '0.6rem 1rem', borderRadius: 10, background: 'var(--orange)', color: '#fff', border: 'none', cursor: 'pointer' }}>Reload</button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
