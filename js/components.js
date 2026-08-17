import { profile } from './data.js';

export function nav(active = '') {
  const items = [
    ['Home','index.html','home'],['Projects','projects.html','projects'],['Security','cybersecurity.html','security'],['About','about.html','about'],['Contact','contact.html','contact']
  ];
  return `<nav class="site-nav" aria-label="Primary navigation"><div class="nav-inner">
    <a class="brand" href="index.html" aria-label="${profile.handle} home"><span class="brand-mark"></span><span>${profile.handle}</span></a>
    <button class="menu-btn" aria-label="Toggle navigation" aria-expanded="false">☰</button>
    <div class="nav-links">${items.map(([label,url,key])=>`<a href="${url}" class="${active===key?'active':''} ${key==='contact'?'nav-cta':''}">${label}</a>`).join('')}</div>
  </div></nav>`;
}

export function footer() {
  return `<footer><div class="container footer-inner"><div><span class="mono">${profile.handle}</span> · built for speed, curiosity & systems.</div><div class="footer-links"><a href="${profile.links.github}" target="_blank" rel="noreferrer">GitHub</a><a href="${profile.links.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a><a href="${profile.links.ctftime}" target="_blank" rel="noreferrer">CTFtime</a></div></div></footer>`;
}

export function projectCard(project) {
  return `<article class="project-card reveal" data-category="${project.kicker.toLowerCase()}">
    <div class="project-thumb"><img src="${project.image}" alt="${project.name} project visual" loading="lazy" width="1200" height="720"></div>
    <div class="project-body"><div class="project-topline"><span>${project.kicker}</span><span>${project.year}</span></div><h3>${project.name}</h3><p>${project.summary}</p><div class="tags">${project.stack.slice(0,5).map(x=>`<span class="tag">${x}</span>`).join('')}</div></div>
    <a class="card-link" href="project.html?project=${project.slug}" aria-label="Open ${project.name}"></a>
  </article>`;
}
