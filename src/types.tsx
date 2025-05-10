export interface RequestTypes {
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

export interface GuideType {
  id: number
  slug: string
  fullname: string
  email: string
  contact: string
  verified: boolean
  registrationStatus: string
  firstTimeLogin: boolean
  guideType: string[] // GuideType as an array of strings
  languageSpeak: string[]
  profilePhoto: string
  licensePhoto: string
  certificationPhoto: string | null
  guidingAreas: string[]
  selfVideo: string
  aboutMe: string
  experiences: string[]
  gallery: string | null
  securityMetadata: {
    isSuspended: boolean
    lastPassword: string | null
    wrongPasswordCounter: number
  }
  availability: {
    isActivate: boolean
    isAvailable: boolean
  }
  lastActiveAt: string
  createdAt: string
  updatedAt: string
}

export interface UserType {
  id: number
  fullName: string
  slug: string
  email: string
  profilePicture: string
  password: string
  contact?: string | null
  authMethod: "email" | "google" | "facebook"
  verified: boolean
  otpCode?: number | null
  otpExpiresAt?: Date | null
  refreshToken?: string | null
  lastActiveAt?: Date | null
  isSuspended: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface SessionData {
  jwt?: string
  user: {
    id: string
    email: string
    name: string
    role: string
    image: string
    firstTimeLogin?: boolean
  }
}
