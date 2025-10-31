import { useNavigate } from "@tanstack/react-router";

export const useApi = () => {
  const navigate = useNavigate();

  async function ApiFetch({ endpoint, options }: { endpoint: string; options: RequestInit }) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("authToken");

    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "API request failed");
    }

    return res;
  }

  const useLogin = async ({ email, password }: { email: string; password: string }) => {
    const resp = await ApiFetch({
      endpoint: "/api/auth/login",
      options: {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    }).then((res) => res.json());

    if (!resp.token) {
      return false;
    }

    localStorage.setItem("authToken", resp.token);

    return true;
  };

  const useToken = async () => {
    await ApiFetch({
      endpoint: "/api/auth/token",
      options: {
        method: "GET",
      },
    })
      .then((res) => {
       if (res.ok) return navigate({ to: "/app/home" });
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        return navigate({ to: "/login" });
      });
  };

  const useHealth = async () => {
    return await ApiFetch({
      endpoint: "/",
      options: {
        method: "GET",
      },
    });
  };

  return { useLogin, useToken, useHealth };
};
