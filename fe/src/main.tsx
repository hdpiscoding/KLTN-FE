import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer } from "react-toastify"
import { HelmetProvider } from 'react-helmet-async'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')!).render(
    <HelmetProvider>
        <App />
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ zIndex: 1000 }}
        />
    </HelmetProvider>
)
