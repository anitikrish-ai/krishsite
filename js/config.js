/*
 * Central site data.
 * Edit this file to update identity, social links or projects.
 * Every page that lists them reads from here.
 */
window.SITE = {
  identity: {
    name: "Krish Makwana",
    shortName: "Krish",
    role: "Computer Engineering Student · Idea Creator · AI-Assisted Developer · Artist",
    blurb: "I design my own ideas and build them with AI as a tool, and I draw alongside it, traditional and digital.",
    year: new Date().getFullYear() || 2026
  },

  // Keys match the platform for icon lookup in js/site.js
  socials: [
    {
      id: "github-primary",
      platform: "github",
      name: "GitHub",
      handle: "anitikrish-ai",
      url: "https://github.com/anitikrish-ai",
      note: "Primary account. AI-assisted builds, tools and experiments.",
      tag: "Code"
    },
    {
      id: "github-personal",
      platform: "github",
      name: "GitHub",
      handle: "KrishMakwana07",
      url: "https://github.com/KrishMakwana07",
      note: "Personal account and earlier work.",
      tag: "Code"
    },
    {
      id: "youtube",
      platform: "youtube",
      name: "YouTube",
      handle: "@NUA_Lite",
      url: "https://www.youtube.com/@NUA_Lite",
      note: "Videos and builds.",
      tag: "Video"
    },
    {
      id: "instagram",
      platform: "instagram",
      name: "Instagram",
      handle: "@07krish_x",
      url: "https://www.instagram.com/07krish_x",
      note: "Art, sketches and behind-the-scenes.",
      tag: "Art"
    },
    {
      id: "pinterest",
      platform: "pinterest",
      name: "Pinterest",
      handle: "Krish",
      url: "https://pin.it/2QrPPjk8p",
      note: "Anime art, digital art and inspiration boards.",
      tag: "Art"
    }
  ],

  // status: "live" | "development" | "collaborative"
  projects: [
    {
      id: "zip-to-git",
      name: "ZIP-TO-GIT",
      status: "live",
      category: "Developer tool",
      desc: "A simple GitHub publishing tool. Connect your GitHub account, upload a project ZIP, and publish it to a repository through an easy workflow. It is built to work conveniently even from smaller devices, including mobile.",
      links: [
        { label: "Repository", url: "https://github.com/anitikrish-ai/zip-to-git" }
      ]
    },
    {
      id: "dropfast",
      name: "DropFast",
      status: "live",
      category: "File sharing",
      desc: "A fast file and image sharing platform for moving content between devices, with one-to-one and one-to-many sharing.",
      links: [
        { label: "Open DropFast", url: "https://dropfast.lovable.app" }
      ]
    },
    {
      id: "ikis-paint-web",
      name: "Ikis Paint Web",
      status: "live",
      category: "Creative studio",
      desc: "A browser-based painting application inspired by ibis Paint X, with Liquid Glass UI support. Built for desktop browsers.",
      links: [
        { label: "Repository", url: "https://github.com/anitikrish-ai/ikis-paint-web" }
      ]
    },
    {
      id: "driftjs",
      name: "DriftJS",
      status: "collaborative",
      category: "Frontend framework",
      desc: "A frontend UI framework and reactivity engine powered by an in-browser register-based bytecode virtual machine and an ahead-of-time optimizing compiler. It compiles .drift Single File Components into compact instruction streams, executed by a lightweight 256-register VM for direct DOM updates, with server-side rendering and static site generation through shared compiled bytecode. Built collaboratively with friends as a college project, and presented here as team engineering work, not sole authorship.",
      links: [
        { label: "Organization", url: "https://github.com/driftjs-org" }
      ]
    },
    {
      id: "multify",
      name: "MUlTiFy",
      status: "development",
      category: "Productivity",
      desc: "Cross-platform workspace and media hub for organizing and running several creative streams at once.",
      links: [
        { label: "GitHub", url: "https://github.com/KrishMakwana07" }
      ]
    },
    {
      id: "photo-editor",
      name: "Photo Editor",
      status: "development",
      category: "Media utility",
      desc: "Single-page browser photo editor for quick adjustments, filters, transforms and client-side export.",
      links: [
        { label: "GitHub", url: "https://github.com/KrishMakwana07" }
      ]
    },
    {
      id: "optimser-extension",
      name: "Optimser Extension",
      status: "development",
      category: "Browser extension",
      desc: "Lightweight extension that improves browsing speed and workflow with small, focused UI changes.",
      links: [
        { label: "GitHub", url: "https://github.com/KrishMakwana07" }
      ]
    }
  ]
};
