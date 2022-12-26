import { useEffect } from "react"
import { checkAuth } from '../../features/checkAuth'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

const Dashboard = () => {
    // pengecekkan token jwt
    useEffect(() => {
        checkAuth()
    }, [])
    return (
        <div>
            <h1>Welcome to Dashboard</h1>
            <Footer />
        </div>
    )
}

export default Dashboard