import { GameStoreProvider } from "@/components/provider";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <GameStoreProvider>
            <Stack screenOptions={{ statusBarStyle: "dark" }} />
        </GameStoreProvider>
    );
}
