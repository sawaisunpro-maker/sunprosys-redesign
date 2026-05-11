/* ════════════════════════════════════════════════════════
   SUNPROSYS REDESIGN - MAIN JS
════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Page loaded ─── */
  setTimeout(() => document.body.classList.add('loaded'), 1300);

  /* ─── Custom cursor ─── */
  if (window.matchMedia('(hover:hover)').matches) {
    const cur = document.createElement('div'); cur.id = 'cursor';
    const ring = document.createElement('div'); ring.id = 'cursor-ring';
    document.body.appendChild(cur); document.body.appendChild(ring);
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      cur.style.left=mx+'px'; cur.style.top=my+'px';
    });
    (function loop(){
      rx += (mx-rx)*.18; ry += (my-ry)*.18;
      ring.style.left=rx+'px'; ring.style.top=ry+'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.card,.tilt,.biz-item,.r-course,.news-item,input,textarea').forEach(el=>{
      el.addEventListener('mouseenter',()=>{
        cur.style.transform='translate(-50%,-50%) scale(2.5)';
        ring.style.width='60px'; ring.style.height='60px';
      });
      el.addEventListener('mouseleave',()=>{
        cur.style.transform='translate(-50%,-50%) scale(1)';
        ring.style.width='38px'; ring.style.height='38px';
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
  totop.innerHTML = '↑';
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
  document.querySelectorAll('.r,.r-l,.r-r,.r-s,.clip-reveal,.clip-up,.text-split').forEach(el => revObs.observe(el));

  /* ─── Split text into chars ─── */
  document.querySelectorAll('.text-split').forEach(el => {
    const txt = el.textContent;
    el.textContent = '';
    [...txt].forEach((c,i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c === ' ' ? ' ' : c;
      s.style.transitionDelay = (i*0.04)+'s';
      el.appendChild(s);
    });
  });

  /* ─── Counter animation ─── */
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimals = (el.dataset.count.split('.')[1] || '').length;
      let start = null, dur = 1600;
      const step = ts => {
        if (!start) start = ts;
        let p = Math.min((ts-start)/dur, 1);
        let eased = 1 - Math.pow(1-p, 4);
        let val = (eased * target).toFixed(decimals);
        el.textContent = (decimals ? val : Math.floor(val).toLocaleString()) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = (decimals ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
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

  /* ─── Hero canvas particles (only if exists) ─── */
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let W, H, pts = [], animId;
    function resize(){W=heroCanvas.width=heroCanvas.offsetWidth;H=heroCanvas.height=heroCanvas.offsetHeight;}
    class P {
      constructor(){this.reset();}
      reset(){
        this.x = Math.random()*W; this.y = Math.random()*H;
        this.vx = (Math.random()-.5)*.4; this.vy = (Math.random()-.5)*.4;
        this.r = Math.random()*2 + .8; this.a = Math.random()*.4 + .3;
      }
      update(){
        this.x += this.vx; this.y += this.vy;
        if (this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
      }
      draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(43,184,217,${this.a})`;
        ctx.fill();
      }
    }
    function init(){resize();pts=[];const c=Math.min(Math.floor(W*H/9000),150);for(let i=0;i<c;i++)pts.push(new P());}
    function draw(){
      ctx.clearRect(0,0,W,H);
      for(let i=0;i<pts.length;i++){
        for(let j=i+1;j<pts.length;j++){
          const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if(d<130){
            ctx.beginPath();
            ctx.moveTo(pts[i].x,pts[i].y);
            ctx.lineTo(pts[j].x,pts[j].y);
            ctx.strokeStyle = `rgba(43,184,217,${.18*(1-d/130)})`;
            ctx.lineWidth=.6; ctx.stroke();
          }
        }
      }
      pts.forEach(p=>{p.update();p.draw();});
      animId=requestAnimationFrame(draw);
    }
    window.addEventListener('resize',()=>{cancelAnimationFrame(animId);init();draw();});
    init(); draw();
  }

  /* ─── Page transition on link click ─── */
  const transitionEl = document.createElement('div');
  transitionEl.className = 'page-transition';
  transitionEl.innerHTML = '<div class="slab"></div><div class="slab"></div><div class="slab"></div><div class="slab"></div><div class="slab"></div>';
  document.body.appendChild(transitionEl);
  // Trigger on internal links
  document.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault();
      transitionEl.classList.add('in');
      setTimeout(() => { window.location.href = href; }, 700);
    });
  });

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

  /* ─── Active nav link ─── */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('header nav.h-nav a, .mnav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === path || (path === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });

});
