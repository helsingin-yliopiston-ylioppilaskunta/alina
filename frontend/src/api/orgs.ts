const API_BASE = "http://localhost:3000/api";

export async function get_orgs() {
    const res = await fetch(`${API_BASE}/orgs/`);

    if (!res.ok) {
        throw new Error("Failed to fetch orgs");
    }

    return res.json();
}

export async function get_orgs_with_allocations(resource_id: number) {
    const res = await fetch(`${API_BASE}/orgs/with-allocations/${resource_id}`);

    if (!res.ok) {
        throw new Error("Failed to fetch orgs");
    }

    return res.json();
}
