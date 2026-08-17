import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { RenderTarget } from "framer";
export function withHideInIframe(Component) {
  return (props) => {
    const [inIframe, setInIframe] = useState(false);
    const onCanvas = RenderTarget.current() === RenderTarget.canvas;
    useEffect(() => {
      if (onCanvas) return;
      try {
        if (window.self !== window.top) {
          setInIframe(true);
        }
      } catch (e) {
        setInIframe(true);
      }
    }, [onCanvas]);
    if (!onCanvas && inIframe) {
      return null;
    }
    return /*#__PURE__*/ _jsx(Component, { ...props });
  };
}
export const __FramerMetadata__ = {
  exports: {
    withHideInIframe: {
      type: "reactHoc",
      name: "withHideInIframe",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./Iframe.map
