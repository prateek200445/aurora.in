import { render } from '@testing-library/react'
import App from '../App'

export function renderAppAt(path = '/') {
  window.history.pushState({}, '', path)
  return render(<App />)
}