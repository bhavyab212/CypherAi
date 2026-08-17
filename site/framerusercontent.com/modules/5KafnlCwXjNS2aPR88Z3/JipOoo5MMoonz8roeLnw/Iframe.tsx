import { useState, useEffect } from "react"
import { RenderTarget } from "framer"
import type { ComponentType } from "react"

export function withHideInIframe(Component): ComponentType {
    return (props) => {
        const [inIframe, setInIframe] = useState(false)

        const onCanvas = RenderTarget.current() === RenderTarget.canvas

        useEffect(() => {
            if (onCanvas) return

            try {
                if (window.self !== window.top) {
                    setInIframe(true)
                }
            } catch (e) {
                setInIframe(true)
            }
        }, [onCanvas])

        if (!onCanvas && inIframe) {
            return null
        }

        return <Component {...props} />
    }
}
