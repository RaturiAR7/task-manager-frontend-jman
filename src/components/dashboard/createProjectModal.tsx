"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/src/services/authApi";
import { User } from "@/src/types/user";

interface Props {
  onCreate: (project: {
    name: string;
    description: string;
    memberIds: string[];
  }) => Promise<void> | void;
  onClose: () => void;
}

export default function CreateProjectModal({ onCreate, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [userSearch, setUserSearch] = useState("");
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await authApi.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setUsersLoading(false);
      }
    }
    fetchUsers();
  }, []);

  function toggleMember(userId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onCreate({
        name: name.trim(),
        description: description.trim(),
        memberIds: Array.from(selectedIds),
      });
      setName("");
      setDescription("");
      setSelectedIds(new Set());
    } catch (err) {
      console.error("Failed to create project:", err);
      setError("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[460px] shadow-xl max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-[#778873]">
          Create Project
        </h2>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 overflow-y-auto flex-1"
        >
          {/* Name */}
          <input
            type="text"
            placeholder="Project name *"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            className="border border-[#D2DCB6] p-2 w-full rounded focus:outline-none focus:border-[#778873]"
            disabled={loading}
          />

          {/* Description */}
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-[#D2DCB6] p-2 w-full rounded focus:outline-none focus:border-[#778873] resize-none h-20"
            disabled={loading}
          />

          {/* Member picker */}
          <div>
            <p className="text-sm font-medium text-[#778873] mb-1">
              Assign Members{" "}
              {selectedIds.size > 0 && (
                <span className="text-xs bg-[#A1BC98]/30 text-[#4A5D23] px-2 py-0.5 rounded-full ml-1">
                  {selectedIds.size} selected
                </span>
              )}
            </p>

            <input
              type="text"
              placeholder="Search by name or email…"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="border border-[#D2DCB6] p-2 w-full rounded focus:outline-none focus:border-[#778873] text-sm mb-2"
              disabled={loading}
            />

            <div className="border border-[#D2DCB6] rounded max-h-44 overflow-y-auto">
              {usersLoading ? (
                <p className="text-sm text-[#778873]/60 p-3 text-center">
                  Loading users…
                </p>
              ) : filteredUsers.length === 0 ? (
                <p className="text-sm text-[#778873]/60 p-3 text-center">
                  No users found.
                </p>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedIds.has(user.id);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleMember(user.id)}
                      disabled={loading}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-[#F1F3E0] ${
                        isSelected ? "bg-[#A1BC98]/20" : ""
                      }`}
                    >
                      {/* Avatar circle */}
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? "bg-[#778873] text-white"
                            : "bg-[#D2DCB6] text-[#778873]"
                        }`}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </span>

                      <span className="flex-1 min-w-0">
                        <span className="block font-medium text-[#4A5D23] truncate">
                          {user.name}
                        </span>
                        <span className="block text-[#778873]/70 truncate">
                          {user.email}
                        </span>
                      </span>

                      {/* Checkmark */}
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-[#778873] shrink-0"
                          fill="none"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-2 border border-[#D2DCB6] text-[#778873] rounded hover:bg-[#F1F3E0] transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#778873] hover:bg-[#A1BC98] text-white px-4 py-2 rounded transition disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
