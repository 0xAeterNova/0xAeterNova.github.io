const AETER_DATA = {
  identity: {
    handle: "0xAeterNova",
    tagline: "Bridging Silicon, Neural Perception, and Low-Level Exploitation",
    philosophy: "Build → Disassemble → Understand → Reinvent",
    status: "SYSTEM OPERATIONAL // TRANSMISSION ACTIVE",
    location: "CYBERNETIC NEXUS // DISTRIBUTED GRID",
    stats: [
      { label: "SECURITY AUDITS", value: "48+" },
      { label: "EMBEDDED NODES", value: "120+" },
      { label: "CTF CHALLENGES", value: "350+" },
      { label: "SYSTEM RUNTIME", value: "99.98%" }
    ]
  },

  districts: [
    { id: "00", name: "Origin", label: "TRANSMISSION CORE", color: "#00f0ff", pos: [0, 0, 0] },
    { id: "01", name: "Archive", label: "FLAGSHIP SYSTEMS", color: "#ff007f", pos: [60, 5, -80] },
    { id: "02", name: "Breach", label: "PWN / BINARY LAB", color: "#ffb700", pos: [-80, -5, -60] },
    { id: "03", name: "Forge", label: "PROTOTYPE DISTRICT", color: "#00ff66", pos: [90, 15, 40] },
    { id: "04", name: "Arsenal", label: "CAPABILITY MATRIX", color: "#9d00ff", pos: [-70, 20, 70] },
    { id: "05", name: "Missions", label: "CTF DECK & AWARDS", color: "#ff3300", pos: [0, 30, -120] },
    { id: "06", name: "Trajectory", label: "SPATIAL TIMELINE", color: "#00e5ff", pos: [-110, -10, 0] },
    { id: "07", name: "Orbit", label: "IDENTITY & ORIGIN", color: "#f5ecd7", pos: [0, -15, 100] },
    { id: "08", name: "Uplink", label: "COMMUNICATION NODE", color: "#00ffa6", pos: [110, -5, -20] }
  ],

  projects: [
    {
      id: "ruvigil",
      title: "RuVigil",
      category: "Robotics / RF Sensing",
      badge: "FLAGSHIP 01",
      worldType: "rf-cathedral",
      color: "#00f0ff",
      summary: "Non-invasive electromagnetic human presence and biometrics detection using ESP32 mesh arrays and passive RF distortion tomography.",
      techStack: ["C++", "ESP-IDF", "FreeRTOS", "Python", "NumPy", "DSP", "Signal Analysis"],
      details: {
        architecture: "Distributed multi-node CSI (Channel State Information) extraction with Kalman-filtered phase-shift classification.",
        features: [
          "Sub-carrier amplitude variance tracking for passive through-wall movement sensing",
          "Edge-computed Fourier transformations directly on ESP32 microcontrollers",
          "Low-latency real-time telemetry streaming over encrypted WebSockets"
        ],
        repo: "https://github.com/0xAeterNova/RuVigil"
      }
    },
    {
      id: "phantom",
      title: "PHANTOM",
      category: "AI / Computer Vision",
      badge: "FLAGSHIP 02",
      worldType: "neural-chamber",
      color: "#ff007f",
      summary: "Neural perception framework for multi-modal emotion and micro-expression analysis via high-density 3D facial landmark temporal point clouds.",
      techStack: ["Python", "PyTorch", "OpenCV", "CUDA", "TensorRT", "C++ Engine"],
      details: {
        architecture: "Spatio-temporal graph convolutional networks (ST-GCN) analyzing 468-point volumetric facial vectors at 120 FPS.",
        features: [
          "Micro-saccade and involuntary ocular movement tracking",
          "Real-time TensorRT model optimization running sub-4ms inference latency",
          "Non-deterministic emotional state confidence clustering"
        ],
        repo: "https://github.com/0xAeterNova/PHANTOM"
      }
    },
    {
      id: "elif-linux",
      title: "Elif Linux",
      category: "Systems / Kernel Reactor",
      badge: "FLAGSHIP 03",
      worldType: "kernel-bunker",
      color: "#00ff66",
      summary: "Hardened custom Linux distribution tailored for reverse engineering, isolated binary exploitation testbeds, and kernel-level trace forensics.",
      techStack: ["C", "Assembly", "Linux Kernel", "Bash", "eBPF", "QEMU", "GDB"],
      details: {
        architecture: "Stripped kernel with custom eBPF hooks for syscall interception, KASLR bypass mitigation research, and preloaded ROP/heap analyzers.",
        features: [
          "Zero-overhead automated binary unpacking and dynamic analysis sandbox",
          "Real-time memory structure visualization integrated with GDB/GEF",
          "Deterministic network traffic containment and raw packet injection"
        ],
        repo: "https://github.com/0xAeterNova/Elif-Linux"
      }
    },
    {
      id: "geomravage",
      title: "GeomRavage Exploit Framework",
      category: "Binary Exploitation / Pwn",
      badge: "SECURITY LAB",
      worldType: "exploit-matrix",
      color: "#ffb700",
      summary: "Automated ROP chain generator, heap layout simulator, and format-string payload synthesizer for x86_64 binaries.",
      techStack: ["Python", "Pwntools", "C", "Z3 SMT Solver", "Capstone", "Ropper"],
      details: {
        architecture: "Symbolic execution pipeline computing constraint-satisfaction routes through ASLR and stack canary protected architectures.",
        features: [
          "Automated glibc heap chunks manipulation and fastbin/tcache poisoning verification",
          "Constraint-solver driven dynamic gadget discovery",
          "Integrated CTF exploit harness generation"
        ],
        repo: "https://github.com/0xAeterNova/GeomRavage"
      }
    }
  ],

  arsenal: [
    {
      cluster: "Robotics & Hardware",
      color: "#00f0ff",
      technologies: ["ESP32 / ARM Cortex", "FreeRTOS", "I2C / SPI / CAN Bus", "RF / CSI Tomography", "Actuator Kinematics", "PCB Design"]
    },
    {
      cluster: "Artificial Intelligence",
      color: "#ff007f",
      technologies: ["Computer Vision", "PyTorch / CUDA", "TensorRT", "Point Cloud DSP", "ST-GCN Networks", "Edge Inference"]
    },
    {
      cluster: "Cybersecurity & Pwn",
      color: "#ffb700",
      technologies: ["Reverse Engineering", "Binary Exploitation", "ROP Synthesis", "Heap Metadata Corruption", "eBPF Trace Analysis", "Digital Forensics"]
    },
    {
      cluster: "Low-Level & Systems",
      color: "#00ff66",
      technologies: ["Linux Kernel", "x86_64 / ARM Assembly", "C / C++", "Rust Systems", "Memory Layout Optimization", "POSIX Concurrency"]
    }
  ],

  missions: [
    { title: "National Cyber Challenge", rank: "1st Place", category: "Pwn / Rev", year: "2025", desc: "Crafted multi-stage kernel zero-day exploit and eBPF trace evasion chain." },
    { title: "DefCon Qualifier CTF", rank: "Top 3%", category: "Binary Exploitation", year: "2025", desc: "Solved obscure heap grooming challenge targeting hardened jemalloc arenas." },
    { title: "Autonomous Robotics Showcase", rank: "Gold Award", category: "Embedded AI", year: "2024", desc: "Deployed sub-watt neural landmark detection on autonomous micro-rovers." },
    { title: "Global Forensics Invitational", rank: "Finalist", category: "Digital Forensics", year: "2024", desc: "Reconstructed air-gapped filesystem transaction timelines from raw volatile memory dumps." }
  ],

  trajectory: [
    { epoch: "PHASE 01", title: "Binary Foundations", time: "2021", focus: "Low-level x86 Assembly, memory mechanics, C systems programming, and debugger engineering." },
    { epoch: "PHASE 02", title: "Pwn & CTF Dominance", time: "2022 - 2023", focus: "Reverse engineering, ROP chain automation, heap vulnerability mechanics, and digital forensics." },
    { epoch: "PHASE 03", title: "Silicon & Embedded Mesh", time: "2023 - 2024", focus: "ESP32 hardware exploitation, RF CSI sensing, signal tomography, and real-time RTOS firmware." },
    { epoch: "PHASE 04", title: "Neural & Vision Fusion", time: "2024 - 2025", focus: "Edge TensorRT perception, spatial point cloud tracking, and robotic kinematic control loops." },
    { epoch: "PHASE 05", title: "Cybernetic Singularity", time: "CURRENT", focus: "Autonomous embedded intelligence, hardware-level security, and immersive spatial human-machine interfaces." }
  ]
};
