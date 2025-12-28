import { SPOTIFY_EXPIRES_AT_KEY, SPOTIFY_TOKEN_KEY } from "@/components/constants";
import * as SecureStore from "expo-secure-store";

/**
 * Returns a valid access token or null if expired / missing
 */
export const getValidSpotifyToken = async (): Promise<string | null> => {
    const token = await SecureStore.getItemAsync(SPOTIFY_TOKEN_KEY);
    const expiresAt = await SecureStore.getItemAsync(SPOTIFY_EXPIRES_AT_KEY);

    if (!token || !expiresAt) {
        return null;
    }

    const isExpired = Date.now() > Number(expiresAt);

    if (isExpired) {
        await SecureStore.deleteItemAsync(SPOTIFY_TOKEN_KEY);
        await SecureStore.deleteItemAsync(SPOTIFY_EXPIRES_AT_KEY);
        return null;
    }

    return token;
};
