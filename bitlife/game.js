const ROOT = "https://cdn.jsdelivr.net/gh/wgfwpnew/assets@main/bitlife/";

const configUrl = ROOT + "Build/BitLife.json";

const unityInstance = UnityLoader.instantiate(
    "gameContainer",
    configUrl,
    {
        onProgress: UnityProgress
    }
);
