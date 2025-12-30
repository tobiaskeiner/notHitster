import { SPOTIFY_EXPIRES_AT_KEY, SPOTIFY_TOKEN_KEY } from "@/components/constants";
import { deleteItem, getItem } from "./store-helper";

/**
 * Returns a valid access token or null if expired / missing
 */
export const getValidSpotifyToken = async (): Promise<string | null> => {
    const token = await getItem(SPOTIFY_TOKEN_KEY);
    const expiresAt = await getItem(SPOTIFY_EXPIRES_AT_KEY);

    if (!token || !expiresAt) {
        return null;
    }

    const isExpired = Date.now() > Number(expiresAt);

    if (isExpired) {
        await deleteItem(SPOTIFY_TOKEN_KEY);
        await deleteItem(SPOTIFY_EXPIRES_AT_KEY);
        return null;
    }

    return token;
};
