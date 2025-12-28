import { SPOTIFY_TOKEN_KEY } from "@/components/constants";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        alignItems: "center",
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: "80%",
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

        const collectedTracks: Track[] = [];

        try {
            let nextUrl: string | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
            while (nextUrl) {
                const res = await fetch(nextUrl, {
                    headers: new Headers({
                        Authorization: `Bearer ${await SecureStore.getItemAsync(SPOTIFY_TOKEN_KEY)}`,
                    }),
                });
                const { next, items } = (await res.json()) as ApiResult;
                nextUrl = next;
                collectedTracks.push(...items.map((item) => item.track));
            }
            setAllTracks(collectedTracks);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View style={styles.container}>
            <Text>Paste spotify Playlist:</Text>
            <TextInput style={styles.input} onChangeText={setInputText} value={inputText} />
            <Button onPress={getSpotifyPlaylist} title="Get playlist" />
            <Text>Found {allTracks.length} songs</Text>
            {allTracks.length > 0 && <QRCode value={allTracks[0].uri}></QRCode>}
        </View>
    );
};

export default SelectPlaylist;
