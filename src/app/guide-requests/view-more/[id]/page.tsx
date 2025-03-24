"use client"
import ViewRequest from "@/components/guides/requests/ViewRequest"
import { useParams } from "next/navigation"
import React from "react"

const page = () => {
  const router = useParams()
  const { id } = router
  const idProp = Array.isArray(id) ? id[0] : id || ""

  return (
    <div className="w-full">
      <ViewRequest id={idProp} />
    </div>
  )
}

export default page
