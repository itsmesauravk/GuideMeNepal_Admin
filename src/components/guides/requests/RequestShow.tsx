"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Trash2,
  Filter,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Languages,
  CheckCircle2,
  XCircle,
  ChevronRight,
  SortAsc,
  HistoryIcon,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDistanceToNow } from "date-fns"
import axios from "axios"
import Image from "next/image"

interface RequestTypes {
  id: number
  fullname: string
  email: string
  contact: string
  registrationStatus: "pending" | "approved" | "rejected"
  createdAt: string
  profilePhoto: string
  guidingAreas: string[]
  languageSpeak: string[]
}

const RegistrationRequests = () => {
  const router = useRouter()
  const [requests, setRequests] = useState<RequestTypes[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [search, setSearch] = useState("")

  // ✅ Function to get status colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "registred":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRequests = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/registration-request`
      )
      if (response.data.success) {
        setRequests(response.data.data)
      } else {
        console.log("Error:", response.data.message)
      }
    } catch (error) {
      console.log("Error fetching data:", error)
    }
  }

  useEffect(() => {
    getRequests()
  }, [])

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Guide Registration Requests
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and review guide registration applications
          </p>
        </div>
        <Button
          onClick={() => router.push("/guide-requests/history")}
          className="flex items-center gap-2"
        >
          <HistoryIcon className="w-4 h-4" />
          History
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex-shrink-0">
                      {request.profilePhoto ? (
                        <Image
                          src={request.profilePhoto}
                          alt={request.fullname || "Profile Photo"}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-800" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {request.fullname}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.contact}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      request.registrationStatus
                    )}`}
                  >
                    {request.registrationStatus.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>
                      {formatDistanceToNow(new Date(request.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    onClick={() =>
                      router.push(`/guide-requests/view-more/${request.id}`)
                    }
                    className="flex items-center gap-2"
                  >
                    See Details
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RegistrationRequests
