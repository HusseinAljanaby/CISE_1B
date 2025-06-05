"use client";

import { useEffect, useState } from "react";
import formStyles from "@/styles/Form.module.scss";
import resultsStyles from "@/styles/Results.module.scss";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function ArticlesPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      router.push("/");
      return;
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  async function setUserRole(id: string, role: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/set-role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: id,
            new_role: role,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to set role");
      }
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set role");
    }
  }

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={formStyles.formWrapper}>
      <h1 style={{ fontSize: "2rem" }}>List of Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className={resultsStyles.resultsTable}>
          {users.map((user) => (
            <div
              key={user._id}
              className="border p-4 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
              <div className="text-sm text-gray-600 mb-2">
                Email: {user.email}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Role: {user.role}
              </div>
              <div className="justify-between items-center border rounded p-1 bg-gray-100 flex w-1/2">
                <button
                  className={`border rounded ${
                    user.role === "USER"
                      ? "bg-blue-300 text-gray-500"
                      : "bg-blue-400 cursor-pointer"
                  }`}
                  disabled={user.role === "USER"}
                  onClick={() => setUserRole(user._id, "USER")}
                >
                  Set as user
                </button>
                <button
                  className={`border rounded ${
                    user.role === "MODERATOR"
                      ? "bg-blue-300 text-gray-500"
                      : "bg-blue-400 cursor-pointer"
                  }`}
                  disabled={user.role === "MODERATOR"}
                  onClick={() => setUserRole(user._id, "MODERATOR")}
                >
                  Set as moderator
                </button>
                <button
                  className={`border rounded ${
                    user.role === "ANALYST"
                      ? "bg-blue-300 text-gray-500"
                      : "bg-blue-400 cursor-pointer"
                  }`}
                  disabled={user.role === "ANALYST"}
                  onClick={() => setUserRole(user._id, "ANALYST")}
                >
                  Set as analyst
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
