"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/src/services/authApi";
import { User } from "@/src/types/user";
import { X, Search, Check } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1629] border border-white/10 rounded-2xl w-full max-w-[480px] shadow-2xl shadow-black/60 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4 border-b border-white/8">
          <div>
            <h2 className="text-lg font-semibold text-white">Create Project</h2>
            <p className="text-xs text-white/40 mt-0.5">Set up a new project and invite your team</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto flex-1 p-5">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Project Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="e.g. Marketing Redesign"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/40"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Description <span className="text-white/30 font-normal">(optional)</span></label>
            <textarea
              placeholder="What's this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/40 resize-none h-20"
              disabled={loading}
            />
          </div>

          {/* Member picker */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/70">Assign Members</label>
              {selectedIds.size > 0 && (
                <span className="text-xs bg-blue-500/15 text-blue-200 border border-blue-500/25 px-2 py-0.5 rounded-full">
                  {selectedIds.size} selected
                </span>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full h-9 rounded-xl border border-white/10 bg-white/5 pl-8 pr-4 text-sm text-white placeholder:text-white/30 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/40"
                disabled={loading}
              />
            </div>

            {/* User list */}
            <div className="border border-white/8 rounded-xl max-h-44 overflow-y-auto bg-white/3">
              {usersLoading ? (
                <div className="text-sm text-white/30 p-4 text-center">Loading users…</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-sm text-white/30 p-4 text-center">No users found.</div>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedIds.has(user.id);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleMember(user.id)}
                      disabled={loading}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-all hover:bg-white/5 ${
                        isSelected ? "bg-blue-500/10" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                          isSelected
                            ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </span>

                      <span className="flex-1 min-w-0">
                        <span className="block font-medium text-white/90 truncate">{user.name}</span>
                        <span className="block text-white/40 text-xs truncate">{user.email}</span>
                      </span>

                      {isSelected && (
                        <Check size={14} className="text-blue-400 shrink-0" />
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
              className="px-4 py-2 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5 hover:text-white transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="glow-btn px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
