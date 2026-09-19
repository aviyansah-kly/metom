const menuBtn=document.getElementById('menuBtn');
const closeMobileMenu=()=>{
  document.body.classList.remove('mobile-open');
  if(menuBtn) menuBtn.setAttribute('aria-expanded','false');
};
if(menuBtn){
  menuBtn.addEventListener('click',()=>{
    const willOpen=!document.body.classList.contains('mobile-open');
    document.body.classList.toggle('mobile-open');
    menuBtn.setAttribute('aria-expanded',String(willOpen));
  });
}
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',closeMobileMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeMobileMenu();});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
}),{threshold:.1,rootMargin:'0px 0px -24px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));