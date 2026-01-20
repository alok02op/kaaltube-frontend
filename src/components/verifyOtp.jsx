import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Button, Input, Card, CardHeader, CardContent, CardTitle, AlertPopup } from "@/components"
import { authService } from "../backend"

const VerifyOtp = () => {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [resendLoading, setResendLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const showAlert = (type, message) => setAlert({show: true, type, message})
  const closeAlert = () => setAlert({...alert, show: false})


  const [params] = useSearchParams()
  const navigate = useNavigate()

  const userId = params.get("userId")

  const resendOtp = async () => {
    setError("")
    setMessage("")
    setResendLoading(true)
    try {
        await authService.resendOtp({ userId })
        setMessage("OTP resent to your email")
    } catch (err) {
        setError(err.response?.data?.message || "Failed to resend OTP")
    } finally {
        setResendLoading(false)
    }
  }

  const verifyOtp = async () => {
    setError("")
    setLoading(true)
    try {
      const msg = await authService.verifyOtp({ userId, otp })
      showAlert('success', msg || "Email verified.");
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm p-6 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">
            Verify your Email
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Enter the 6-digit OTP sent to your email
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            label="OTP"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}

          <Button
            className="w-full cursor-pointer"
            onClick={verifyOtp}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
          <button
            type="button"
            onClick={resendOtp}
            disabled={resendLoading}
            className="w-full text-sm text-blue-600 hover:underline disabled:text-gray-400"
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </CardContent>
      </Card>
      <AlertPopup
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  )
}

export default VerifyOtp
