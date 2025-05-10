"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "../ui/button"
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

// Define TypeScript interfaces
interface Guide {
  fullname: string
  profilePhoto: string
}

interface User {
  fullName: string
  profilePicture: string
}

interface GuideReport {
  id: number
  reason: string
  description: string
  userId: number
  guideId: number
  status: string
  metadata: {
    reportedAt: string
  }
  createdAt: string
  updatedAt: string
  guide: Guide
  user: User
}

interface ApiResponse {
  status: number
  success: boolean
  message: string
  data: {
    reports: GuideReport[]
    totalReports: number
    totalPages: number
    currentPage: number
  }
}

const GuideReports = () => {
  // State variables
  const [reports, setReports] = useState<GuideReport[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [selectedReport, setSelectedReport] = useState<GuideReport | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalReports, setTotalReports] = useState<number>(0)

  // Fetch guide reports on component mount and page change
  useEffect(() => {
    getGuideReports()
  }, [currentPage])

  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Fetch all guide reports
  const getGuideReports = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault()
    }

    try {
      setIsLoading(true)
      const response = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/common/get-all-guides-reports?page=${currentPage}`
      )
      const data = response.data

      if (data.success) {
        setReports(data.data.reports)
        setTotalPages(data.data.totalPages)
        setTotalReports(data.data.totalReports)
        setSuccessMessage("")
        setErrorMessage("")
      } else {
        setErrorMessage(data.message || "Failed to fetch guide reports.")
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while fetching reports."
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Update status of a guide report
  const updateReportStatus = async (id: number, newStatus: string) => {
    try {
      setIsSubmitting(true)
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/common/guides-reports/${id}`,
        { status: newStatus }
      )

      const data = response.data
      if (data.success) {
        // Update local state
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === id ? { ...report, status: newStatus } : report
          )
        )
        setSuccessMessage(`Report status updated to ${newStatus}`)
        setErrorMessage("")
      } else {
        setErrorMessage(data.message || "Failed to update report status.")
        setSuccessMessage("")
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while updating status."
      )
      setSuccessMessage("")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // View report details
  const viewReportDetails = (report: GuideReport) => {
    setSelectedReport(report)
  }

  // Close report details modal
  const closeReportDetails = () => {
    setSelectedReport(null)
  }

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guide Reports</h1>
          <p className="text-gray-600 mt-1">
            Manage client reports about guides
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              setCurrentPage(1)
              getGuideReports()
            }}
            disabled={isLoading}
            className="flex items-center gap-2 bg-primary-dark hover:bg-primary-darker"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Success and Error Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No guide reports found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-500 uppercase tracking-wider">
                    Tourist
                  </th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-500 uppercase tracking-wider">
                    Guide
                  </th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-500 uppercase tracking-wider">
                    Reported At
                  </th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 border-b text-left font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 whitespace-nowrap">{report.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <Image
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover"
                            src={
                              report.user.profilePicture ||
                              "/placeholder-user.png"
                            }
                            alt={report.user.fullName}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {report.user.fullName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <Image
                            className="h-8 w-8 rounded-full object-cover"
                            src={
                              report.guide.profilePhoto ||
                              "/placeholder-guide.png"
                            }
                            alt={report.guide.fullname}
                            width={32}
                            height={32}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {report.guide.fullname}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs overflow-hidden text-ellipsis">
                      {report.reason}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {formatDate(report.metadata.reportedAt)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewReportDetails(report)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          View
                        </button>
                        {report.status !== "resolved" && (
                          <button
                            onClick={() =>
                              updateReportStatus(report.id, "resolved")
                            }
                            disabled={isSubmitting}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {/* <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {reports.length} of {totalReports} reports
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={goToPrevPage}
                disabled={currentPage === 1 || isLoading}
                className="flex items-center gap-1"
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="px-3 py-1 bg-gray-100 rounded">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages || isLoading}
                className="flex items-center gap-1"
                variant="outline"
                size="sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div> */}
        </>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Report Details</h3>
              <button
                onClick={closeReportDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Reported By</p>
                  <div className="flex items-center mt-1">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={
                        selectedReport.user.profilePicture ||
                        "/placeholder-user.png"
                      }
                      alt={selectedReport.user.fullName}
                    />
                    <p className="ml-2 font-semibold">
                      {selectedReport.user.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Guide Reported</p>
                  <div className="flex items-center mt-1">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={
                        selectedReport.guide.profilePhoto ||
                        "/placeholder-guide.png"
                      }
                      alt={selectedReport.guide.fullname}
                    />
                    <p className="ml-2 font-semibold">
                      {selectedReport.guide.fullname}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Report Reason</p>
                <p className="font-semibold">{selectedReport.reason}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date Reported</p>
                <p>{formatDate(selectedReport.metadata.reportedAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    selectedReport.status
                  )}`}
                >
                  {selectedReport.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                  {selectedReport.description}
                </div>
              </div>
              <div className="flex space-x-2 pt-2">
                {selectedReport.status !== "resolved" && (
                  <button
                    onClick={() => {
                      updateReportStatus(selectedReport.id, "resolved")
                      closeReportDetails()
                    }}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Mark as Resolved
                  </button>
                )}
                <button
                  onClick={closeReportDetails}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuideReports
