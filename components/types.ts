export type Track = {
    name: string;
    id: string;
    uri: string;
    album: Album;
    artists: Artist[];
    popularity: number;
};

export type Artist = {
    name: string;
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
