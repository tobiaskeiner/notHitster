# Welcome to notHitster 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

NotHitster is a simple App, which allows you to guess your favourite Music. It generates the QR-Codes to play your music.

## Prerequisites

You need the App [QRSong!](https://play.google.com/store/apps/details?id=nl.rickgroenewegen.qrsong) for scanning the generated QR Codes and playing the music.

## How to play

Currently only available for android and web.

1. Download the app from the releases, start the app and login to spotify
2. Allow the app to access your data (only personal and public playlists are read)
3. Copy the url of the playlist you want to guess music for
4. Paste the url of a Spotify Playlist into the Text Input
5. Click the "Get tracks" button, so that the app can get all tracks of the playlist from Spotify
6. Start the game
7. Use the App QRSong! to play the music

## How to setup

This Project uses the Spotify Web API. Because this is only a hobby project, it is only possible to allow 25 users, which have to be explictly white listed.
Meaning that if you want to use this app (and do not know me personally), you will have to setup your own Spotfiy Developer API Account. You can find documentation for the setup [here](https://developer.spotify.com/documentation/web-api/tutorials/getting-started).

Then simply replace the clientId in `index.tsx` and change the `redirectUri`.

```ts
// index.tsx
const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
        clientId: "<yourClientId>",
        scopes: [
            "playlist-read-private",
            "playlist-read-collaborative",
            "playlist-modify-public",
            "playlist-modify-private",
        ],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
    },
    {
        authorizationEndpoint: "https://accounts.spotify.com/authorize",
        tokenEndpoint: "https://accounts.spotify.com/api/token",
    },
);
```
```ts
const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
        clientId: "<yourClientId>",
        code: response.params.code,
        redirectUri,
        extraParams: {
            code_verifier: request?.codeVerifier!,
        },
    },
    {
        tokenEndpoint: "https://accounts.spotify.com/api/token",
    },
);
```
```ts
const redirectUri =
  Platform.OS === "web"
      ? "https://tobiaskeiner.github.io/notHitster/spotify-auth"
      : AuthSession.makeRedirectUri({
            scheme: "nothitster",
            path: "spotify-auth",
        });
```

## Screenshots

<img width="270" height="600" alt="Screenshot_20251230-154519" src="https://github.com/user-attachments/assets/60786cd0-a9c4-49cd-a281-304395c1fcd5" />
<img width="270" height="600" alt="Screenshot_20251230-154528" src="https://github.com/user-attachments/assets/89708f28-c712-48ae-b34c-5d729937c86f" />
<img width="270" height="600" alt="Screenshot_20251230-154536" src="https://github.com/user-attachments/assets/9fa3f429-8c27-4fb6-a0a5-b4d92a6af3be" />
