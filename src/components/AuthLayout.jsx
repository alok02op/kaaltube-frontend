import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../components'

export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)
    const authLoaded = useSelector(state => state.auth.loaded)

    useEffect(() => {
        if (!authLoaded) return

        if (authentication && !authStatus) {
            navigate('/login', { replace: true })
        } else if (!authentication && authStatus) {
            navigate('/', { replace: true })
        }

        setLoader(false)
    }, [authStatus, authLoaded, navigate, authentication])

    return loader ? <Loader /> : <>{children}</>
}
