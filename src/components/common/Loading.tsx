import { Compass } from "lucide-react"

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="flex items-center gap-3 animate-fadeIn">
        <Compass className="w-10 h-10 text-primary-dark animate-spin" />
        <span className="text-3xl font-bold text-gray-800 tracking-wide">
          Guide<span className="text-primary-dark">Me</span>Nepal
        </span>
      </div>
      <p className="mt-4 text-gray-600 text-lg animate-pulse">
        Please wait while we load your experience...
      </p>
    </div>
  )
}

export { Loading }
