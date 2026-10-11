const ROOT = "https://cdn.jsdelivr.net/gh/wgfwpnew/assets@main/escaperoad/";

const container = document.querySelector("#unity-container");
const canvas = document.querySelector("#unity-canvas");
const loadingCover = document.querySelector("#loading-cover");

const config = {
    dataUrl: ROOT + "TemplateData/data.unityweb",
    frameworkUrl: ROOT + "TemplateData/framework.js.unityweb",
    codeUrl: ROOT + "TemplateData/wasm.unityweb",
    streamingAssetsUrl: ROOT + "StreamingAssets",
    companyName: "1games.io",
    productName: "Escape Road",
    productVersion: "2.0"
};

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    container.className = "unity-mobile";
    config.devicePixelRatio = 1;
}

loadingCover.style.display = "";

createUnityInstance(canvas, config, progress => {
    const bar = document.querySelector("#progress");
    if (bar) bar.style.width = `${progress * 100}%`;
}).then(instance => {
    window.unityInstance = instance;
    loadingCover.style.display = "none";
    window.focus();
}).catch(message => {
    console.error(message);
    alert(message);
});
