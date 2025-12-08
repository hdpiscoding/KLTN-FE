export function getUserIdFromToken(token: string): number | null {
    try {
        if (!token) return null;

        const payloadBase64 = token.split(".")[1];
        if (!payloadBase64) return null;

        let base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const pad = base64.length % 4;
        if (pad === 2) base64 += "==";
        else if (pad === 3) base64 += "=";

        const jsonPayload = atob(base64);

        const payload = JSON.parse(jsonPayload);

        if (!payload.user) return null;

        const user = JSON.parse(payload.user);

        return user.userId ?? null;
    } catch {
        return null;
    }
}

export function decodeJwt(token: string) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}
