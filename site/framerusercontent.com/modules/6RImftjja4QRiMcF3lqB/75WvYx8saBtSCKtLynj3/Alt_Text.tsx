import type { ComponentType } from "react"
import { useEffect, useState, useRef } from "react"

export function withImageAlt(Component): ComponentType {
    return (props) => {
        const [altText, setAltText] = useState("")
        const ref = useRef(null)

        useEffect(() => {
            if (!ref.current) return

            const parent =
                ref.current.closest("[data-framer-component-type]") ||
                ref.current.parentElement
            const img = parent?.querySelector("img")

            if (img?.alt) {
                setAltText(img.alt)
            }
        }, [])

        return (
            <div ref={ref} style={{ display: altText ? "block" : "none" }}>
                <Component {...props} text={altText} />
            </div>
        )
    }
}
