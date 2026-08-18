export const profile = {
  handle: '0xAeterNova',
  name: 'Zaid Tawalbeh',
  title: 'Robotics & AI · Cybersecurity · CTF',
  statement: 'I build intelligent systems, explore machine behavior, and break software apart to understand how it really works.',
  location: 'Jordan',
  focus: ['Robotics & AI', 'Reverse Engineering', 'Binary Exploitation', 'Embedded Systems', 'Computer Vision'],
  links: {
    github: 'https://github.com/0xAeterNova',
    linkedin: 'https://www.linkedin.com/in/zaidtawalbeh/',
    ctftime: 'https://ctftime.org/user/245368',
    team: 'https://ctftime.org/team/412925',
    linktree: 'https://linktr.ee/0xAeterNova',
    instagram: 'https://www.instagram.com/0xaeternova/',
    telegram: 'https://t.me/OxAtereNova'
  }
};

export const projects = [
  {
    slug: 'ruvigil',
    name: 'RuVigil',
    label: '01 / RF SENSING',
    tagline: 'Privacy-first human sensing without cameras.',
    summary: 'A camera-free room monitoring system using a five-node ESP32-S3 deployment and Wi-Fi CSI sensing for presence, vital-signal, fall and crowd-awareness research.',
    long: 'RuVigil explores how radio-frequency sensing can turn ordinary Wi-Fi signals into a privacy-focused perception layer. The system combines multiple ESP32-S3 nodes, signal processing and software services to study presence, motion, vital signals, falls and occupancy without relying on a visible camera feed.',
    year: '2026',
    status: 'Active development',
    role: 'Developer',
    stack: ['ESP32-S3', 'Wi-Fi CSI', 'Rust', 'Python', 'JavaScript', 'TypeScript', 'C'],
    repository: 'https://github.com/0xAeterNova/RuVigil',
    poster: 'assets/projects/ruvigil.svg',
    realm: 'ruvigil',
    accent: '#47f5ff'
  },
  {
    slug: 'phantom',
    name: 'PHANTOM',
    label: '02 / HUMAN SIGNAL AI',
    tagline: 'A multimodal behavioral analysis engine.',
    summary: 'A deep-learning module for age estimation, male-or-female presentation, facial emotion recognition and emotion analysis from voice tone.',
    long: 'PHANTOM combines visual and audio signals into one experimental behavioral-analysis pipeline. The project studies facial emotion, age estimation and voice emotion while presenting the outputs as a unified perception system rather than isolated models.',
    year: '2026',
    status: 'Under development',
    role: 'Developer',
    stack: ['Deep Learning', 'Computer Vision', 'Audio Analysis', 'Python', 'Camera', 'Microphone'],
    repository: 'https://github.com/0xAeterNova/PHANTOM',
    poster: 'assets/projects/phantom.svg',
    realm: 'phantom',
    accent: '#ff5bd7'
  },
  {
    slug: 'elif-linux',
    name: 'Elif Linux',
    label: '03 / SECURITY OS',
    tagline: 'A Linux environment shaped for low-level security work.',
    summary: 'A custom Linux distribution focused on reverse engineering, binary exploitation, cryptography and digital-forensics workflows.',
    long: 'Elif is a personal Linux environment built around the workflows that matter most for low-level security practice: reverse engineering, binary exploitation, cryptography and forensics. The project is less about shipping every tool and more about creating a focused system that feels intentional.',
    year: '2026',
    status: 'v1.0.0 · continuing development',
    role: 'Creator / Developer',
    stack: ['Linux', 'Bash', 'Python', 'Shell', 'Security Tooling', 'System Customization'],
    repository: 'https://github.com/0xAeterNova/Elif-Linux-Distribution',
    poster: 'assets/projects/elif.svg',
    realm: 'elif',
    accent: '#b9ff43'
  }
];

export const skills = [
  { name: 'Robotics', family: 'Build', signal: 'physical intelligence' },
  { name: 'Embedded Systems', family: 'Build', signal: 'hardware + firmware' },
  { name: 'Artificial Intelligence', family: 'Think', signal: 'learning systems' },
  { name: 'Computer Vision', family: 'Think', signal: 'machine perception' },
  { name: 'Reverse Engineering', family: 'Break', signal: 'binary understanding' },
  { name: 'Binary Exploitation', family: 'Break', signal: 'memory + control flow' },
  { name: 'Digital Forensics', family: 'Break', signal: 'evidence + artifacts' },
  { name: 'Linux', family: 'Systems', signal: 'operating environments' },
  { name: 'Python', family: 'Code', signal: 'rapid systems + AI' },
  { name: 'C / C++', family: 'Code', signal: 'low-level control' },
  { name: 'Rust', family: 'Code', signal: 'safe systems' },
  { name: 'CTF', family: 'Practice', signal: 'pressure-tested curiosity' }
];

export const achievements = [
  {
    title: 'Writeup Challenge Winner — Locked Temple',
    text: 'Technical reverse-engineering writeup selected as a challenge winner.',
    url: 'https://github.com/0xAeterNova/upctf-writeups/blob/main/REV/Locked%20Temple/Write-Up.md'
  },
  {
    title: 'GeomRavage',
    text: 'CTF team focused on practical competition work.',
    url: 'https://ctftime.org/team/412925'
  }
];

export const realms = [
  { id: 'home', name: 'Origin', subtitle: 'Living Singularity', number: '00', palette: ['#f7f0d8', '#ff6a3d', '#5b2cff'], icon: '✦' },
  { id: 'projects', name: 'Archive', subtitle: 'Project Constellation', number: '01', palette: ['#fff4cb', '#ff2ea6', '#19e6ff'], icon: '◈' },
  { id: 'cyber', name: 'Breach', subtitle: 'CTF / Security', number: '02', palette: ['#faff00', '#ff5a1f', '#0a0a08'], icon: '⌁' },
  { id: 'about', name: 'Orbit', subtitle: 'About / Skills', number: '03', palette: ['#ffd87a', '#7d52ff', '#26e6b4'], icon: '◎' },
  { id: 'contact', name: 'Uplink', subtitle: 'Contact', number: '04', palette: ['#88ffd5', '#ff9b78', '#6755ff'], icon: '⌁' }
];

export const commandEntries = [
  { label: 'Go to Origin', route: 'home', keywords: 'home origin intro' },
  { label: 'Open Project Archive', route: 'projects', keywords: 'projects work archive' },
  ...projects.map(p => ({ label: `Project · ${p.name}`, route: `project/${p.slug}`, keywords: `${p.name} ${p.stack.join(' ')}` })),
  { label: 'Open Cyber Realm', route: 'cyber', keywords: 'ctf cybersecurity reverse engineering pwn' },
  { label: 'Open About Orbit', route: 'about', keywords: 'about skills profile education' },
  { label: 'Open Contact Uplink', route: 'contact', keywords: 'contact links github linkedin' }
];
