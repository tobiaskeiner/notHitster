import { GameStoreProvider } from "@/components/provider";
import { Stack } from "expo-router";
import { maybeCompleteAuthSession } from "expo-web-browser";

const RootLayout = () => {
    maybeCompleteAuthSession();

    return (
        <GameStoreProvider>
            <Stack screenOptions={{ statusBarStyle: "dark" }} />
        </GameStoreProvider>
    );
}

export default RootLayout;