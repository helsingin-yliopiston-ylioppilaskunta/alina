const API_BASE = "http://localhost:3000/api";

export async function get_resources() {
    const res = await fetch(`${API_BASE}/resources/`);

    if (!res.ok) {
        throw new Error("Failed to fetch resources");
    }

    return res.json();
}
