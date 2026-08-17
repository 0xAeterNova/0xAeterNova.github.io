import { profile, projects, skills } from './data.js'; import { nav, footer, projectCard } from './components.js'; import { initShell, renderInto } from './site.js'; import { initThreeStage } from './three-scene.js';
renderInto('#nav',nav('home'));renderInto('#footer',footer());
document.querySelector('#featured-projects').innerHTML=projects.filter(p=>p.featured).map(projectCard).join('');
document.querySelector('#skills').innerHTML=skills.map(s=>`<div class="skill-group"><h3>${s.group}</h3><div class="skill-cloud">${s.items.map(i=>`<span class="skill">${i}</span>`).join('')}</div></div>`).join('');
document.querySelector('[data-name]').textContent=profile.name;document.querySelector('[data-intro]').textContent=profile.intro;
initShell();initThreeStage();
