import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  fallback: ReactNode | ((error: Error) => ReactNode)
  children: ReactNode
}

export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }
  render() {
    const { error } = this.state
    if (error) return typeof this.props.fallback === 'function' ? this.props.fallback(error) : this.props.fallback
    return this.props.children
  }
}
