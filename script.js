    // menu toggle and responsive behavior
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const main = document.getElementById('main');
    const items = sidebar.querySelectorAll('a.item');

    let collapsed = false;
    function setCollapsed(state){
      collapsed = state;
      if(collapsed){
        sidebar.classList.add('collapsed');
        main.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
        main.classList.remove('collapsed');
      }
    }
    menuToggle.addEventListener('click', ()=>{
      setCollapsed(!collapsed);
    });
    // highlight active link on scroll
    const anchors = [...document.querySelectorAll('main .card, main section')].filter(s => s.id);
    function onScroll(){
      const top = window.scrollY + 120;
      let currentId = null;
      for(const a of anchors){
        if(a.offsetTop <= top) currentId = a.id;
      }
      items.forEach(it => {
        it.classList.toggle('active', it.getAttribute('href') === '#' + currentId);
      });
    }
    document.addEventListener('scroll', onScroll);
    onScroll();

    // smooth scrolling for links
    items.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if(!target) return;
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // close sidebar on small screens
        if(window.innerWidth <= 980){
          sidebar.classList.remove('show');
        }
      });
    });

    // mobile: swipe to show sidebar
    let touchStartX = 0;
    document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].clientX);
    document.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if(dx > 80) sidebar.classList.add('show');
      if(dx < -80) sidebar.classList.remove('show');
    });