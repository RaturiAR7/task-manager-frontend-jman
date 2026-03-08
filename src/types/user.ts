export type Role = "admin" | "manager" | "employee";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}