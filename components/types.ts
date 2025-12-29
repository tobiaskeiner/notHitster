export type Track = {
    name: string;
    id: string;
    uri: string;
    album: Album;
};

export type Album = {
    release_date: string;
};

export type Item = {
    track: Track;
};

export type ApiResult = {
    items: Item[];
    total: number;
    offset: number;
    limit: number;
    next: string | null;
};
