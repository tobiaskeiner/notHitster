import { SPOTIFY_EXPIRES_AT_KEY, SPOTIFY_TOKEN_KEY } from "@/components/constants";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { maybeCompleteAuthSession } from "expo-web-browser";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        alignItems: "center",
    },
});

const Login = () => {
    maybeCompleteAuthSession();

    const [accessToken, setAccessToken] = useState<string | null>(null);

    const redirectUri = AuthSession.makeRedirectUri();
    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: "0a3ab371d02142c29138f5f418ac8873",
            scopes: [
                "playlist-read-private",
                "playlist-read-collaborative",
                "playlist-modify-public",
                "playlist-modify-private",
            ],
            redirectUri,
            responseType: AuthSession.ResponseType.Code,
            usePKCE: true,
        },
        {
            authorizationEndpoint: "https://accounts.spotify.com/authorize",
            tokenEndpoint: "https://accounts.spotify.com/api/token",
        },
    );

    useEffect(() => {
        const loadToken = async () => {
            const storedToken = await SecureStore.getItemAsync(SPOTIFY_TOKEN_KEY);
            if (storedToken) {
                setAccessToken(storedToken);
            }
        };

        loadToken();
    }, []);

    useEffect(() => {
        if (accessToken) {
            router.replace("/selectPlaylist");
        }
    }, [accessToken]);

    useEffect(() => {
        if (response?.type === "success") {
            const exchangeToken = async () => {
                try {
                    const tokenResponse = await AuthSession.exchangeCodeAsync(
                        {
                            clientId: "0a3ab371d02142c29138f5f418ac8873",
                            code: response.params.code,
                            redirectUri,
                            extraParams: {
                                code_verifier: request?.codeVerifier!,
                            },
                        },
                        {
                            tokenEndpoint: "https://accounts.spotify.com/api/token",
                        },
                    );

                    const expiresAt = Date.now() + (tokenResponse.expiresIn ?? 0) * 1000;
                    const token = tokenResponse.accessToken;

                    if (token) {
                        await SecureStore.setItemAsync(SPOTIFY_TOKEN_KEY, token);
                        setAccessToken(token);
                    }
                    if (expiresAt) {
                        await SecureStore.setItemAsync(SPOTIFY_EXPIRES_AT_KEY, expiresAt.toString());
                    }
                } catch (error) {
                    console.error("Spotify token exchange failed", error);
                }
            };

            exchangeToken();
        }
    }, [response, redirectUri, request?.codeVerifier]);

    const logout = async () => {
        await SecureStore.deleteItemAsync(SPOTIFY_TOKEN_KEY);
        setAccessToken(null);
    };

    return (
        <View style={styles.container}>
            {accessToken ? (
                <>
                    <Text>✅ Logged in to Spotify</Text>
                    <Button title="Logout" onPress={logout} />
                </>
            ) : (
                <Button title="Login with Spotify" onPress={() => promptAsync()} disabled={!request} />
            )}
        </View>
    );
};
export default Login;
