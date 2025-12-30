import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const getItem = async (key: string) => {
    if (Platform.OS === "web") {
        return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
};

export const deleteItem = async (key: string) => {
    if (Platform.OS === "web") {
        return localStorage.removeItem(key);
    }
    await SecureStore.deleteItemAsync(key);
};

export const setItem = async (key: string, value: string, options?: SecureStore.SecureStoreOptions) => {
    if (Platform.OS === "web") {
        return localStorage.setItem(key, value);
    }
    return SecureStore.setItemAsync(key, value, options);
};
