const API_BASE = "http://localhost:3000/api";

export async function get_dates() {
    const res = await fetch(`${API_BASE}/dates/`);

    if (!res.ok) {
        throw new Error("Failed to fetch dates");
    }

    return res.json();
}

export async function patch_dates(dates: Date[]) {
    for (const date of dates) {
        try {
            const response = await fetch(`${API_BASE}/dates/${date.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(date)
            });

            if (!response.ok) {
                console.error(`Failed to update date ${date.id}`);
            }
        } catch (error) {
            console.error(`Error updating date ${date.id}`, error);
        }
    }
}
