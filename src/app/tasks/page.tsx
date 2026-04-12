import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

const Tasks = () => {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
      <div>Tasks</div>
    </ProtectedRoute>
  )
}

export default Tasks