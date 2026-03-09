export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee"
};

export type Role = "admin" | "manager" | "employee";

export type LoginFormData = {
  email: "";
  password: "";
  role: Role;
}

export type SignupFormData = {
  email: "";
  password: "";
  confirmPassword: "";
  name: "";
}