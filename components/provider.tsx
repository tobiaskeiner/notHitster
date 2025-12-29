import { createContext, ReactNode, useContext, useState } from "react";
import { Item } from "./types";
type GameStore = {
    spotifyItems?: Item[];
    setSpotifyItems: (spotifyItems: Item[]) => void;
};

const GameStoreContext = createContext<GameStore | undefined>(undefined);

export const GameStoreProvider = ({ children }: { children: ReactNode }) => {
    const [spotifyItems, setSpotifyItems] = useState<Item[] | undefined>(undefined);

    return <GameStoreContext.Provider value={{ spotifyItems, setSpotifyItems }}>{children}</GameStoreContext.Provider>;
};

export const useGameStore = () => {
    const ctx = useContext(GameStoreContext);
    if (!ctx) {
        throw new Error("useGameStore must be used inside GameStoreProvider");
    }
    return ctx;
};
