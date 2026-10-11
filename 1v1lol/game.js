var gameInstance;

window.addEventListener("load", function () {
    gameInstance = UnityLoader.instantiate(
        "gameContainer",
        "https://cdn.jsdelivr.net/gh/wgfwpnew/assets@main/1v1lol/2.7.json",
        {
            onProgress: UnityProgress,
            Module: {
                onRuntimeInitialized: function () {
                    UnityProgress(gameInstance, "complete");
                }
            }
        }
    );
});

function showAds() {
    unityAdFinishedCallback();
}

function requestNewAd() {
    unityAdFinishedCallback();
}

function unityAdFinishedCallback() {
    try {
        if (gameInstance) {
            gameInstance.SendMessage("AdsManager", "OnWebCallback");
        }
    } catch (error) {
        console.log(error);
    }
}
