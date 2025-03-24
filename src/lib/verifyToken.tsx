import axios from "axios"

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_DEV}/admin/validate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    )

    // Simple validation - check for successful token validation
    return response.data.success === true
  } catch (error) {
    console.error("Token verification failed:")
    return false
  }
}
