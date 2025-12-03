import { WalletProvider } from './context/WalletContext'
import { ThemeProvider } from './context/ThemeContext'
import MainLayout from './components/MainLayout'
import ToastContainer from './components/ui/ToastContainer'

function App() {
    return (
        <ThemeProvider>
            <WalletProvider>
                <MainLayout />
                <ToastContainer />
            </WalletProvider>
        </ThemeProvider>
    )
}

export default App
