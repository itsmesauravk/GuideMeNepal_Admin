"use client"
import { useEffect, useState } from "react"
import {
  Users,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  UserCheck,
} from "lucide-react"
import { useSession } from "next-auth/react"
import axios from "axios"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TimeAgo from "../common/TimeAgo"

export interface AdminDashboardData {
  metrices: {
    totalUsers: number
    totalGuides: number
    totalBookings: number
    totalEarnings: number
  }
  recentGuidesRequest: GuideRequest[]
}

export interface GuideRequest {
  id: number
  slug: string
  fullname: string
  email: string
  contact: string
  verified: boolean
  registrationStatus: "registered" | "rejected" | "pending"
  firstTimeLogin: boolean
  guideType: string[]
  languageSpeak: string[]
  profilePhoto: string
  certificationPhoto: string | null
  guidingAreas: string[]
  aboutMe: string
  experiences: string[]
  availability: {
    isActivate: boolean
    isAvailable: boolean
  }
  lastActiveAt: string | null
  profileviews: number
  createdAt: string
  updatedAt: string
}

const DashboardHome = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(
    null
  )

  const { data: sessionData } = useSession()

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  //for getting morning, afternoon, evening
  const getTimeOfDay = () => {
    const date = new Date()
    const hours = date.getHours()

    if (hours < 12) {
      return "Good Morning"
    } else if (hours < 18) {
      return "Good Afternoon"
    } else {
      return "Good Evening"
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`
      )
      const data = response.data
      if (data.success) {
        setDashboardData(data.data)
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!sessionData) return
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col w-full items-center justify-center h-screen">
        <Loader2 className="animate-spin w-12 h-12 text-primary-dark" />
        <span className="ml-2 text-lg text-gray-700 animate-pulse">
          Loading dashboard...
        </span>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="flex flex-col w-full p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {getTimeOfDay()}, {sessionData?.user?.name}!
          </h2>
        </div>
        <Button
          onClick={fetchDashboardData}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-primary-dark hover:bg-primary-darker"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Link href="/users">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center text-blue-600 mb-2">
                <Users className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Total Users</span>
              </div>
              <p className="text-2xl font-bold">
                {dashboardData?.metrices.totalUsers || 0}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/guides">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center text-indigo-600 mb-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Total Guides</span>
              </div>
              <p className="text-2xl font-bold">
                {dashboardData?.metrices.totalGuides || 0}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center text-yellow-600 mb-2">
              <DollarSign className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Total Earnings</span>
            </div>
            <p className="text-2xl font-bold">
              ${dashboardData?.metrices.totalEarnings || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center text-green-600 mb-2">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">
                Total Bookings Completed
              </span>
            </div>
            <p className="text-2xl font-bold">
              {dashboardData?.metrices.totalBookings || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guide Requests Table */}
        <div className="lg:col-span-2">
          <Card className="bg-white overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Guide Applications
              </h3>
              <Link
                href="/guides"
                className="text-primary-dark hover:text-primary-darker text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              {dashboardData?.recentGuidesRequest &&
              dashboardData.recentGuidesRequest.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentGuidesRequest.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {request.fullname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.guidingAreas.join(", ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.verified ? (
                            <span className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <XCircle className="w-4 h-4 text-red-500 mr-1" />
                              Not Verified
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              request.registrationStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.registrationStatus === "registered"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {request.registrationStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <TimeAgo timestamp={request.createdAt} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">
                    No guide applications at the moment
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Links */}
          <Card className="bg-white">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Quick Actions
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <Link
                href="/analytics"
                className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">View Analytics</p>
                  <p className="text-xs text-gray-500">
                    Check platform performance metrices
                  </p>
                </div>
              </Link>

              <Link
                href="/contact"
                className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <UserCheck className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Contact Messages</p>
                  <p className="text-xs text-gray-500">
                    View and respond to user messages
                  </p>
                </div>
              </Link>

              {/* <Link
                href="#"
                className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Manage Bookings</p>
                  <p className="text-xs text-gray-500">
                    View and handle booking issues
                  </p>
                </div>
              </Link> */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
