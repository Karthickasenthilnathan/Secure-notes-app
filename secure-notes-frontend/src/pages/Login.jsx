import { useState } from "react"
import api from "../api/api"
import { useNavigate } from "react-router-dom"

function Login() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {

      const formData = new URLSearchParams()
      formData.append("username", username)
      formData.append("password", password)

      const res = await api.post("/auth/login", formData)

      const token = res.data.access_token

      localStorage.setItem("token", token)

      alert("Login successful")

      navigate("/dashboard")

    } catch (err) {

      console.log(err)
      alert("Login failed")

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/30 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/30 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-white text-purple-700 font-semibold hover:bg-purple-100 transition duration-300"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login