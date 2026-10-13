// Determine our CDN directory from this script's own URL.
// Example:
// https://cdn.jsdelivr.net/gh/wgfwpnew/assets@SHA/escaperoad/2/game.js
const GAME_SCRIPT_URL = document.currentScript.src;
const ROOT = new URL("./", GAME_SCRIPT_URL).href;

console.log("[Escape Road 2] Asset root:", ROOT);

const canvas = document.getElementById("unity-canvas");
const loading = document.getElementById("loading");
const status = document.getElementById("status");
const progress = document.getElementById("progress");

// Analytics hooks expected by the game.
window.firebaseLogEvent = (...args) => {
    console.debug("[firebaseLogEvent]", ...args);
};

window.firebaseLogEventParameter = (...args) => {
    console.debug("[firebaseLogEventParameter]", ...args);
};

function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = () =>
            reject(new Error("Failed to load " + url));

        document.body.appendChild(script);
    });
}

async function decompressAsset(filename, mimeType) {
    status.textContent = "Downloading " + filename + "...";

    const response = await fetch(ROOT + filename);

    if (!response.ok) {
        throw new Error(
            filename + " returned HTTP " + response.status
        );
    }

    if (!response.body) {
        throw new Error("Response streaming is unavailable");
    }

    status.textContent = "Decompressing " + filename + "...";

    const stream = response.body.pipeThrough(
        new DecompressionStream("gzip")
    );

    const blob = await new Response(stream, {
        headers: {
            "Content-Type": mimeType
        }
    }).blob();

    console.log(
        "[CDN]",
        filename,
        "decompressed:",
        blob.size,
        "bytes"
    );

    return URL.createObjectURL(blob);
}

async function startGame() {
    if (!window.DecompressionStream) {
        throw new Error(
            "Your browser does not support gzip decompression"
        );
    }

    const dataURL = await decompressAsset(
        "data.unityweb.gz",
        "application/octet-stream"
    );

    const wasmURL = await decompressAsset(
        "code.wasm.gz",
        "application/wasm"
    );

    status.textContent = "Loading Unity...";

    await loadScript(ROOT + "loader.js");

    if (typeof createUnityInstance !== "function") {
        throw new Error("Unity loader did not initialize");
    }

    const config = {
        dataUrl: dataURL,
        frameworkUrl: ROOT + "framework.js",
        codeUrl: wasmURL,

        streamingAssetsUrl: ROOT + "StreamingAssets",

        companyName: "1games.io",
        productName: "Escape Road 2",
        productVersion: "25102308",

        showBanner: (message, type) => {
            console.log("[Unity " + type + "]", message);
        }
    };

    const instance = await createUnityInstance(
        canvas,
        config,
        value => {
            const percent = Math.round(value * 100);

            progress.style.width = percent + "%";
            status.textContent =
                "Loading Escape Road 2... " + percent + "%";
        }
    );

    window.unityInstance = instance;

    loading.style.display = "none";
    canvas.focus();

    URL.revokeObjectURL(dataURL);
    URL.revokeObjectURL(wasmURL);
}

startGame().catch(error => {
    console.error("Escape Road 2 failed:", error);

    status.textContent =
        "Failed: " + (error.message || String(error));
});
