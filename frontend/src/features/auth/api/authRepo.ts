import { getResponseData } from "@/config/function"
import { apiClient } from "@/lib/api-client"

// type MoveRequest = paths["/move"]["post"]["requestBody"]["content"]["application/json"]
// type MoveResponse = paths["/move"]["post"]["responses"]["200"]["content"]["application/json"]


export const authApi = {
  async logout() {
    const response = await apiClient.post("/users/logout")

    return getResponseData(response.data)
  },

}