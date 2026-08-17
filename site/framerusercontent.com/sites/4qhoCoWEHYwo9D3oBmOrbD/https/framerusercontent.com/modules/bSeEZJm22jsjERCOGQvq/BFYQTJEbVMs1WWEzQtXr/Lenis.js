import { jsx as _jsx } from "react/jsx-runtime";
import { addPropertyControls, ControlType } from "framer";
import _Lenis from "https://unpkg.com/lenis@1.2.4-dev.4/dist/lenis.mjs";
import { useEffect } from "react";
/**
 * @framerIntrinsicHeight 0
 * @framerIntrinsicWidth 0
 * @framerDisableUnlink
 */ export default function Lenis({
  smooth,
  easing,
  infinite,
  orientation,
  intensity,
}) {
  useEffect(() => {
    const lenis = new _Lenis({
      smoothWheel: smooth,
      duration: intensity / 10,
      infinite,
      orientation,
      gestureOrientation: orientation === "horizontal" ? "both" : "vertical",
      autoRaf: true,
      autoToggle: true,
      anchors: true,
      allowNestedScroll: true,
    });
    window.lenis = lenis;
    return () => {
      lenis.destroy();
    };
  }, []);
  return /*#__PURE__*/ _jsx("link", {
    href: "https://unpkg.com/lenis@1.2.4-dev.1/dist/lenis.css",
    rel: "stylesheet",
  });
}
addPropertyControls(Lenis, {
  smooth: { type: ControlType.Boolean, title: "Smooth", defaultValue: true },
  intensity: {
    type: ControlType.Number,
    title: "Intensity",
    defaultValue: 12,
    step: 1,
    min: 1,
    max: 100,
  },
  infinite: {
    type: ControlType.Boolean,
    title: "Infinite",
    defaultValue: false,
  },
  orientation: {
    type: ControlType.Enum,
    defaultValue: "Vertical",
    displaySegmentedControl: true,
    options: ["vertical", "horizontal"],
    optionTitles: ["Vertical", "Horizontal"],
  },
});
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "Lenis",
      slots: [],
      annotations: {
        framerContractVersion: "1",
        framerDisableUnlink: "",
        framerIntrinsicWidth: "0",
        framerIntrinsicHeight: "0",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./Lenis.map
