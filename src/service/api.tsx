export const useApi = () => {
  async function ApiFetch({ endpoint, options }: { endpoint: string; options: RequestInit }) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("authToken");

    const res = await fetch(`${baseUrl}/${endpoint}`, {
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

    return res.json();
  }

  const useLogin = async (username: string, password: string) => {
    return await ApiFetch({
      endpoint: "/auth/login",
      options: {
        method: "POST",
        body: JSON.stringify({ username, password }),
      },
    });
  };

  return { useLogin };
};
