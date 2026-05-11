/* ════════════════════════════════════════════════════════
   SUNPROSYS REDESIGN - MAIN JS
   Gear cursor, machine-parts scroll effects
════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Page loaded ─── */
  setTimeout(() => document.body.classList.add('loaded'), 1300);

  /* ─── Custom gear cursor ─── */
  if (window.matchMedia('(hover:hover)').matches) {
    const cur = document.createElement('div'); cur.id = 'cursor';
    const ring = document.createElement('div'); ring.id = 'cursor-ring';
    // SVG gear cursor ring
    ring.innerHTML = `<svg viewBox="0 0 48 48" fill="none">
      <path d="M24 14a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" stroke="#2d8e3d" stroke-width="1.5"/>
      <path d="M24 4l1.5 4M24 44l1.5-4M44 24l-4-1.5M8 24l-4-1.5M38.5 9.5L36 12M12 36l-2.5 2.5M38.5 38.5L36 36M12 12l-2.5-2.5" stroke="#2d8e3d" stroke-width="1.5" stroke-linecap="round"/>
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

  /* ─── Page transition on link click ─── */
  const transitionEl = document.createElement('div');
  transitionEl.className = 'page-transition';
  transitionEl.innerHTML = '<div class="slab"></div><div class="slab"></div><div class="slab"></div><div class="slab"></div><div class="slab"></div>';
  document.body.appendChild(transitionEl);
  document.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault();
      transitionEl.classList.add('in');
      setTimeout(() => { window.location.href = href; }, 700);
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
