export const profile = {
  handle: "0xAeterNova",
  name: "Zaid Tawalbeh",
  title: "Robotics & AI · Cybersecurity · CTF",
  statement: "Building intelligent systems. Breaking systems to understand them.",
  links: {
    github: "https://github.com/0xAeterNova",
    linkedin: "https://www.linkedin.com/in/zaidtawalbeh/",
    ctftime: "https://ctftime.org/user/245368",
    team: "https://ctftime.org/team/412925",
    linktree: "https://linktr.ee/0xAeterNova"
  }
};

// ADD NEW PROJECTS HERE ONLY.
// The Projects panel and project detail view are generated from this array.
// For a new project: copy an object, give it a unique slug, change the text/stack/link,
// and optionally add a matching 3D station type/color.
export const projects = [
  {
    slug: "ruvigil",
    index: "01",
    name: "RuVigil",
    short: "RF sensing without cameras.",
    kicker: "AMBIENT INTELLIGENCE / EMBEDDED",
    year: "2026",
    status: "ACTIVE DEVELOPMENT",
    summary: "Privacy-focused room intelligence using distributed ESP32-S3 nodes and Wi-Fi CSI sensing for presence, vital signals, fall detection, and crowd occupancy.",
    description: "RuVigil explores camera-free human sensing through Wi-Fi channel-state information. Five ESP32-S3 nodes form a distributed sensing platform designed around presence, physiological signals, fall events, and crowd occupancy while preserving visual privacy.",
    contribution: "System integration, embedded architecture, sensing experiments, pipeline development, deployment design, and product direction.",
    stack: ["ESP32-S3", "Wi-Fi CSI", "Rust", "Python", "JavaScript", "TypeScript", "C"],
    repository: "https://github.com/0xAeterNova/RuVigil",
    color: "#22d3ee",
    accent: "#10b981",
    station: "sensor"
  },
  {
    slug: "phantom",
    index: "02",
    name: "PHANTOM",
    short: "Multimodal behavioral AI.",
    kicker: "AI / COMPUTER VISION / AUDIO",
    year: "2026",
    status: "UNDER DEVELOPMENT",
    summary: "A multimodal behavioral-analysis system combining facial understanding, age estimation, expression recognition, and emotion analysis from voice tone.",
    description: "PHANTOM brings visual and audio perception into one behavioral-analysis workflow. Separate models interpret age cues, facial emotion, and vocal emotion before their outputs are combined into one interaction layer.",
    contribution: "Dataset planning, model experiments, computer-vision pipeline, audio-analysis workflow, multimodal integration, and implementation.",
    stack: ["Python", "Deep Learning", "Computer Vision", "Audio Analysis", "YOLO", "PyTorch"],
    repository: "https://github.com/0xAeterNova/PHANTOM",
    color: "#a78bfa",
    accent: "#22d3ee",
    station: "ai"
  },
  {
    slug: "elif-linux",
    index: "03",
    name: "Elif Linux",
    short: "A focused security workstation.",
    kicker: "LINUX / REVERSE ENGINEERING / PWN",
    year: "2026",
    status: "V1.0.0 · EVOLVING",
    summary: "A custom Linux environment designed around reverse engineering, binary exploitation, cryptography, digital forensics, and intentionally selected security tooling.",
    description: "Elif is designed as a focused security workstation instead of an everything-preinstalled distribution. Its direction is a polished Linux environment where reverse engineering, Pwn, crypto, and forensics tooling can be added and maintained intentionally.",
    contribution: "Distribution direction, system customization, workflow design, tool integration, security environment configuration, and release planning.",
    stack: ["Linux", "Bash", "Python", "Shell", "Reverse Engineering", "Pwn", "Forensics"],
    repository: "https://github.com/0xAeterNova/Elif-Linux-Distribution",
    color: "#38bdf8",
    accent: "#7c3aed",
    station: "bunker"
  }
];

export const skills = [
  { group: "Core Languages", items: ["C", "C++", "Python", "Rust", "Bash", "JavaScript", "SQL"] },
  { group: "Robotics / Embedded", items: ["ESP32-S3", "Raspberry Pi", "Arduino", "ROS", "Webots", "Sensors"] },
  { group: "AI / Data", items: ["Computer Vision", "Deep Learning", "PyTorch", "Pandas", "NumPy"] },
  { group: "Security", items: ["Reverse Engineering", "Binary Exploitation", "Digital Forensics", "Linux", "CTF", "OSINT"] }
];
