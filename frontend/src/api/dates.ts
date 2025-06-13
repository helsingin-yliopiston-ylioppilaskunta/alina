const API_BASE = "http://localhost:3000/api";

export async function get_dates() {
    const res = await fetch(`${API_BASE}/dates/`);

    if (!res.ok) {
        throw new Error("Failed to fetch dates");
    }

    return res.json();
}
