import { getValidSpotifyToken } from "@/components/spotifyAuth";
import { Button, Text, TextInput } from "@react-native-material/core";
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

type Track = {
    name: string;
    id: string;
    uri: string;
};
type Item = {
    track: Track;
};

type ApiResult = {
    items: Item[];
    total: number;
    offset: number;
    limit: number;
    next: string | null;
};

const SelectPlaylist = () => {
    const [inputText, setInputText] = useState<string>("");
    const [allTracks, setAllTracks] = useState<Track[]>([]);

    const getSpotifyPlaylist = async () => {
        setAllTracks([]);
        // example url: https://open.spotify.com/playlist/22iWDi8QmSrR6s8YugUzqx?si=4450f909ea374953
        const lastParamAndQuery = inputText.substring(inputText.lastIndexOf("/") + 1);
        const playlistId = lastParamAndQuery.substring(0, lastParamAndQuery.lastIndexOf("?"));

        const token = await getValidSpotifyToken();
        if (!token) router.replace("/login");

        const collectedTracks: Track[] = [];

        try {
            let nextUrl: string | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
            while (nextUrl) {
                const res = await fetch(nextUrl, {
                    headers: new Headers({
                        Authorization: `Bearer ${token}`,
                    }),
                });
                if (res.status === 401) router.replace("/login");
                const { next, items } = (await res.json()) as ApiResult;
                nextUrl = next;
                collectedTracks.push(...items.map((item) => item.track));
            }
            setAllTracks(collectedTracks);
        } catch {
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
                <Button onPress={getSpotifyPlaylist} title="Get tracks" />
                {allTracks.length > 0 && (
                    <>
                        <Text>
                            Found {allTracks.length} tracks like {allTracks[0].name}, {allTracks[1].name} or{" "}
                            {allTracks[2].name}
                        </Text>
                    </>
                )}
            </View>
        </>
    );
};

export default SelectPlaylist;
