import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const mount = (selector: string) => {
    const el = document.querySelector(selector)
    if (el) {
        const root = ReactDOM.createRoot(el)
        root.render(<App />)
    } else {
        console.error('Mount point not found:', selector)
    }
}

    ; (window as any).LeadFormWidget = {
        mount,
    }
