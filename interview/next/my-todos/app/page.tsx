"use client";
import { useEffect, useState } from "react";
import { type Todo } from "@/types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: input.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos([data, ...todos]);
        setInput("");
      }
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTodo = async (id: number, complete: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complete }),
      });

      if (response.ok) {
        setTodos(
          todos.map((todo) => (todo.id === id ? { ...todo, complete } : todo))
        );
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleEditTodo = async (id: number) => {
    if (!editTitle.trim()) return;

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle.trim() }),
      });

      if (response.ok) {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, title: editTitle.trim() } : todo
          )
        );
        setEditingId(null);
        setEditTitle("");
      }
    } catch (error) {
      console.error("Failed to edit todo:", error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter") {
      handleEditTodo(id);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const completedCount = todos.filter((todo) => todo.complete).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">✨ My Todos</h1>
          <p className="text-gray-600">Stay organized and productive</p>
          {totalCount > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              {completedCount} of {totalCount} completed (
              {Math.round((completedCount / totalCount) * 100)}%)
            </div>
          )}
        </div>

        {/* Add Todo Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={loading}
            />
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                loading || !input.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
              onClick={handleAddTodo}
              disabled={loading || !input.trim()}
            >
              {loading ? "Adding..." : "Add Todo"}
            </button>
          </div>
        </div>

        {/* Todos List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading && todos.length === 0 ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading todos...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">
                No todos yet. Add your first one above!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`p-4 transition-all hover:bg-gray-50 ${
                    todo.complete ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={todo.complete}
                      onChange={() => handleUpdateTodo(todo.id, !todo.complete)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                    />

                    {/* Todo Content */}
                    <div className="flex-1 min-w-0">
                      {editingId === todo.id ? (
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyPress={(e) => handleEditKeyPress(e, todo.id)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`block text-gray-800 transition-all ${
                            todo.complete ? "line-through text-gray-500" : ""
                          }`}
                        >
                          {todo.title}
                        </span>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(todo.createdAt).toLocaleDateString()} at{" "}
                        {new Date(todo.createdAt).toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {editingId === todo.id ? (
                        <>
                          <button
                            onClick={() => handleEditTodo(todo.id)}
                            className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(todo)}
                            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {totalCount > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>✨ Keep going! You're doing great!</p>
            <p>❤️🥰永远爱乡乡</p>
          </div>
        )}
      </div>
    </div>
  );
}
