

export const getApplications = async (token) => {
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    const url = `${import.meta.env.VITE_API_URL}/api/applications`;

    const result = await fetch(url, options);
    const data = await result.json();

    if (!result.ok) {
        throw new Error(data.error || "Failed to fetch applications");
    }

    return data;
}
export const createApplication = async (card, token) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(card)
    }
    const url = `${import.meta.env.VITE_API_URL}/api/applications`;

    const result = await fetch(url, options);
    const data = await result.json();

    if (!result.ok) {
        throw new Error(data.error || "Failed to fetch applications");
    }

    return data;
}


export const updateApplication = async (card, token) => {
    const options = {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(card)
    }
    const url = `${import.meta.env.VITE_API_URL}/api/applications/${card.id}`;

    const result = await fetch(url, options);
    const data = await result.json();

    if (!result.ok) {
        throw new Error(data.error || "Failed to fetch applications");
    }

    return data;
}



export const deleteApplication = async (id, token) => {
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    const url = `${import.meta.env.VITE_API_URL}/api/applications/${id}`;

    const result = await fetch(url, options);
    const data = await result.json();

    if (!result.ok) {
        throw new Error(data.error || "Failed to fetch applications");
    }

    return data;
}


export const getStats = async (token) => {
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    const url = `${import.meta.env.VITE_API_URL}/api/applications/stats`;

    const result = await fetch(url, options);
    const data = await result.json();

    if (!result.ok) {
        throw new Error(data.error || "Failed to fetch applications");
    }

    return data;
}


export const getFollowups = async (token) => {
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    const url = `${import.meta.env.VITE_API_URL}/api/applications/followups`;

    const result = await fetch(url, options);
    const data = await result.json();

    if (!result.ok) {
        throw new Error(data.error || "Failed to fetch applications");
    }

    return data;
}