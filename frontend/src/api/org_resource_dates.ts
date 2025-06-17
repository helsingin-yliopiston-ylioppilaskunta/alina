const API_BASE = "http://localhost:3000/api";

export async function get_org_resource_dates(resource_id: number) {
    const res = await fetch(`${API_BASE}/resource-dates/${resource_id}`);

    if (!res.ok) {
        throw new Error("Failed to fetch resource-dates");
    }

    return res.json();
}
