document.addEventListener('DOMContentLoaded', () => {
  const DB = {
    get: (k, d=[]) => JSON.parse(localStorage.getItem('novalia_'+k) || JSON.stringify(d)),
    set: (k, v) => localStorage.setItem('novalia_'+k, JSON.stringify(v)),
    toast: (msg, type='success') => {
      let t = document.createElement('div');
      t.innerText = msg;
      t.style.cssText = `position:fixed; bottom:25px; right:25px; background:${type==='success'?'#b27b38':'#c0392b'}; color:#fff; padding:14px 22px; border-radius:999px; z-index:99999; box-shadow:0 8px 25px rgba(0,0,0,.2); font-weight:700; transition:all .4s ease`;
      document.body.appendChild(t);
      setTimeout(()=>t.remove(), 3500);
    }
  };

  // Navbar active
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, header');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (scrollY >= s.offsetTop - 150) cur = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+cur));
  });

  // Reservation Save
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = {
        id: Date.now(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        date: document.getElementById('date').value,
        guests: document.getElementById('guests').value,
        message: document.getElementById('message').value,
        created: new Date().toLocaleString()
      };
      let list = DB.get('reservations');
      list.unshift(data);
      DB.set('reservations', list);
      DB.toast('✅ Reservation Saved! ' + data.name);
      form.reset();
    });
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Gallery Lightbox
  const lb = document.createElement('div');
  lb.innerHTML = `<span id="lb-close" style="position:absolute; top:25px; right:35px; font-size:40px; color:#fff; cursor:pointer">&times;</span><img id="lb-img" style="max-width:90%; max-height:80vh; border-radius:15px"><div id="lb-cap" style="color:#d9a35f; margin-top:15px; font-size:1.3rem"></div>`;
  lb.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,.92); display:none; align-items:center; justify-content:center; z-index:99999; flex-direction:column; cursor:zoom-out';
  document.body.appendChild(lb);
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lb.querySelector('#lb-img').src = item.querySelector('img').src;
      lb.querySelector('#lb-cap').innerText = item.querySelector('.gallery-overlay-text')?.innerText || '';
      lb.style.display = 'flex';
    });
  });
  lb.addEventListener('click', () => lb.style.display = 'none');

  // Scroll Animation
  const obs = new IntersectionObserver(ents => {
    ents.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }});
  }, { threshold: 0.15 });
  document.querySelectorAll('.chef-card, .menu-category, .review-card, .gallery-item').forEach(el => {
    el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = 'all .7s ease';
    obs.observe(el);
  });
});
