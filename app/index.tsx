import { SPOTIFY_EXPIRES_AT_KEY, SPOTIFY_TOKEN_KEY } from "@/components/constants";
import { Button, Text } from "@react-native-material/core";
import * as AuthSession from "expo-auth-session";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { maybeCompleteAuthSession } from "expo-web-browser";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loginButton: {
        padding: 15,
    }
});

const Index = () => {
    maybeCompleteAuthSession();

    const [accessToken, setAccessToken] = useState<string | null>(null);

    const redirectUri = AuthSession.makeRedirectUri({
        scheme: "nothitster",
        path: "auth",
    });
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
        <>
            <Stack.Screen options={{ title: "Select Playlist" }} />
            <View style={styles.container}>
                {accessToken ? (
                    <>
                        <Text>✅ Logged in to Spotify</Text>
                        <Button title="Logout" onPress={logout} />
                    </>
                ) : (
                    <Button style={styles.loginButton} title="Login with Spotify" onPress={() => promptAsync()} disabled={!request} />
                )}
            </View>
        </>
    );
};
export default Index;
