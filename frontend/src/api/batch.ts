const API_BASE = "http://localhost:3000/api";

interface RowObject {
    org_name: string,
    alina_dates: string[],
    sivistys_dates: string[],
    contact_person: string,
    contact_email: string
    contact_phone: string
    event: string
    description: string
    participants: string
    checked: boolean
}

export async function send_batch(data: RowObject[]) {
    const res = await fetch(`${API_BASE}/requests/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error("Failed to submit data");
    }

    return res.json();
}
