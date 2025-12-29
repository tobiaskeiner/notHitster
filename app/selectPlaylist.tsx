import { useGameStore } from "@/components/provider";
import { getValidSpotifyToken } from "@/components/spotifyAuth";
import { ApiResult, Item } from "@/components/types";
import { ActivityIndicator, Button, Text, TextInput } from "@react-native-material/core";
import * as Clipboard from "expo-clipboard";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        margin: 20,
        flexDirection: "column",
        gap: 10,
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
            <View style={styles.container}>
                <Text>Paste spotify Playlist URL:</Text>
                <TextInput
                    onChangeText={setInputText}
                    value={inputText}
                    placeholder="https://open.spotify.com/playlist/22iWDi8QmSrR6s8YugUzqx?si=4450f909ea374953"
                    numberOfLines={1}
                    variant="outlined"
                />
                <Button onPress={handlePaste} title="Paste from clipboard" variant="outlined" />
                <Button onPress={getSpotifyPlaylist} title="Get tracks" />
                {isLoading && <ActivityIndicator style={{ margin: 20 }} size={"large"} />}
                {allSpotifyItems.length > 0 && (
                    <>
                        <Text>
                            Found {allSpotifyItems.length} tracks like {allSpotifyItems[0].track.name},{" "}
                            {allSpotifyItems[1].track.name} or {allSpotifyItems[2].track.name}
                        </Text>
                        <Button
                            title="Start game"
                            onPress={() => {
                                setSpotifyItems(allSpotifyItems);
                                router.push("/game");
                            }}
                        />
                    </>
                )}
            </View>
        </>
    );
};

export default SelectPlaylist;
