"use client"
import { CalendarIcon, MapPinIcon, RefreshCwIcon, UserIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import axios from "axios"

// Define Booking interface
interface User {
  id: number
  slug: string
  fullName: string
  email: string
  profilePicture: string
}

interface Guide {
  id: number
  slug: string
  fullname: string
  email: string
  profilePhoto: string
}

interface Booking {
  id: number
  userId: number
  guideId: number
  destination: string
  contact: string
  startingLocation: string
  accommodation: string
  numberOfAdults: number
  numberOfChildren: number
  estimatedDays: number
  estimatedPrice: number
  startDate: string
  endDate: string
  bookingDate: string
  bookingMessage: string
  cancelMessage: string | null
  bookingType: string | null
  bookingStatus: string
  travelStatus: string
  reviewstatus: boolean
  reportstatus: boolean
  travelLoations: string | null
  platformLiability: boolean
  createdAt: string
  updatedAt: string
  User: User
  Guide: Guide
}

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Get display name for travel status
const getTravelStatusDisplayName = (status: string): string => {
  return status
    .replace("-", " ")
    .replace(/\b\w/g, (l: string) => l.toUpperCase())
}

// Get status color class
const getStatusColorClass = (status: string): string => {
  switch (status) {
    case "on-going":
      return "bg-blue-100 text-blue-800"
    case "not-started":
      return "bg-purple-100 text-purple-800"
    case "guide-completed":
      return "bg-yellow-100 text-yellow-800"
    case "completed":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Booking Card Component
const BookingCard = ({ booking }: { booking: Booking }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {booking.destination.charAt(0).toUpperCase() +
            booking.destination.slice(1)}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColorClass(
            booking.travelStatus
          )}`}
        >
          {getTravelStatusDisplayName(booking.travelStatus)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-gray-700">
            Tourist: {booking.User?.fullName || "N/A"}
          </span>
        </div>
        <div className="flex items-center">
          <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-gray-700">
            Guide: {booking.Guide.fullname || "N/A"}
          </span>
        </div>
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-gray-700">
            Start: {formatDate(booking.startDate)}
          </span>
        </div>
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-gray-700">
            End: {formatDate(booking.endDate)}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="text-sm font-medium text-gray-500">
            Type:{" "}
            {booking.bookingType
              ? booking.bookingType.charAt(0).toUpperCase() +
                booking.bookingType.slice(1)
              : "Standard"}
          </span>
          <p className="text-sm text-gray-500">
            {booking.numberOfAdults} Adults, {booking.numberOfChildren} Children
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary-dark">
            ${booking.estimatedPrice}
          </p>
          <p className="text-sm text-gray-500">{booking.estimatedDays} Days</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button className="w-full bg-primary-dark hover:bg-primary-darker">
          View Details
        </Button>
      </div>
    </div>
  )
}

const BookingsHome = () => {
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGetBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/common/get-all-booking`
      )
      const data = response.data
      if (data.success) {
        setBookings(data.data)
      } else {
        setError(data.message || "Failed to fetch bookings")
        console.error("Failed to fetch bookings:", data.message)
      }
    } catch (error) {
      setError("Error connecting to server")
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter bookings
  const notStartedBookings = bookings.filter(
    (booking) => booking.travelStatus === "not-started"
  )

  const ongoingBookings = bookings.filter(
    (booking) => booking.travelStatus === "on-going"
  )

  const completedBookings = bookings.filter(
    (booking) => booking.travelStatus === "completed"
  )

  useEffect(() => {
    handleGetBookings()
  }, [])

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Details</h1>
          <p className="text-gray-600 mt-2">
            All details about booking and its status
          </p>
        </div>
        {/* Refresh button */}
        <Button
          className="flex items-center gap-2 bg-primary-dark hover:bg-primary-darker"
          onClick={handleGetBookings}
          disabled={loading}
        >
          <RefreshCwIcon
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Ongoing Bookings Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Ongoing Bookings
          </h2>
          <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
            {ongoingBookings.length} Active
          </span>
        </div>

        {ongoingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No ongoing bookings at the moment.</p>
          </div>
        )}
      </div>

      {/* Not Started Bookings Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Upcoming Bookings
          </h2>
          <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium">
            {notStartedBookings.length} Upcoming
          </span>
        </div>

        {notStartedBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notStartedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No upcoming bookings at the moment.</p>
          </div>
        )}
      </div>

      {/* Completed Bookings Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Completed Bookings
          </h2>
          <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium">
            {completedBookings.length} Completed
          </span>
        </div>

        {completedBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No completed bookings yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingsHome
