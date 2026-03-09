import { users } from "../mocks/users";
import { User } from "../types/user";

export const userApi = {
  async getUsers(): Promise<User[]> {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Strip out passwords when returning users
        const safeUsers = users.map(({ password, ...user }) => user);
        resolve(safeUsers);
      }, 300);
    });
  },

  async getUserById(id: string): Promise<User | undefined> {
    const user = users.find((u) => u.id === id);
    if (!user) return undefined;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }
};
