const API_BASE = "http://localhost:3000/api";

export async function get_orgs() {
    const res = await fetch(`${API_BASE}/orgs/`);

    if (!res.ok) {
        throw new Error("Failed to fetch orgs");
    }

    return res.json();
}
