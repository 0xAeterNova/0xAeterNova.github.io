export function initShell() {
  const nav = document.querySelector('.site-nav');
  const menu = document.querySelector('.menu-btn');
  const links = document.querySelector('.nav-links');
  const updateNav = () => nav?.classList.toggle('scrolled', scrollY > 18);
  updateNav(); addEventListener('scroll', updateNav, {passive:true});
  menu?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? '×' : '☰';
  });

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }), {threshold:.12, rootMargin:'0px 0px -4%'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault(); document.body.classList.add('leaving');
      setTimeout(()=>location.href=href, 330);
    });
  });

  document.body.insertAdjacentHTML('beforeend','<div class="page-transition" aria-hidden="true"></div>');
}

export function renderInto(selector, html) { const el=document.querySelector(selector); if(el) el.innerHTML=html; }
