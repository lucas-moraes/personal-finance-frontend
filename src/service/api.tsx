import { useNavigate } from "@tanstack/react-router";

export const useApi = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  async function ApiFetch({ endpoint, options, token }: { endpoint: string; options: RequestInit; token?: string }) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("authToken");
        navigate({ to: "/login" });
      }
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
    if (!token) {
      return navigate({ to: "/login" });
    }

    await ApiFetch({
      endpoint: "/api/auth/token",
      options: {
        method: "GET",
      },
      token,
    })
      .then((res) => {
        if (res.ok) return navigate({ to: "/app/home" });
      })
      .catch(() => {
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

  const useFilterMovement = async ({ month, year, category }: { month: string; year: string; category: string }) => {
    if (!token) {
      return navigate({ to: "/login" });
    }

    return await ApiFetch({
      endpoint:
        "/api/movement/filter?" +
        `month=${month}` +
        "&" +
        `year=${year} ` +
        (category ? "&" + `category=${category}` : ""),
      options: {
        method: "GET",
      },
      token,
    }).then((res) => res.json());
  };

  const useCategory = async () => {
    if (!token) {
      return navigate({ to: "/login" });
    }

    return await ApiFetch({
      endpoint: "/api/category/get-all",
      options: {
        method: "GET",
      },
      token,
    }).then((res) => res.json());
  };

  const useMonth = async () => {
    if (!token) {
      return navigate({ to: "/login" });
    }

    return await ApiFetch({
      endpoint: "/api/movement/months",
      options: {
        method: "GET",
      },
      token,
    }).then((res) => res.json());
  };

  const useYear = async () => {
    if (!token) {
      return navigate({ to: "/login" });
    }

    return await ApiFetch({
      endpoint: "/api/movement/years",
      options: {
        method: "GET",
      },
      token,
    }).then((res) => res.json());
  };

  const useLogout = async () => {
    if (!token) {
      return navigate({ to: "/login" });
    }
    const resp = await ApiFetch({
      endpoint: "/api/auth/logout",
      options: {
        method: "POST",
      },
      token,
    });
    if (resp.status === 200) {
      localStorage.removeItem("authToken");
      navigate({ to: "/login" });
    }
  };

  return { useLogin, useToken, useHealth, useFilterMovement, useCategory, useMonth, useYear, useLogout };
};
