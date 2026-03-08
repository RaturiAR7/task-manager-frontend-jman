"use client";

import { useState } from "react";

interface Props {
  onCreate: (project: { name: string; description: string }) => void;
  onClose: () => void;
}

export default function CreateProjectModal({ onCreate, onClose }: Props) {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name) return;

    onCreate({
      name,
      description,
    });

    setName("");
    setDescription("");
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded w-[400px]">

        <h2 className="text-xl font-semibold mb-4">
          Create Project
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full mb-3 rounded"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full mb-3 rounded"
          />

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}