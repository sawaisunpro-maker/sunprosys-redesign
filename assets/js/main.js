/* ════════════════════════════════════════════════════════
   SUNPROSYS REDESIGN - MAIN JS
   Gear cursor, machine-parts scroll effects
════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Page loaded ─── */
  setTimeout(() => document.body.classList.add('loaded'), 1300);

  /* ─── Custom spanner cursor (filled silhouette) ─── */
  if (window.matchMedia('(hover:hover)').matches) {
    const cur = document.createElement('div'); cur.id = 'cursor';
    const ring = document.createElement('div'); ring.id = 'cursor-ring';
    // SVG combination wrench — dark-grey filled silhouette (matches attached image)
    ring.innerHTML = `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-35 24 24)" fill="#3f3f3f">
        <path fill-rule="evenodd" d="
          M 8 18
          L 28 18
          L 28 12
          L 32 12
          Q 36 12, 36 22
          Q 36 12, 40 12
          L 44 12
          L 44 34
          L 28 34
          L 28 28
          L 8 28
          A 5 5 0 0 0 8 18 Z
          M 10.5 23
          A 2.5 2.5 0 1 0 5.5 23
          A 2.5 2.5 0 1 0 10.5 23 Z
        "/>
      </g>
    </svg>`;
    document.body.appendChild(cur); document.body.appendChild(ring);
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      cur.style.left=mx+'px'; cur.style.top=my+'px';
    });
    (function loop(){
      rx += (mx-rx)*.16; ry += (my-ry)*.16;
      ring.style.left=rx+'px'; ring.style.top=ry+'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.card,.tilt,.biz-item,.r-course,.news-item,input,textarea,select,.feature-card,.voice,.skill-card,.gear-hover').forEach(el=>{
      el.addEventListener('mouseenter',()=>{
        cur.style.transform='translate(-50%,-50%) scale(2.5)';
        cur.style.background='#f4a800';
        ring.style.width='70px'; ring.style.height='70px';
      });
      el.addEventListener('mouseleave',()=>{
        cur.style.transform='translate(-50%,-50%) scale(1)';
        cur.style.background='#2d8e3d';
        ring.style.width='42px'; ring.style.height='42px';
      });
    });
  }

  /* ─── Progress line ─── */
  const pline = document.createElement('div');
  pline.className = 'progress-line';
  document.body.appendChild(pline);
  window.addEventListener('scroll', () => {
    const s = document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    pline.style.width = (s/h*100)+'%';
  });

  /* ─── Header scroll ─── */
  const hdr = document.querySelector('header');
  if (hdr) {
    window.addEventListener('scroll', () => {
      hdr.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /* ─── Back to top ─── */
  const totop = document.createElement('button');
  totop.className = 'totop';
  totop.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4l-7 7M10 4l7 7M10 4v12" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>';
  totop.setAttribute('aria-label','ページ上部へ');
  totop.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
  document.body.appendChild(totop);
  window.addEventListener('scroll', () => {
    totop.classList.toggle('v', window.scrollY > 600);
  });

  /* ─── Mobile nav ─── */
  const burger = document.querySelector('.burger');
  const mnav = document.querySelector('.mnav');
  if (burger && mnav) {
    burger.addEventListener('click', () => {
      const open = mnav.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mnav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mnav.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
  const mclose = document.querySelector('.mnav-close');
  if (mclose) mclose.addEventListener('click', () => {
    mnav.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });

  /* ─── Reveal on scroll ─── */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('v');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.r,.r-l,.r-r,.r-s,.clip-reveal,.clip-up,.plate-reveal,.text-split').forEach(el => revObs.observe(el));

  /* ─── Scroll-reveal for voice header panels (cutout slides up) ─── */
  const dataRevObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        dataRevObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => dataRevObs.observe(el));

  /* ─── Counter ─── */
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let start = null, dur = 1800;
      const step = ts => {
        if (!start) start = ts;
        let p = Math.min((ts-start)/dur, 1);
        let eased = 1 - Math.pow(1-p, 4);
        let val = Math.floor(eased * target);
        el.textContent = val.toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + suffix;
      };
      requestAnimationFrame(step);
      countObs.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

  /* ─── Magnetic buttons ─── */
  document.querySelectorAll('.magnetic').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      b.style.transform = `translate(${x*0.2}px, ${y*0.2}px)`;
    });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });

  /* ─── Tilt cards ─── */
  document.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  /* ─── Parallax ─── */
  function par() {
    const sy = window.scrollY;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (rect.top + sy - window.innerHeight) * speed * -1;
      el.style.transform = `translateY(${offset}px)`;
    });
  }
  window.addEventListener('scroll', par, { passive: true });
  par();

  /* ─── Scroll-driven gear rotation ─── */
  function rotateGears() {
    const sy = window.scrollY;
    document.querySelectorAll('[data-spin]').forEach(el => {
      const speed = parseFloat(el.dataset.spin) || 0.3;
      el.style.transform = `rotate(${sy * speed}deg)`;
    });
  }
  window.addEventListener('scroll', rotateGears, { passive: true });

  /* ─── Hero slider (if present) ─── */
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    const dots = document.querySelectorAll('.hero-pager-dot');
    const cidx = document.getElementById('cidx');
    let cur = 0;
    function go(i) {
      slides[cur].classList.remove('active');
      if (dots[cur]) dots[cur].classList.remove('active');
      cur = i;
      slides[cur].classList.add('active');
      if (dots[cur]) dots[cur].classList.add('active');
      if (cidx) cidx.textContent = String(cur+1).padStart(2,'0');
    }
    dots.forEach((d,i) => d.addEventListener('click', () => go(i)));
    setInterval(() => go((cur+1) % slides.length), 5500);
  }

  /* ─── Page transition on link click (2-color + pictograms) ─── */
  const SLAB_ICONS = [
    // Robot arm
    '<svg class="slab-pic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="54" width="24" height="6" fill="currentColor" opacity=".35"/><circle cx="32" cy="50" r="4"/><line x1="32" y1="50" x2="24" y2="32" stroke-width="6"/><circle cx="24" cy="32" r="3.5"/><line x1="24" y1="32" x2="46" y2="22" stroke-width="5"/><circle cx="46" cy="22" r="3"/><line x1="46" y1="22" x2="54" y2="12" stroke-width="3"/><rect x="50" y="6" width="8" height="6"/></svg>',
    // Gear
    '<svg class="slab-pic" viewBox="0 0 64 64" fill="currentColor"><path d="M32 18a14 14 0 1 0 0 28 14 14 0 0 0 0-28zm0 22a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/><path d="M32 4l2 8h-4l2-8zm0 56l2-8h-4l2 8zm28-28l-8 2v-4l8 2zm-56 0l8-2v4l-8-2zm49-21l-5 6-3-3 8-3zm-42 42l-5 6-3-3 8-3zm45 0l6 5-3 3-3-8zm-42-42l6 5-3 3-3-8z"/></svg>',
    // Cobot
    '<svg class="slab-pic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="32" cy="56" rx="14" ry="3" fill="currentColor" opacity=".35"/><line x1="32" y1="54" x2="32" y2="36" stroke-width="6"/><circle cx="32" cy="36" r="4"/><path d="M32 36 Q 20 28 18 18" stroke-width="4"/><circle cx="18" cy="18" r="3"/><path d="M18 18 Q 28 12 42 14" stroke-width="3"/><circle cx="42" cy="14" r="2.5"/><line x1="42" y1="14" x2="48" y2="8" stroke-width="2"/></svg>',
    // PLC control panel
    '<svg class="slab-pic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="8" width="44" height="48" rx="2"/><line x1="10" y1="20" x2="54" y2="20"/><circle cx="18" cy="14" r="1.8" fill="currentColor"/><circle cx="24" cy="14" r="1.8" fill="currentColor"/><rect x="16" y="26" width="32" height="8" rx="1"/><line x1="16" y1="42" x2="48" y2="42"/><line x1="16" y1="48" x2="48" y2="48"/><rect x="16" y="42" width="6" height="8" fill="currentColor" opacity=".5"/></svg>',
    // PCB
    '<svg class="slab-pic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="10" width="52" height="44" rx="2"/><circle cx="14" cy="18" r="1.8" fill="currentColor"/><circle cx="50" cy="18" r="1.8" fill="currentColor"/><circle cx="14" cy="46" r="1.8" fill="currentColor"/><circle cx="50" cy="46" r="1.8" fill="currentColor"/><rect x="20" y="22" width="14" height="10" rx="1"/><rect x="38" y="34" width="14" height="10" rx="1"/><line x1="14" y1="18" x2="20" y2="22"/><line x1="34" y1="32" x2="38" y2="34"/></svg>',
    // Conveyor
    '<svg class="slab-pic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="32" width="52" height="10" rx="5"/><circle cx="14" cy="37" r="2" fill="currentColor"/><circle cx="50" cy="37" r="2" fill="currentColor"/><rect x="22" y="20" width="10" height="10" fill="currentColor" opacity=".55"/><rect x="36" y="20" width="10" height="10" fill="currentColor" opacity=".4"/></svg>',
    // Gripper
    '<svg class="slab-pic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="26" y="10" width="12" height="14" rx="2"/><line x1="32" y1="24" x2="32" y2="30"/><path d="M26 30 L20 50 L26 52" stroke-width="2.6"/><path d="M38 30 L44 50 L38 52" stroke-width="2.6"/><rect x="18" y="50" width="10" height="4" rx="1"/><rect x="36" y="50" width="10" height="4" rx="1"/></svg>',
    // Sensor
    '<svg class="slab-pic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="22" y="16" width="20" height="34" rx="2"/><circle cx="32" cy="26" r="5" fill="currentColor" opacity=".35"/><circle cx="32" cy="26" r="2.5" fill="currentColor"/><line x1="32" y1="50" x2="32" y2="58"/></svg>',
    // Camera
    '<svg class="slab-pic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="22" width="44" height="28" rx="3"/><circle cx="32" cy="36" r="9"/><circle cx="32" cy="36" r="5"/><rect x="20" y="14" width="12" height="8" rx="1"/><circle cx="46" cy="28" r="1.5" fill="currentColor"/></svg>',
    // Laser
    '<svg class="slab-pic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="8" width="24" height="14" rx="2"/><line x1="32" y1="22" x2="32" y2="40" stroke-width="3" stroke-dasharray="4 3"/><path d="M22 44 L 42 44 L 38 56 L 26 56 Z" fill="currentColor" opacity=".25"/></svg>',
  ];

  // Shuffle helper for variety on each session
  function shuffled(arr){const a = arr.slice();for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}return a}

  const transitionEl = document.createElement('div');
  transitionEl.className = 'page-transition';
  transitionEl.innerHTML = shuffled(SLAB_ICONS).slice(0, 5).map(svg => `<div class="slab">${svg}</div>`).join('');
  document.body.appendChild(transitionEl);

  document.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault();
      // Reshuffle pictograms for each transition (visual variety)
      transitionEl.innerHTML = shuffled(SLAB_ICONS).slice(0, 5).map(svg => `<div class="slab">${svg}</div>`).join('');
      // Force reflow before adding .in class so transition runs from initial state
      void transitionEl.offsetWidth;
      transitionEl.classList.add('in');
      setTimeout(() => { window.location.href = href; }, 850);
    });
  });

  /* ─── Active nav link ─── */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('header nav.h-nav a, .mnav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === path || (path === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });

  /* ─── Insert decorative gears into section corners ─── */
  document.querySelectorAll('[data-gear-corner]').forEach(sec => {
    const positions = sec.dataset.gearCorner.split(',');
    positions.forEach(p => {
      const div = document.createElement('div');
      div.className = 'gear-deco ' + (Math.random() > .5 ? 'reverse' : '');
      const size = 80 + Math.random() * 140;
      div.innerHTML = gearSVG(size);
      const [pos, ...mods] = p.trim().split(' ');
      Object.assign(div.style, {
        position:'absolute',
        ...gearPosition(pos),
      });
      if (mods.includes('y')) div.classList.add('yellow');
      sec.appendChild(div);
    });
  });

  function gearPosition(pos) {
    switch(pos) {
      case 'tl': return {top:'-40px',left:'-40px'};
      case 'tr': return {top:'-40px',right:'-40px'};
      case 'bl': return {bottom:'-40px',left:'-40px'};
      case 'br': return {bottom:'-40px',right:'-40px'};
      case 'c-l': return {top:'40%',left:'2%'};
      case 'c-r': return {top:'40%',right:'2%'};
      default: return {};
    }
  }
  function gearSVG(size){
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 28a22 22 0 1 0 0 44 22 22 0 0 0 0-44zm0 36a14 14 0 1 1 0-28 14 14 0 0 1 0 28z"/>
      <path d="M50 4l3 11h-6l3-11zm0 92l3-11h-6l3 11zm46-46l-11 3v-6l11 3zm-92 0l11-3v6l-11-3zm78.5-32.5l-7 8.5-4.2-4.2 11.2-4.3zM21 79l-7 8.5L18.2 91l4.3-11.2zM82.5 79L91 87.5 79.8 91l4.3-11.2zM21 21l-7-8.5L18.2 9l4.3 11.2z"/>
    </svg>`;
  }
});
