window.AETER_DATA = {
  profile: {
    handle: '0xAeterNova',
    name: 'Zaid Tawalbeh',
    title: 'Robotics & AI // Cybersecurity // Systems',
    intro: 'I build intelligent machines, study the systems beneath them, and break assumptions until the architecture gets better.',
    about: [
      'I work across robotics, artificial intelligence, embedded systems, Linux, reverse engineering and binary exploitation. I like projects where software has to touch the physical world, where constraints matter, and where the final system has a point of view.',
      'My current direction is the intersection of sensing, autonomy, security and human-centered intelligent systems — from Wi-Fi sensing and embedded nodes to computer vision, custom Linux workflows and CTF research.'
    ],
    current: 'Advanced robotics modules, Wi-Fi sensing, reverse engineering & PWN.',
    location: 'Jordan',
    team: 'GeomRavage',
    ctfFocus: ['Reverse Engineering','Pwn','Forensics','OSINT'],
    links: {
      github: 'https://github.com/0xAeterNova/',
      linkedin: 'https://www.linkedin.com/in/zaidtawalbeh/',
      ctftime: 'https://ctftime.org/user/245368',
      team: 'https://ctftime.org/team/412925',
      linktree: 'https://linktr.ee/0xAeterNova',
      instagram: 'https://www.instagram.com/0xaeternova/',
      telegram: 'https://t.me/OxAtereNova'
    }
  },
  projects: [
    {
      slug:'ruvigil', name:'RuVigil', index:'01', realm:'RF CATHEDRAL', status:'UPGRADING', year:'2026', featured:true,
      tagline:'Camera-free human sensing through Wi-Fi CSI and distributed ESP32-S3 nodes.',
      description:'A privacy-focused sensing platform that explores presence, vital-sign estimation, fall events and occupancy using a five-node ESP32-S3 deployment and Wi-Fi channel-state information.',
      contribution:'System architecture, multi-node deployment, ESP32-S3 integration, sensing modes, server-side experimentation and product direction.',
      stack:['ESP32-S3','Wi-Fi CSI','Rust','Python','JavaScript','TypeScript','C'],
      repo:'https://github.com/0xAeterNova/RuVigil',
      palette:['#35f4ff','#ffb14a','#d7fff2'],
      scene:'rf'
    },
    {
      slug:'phantom', name:'PHANTOM', index:'02', realm:'NEURAL MIRROR', status:'UNDER DEVELOPMENT', year:'2026', featured:true,
      tagline:'A multimodal behavioral-analysis system for age, presentation and emotion.',
      description:'A deep-learning module that combines facial analysis with voice-tone analysis to estimate age ranges, presentation and emotional state from camera and microphone input.',
      contribution:'Multimodal concept, dataset pipeline, model integration, real-time inference workflow and interface experimentation.',
      stack:['Deep Learning','Computer Vision','Audio Analysis','Python','OpenCV','YOLO','scikit-learn'],
      repo:'https://github.com/0xAeterNova/PHANTOM',
      palette:['#ff3db8','#816bff','#99ffd9'],
      scene:'neural'
    },
    {
      slug:'elif-linux', name:'Elif Linux', index:'03', realm:'KERNEL FORGE', status:'V1 READY', year:'2026', featured:true,
      tagline:'A custom Linux environment shaped around reverse engineering and exploitation workflows.',
      description:'A custom Linux distribution and workflow environment focused on reverse engineering, binary exploitation, cryptography and digital-forensics tooling without the noise of a general-purpose security distro.',
      contribution:'Distribution direction, package/tool workflow, shell customization, security environment design and release packaging.',
      stack:['Linux','Bash','Python','Shell','Security Tooling','System Customization'],
      repo:'https://github.com/0xAeterNova/Elif-Linux-Distribution',
      palette:['#a9ff32','#ff5c45','#e9ffcc'],
      scene:'forge'
    }
  ],
  skills: [
    {group:'BUILD', items:['C','C++','Python','Rust','Bash','CMake','Git']},
    {group:'INTELLIGENCE', items:['Machine Learning','Deep Learning','Computer Vision','Data Science','Audio Analysis']},
    {group:'PHYSICAL', items:['Robotics','ROS','ESP32','Arduino','Raspberry Pi','Embedded Systems','Sensors']},
    {group:'BREAK', items:['Reverse Engineering','Pwn','Linux','Forensics','OSINT','CTF']},
    {group:'SYSTEMS', items:['Linux','Arch','Debian','Windows','Cloud','MySQL','Networking']}
  ],
  achievements: [
    {title:'Locked Temple', detail:'Writeup Challenge Winner', href:'https://github.com/0xAeterNova/upctf-writeups/blob/main/REV/Locked%20Temple/Write-Up.md'},
    {title:'GeomRavage', detail:'CTF Team', href:'https://ctftime.org/team/412925'},
    {title:'CTFtime', detail:'0xAeterNova profile', href:'https://ctftime.org/user/245368'}
  ]
};
