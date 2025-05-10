"use client"
import React, { useEffect, useState } from "react"
import UserGrowthChart from "./UserGrothChart"
import GuideGrowthChart from "./GuideGrowthChart"
import BookingCountChart from "./BookingCountChart"
import axios from "axios"
import { useSession } from "next-auth/react"
import {
  RefreshCw,
  Calendar,
  TrendingUp,
  Users,
  MapPin,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserGrowth {
  data: {
    month: string
    users: number
  }[]
  growthPercentage: string
}

interface GuideGrowth {
  data: {
    month: string
    users: number
  }[]
  growthPercentage: string
}

interface BookingGrowth {
  data: {
    month: string
    bookings: number
  }[]
  growthPercentage: string
}

const AnalyticsHome = () => {
  const [userGrowth, setUserGrowth] = useState<UserGrowth>({
    data: [
      { month: "January", users: 0 },
      { month: "February", users: 0 },
      { month: "March", users: 0 },
      { month: "April", users: 0 },
      { month: "May", users: 0 },
      { month: "June", users: 0 },
    ],
    growthPercentage: "0",
  })

  const [guideGrowth, setGuideGrowth] = useState<GuideGrowth>({
    data: [
      { month: "January", users: 0 },
      { month: "February", users: 0 },
      { month: "March", users: 0 },
      { month: "April", users: 0 },
      { month: "May", users: 0 },
      { month: "June", users: 0 },
    ],
    growthPercentage: "0",
  })

  const [bookingGrowth, setBookingGrowth] = useState({
    data: [
      { month: "January", bookings: 0 },
      { month: "February", bookings: 0 },
      { month: "March", bookings: 0 },
      { month: "April", bookings: 0 },
      { month: "May", bookings: 0 },
      { month: "June", bookings: 0 },
    ],
    growthPercentage: "0",
  })

  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())
  const { data: session } = useSession()
  const user = session?.user

  // Generate available years (current year and 5 previous years)
  const availableYears = Array.from(
    { length: 6 },
    (_, i) => new Date().getFullYear() - i
  )

  const getTotalUsers = () => {
    return userGrowth.data.reduce((sum, item) => sum + item.users, 0)
  }

  const getTotalGuides = () => {
    return guideGrowth.data.reduce((sum, item) => sum + item.users, 0)
  }

  const getTotalBookings = () => {
    return bookingGrowth.data.reduce((sum, item) => sum + item.bookings, 0)
  }

  const getAnalytics = async (selectedYear = year) => {
    try {
      setLoading(true)

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/analytics?year=${selectedYear}`
      )
      const data = response.data
      if (data.success) {
        setUserGrowth(data.data.userGrowth)
        setGuideGrowth(data.data.guideGrowth)
        setBookingGrowth(data.data.bookingGrowth)
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    getAnalytics()
  }, [user])

  const handleYearChange = (value: string) => {
    const selectedYear = parseInt(value)
    setYear(selectedYear)
    getAnalytics(selectedYear)
  }

  return (
    <div className="p-6 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">
            Monitor platform performance and growth metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <Select value={year.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => getAnalytics()}
            className="flex items-center gap-2 bg-primary-dark hover:bg-primary-darker"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <UserGrowthChart
          data={userGrowth.data}
          growthPercentage={userGrowth.growthPercentage || "0"}
          isLoading={loading}
          currentYear={year}
        />

        <GuideGrowthChart
          data={guideGrowth.data}
          growthPercentage={guideGrowth.growthPercentage || "0"}
          isLoading={loading}
          currentYear={year}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 ">
        <BookingCountChart
          data={bookingGrowth.data}
          growthPercentage={bookingGrowth.growthPercentage || "0"}
          isLoading={loading}
          currentYear={year}
        />
      </div>
    </div>
  )
}

export default AnalyticsHome
