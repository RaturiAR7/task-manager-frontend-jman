import { User } from "../types/user";
import { apiClient } from "./apiClient";

export const userApi = {
  async getUsers(): Promise<User[]> {
    return apiClient<User[]>("/user/users", {
      method: "GET"
    });
  },

  async getUserById(id: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find((u) => u.id === id);
  }
};
