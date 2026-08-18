const PROJECTS = [
  {
    id: "strida",
    index: 0,
    uTZAUbA1P: "strida",
    uLRpQRGcH: "Strida",
    V48QqcuXU: "Strida — Full-Screen Portfolio",
    rm2tapp6I: "https://strida.framer.website",
    lQBdWmB0N: "portfolio",
    dnVagKu6Z: "sidebar",
    Ilm_tuKWl: "UI/UX, Web Design",
    gFi3QPm5F: "Framer, React",
    rA8UF9a3f: "2024 / 2 Weeks",
    tS_yc4nrS: {
      src: "/framerusercontent.com/images/aLickQcDkn7JlTftxkq33tHE.jpg",
      srcSet: "/framerusercontent.com/images/aLickQcDkn7JlTftxkq33tHE.jpg?scale-down-to=512 512w,/framerusercontent.com/images/aLickQcDkn7JlTftxkq33tHE.jpg?scale-down-to=1024 1024w,/framerusercontent.com/images/aLickQcDkn7JlTftxkq33tHE.jpg 2560w",
      alt: "Strida"
    }
  },
  {
    id: "nitro",
    index: 1,
    uTZAUbA1P: "nitro",
    uLRpQRGcH: "Nitro",
    V48QqcuXU: "Nitro — Design System & Web Template",
    rm2tapp6I: "https://nitro.framer.website",
    lQBdWmB0N: "Design System",
    dnVagKu6Z: "Web",
    Ilm_tuKWl: "Design System",
    gFi3QPm5F: "Framer, React",
    rA8UF9a3f: "2024 / 3 Weeks",
    tS_yc4nrS: {
      src: "/framerusercontent.com/images/3aXWeqXIIYMcGQPJZLsEszLm4GE.jpg",
      srcSet: "/framerusercontent.com/images/3aXWeqXIIYMcGQPJZLsEszLm4GE.jpg?scale-down-to=512 512w,/framerusercontent.com/images/3aXWeqXIIYMcGQPJZLsEszLm4GE.jpg?scale-down-to=1024 1024w,/framerusercontent.com/images/3aXWeqXIIYMcGQPJZLsEszLm4GE.jpg 2560w",
      alt: "Nitro"
    }
  },
  {
    id: "bravo",
    index: 2,
    uTZAUbA1P: "bravo",
    uLRpQRGcH: "Bravo",
    V48QqcuXU: "Bravo — Mobile Application Experience",
    rm2tapp6I: "https://bravo.framer.website",
    lQBdWmB0N: "UI/UX",
    dnVagKu6Z: "App",
    Ilm_tuKWl: "Mobile App Design",
    gFi3QPm5F: "Framer, iOS",
    rA8UF9a3f: "2024 / 4 Weeks",
    tS_yc4nrS: {
      src: "/framerusercontent.com/images/ISAjHKBwJV6BJzD55lhE8XAFBM.jpg",
      srcSet: "/framerusercontent.com/images/ISAjHKBwJV6BJzD55lhE8XAFBM.jpg?scale-down-to=512 512w,/framerusercontent.com/images/ISAjHKBwJV6BJzD55lhE8XAFBM.jpg?scale-down-to=1024 1024w,/framerusercontent.com/images/ISAjHKBwJV6BJzD55lhE8XAFBM.jpg 2560w",
      alt: "Bravo"
    }
  },
  {
    id: "fargo",
    index: 3,
    uTZAUbA1P: "fargo",
    uLRpQRGcH: "Fargo",
    V48QqcuXU: "Fargo — SaaS Platform & Design System",
    rm2tapp6I: "https://fargo.framer.website",
    lQBdWmB0N: "SaaS",
    dnVagKu6Z: "Web",
    Ilm_tuKWl: "SaaS UI/UX, Design System",
    gFi3QPm5F: "Framer, Next.js",
    rA8UF9a3f: "2023 / 5 Weeks",
    tS_yc4nrS: {
      src: "/framerusercontent.com/images/vzQsCEYy7zN2RmDQcgrizz0O0MI.jpg",
      srcSet: "/framerusercontent.com/images/vzQsCEYy7zN2RmDQcgrizz0O0MI.jpg?scale-down-to=512 512w,/framerusercontent.com/images/vzQsCEYy7zN2RmDQcgrizz0O0MI.jpg?scale-down-to=1024 1024w,/framerusercontent.com/images/vzQsCEYy7zN2RmDQcgrizz0O0MI.jpg 2560w",
      alt: "Fargo"
    }
  }
];

export default PROJECTS;

export const utils = {
  async getSlugByRecordId(id) {
    const found = PROJECTS.find(p => p.id === id || p.uTZAUbA1P === id);
    return found ? found.uTZAUbA1P : id;
  },
  async getRecordIdBySlug(slug) {
    const found = PROJECTS.find(p => p.uTZAUbA1P === slug || p.id === slug);
    return found ? (found.id || found.uTZAUbA1P) : slug;
  }
};

export const enumToDisplayNameFunctions = {
  qlf78p8v0: (e) => e === "Jn8C0k6b8" ? "Personal" : "Framer"
};

export const __FramerMetadata__ = {
  exports: {
    utils: { type: "variable" },
    default: { type: "data", annotations: { framerCollectionId: "eUOlCMwzv", framerSlug: "uTZAUbA1P" } },
    enumToDisplayNameFunctions: { type: "variable" }
  }
};