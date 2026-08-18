import createGlobe from "./vendor/cobe.esm.js";

// Displayed on the globe (matches the labels list from the source component)
const globeLocations = [
  { id: "sf", city: "San Francisco" },
  { id: "nyc", city: "New York" },
  { id: "toronto", city: "Toronto" },
  { id: "london", city: "London" },
  { id: "paris", city: "Paris" },
  { id: "berlin", city: "Berlin" },
  { id: "madrid", city: "Madrid" },
  { id: "rome", city: "Rome" },
  { id: "capetown", city: "Cape Town" },
  { id: "dubai", city: "Dubai" },
  { id: "mumbai", city: "Mumbai" },
  { id: "india", city: "Bengaluru" },
  { id: "singapore", city: "Singapore" },
  { id: "tokyo", city: "Tokyo" },
  { id: "sydney", city: "Sydney" },
];

const markerCoords = {
  sf: [37.7749, -122.4194],
  nyc: [40.7128, -74.006],
  toronto: [43.651, -79.347],
  london: [51.5072, -0.1276],
  paris: [48.8566, 2.3522],
  berlin: [52.52, 13.405],
  madrid: [40.4168, -3.7038],
  rome: [41.9028, 12.4964],
  capetown: [-33.9249, 18.4241],
  dubai: [25.2048, 55.2708],
  mumbai: [19.076, 72.8777],
  india: [12.9716, 77.5946],
  singapore: [1.3521, 103.8198],
  tokyo: [35.6762, 139.6503],
  sydney: [-33.8688, 151.2093],
};

function initGlobe() {
  const canvas = document.getElementById("rl-globe-canvas");
  const labelsRoot = document.getElementById("rl-globe-labels");
  const orb = document.getElementById("rl-globe-orb");
  if (!canvas || !labelsRoot || !orb) return;

  let phi = 0;
  let width = 0;
  let currentSpeed = 0.012;
  let isHovering = false;

  const onResize = () => {
    width = canvas.offsetWidth;
  };
  window.addEventListener("resize", onResize);
  onResize();

  orb.addEventListener("mouseenter", () => {
    isHovering = true;
  });
  orb.addEventListener("mouseleave", () => {
    isHovering = false;
  });

  const globe = createGlobe(canvas, {
    devicePixelRatio: 2,
    width: width * 2,
    height: width * 2,
    phi: 0,
    theta: 0.3,
    dark: 0,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: 6,
    baseColor: [0.95, 0.95, 0.95],
    markerColor: [0.1, 0.1, 0.1],
    glowColor: [1, 1, 1],
    markers: [],
    onRender(state) {
      state.phi = phi;
    },
  });

  let animationFrame;
  const render = () => {
    if (!globe) return;

    const targetSpeed = isHovering ? 0.002 : 0.016;
    currentSpeed += (targetSpeed - currentSpeed) * 0.05;
    phi += currentSpeed;

    globe.update({ phi, width: width * 2, height: width * 2 });

    if (width > 0) {
      const r = width / 2;
      const theta = 0.3;

      globeLocations.forEach((region, i) => {
        const [lat, lng] = markerCoords[region.id];
        const latRad = lat * (Math.PI / 180);
        const lngRad = lng * (Math.PI / 180);

        const currentLng = lngRad - phi;

        const x = Math.cos(latRad) * Math.sin(currentLng);
        const y = Math.sin(latRad);
        const z = Math.cos(latRad) * Math.cos(currentLng);

        const yRot = y * Math.cos(theta) - z * Math.sin(theta);
        const zRot = y * Math.sin(theta) + z * Math.cos(theta);

        const screenX = x * r + r;
        const screenY = -yRot * r + r;

        const isVisible = zRot > 0.15;

        const label = labelsRoot.children[i];
        if (!label) return;

        if (isVisible) {
          label.style.opacity = "1";
          label.style.filter = "blur(0px)";
          label.style.transform = "translate(-50%, -50%) scale(1)";
          label.style.left = `${screenX}px`;
          label.style.top = `${screenY}px`;
        } else {
          label.style.opacity = "0";
          label.style.filter = "blur(4px)";
          label.style.transform = "translate(-50%, -50%) scale(0.95)";
        }
      });
    }

    animationFrame = requestAnimationFrame(render);
  };
  animationFrame = requestAnimationFrame(render);

  setTimeout(() => {
    canvas.style.opacity = "1";
  }, 100);

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animationFrame);
    globe.destroy();
  });
}

window.__rlInitGlobe = initGlobe;
