
export const setTeamskjermTokenCookie = (value: string): void => {
    const date = new Date();
    date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `teamskjermtoken=${value}; ${expires}; path=/`;
};

export const clearTeamskjermTokenCookie = (): void => {
    const date = new Date();
    date.setTime(date.getTime());
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `teamskjermtoken=""; ${expires}; path=/`;
};

export const teamskjermTokenCookie = (): string | null => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === "teamskjermtoken") {
            return decodeURIComponent(value); // Dekodér verdien
        }
    }
    return null;
};
