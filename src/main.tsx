import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from './context/AuthContext'
import { NextUIProvider } from '@nextui-org/react'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
<BrowserRouter>
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <NextUIProvider>
                <App />
            </NextUIProvider>
        </AuthProvider>
    </QueryClientProvider>
</BrowserRouter>
)
