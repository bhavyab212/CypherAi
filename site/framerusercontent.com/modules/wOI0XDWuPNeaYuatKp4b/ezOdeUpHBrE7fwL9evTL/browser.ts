export namespace Browser {
    export const isBrowser = () => typeof window === "object"
    export const isTouch = () =>
        "ontouchstart" in window || navigator.maxTouchPoints > 0
    export const isChrome = () =>
        navigator.userAgent.toLowerCase().includes("chrome/")
    export const isWebKit = () =>
        navigator.userAgent.toLowerCase().includes("applewebkit/")
    export const isSafari = () => isWebKit() && !isChrome()
    export const isSafariDesktop = () => isSafari() && !isTouch()
    export const isWindows = () => /Win/.test(navigator.platform)
    export const isMacOS = () => /Mac/.test(navigator.platform)
}
