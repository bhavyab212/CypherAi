import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
export function withImageAlt(Component) {
  return (props) => {
    const [altText, setAltText] = useState("");
    const ref = useRef(null);
    useEffect(() => {
      if (!ref.current) return;
      const parent =
        ref.current.closest("[data-framer-component-type]") ||
        ref.current.parentElement;
      const img = parent?.querySelector("img");
      if (img?.alt) {
        setAltText(img.alt);
      }
    }, []);
    return /*#__PURE__*/ _jsx("div", {
      ref: ref,
      style: { display: altText ? "block" : "none" },
      children: /*#__PURE__*/ _jsx(Component, { ...props, text: altText }),
    });
  };
}
export const __FramerMetadata__ = {
  exports: {
    withImageAlt: {
      type: "reactHoc",
      name: "withImageAlt",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./Alt_Text.map
