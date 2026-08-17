import { addPropertyControls, ControlType } from "framer"
import { useEffect } from "react"
import type { ComponentType } from "react"
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"

const useStore = createStore({
    // Set the starting theme below, otherwise default to system.
    theme: "light",
})

const changeTheme = (theme: string) => {
    const htmlElement = document.getElementsByTagName("html")[0]
    const bodyElement = document.getElementsByTagName("body")[0]

    htmlElement.setAttribute("toggle-theme", `${theme}`)
    bodyElement.setAttribute("toggle-theme", `${theme}`)
    localStorage.setItem("theme", `${theme}`)

    // Trigger event that is compatible with Framestack Theme Image Component
    const event = new Event("themeChange")
    window.dispatchEvent(event)
    return
}

export function withSingleToggle(Component): ComponentType {
    return (props) => {
        const [store, setStore] = useStore()

        useEffect(() => {
            // If starting theme is other than light/dark then match device theme.
            if (store.theme !== "dark" && store.theme !== "light") {
                // Detect system theme
                const mediaQuery = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                )
                let newTheme = mediaQuery.matches ? "dark" : "light"
                // Set store theme
                setStore({ theme: newTheme })
                localStorage.setItem("theme", `${newTheme}`)
            } else {
                // Set the starting theme based on store
                localStorage.setItem("theme", `${store.theme}`)
            }

            // Create attributes on html and body so that theme will be applied based on store
            const htmlElement = document.getElementsByTagName("html")[0]
            const bodyElement = document.getElementsByTagName("body")[0]
            htmlElement &&
                htmlElement.setAttribute("toggle-theme", `${store.theme}`)

            bodyElement &&
                bodyElement.setAttribute("toggle-theme", `${store.theme}`)

            // Create sets of light and dark mode tokens
            let lightThemeTokens: string[] | string = []
            let darkThemeTokens: string[] | string = []
            for (let i = 0; i < document.styleSheets.length; i++) {
                const sheet = document.styleSheets[i]
                try {
                    for (let rule of sheet.cssRules) {
                        // Get light and dark mode tokens
                        if (rule.selectorText === "body") {
                            const style = rule.style
                            for (let j = 0; j < style.length; j++) {
                                const propertyName = style[j]
                                if (propertyName.includes("--token")) {
                                    const value =
                                        style.getPropertyValue(propertyName)
                                    // Check for specific tokens or list all
                                    const combinedCssRule = `${propertyName}: ${value};`
                                    lightThemeTokens.push(combinedCssRule)
                                }
                            }
                            lightThemeTokens = lightThemeTokens.join(" ")
                        } else if (
                            rule.conditionText ===
                            "(prefers-color-scheme: dark)"
                        ) {
                            const cssTextIgnore =
                                "body:not([data-framer-theme])"
                            if (!rule.cssText.includes(cssTextIgnore)) {
                                const mediaRulesString =
                                    rule.cssRules[0].cssText
                                        .replace("body", "")
                                        .replace(/\s*{\s*/, "")
                                        .replace(/\s*}\s*$/, "")
                                darkThemeTokens = mediaRulesString
                            }
                        }
                    }
                } catch (e) {
                    console.warn("Cannot access stylesheet:", sheet.href)
                }
            }

            // Create styleSheet with id and populate with correct CSS text
            let styleElement = document.createElement("style")
            styleElement.id = "toggle-theme"
            const customCssRule = `body[toggle-theme="light"] {${lightThemeTokens}} body[toggle-theme="dark"]{${darkThemeTokens}} html[toggle-theme="light"] { color-scheme: light; } html[toggle-theme="dark"] { color-scheme: dark; }`
            styleElement.textContent = customCssRule
            document.head.appendChild(styleElement)

            // Cleanup function
            return () => {
                // Check if the style element exists and remove it
                const existingStyleElement =
                    document.getElementById("toggle-theme")
                if (existingStyleElement) {
                    document.head.removeChild(existingStyleElement)
                }
                htmlElement &&
                    htmlElement.setAttribute("toggle-theme", "system")

                bodyElement &&
                    bodyElement.setAttribute("toggle-theme", "system")
            }
        }, [])

        const handleClick = () => {
            let newTheme = store.theme === "light" ? "dark" : "light"
            setStore({
                theme: newTheme,
            })
            changeTheme(newTheme)
        }

        return (
            <Component
                {...props}
                variant={store.theme === "light" ? "Light" : "Dark"}
                whileHover={{ scale: 1.1 }}
                onClick={handleClick}
            />
        )
    }
}
