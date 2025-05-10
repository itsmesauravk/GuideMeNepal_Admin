// "use client"

// import React, { useEffect, useState, useRef } from "react"
// import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
// import { LatLngExpression, Icon, IconOptions } from "leaflet"
// import "leaflet/dist/leaflet.css"
// import { useSocket } from "@/providers/ClientSocketProvider"
// import { SessionData } from "@/types"
// import { useSession } from "next-auth/react"

// interface GuideLocationData {
//   location: LatLngExpression
//   timestamp: number
//   name: string
// }

// interface GuideLocationsState {
//   [guideId: string]: GuideLocationData
// }

// interface MarkerData {
//   position: LatLngExpression
//   popup: string
//   icon: Icon
// }

// interface LocationUpdate {
//   guideId: string
//   latitude: number
//   longitude: number
//   name?: string
// }

// interface GuideInterface {
//   guideId: string
//   latitude: number
//   longitude: number
//   timestamp: number
//   name?: string
// }

// // Component to recenter map when needed
// const MapController: React.FC<{ center: LatLngExpression }> = ({ center }) => {
//   const map = useMap()

//   useEffect(() => {
//     map.setView(center, map.getZoom())
//   }, [center, map])

//   return null
// }

// const AdminLocationTrack: React.FC = () => {
//   const center: LatLngExpression = [27.7103, 85.3222] // Default center (Kathmandu)
//   const attribution =
//     '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

//   // State to track guide locations
//   const [guideLocations, setGuideLocations] = useState<GuideLocationsState>({})
//   // State to track admin's own location
//   const [adminLocation, setAdminLocation] = useState<LatLngExpression | null>(
//     null
//   )
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null)
//   const [mapCenter, setMapCenter] = useState<LatLngExpression>(center)

//   const { data: sessionData } = useSession()

//   // Get current user data
//   const session = sessionData as unknown as SessionData

//   const { socket } = useSocket()

//   // Custom icons
//   const guideIcon = new Icon({
//     iconUrl: "/location-pin.png",
//     iconSize: [40, 40],
//   } as IconOptions)

//   const selectedGuideIcon = new Icon({
//     iconUrl: "/location-pin.png", // Create this icon for selected guides
//     iconSize: [45, 45],
//   } as IconOptions)

//   const adminIcon = new Icon({
//     iconUrl: "/admin-pin.png",
//     iconSize: [40, 40],
//   } as IconOptions)

//   // Get admin's location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       const watcher: number = navigator.geolocation.watchPosition(
//         (position: GeolocationPosition) => {
//           const { latitude, longitude } = position.coords
//           setAdminLocation([latitude, longitude])
//         },
//         (error: GeolocationPositionError) => {
//           console.error("Error getting admin location:", error)
//         },
//         {
//           enableHighAccuracy: true,
//           maximumAge: 0,
//           timeout: 5000,
//         }
//       )

//       return () => navigator.geolocation.clearWatch(watcher)
//     }
//   }, [])

//   // Update socket with admin role
//   useEffect(() => {
//     if (!socket) return

//     // Set user role in socket query parameters
//     socket.io.opts.query = {
//       ...socket.io.opts.query,
//       userId: session.user.id || "unknown",
//       role: "admin",
//       name: session.user.name || "Admin",
//     }

//     // Reconnect with updated parameters
//     socket.disconnect().connect()
//   }, [socket, session])

//   // Socket connection to receive guide locations
//   useEffect(() => {
//     if (!socket) return

//     setIsLoading(true)

//     // Handle initial locations
//     socket.on("initial-guide-locations", (guides) => {
//       console.log("Received initial guide locations:", guides)
//       const locations: GuideLocationsState = {}

//       guides.forEach((guide: GuideInterface) => {
//         locations[guide.guideId] = {
//           location: [guide.latitude, guide.longitude] as LatLngExpression,
//           timestamp: guide.timestamp,
//           name: guide.name || `Guide ${guide.guideId}`,
//         }
//       })

//       setGuideLocations(locations)
//       setIsLoading(false)
//     })

//     // Listen for guide location updates
//     socket.on("guide-location-update", (data: LocationUpdate) => {
//       const { guideId, latitude, longitude } = data

//       setGuideLocations((prev) => ({
//         ...prev,
//         [guideId]: {
//           location: [latitude, longitude] as LatLngExpression,
//           timestamp: Date.now(),
//           name: data.name || `Guide ${guideId}`,
//         },
//       }))

//       console.log(`Received location from guide ${guideId}:`, data)
//     })

//     // Listen for guide disconnection
//     socket.on("guide-disconnected", (guideId: string) => {
//       console.log(`Guide ${guideId} disconnected`)

//       setGuideLocations((prev) => {
//         const updated = { ...prev }
//         delete updated[guideId]
//         return updated
//       })

//       // If selected guide disconnected, clear selection
//       if (selectedGuideId === guideId) {
//         setSelectedGuideId(null)
//       }
//     })

//     // Request initial guide locations
//     socket.emit("request-guide-locations")

//     return () => {
//       socket.off("initial-guide-locations")
//       socket.off("guide-location-update")
//       socket.off("guide-disconnected")
//     }
//   }, [socket])

//   // Update map center when selection changes
//   useEffect(() => {
//     if (selectedGuideId && guideLocations[selectedGuideId]) {
//       setMapCenter(guideLocations[selectedGuideId].location)
//     } else if (adminLocation) {
//       setMapCenter(adminLocation)
//     } else if (Object.keys(guideLocations).length > 0) {
//       // Use the first guide's location as center
//       const firstGuideId = Object.keys(guideLocations)[0]
//       setMapCenter(guideLocations[firstGuideId].location)
//     }
//   }, [selectedGuideId, guideLocations, adminLocation])

//   // Create markers array from guide locations
//   const getMarkers = (): MarkerData[] => {
//     const markers: MarkerData[] = []

//     // Add admin marker if location is available
//     if (adminLocation) {
//       markers.push({
//         position: adminLocation,
//         popup: "Admin (You)",
//         icon: adminIcon,
//       })
//     }

//     // Add guide markers
//     Object.entries(guideLocations).forEach(([guideId, data]) => {
//       markers.push({
//         position: data.location,
//         popup: `${data.name} (Last updated: ${new Date(
//           data.timestamp
//         ).toLocaleTimeString()})`,
//         icon: guideId === selectedGuideId ? selectedGuideIcon : guideIcon,
//       })
//     })

//     return markers
//   }

//   // Handle guide selection
//   const handleGuideSelect = (guideId: string) => {
//     setSelectedGuideId(guideId)
//   }

//   // Format time since last update
//   const formatTimeSince = (timestamp: number) => {
//     const seconds = Math.floor((Date.now() - timestamp) / 1000)

//     if (seconds < 60) return `${seconds} seconds ago`
//     if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
//     return `${Math.floor(seconds / 3600)} hours ago`
//   }

//   return (
//     <div className="h-full w-full flex flex-col">
//       <div className="p-4 bg-white shadow-md">
//         <h1 className="text-xl font-bold">Guide Location Tracking</h1>
//         <p className="text-gray-600">
//           {Object.keys(guideLocations).length} guides currently active
//         </p>
//       </div>

//       <div className="flex h-full">
//         {/* Guide list */}
//         <div className="w-64 bg-gray-50 border-r overflow-y-auto">
//           <h2 className="p-2 font-semibold text-gray-700 border-b bg-gray-100">
//             Active Guides
//           </h2>

//           {isLoading ? (
//             <div className="p-4 text-center text-gray-500">
//               Loading guides...
//             </div>
//           ) : Object.keys(guideLocations).length === 0 ? (
//             <div className="p-4 text-center text-gray-500">
//               No active guides
//             </div>
//           ) : (
//             <ul>
//               {Object.entries(guideLocations).map(([guideId, data]) => (
//                 <li
//                   key={guideId}
//                   className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
//                     selectedGuideId === guideId
//                       ? "bg-blue-50 border-l-4 border-blue-500"
//                       : ""
//                   }`}
//                   onClick={() => handleGuideSelect(guideId)}
//                 >
//                   <div className="font-medium">{data.name}</div>
//                   <div className="text-xs text-gray-500">
//                     Updated: {formatTimeSince(data.timestamp)}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Map container */}
//         <div className="flex-1 relative">
//           <MapContainer
//             center={mapCenter}
//             zoom={13}
//             style={{ height: "100%", width: "100%" }}
//           >
//             <TileLayer
//               attribution={attribution}
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />

//             <MapController center={mapCenter} />

//             {getMarkers().map((marker, index) => (
//               <Marker key={index} position={marker.position} icon={marker.icon}>
//                 <Popup>{marker.popup}</Popup>
//               </Marker>
//             ))}
//           </MapContainer>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminLocationTrack
