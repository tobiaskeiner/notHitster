import { SPOTIFY_EXPIRES_AT_KEY, SPOTIFY_TOKEN_KEY } from "@/components/constants";
import * as AuthSession from "expo-auth-session";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        margin: 20,
        flex: 1,
        justifyContent: "center",
        gap: 20,
    },
    logo: {
        fontFamily: "JosefinSans_700Bold",
        fontSize: 70,
    },
    loginPressable: {
        backgroundColor: "#3F9AAE",
        alignSelf: "flex-start",
        borderRadius: 30,
    },
    loginText: {
        color: "white",
        fontFamily: "JosefinSans_500Medium",
        fontSize: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    logoutPressable: {
        backgroundColor: "#FFE2AF",
        alignSelf: "flex-start",
        borderRadius: 30,
    },
    logoutText: {
        color: "black",
        fontFamily: "JosefinSans_500Medium",
        fontSize: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});

const Index = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const redirectUri =
        Platform.OS === "web"
            ? "https://tobiaskeiner.github.io/notHitster/spotify-auth"
            : AuthSession.makeRedirectUri({
                  scheme: "nothitster",
                  path: "spotify-auth",
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
            <Stack.Screen options={{ title: "Login" }} />
            <View style={styles.container}>
                <Text style={styles.logo}>not{"\n"}Hitster</Text>
                {accessToken ? (
                    <Pressable onPress={logout} style={styles.logoutPressable}>
                        <Text style={styles.logoutPressable}>Disconnect Spotify</Text>
                    </Pressable>
                ) : (
                    <Pressable onPress={() => promptAsync()} disabled={!request} style={styles.loginPressable}>
                        <Text style={styles.loginText}>Connect with Spotify</Text>
                    </Pressable>
                )}
            </View>
        </>
    );
};
export default Index;
