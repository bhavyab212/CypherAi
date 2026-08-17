// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from "framer"
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion"
import { useRef } from "react"

const EachWord = ({ word, starting, ending, progress }) => {
    const ref = useRef()
    const progressVal = useTransform(progress, [starting, ending], [0.2, 1])
    return <motion.span style={{ opacity: progressVal }}>{word} </motion.span>
}

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function Text_Opacity_Words(props) {
    const text = props.text
    const words = text.split(" ")
    const totalWords = words.length
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.75", "start 0.35"],
    })

    return (
        <p ref={ref} style={{ ...props.font, color: props.textColor }}>
            {words.map((word, idx) => {
                const starting = idx / totalWords
                const ending = (idx + 1) / totalWords
                return (
                    <EachWord
                        word={word}
                        starting={starting}
                        ending={ending}
                        progress={scrollYProgress}
                    />
                )
            })}
        </p>
    )
}

addPropertyControls(Text_Opacity_Words, {
    text: {
        title: "Text",
        type: ControlType.String,
        defaultValue: "Hello",
    },
    font: {
        type: "font",
        controls: "extended",
    },
    textColor: {
        type: ControlType.Color,
    },
})
