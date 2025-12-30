import { useGameStore } from "@/components/provider";
import { getValidSpotifyToken } from "@/components/spotifyAuth";
import { ApiResult, Item } from "@/components/types";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    urlSelectionContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 20,
        flexDirection: "column",
        gap: 15,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    pasteText: {
        fontFamily: "JosefinSans_400Regular",
        fontSize: 20,
    },
    textInput: {
        borderWidth: 2,
        borderColor: "#79C9C5",
        borderRadius: 20,
    },
    pasteButton: {
        borderRadius: 30,
        backgroundColor: "#79C9C5",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 10,
    },
    pasteButtonText: {
        color: "white",
        alignSelf: "center",
        fontFamily: "JosefinSans_400Regular",
        fontSize: 20,
    },
    queryButton: {
        borderRadius: 30,
        backgroundColor: "#3F9AAE",
        display: "flex",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    queryButtonText: {
        color: "white",
        fontFamily: "JosefinSans_400Regular",
        fontSize: 26,
    },
});

const SelectPlaylist = () => {
    const [inputText, setInputText] = useState<string>("");
    const [allSpotifyItems, setAllSpotifyItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { setSpotifyItems } = useGameStore();

    const handlePaste = async () => {
        const text = await Clipboard.getStringAsync();
        setInputText(text);
    };

    const getSpotifyPlaylist = async () => {
        setAllSpotifyItems([]);
        // example url: https://open.spotify.com/playlist/22iWDi8QmSrR6s8YugUzqx?si=4450f909ea374953
        const lastParamAndQuery = inputText.substring(inputText.lastIndexOf("/") + 1);
        const playlistId = lastParamAndQuery.substring(0, lastParamAndQuery.lastIndexOf("?"));

        const token = await getValidSpotifyToken();
        if (!token) router.replace("/");

        const collectedSpotifyItems: Item[] = [];

        try {
            let nextUrl: string | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
            setIsLoading(true);
            while (nextUrl) {
                const res = await fetch(nextUrl, {
                    headers: new Headers({
                        Authorization: `Bearer ${token}`,
                    }),
                });
                if (res.status === 401) router.replace("/");
                const { next, items } = (await res.json()) as ApiResult;
                nextUrl = next;
                collectedSpotifyItems.push(...items.map((item) => ({ track: item.track })));
            }
            setAllSpotifyItems(collectedSpotifyItems);
            setIsLoading(false);
        } catch {
            setIsLoading(false);
            alert("Error getting playlist");
        }
    };
    return (
        <>
            <Stack.Screen options={{ title: "Select Playlist" }} />
            <View style={{ margin: 20, flexDirection: "column", height: "90%", justifyContent: "space-between" }}>
                <View style={styles.container}>
                    <View style={styles.urlSelectionContainer}>
                        <Text style={styles.pasteText}>Paste Spotify Playlist URL:</Text>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setInputText}
                            value={inputText}
                            placeholder="https://open.spotify.com/playlist..."
                            numberOfLines={1}
                        />
                        <Pressable onPress={handlePaste} style={styles.pasteButton}>
                            <Feather name="clipboard" size={20} color="white" />
                            <Text style={styles.pasteButtonText}>Paste from clipboard</Text>
                        </Pressable>
                    </View>
                    <Pressable onPress={getSpotifyPlaylist} style={styles.queryButton}>
                        <MaterialIcons name="multitrack-audio" size={20} color="white" />
                        <Text style={styles.queryButtonText}>Get tracks</Text>
                    </Pressable>
                    {isLoading && <ActivityIndicator style={{ margin: 20 }} size={"large"} />}
                    {allSpotifyItems.length > 0 && (
                        <Text style={{ fontFamily: "JosefinSans_700Bold", fontSize: 20, alignSelf: "center" }}>
                            Found {allSpotifyItems.length} tracks 🎶
                        </Text>
                    )}
                </View>
                {allSpotifyItems.length > 0 && (
                    <Pressable
                        style={styles.queryButton}
                        onPress={() => {
                            setSpotifyItems(allSpotifyItems);
                            router.push("/game");
                        }}
                    >
                        <Ionicons name="play-outline" size={20} color="white" />
                        <Text style={styles.queryButtonText}>Start game</Text>
                    </Pressable>
                )}
            </View>
        </>
    );
};

export default SelectPlaylist;
