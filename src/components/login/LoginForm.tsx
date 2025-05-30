"use client"
import React, { useState } from "react"
import { Mail, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { signIn } from "next-auth/react"
import Image from "next/image"

const LoginForm = () => {
  const [email, setEmail] = useState("saurav@example.com")
  const [password, setPassword] = useState("secret123")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) return toast.warning("All fields are required.")

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    try {
      setLoading(true)
      const result = await signIn("credentials", {
        identifier: email,
        password,
        redirect: false,
        callbackUrl: "/",
      })

      console.log(result)

      if (result?.error) {
        toast.error(result.error)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error: any) {
      console.error("Login failed:", error)
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl flex  overflow-hidden">
        {/* Left side with image */}
        <div className="hidden md:flex md:w-2/5 p-12 flex-col justify-center items-center">
          <div className="w-full aspect-square relative  ">
            <Image
              src="/logos/gmn_logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
              height={500}
              width={500}
            />
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden md:block w-px bg-gray-200 mx-2" />

        {/* Right side with form */}
        <div className="w-full md:w-3/5 p-12">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Login
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 text-black pr-4 py-3.5 border  border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-2 text-white bg-primary-dark hover:bg-primary-darker"
            >
              {loading ? "Please wait..." : "Login"}
            </Button>
          </form>
          <div className="flex justify-center mt-6 underline">
            <Link
              href="#"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
