import { useGameStore } from "@/components/provider";
import { Item } from "@/components/types";
import { Button, Text } from "@react-native-material/core";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const Game = () => {
    const { spotifyItems } = useGameStore();
    const [playedTrackUris, setPlayedTrackUris] = useState<string[]>([]);
    const [currentSong, setCurrentSong] = useState<Item | undefined>(undefined);
    const [showSolution, setShowSolution] = useState<boolean>(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if ((spotifyItems?.length ?? 0) > 0) {
            setReady(true);
        }
    }, [spotifyItems]);

    if (!ready) {
        return <Text>Loading game…</Text>;
    }

    const getRandomSong = () => {
        if (!spotifyItems || spotifyItems.length === 0) return;

        setShowSolution(false);

        const remainingTracks = spotifyItems.filter((song) => !playedTrackUris.includes(song.track.uri));

        if (remainingTracks.length === 0) {
            alert("Game finished 🎉");
            return;
        }

        const nextSong = remainingTracks[Math.floor(Math.random() * remainingTracks.length)];

        setCurrentSong(nextSong);
        setPlayedTrackUris((prev) => [...prev, nextSong.track.uri]);
    };

    return (
        <>
            <Stack.Screen options={{ title: "Playing" }} />
            <View style={{ margin: 20, gap: 20, alignItems: "center" }}>
                {currentSong && (
                    <>
                        {showSolution ? (
                            <>
                                <Text>Name: {currentSong.track.name}</Text>
                                <Text>Release Date: {currentSong.track.album.release_date}</Text>
                            </>
                        ) : (
                            <QRCode size={250} value={currentSong.track.uri} />
                        )}
                        <Button title="Show solution" onPress={() => setShowSolution(true)} />
                    </>
                )}
                <Button title="Get random song" onPress={getRandomSong} />
            </View>
        </>
    );
};

export default Game;
