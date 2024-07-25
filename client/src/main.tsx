import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import TrpcProvider from './providers/TrpcProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TrpcProvider>
    <App />
  </TrpcProvider>
)
