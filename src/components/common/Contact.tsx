"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "../ui/button"
import { RefreshCw } from "lucide-react"

// Define TypeScript interfaces
interface ContactMessage {
  id: number
  fullname: string
  email: string
  message: string
  status: string
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  status: number
  success: boolean
  message: string
  data: ContactMessage[]
}

const Contact = () => {
  // State variables
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formData, setFormData] = useState({})

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  )

  // Fetch contact messages on component mount
  useEffect(() => {
    getContactMessages()
  }, [])

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

  // Fetch all contact messages
  const getContactMessages = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault()
    }

    try {
      setIsLoading(true)
      const response = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/client/contact`
      )
      const data = response.data

      if (data.success) {
        setContactMessages(data.data)
        setSuccessMessage("")
        setErrorMessage("")
      } else {
        setErrorMessage(data.message || "Failed to fetch contact messages.")
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while fetching messages."
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Update status of a contact message
  const updateMessageStatus = async (id: number, newStatus: string) => {
    try {
      setIsSubmitting(true)
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/client/contact/${id}`,
        { status: newStatus }
      )

      const data = response.data
      if (data.success) {
        // Update local state
        setContactMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === id ? { ...message, status: newStatus } : message
          )
        )
        setSuccessMessage(`Message status updated to ${newStatus}`)
        setErrorMessage("")
      } else {
        setErrorMessage(data.message || "Failed to update message status.")
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
      case "in progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // View message details
  const viewMessageDetails = (message: ContactMessage) => {
    setSelectedMessage(message)
  }

  // Close message details modal
  const closeMessageDetails = () => {
    setSelectedMessage(null)
  }

  return (
    <div className="p-6 ">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => getContactMessages()}
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
          <p className="mt-2 text-gray-600">Loading messages...</p>
        </div>
      ) : contactMessages.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No contact messages found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b text-left font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 border-b text-left font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-4 border-b text-left font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 border-b text-left font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
              {contactMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 whitespace-nowrap">{message.id}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {message.fullname}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {message.email}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {formatDate(message.createdAt)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        message.status
                      )}`}
                    >
                      {message.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewMessageDetails(message)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        View
                      </button>
                      {message.status !== "resolved" && (
                        <button
                          onClick={() =>
                            updateMessageStatus(message.id, "resolved")
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
      )}

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Message Details</h3>
              <button
                onClick={closeMessageDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-semibold">{selectedMessage.fullname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{selectedMessage.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p>{formatDate(selectedMessage.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    selectedMessage.status
                  )}`}
                >
                  {selectedMessage.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Message</p>
                <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                  {selectedMessage.message}
                </div>
              </div>
              <div className="flex space-x-2 pt-2">
                {selectedMessage.status !== "resolved" && (
                  <button
                    onClick={() => {
                      updateMessageStatus(selectedMessage.id, "resolved")
                      closeMessageDetails()
                    }}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Mark as Resolved
                  </button>
                )}
                <button
                  onClick={closeMessageDetails}
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

export default Contact
