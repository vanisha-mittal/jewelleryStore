const API_URL =
    import.meta.env.VITE_API_URL || "";

export const getImageUrl = (img) => {

    if (!img) {
        return "";
    }

    if (
        img.startsWith("http://") ||
        img.startsWith("https://")
    ) {
        return img;
    }

    return `${API_URL}${img}`;
};
const api = async (url, options = {}) => {
    const response = await fetch(`${API_URL}${url}`, {
        credentials: "include",
        ...options,
        headers: {
            ...(options.body instanceof FormData
                ? {}
                : { "Content-Type": "application/json" }),
            ...(options.headers || {})
        }
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        throw new Error(
            typeof data === "object" && data?.message
                ? data.message
                : "Something went wrong."
        );
    }

    return data;
};

export const authApi = {
    me: () => api("/api/auth/me"),
    login: (payload) => api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
    }),
    register: (payload) => api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
    }),
    logout: () => api("/api/auth/logout", { method: "POST" })
};

export const productApi = {

    all: () =>
        api("/api/products"),

    mine: () =>
        api("/api/products/mine"),

    one: (id) =>
        api(`/api/products/${id}`),

    create: (payload) =>
        api("/api/products", {
            method: "POST",
            body: JSON.stringify(payload)
        }),

    update: (id, payload) =>
        api(`/api/products/${id}`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        }),

    remove: (id) =>
        api(`/api/products/${id}`, {
            method: "DELETE"
        })

};
export const cartApi = {
    get: () => api("/api/cart"),
    add: (productId) => api(`/api/cart/${productId}`, { method: "POST" }),
    remove: (productId) => api(`/api/cart/${productId}`, { method: "DELETE" })
};

export const wishlistApi = {
    get: () => api("/api/wishlist"),
    toggle: (productId) => api(`/api/product/${productId}/like`, {
        method: "POST"
    })
};

export const reviewApi = {
    create: (productId, payload) => api(`/api/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify(payload)
    })
};
