import { User } from "../types/user";

export const users: (User & { password: string })[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@test.com",
    password: "123456",
    role: "ADMIN"
  },
  {
    id: "2",
    name: "Manager",
    email: "manager@test.com",
    password: "123456",
    role: "MANAGER"
  },
  {
    id: "3",
    name: "Employee",
    email: "employee@test.com",
    password: "123456",
    role: "EMPLOYEE"
  }
];