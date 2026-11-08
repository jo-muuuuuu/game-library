// GENERATED from app.jsx — do not edit. Rebuild after changing the .jsx source.
const TWEAK_DEFAULTS = {
  arcAccent: "#ff2e88",
  arcNeon: "#00e5ff",
  arcSticky: "#fff066",
  arcTagColor: "#ff7e3e",
  arcTagBg: "#1a1a2e",
  arcTagFont: "#e8e8f0",
  arcPlayerName: "JOHNNY",
  arcTagline: "Souls connoisseur · open-world tourist · co-op believer",
  arcPlatinum: 8
};
const _stored = (() => {
  try {
    const s = localStorage.getItem("johnny-lib-tweaks");
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
})();
const initialTweaks = {
  ...TWEAK_DEFAULTS,
  ..._stored
};
function App() {
  const [t, setTweak] = useTweaks(initialTweaks);
  React.useEffect(() => {
    window.__setTweak = setTweak;
  }, [setTweak]);
  React.useEffect(() => {
    const handler = e => {
      try {
        const cur = JSON.parse(localStorage.getItem("johnny-lib-tweaks") || "{}");
        localStorage.setItem("johnny-lib-tweaks", JSON.stringify({
          ...cur,
          ...e.detail
        }));
      } catch {}
    };
    window.addEventListener("tweakchange", handler);
    return () => window.removeEventListener("tweakchange", handler);
  }, []);
  return React.createElement(Arcade, {
    accent: t.arcAccent,
    neon: t.arcNeon,
    sticky: t.arcSticky,
    playerName: t.arcPlayerName,
    tagline: t.arcTagline,
    platinum: t.arcPlatinum,
    tagColor: t.arcTagColor,
    tagBg: t.arcTagBg,
    tagFont: t.arcTagFont
  });
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));