"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import { Loader2Icon, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loading } from "@/components/common/Loading"

// Define the type for the guide data
interface Guide {
  id: number
  fullname: string
  email: string
  contact: string
  verified: boolean
  registrationStatus: string
  firstTimeLogin: boolean
  guideType: string[]
  languageSpeak: string[]
  profilePhoto: string | null
  liscensePhoto: string | null
  certificationPhoto: string | null
  guidingAreas: string[]
  selfVideo: string | null
  aboutMe: string
  experiences: string[]
  gallery: string[] | null
  securityMetadata: {
    isSuspended: boolean
    lastPassword: string | null
    wrongPasswordCounter: number
  }
  availability: {
    isActivate: boolean
    isAvailable: boolean
  }
  createdAt: string
  updatedAt: string
}

const ViewRequest = ({ id }: { id: string }) => {
  const [details, setDetails] = useState<Guide | null>(null)

  //loadings
  const [loading, setLoading] = useState(false)
  const [acceptLoading, setAcceptLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)

  const router = useRouter()
  // Fetch guide details
  const handleGetDetails = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/guide/get-single-request/${id}`
      )
      const data = response.data

      if (data.success) {
        setDetails(data.data) // Assuming the guide data is in `data.data`
      } else {
        console.error(data.message)
      }
    } catch (error) {
      console.error("Error fetching guide details:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle accept action
  const handleRequestAction = async (action: string) => {
    try {
      if (action === "accept") {
        setAcceptLoading(true)
      } else {
        setRejectLoading(true)
      }
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/verify-request/${id}`,
        { action }
      )
      const data = response.data
      if (data.success) {
        toast.success(data.message || "Guide request accepted successfully!")
        router.push("/guides") // Redirect to guide  page
      } else {
        console.error(data.message || "Error performing action")
        toast.error(data.message || "Error performing action")
      }
    } catch (error: any) {
      console.error("Error performing action:", error)
      toast.error(error.response.data.message || "Error performing action")
    } finally {
      setAcceptLoading(false)
      setRejectLoading(false)
    }
  }

  useEffect(() => {
    handleGetDetails()
  }, [id])

  if (!details || loading) {
    return <Loading />
  }

  return (
    <div className="p-8  min-h-screen">
      <div className=" mx-auto p-8">
        {/* Profile Section */}
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            {details.profilePhoto ? (
              <Image
                src={details.profilePhoto}
                alt={details.fullname || "Profile Photo"}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <User className="w-8 h-8 text-purple-800" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {details.fullname}
            </h1>
            <p className="text-sm text-gray-500">{details.email}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Contact Information
              </h2>
              <p className="text-gray-600">Phone: {details.contact}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Guide Type
              </h2>
              <p className="text-gray-600">{details.guideType.join(", ")}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Languages Spoken
              </h2>
              <p className="text-gray-600">
                {details.languageSpeak.join(", ")}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">About Me</h2>
              <p className="text-gray-600">{details.aboutMe}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Guiding Areas
              </h2>
              <p className="text-gray-600">{details.guidingAreas.join(", ")}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Experiences
              </h2>
              <p className="text-gray-600">{details.experiences.join(", ")}</p>
            </div>

            {/* License and Certification Photos */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                License Photo
              </h2>
              {details.liscensePhoto ? (
                <Image
                  src={details.liscensePhoto}
                  alt="License Photo"
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              ) : (
                <p className="text-gray-500">No license photo uploaded.</p>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Certification Photo
              </h2>
              {details.certificationPhoto ? (
                <Image
                  src={details.certificationPhoto}
                  alt="Certification Photo"
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              ) : (
                <p className="text-gray-500">
                  No certification photo uploaded.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Self Video Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800">
            Self Introduction Video
          </h2>
          {details.selfVideo ? (
            <video controls className="w- h-96 rounded-lg mt-4">
              <source src={details.selfVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p className="text-gray-500">
              No self-introduction video uploaded.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            disabled={acceptLoading || rejectLoading}
            onClick={() => handleRequestAction("accept")}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          >
            {acceptLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2Icon className="w-6 h-6 animate-spin" />
                <span className="ml-2">Accepting...</span>
              </div>
            ) : (
              <p>Accept</p>
            )}
          </button>
          <button
            disabled={acceptLoading || rejectLoading}
            onClick={() => handleRequestAction("reject")}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            {rejectLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2Icon className="w-6 h-6 animate-spin" />
                <span className="ml-2">Rejecting...</span>
              </div>
            ) : (
              <p>Reject</p>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewRequest
