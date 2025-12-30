import { useGameStore } from "@/components/provider";
import { Item } from "@/components/types";
import Foundation from "@expo/vector-icons/Foundation";
import { Text } from "@react-native-material/core";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    buttonsContainer: {
        gap: 15,
        paddingBottom: 10,
    },
    nextSongButton: {
        borderRadius: 30,
        backgroundColor: "#3F9AAE",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    nextSongText: {
        color: "white",
        fontFamily: "JosefinSans_400Regular",
        fontSize: 26,
    },
    showSolutionButton: {
        borderRadius: 30,
        backgroundColor: "#79C9C5",
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: "center",
    },
    showSolutionText: {
        color: "white",
        fontFamily: "JosefinSans_400Regular",
        fontSize: 22,
    },
    solutionText: {
        fontFamily: "JosefinSans_400Regular",
        fontSize: 22,
    },
    solutionCard: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        paddingVertical: 30,
        paddingHorizontal: 24,
        alignItems: "center",
        width: "100%",
        maxWidth: 340,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    releaseYear: {
        fontSize: 56,
        fontFamily: "JosefinSans_700Bold",
        color: "#3F9AAE",
    },
    releaseLabel: {
        fontSize: 14,
        opacity: 0.6,
        marginTop: -6,
    },
    divider: {
        width: 40,
        height: 2,
        backgroundColor: "#3F9AAE",
        opacity: 0.4,
        marginVertical: 18,
    },
    songTitle: {
        fontSize: 22,
        fontFamily: "JosefinSans_600SemiBold",
        textAlign: "center",
    },
    artist: {
        fontSize: 18,
        opacity: 0.8,
        marginTop: 4,
        textAlign: "center",
    },
});

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

            <SafeAreaView style={styles.screen}>
                {/* CENTER CONTENT */}
                <View style={styles.contentContainer}>
                    {currentSong && (
                        <>
                            {showSolution ? (
                                <View style={styles.solutionCard}>
                                    <Text style={styles.releaseYear}>
                                        {currentSong.track.album.release_date.slice(0, 4)}
                                    </Text>
                                    <Text style={styles.releaseLabel}>Release Year</Text>
                                    <View style={styles.divider} />
                                    <Text style={styles.songTitle}>{currentSong.track.name}</Text>
                                    <Text style={styles.artist}>
                                        {currentSong.track.artists.map((a) => a.name).join(", ")}
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.solutionCard}>
                                <QRCode size={250} value={currentSong.track.uri} /></View>
                            )}
                        </>
                    )}
                </View>

                {/* BOTTOM BUTTONS */}
                <View style={styles.buttonsContainer}>
                    {currentSong && (
                        <Pressable style={styles.showSolutionButton} onPress={() => setShowSolution(true)}>
                            <Text style={styles.showSolutionText}>Show solution</Text>
                        </Pressable>
                    )}

                    <Pressable style={styles.nextSongButton} onPress={getRandomSong}>
                        <Foundation name="next" size={30} color="white" />
                        <Text style={styles.nextSongText}>Next Song</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </>
    );
};

export default Game;
