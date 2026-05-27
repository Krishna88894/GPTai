const getApiBaseUrl = () => {
    const configuredUrl = import.meta.env.VITE_API_URL;
    if (configuredUrl) {
        return configuredUrl.replace(/\/$/, "");
    }

    const { hostname, protocol } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "http://localhost:8080";
    }

    return `${protocol}//${hostname}`;
};

export const apiUrl = (path) => `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
