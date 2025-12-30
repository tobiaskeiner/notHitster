import { GameStoreProvider } from "@/components/provider";
import { JosefinSans_100Thin } from "@expo-google-fonts/josefin-sans/100Thin";
import { JosefinSans_100Thin_Italic } from "@expo-google-fonts/josefin-sans/100Thin_Italic";
import { JosefinSans_200ExtraLight } from "@expo-google-fonts/josefin-sans/200ExtraLight";
import { JosefinSans_200ExtraLight_Italic } from "@expo-google-fonts/josefin-sans/200ExtraLight_Italic";
import { JosefinSans_300Light } from "@expo-google-fonts/josefin-sans/300Light";
import { JosefinSans_300Light_Italic } from "@expo-google-fonts/josefin-sans/300Light_Italic";
import { JosefinSans_400Regular } from "@expo-google-fonts/josefin-sans/400Regular";
import { JosefinSans_400Regular_Italic } from "@expo-google-fonts/josefin-sans/400Regular_Italic";
import { JosefinSans_500Medium } from "@expo-google-fonts/josefin-sans/500Medium";
import { JosefinSans_500Medium_Italic } from "@expo-google-fonts/josefin-sans/500Medium_Italic";
import { JosefinSans_600SemiBold } from "@expo-google-fonts/josefin-sans/600SemiBold";
import { JosefinSans_600SemiBold_Italic } from "@expo-google-fonts/josefin-sans/600SemiBold_Italic";
import { JosefinSans_700Bold } from "@expo-google-fonts/josefin-sans/700Bold";
import { JosefinSans_700Bold_Italic } from "@expo-google-fonts/josefin-sans/700Bold_Italic";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { maybeCompleteAuthSession } from "expo-web-browser";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    maybeCompleteAuthSession();

    let [fontsLoaded, error] = useFonts({
        JosefinSans_100Thin,
        JosefinSans_200ExtraLight,
        JosefinSans_300Light,
        JosefinSans_400Regular,
        JosefinSans_500Medium,
        JosefinSans_600SemiBold,
        JosefinSans_700Bold,
        JosefinSans_100Thin_Italic,
        JosefinSans_200ExtraLight_Italic,
        JosefinSans_300Light_Italic,
        JosefinSans_400Regular_Italic,
        JosefinSans_500Medium_Italic,
        JosefinSans_600SemiBold_Italic,
        JosefinSans_700Bold_Italic,
    });

    useEffect(() => {
        if (fontsLoaded || error) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded && !error) {
        return null;
    }

    return (
        <GameStoreProvider>
            <Stack screenOptions={{ statusBarStyle: "dark" }} />
        </GameStoreProvider>
    );
};

export default RootLayout;
