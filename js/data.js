export const profile = {
  handle: "0xAeterNova",
  name: "Zaid Tawalbeh",
  title: "Robotics & AI · Cybersecurity · CTF",
  intro: "I build intelligent systems, embedded prototypes, and security tooling at the intersection of robotics, AI, and offensive security.",
  location: "Jordan",
  status: "Building intelligent systems. Breaking systems to understand them.",
  links: {
    github: "https://github.com/0xAeterNova",
    linkedin: "https://www.linkedin.com/in/zaidtawalbeh/",
    ctftime: "https://ctftime.org/user/245368",
    team: "https://ctftime.org/team/412925",
    linktree: "https://linktr.ee/0xAeterNova"
  }
};

// ADD A NEW PROJECT HERE.
// 1) Copy one object.
// 2) Change the slug/name/text/links.
// 3) Put its image in assets/projects/ and change image.
// It will automatically appear on projects.html and project.html?project=YOUR-SLUG.
export const projects = [
  {
    slug: "ruvigil",
    name: "RuVigil",
    kicker: "Ambient Intelligence / Embedded",
    year: "2026",
    featured: true,
    status: "Active development",
    summary: "Privacy-focused, camera-free room monitoring using a five-node ESP32-S3 deployment and Wi-Fi CSI sensing.",
    description: "RuVigil explores presence, vital-signal sensing, fall detection, and crowd occupancy without relying on cameras. The project combines distributed ESP32-S3 nodes, Wi-Fi channel-state information, embedded development, and analysis software into one sensing platform.",
    contribution: "System integration, embedded architecture, experimentation, sensing pipeline, and product direction.",
    stack: ["ESP32-S3", "Wi-Fi CSI", "Rust", "Python", "JavaScript", "TypeScript", "C"],
    image: "assets/projects/ruvigil.svg",
    repository: "https://github.com/0xAeterNova/RuVigil"
  },
  {
    slug: "phantom",
    name: "PHANTOM",
    kicker: "Multimodal Artificial Intelligence",
    year: "2026",
    featured: true,
    status: "Under development",
    summary: "A behavioral-analysis AI module combining facial understanding, age estimation, expression recognition, and voice-emotion analysis.",
    description: "PHANTOM is designed as a multimodal perception system. It brings visual and audio signals into a single behavioral-analysis workflow, with separate models for demographic cues, facial emotion, and vocal emotion.",
    contribution: "Dataset design, multimodal pipeline planning, model experimentation, integration, and system implementation.",
    stack: ["Python", "Deep Learning", "Computer Vision", "Audio Analysis", "YOLO", "PyTorch"],
    image: "assets/projects/phantom.svg",
    repository: "https://github.com/0xAeterNova/PHANTOM"
  },
  {
    slug: "elif-linux",
    name: "Elif Linux Distribution",
    kicker: "Security / Linux",
    year: "2026",
    featured: true,
    status: "v1.0.0 · evolving",
    summary: "A custom Linux environment shaped for reverse engineering, binary exploitation, cryptography, and digital-forensics workflows.",
    description: "Elif is a focused security workstation rather than an everything-preinstalled distribution. The goal is a polished environment where reverse engineering, pwn, cryptography, and forensics tooling can be installed and maintained intentionally.",
    contribution: "Distribution direction, workflow design, customization, security-tool integration, and system configuration.",
    stack: ["Linux", "Bash", "Python", "Shell", "Reverse Engineering", "Pwn", "Forensics"],
    image: "assets/projects/elif-linux.svg",
    repository: "https://github.com/0xAeterNova/Elif-Linux-Distribution"
  }
];

export const skills = [
  { group: "Core languages", items: ["C", "C++", "Python", "Rust", "Bash", "JavaScript", "SQL"] },
  { group: "Robotics & embedded", items: ["ESP32-S3", "Raspberry Pi", "Arduino", "ROS", "Webots", "Sensors", "Embedded systems"] },
  { group: "AI & data", items: ["Computer Vision", "Deep Learning", "PyTorch", "Pandas", "NumPy", "Data Analysis"] },
  { group: "Security", items: ["Reverse Engineering", "Binary Exploitation", "Digital Forensics", "Linux", "CTF", "OSINT"] }
];

export const achievements = [
  {
    title: "Locked Temple · Writeup Challenge Winner",
    type: "CTF / Reverse Engineering",
    text: "Recognized for a technical writeup covering the Locked Temple reverse-engineering challenge.",
    link: "https://github.com/0xAeterNova/upctf-writeups/blob/main/REV/Locked%20Temple/Write-Up.md"
  }
];
