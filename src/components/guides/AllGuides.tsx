"use client"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import {
  Ban,
  CheckCircle,
  ChevronRight,
  Clock,
  Languages,
  Mail,
  MapPin,
  PauseIcon,
  Phone,
  RefreshCwIcon,
  User,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { GuideType } from "@/types"
import Image from "next/image"
import { Loading } from "../common/Loading"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

const AllGuides = () => {
  const [guides, setGuides] = useState<GuideType[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("DESC")
  const [fields, setFields] = useState("")

  const router = useRouter()

  const fetchGuides = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/view-guides`,
        {
          params: {
            page: currentPage,
            limit,
            search,
            sortBy,
            sortOrder,
            fields,
          },

          withCredentials: true,
        }
      )
      const data = response.data
      if (data.success) {
        setGuides(data.data.guides)
      }
    } catch (error) {
      console.error("Fetching guides failed:", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchGuides()
  }, [currentPage, limit, sortBy, sortOrder, fields])

  //debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchGuides()
    }, 1000)
    return () => clearTimeout(timeout)
  }, [search])

  const handleSuspendAndUnblock = async (guideId: number, action: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/guide-suspension`,
        {
          guideId,
          action,
        }
      )
      const data = response.data
      if (data.success) {
        toast.success(data.message || "Action performed successfully")
        fetchGuides()
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Action failed")
      console.error("Suspending guide failed:", error)
    }
  }

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Registered Guides
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and review guide registration applications
          </p>
        </div>
        {/* //refresh button  */}
        <Button
          onClick={() => fetchGuides()}
          className="flex items-center gap-2 bg-primary-dark hover:bg-primary-darker"
        >
          <RefreshCwIcon
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
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

      {/* guide List */}

      {loading && <Loading />}
      {!loading && guides.length === 0 && (
        <div className="text-center text-gray-500 mt-10 text-2xl">
          No guides found
        </div>
      )}

      {guides.length > 0 && (
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {guides.map((guide) => (
                <tr key={guide.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex-shrink-0">
                        {guide.profilePhoto ? (
                          <Image
                            src={guide.profilePhoto}
                            alt={guide.fullname || "Profile Photo"}
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
                          {guide.fullname}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {guide.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800}`}
                    >
                      VERIFIED
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {guide.lastActiveAt ? (
                        <span>
                          {new Date(guide.lastActiveAt).toLocaleString()} (
                          <span>
                            {formatDistanceToNow(new Date(guide.lastActiveAt), {
                              addSuffix: true,
                            })}
                          </span>
                          )
                        </span>
                      ) : (
                        <span>Not Available</span>
                      )}
                    </div>
                  </td>
                  <td className="flex items-center justify-center px-6 py-4 whitespace-nowrap text-sm font-medium  ">
                    {guide.securityMetadata.isSuspended ? (
                      <Button
                        onClick={() =>
                          handleSuspendAndUnblock(guide.id, "active")
                        }
                        className="bg-green-600 hover:bg-green-700 text-white mr-2"
                      >
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <p className="text-white">Unblock</p>
                        </>
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          handleSuspendAndUnblock(guide.id, "suspended")
                        }
                        className="bg-red-600 hover:bg-red-700 text-white mr-2"
                      >
                        <>
                          <Ban className="w-4 h-4 mr-1" />
                          <p className="text-white">Suspend</p>
                        </>
                      </Button>
                    )}
                    <Button
                      onClick={() => router.push(`/guides/${guide.id}`)}
                      className="bg-primary-dark hover:bg-primary-darker"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AllGuides
