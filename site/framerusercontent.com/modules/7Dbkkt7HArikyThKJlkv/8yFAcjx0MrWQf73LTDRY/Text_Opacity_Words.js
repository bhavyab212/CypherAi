// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { addPropertyControls, ControlType } from "framer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
const EachWord = ({ word, starting, ending, progress }) => {
  const ref = useRef();
  const progressVal = useTransform(progress, [starting, ending], [0.2, 1]);
  return /*#__PURE__*/ _jsxs(motion.span, {
    style: { opacity: progressVal },
    children: [word, " "],
  });
};
/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */ export default function Text_Opacity_Words(props) {
  const text = props.text;
  const words = text.split(" ");
  const totalWords = words.length;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "start 0.35"],
  });
  return /*#__PURE__*/ _jsx("p", {
    ref: ref,
    style: { ...props.font, color: props.textColor },
    children: words.map((word, idx) => {
      const starting = idx / totalWords;
      const ending = (idx + 1) / totalWords;
      return /*#__PURE__*/ _jsx(EachWord, {
        word: word,
        starting: starting,
        ending: ending,
        progress: scrollYProgress,
      });
    }),
  });
}
addPropertyControls(Text_Opacity_Words, {
  text: { title: "Text", type: ControlType.String, defaultValue: "Hello" },
  font: { type: "font", controls: "extended" },
  textColor: { type: ControlType.Color },
});
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "Text_Opacity_Words",
      slots: [],
      annotations: {
        framerContractVersion: "1",
        framerSupportedLayoutHeight: "any",
        framerSupportedLayoutWidth: "any",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./Text_Opacity_Words.map
