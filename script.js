const qs=(s,c=document)=>c.querySelector(s), qsa=(s,c=document)=>[...c.querySelectorAll(s)];

// Year
qs('#year').textContent = new Date().getFullYear();

// Header
const header=qs('.site-header');
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30),{passive:true});

// Mobile menu
const toggle=qs('.menu-toggle'), menu=qs('.mobile-menu');
toggle.addEventListener('click',()=>{
  const open=menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded',open);
  menu.setAttribute('aria-hidden',!open);
  document.body.style.overflow=open?'hidden':'';
});
qsa('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{
  menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');document.body.style.overflow='';
}));

// Reveal on scroll
const revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){ e.target.classList.add('visible'); revealObs.unobserve(e.target); }
}),{threshold:.14});
qsa('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%4,3)*70}ms`;revealObs.observe(el)});

// Custom cursor
const dot=qs('.cursor-dot'), ring=qs('.cursor-ring');
let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;});
(function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(loop)})();
qsa('a,button,.tilt-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('active'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('active'));
});

// Magnetic buttons
qsa('.magnetic').forEach(el=>{
  el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=e.clientX-(r.left+r.width/2);const y=e.clientY-(r.top+r.height/2);el.style.transform=`translate(${x*.12}px,${y*.12}px)`});
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

// Tilt cards
qsa('.tilt-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const px=(e.clientX-r.left)/r.width-.5;const py=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${py*-5}deg) rotateY(${px*7}deg) translateY(-4px)`});
  card.addEventListener('mouseleave',()=>card.style.transform='');
});

// Hero + image parallax
const heroMedia=qs('.hero-media'), breakImg=qs('.image-break-img');
addEventListener('scroll',()=>{
  if(innerWidth>900){
    heroMedia.style.transform=`scale(1.03) translateY(${scrollY*.08}px)`;
    const br=qs('.image-break').getBoundingClientRect();
    if(br.top<innerHeight && br.bottom>0) breakImg.style.transform=`translateY(${br.top*.05}px) scale(1.08)`;
  }
},{passive:true});

// Timeline progress
const timeline=qs('.timeline'), line=qs('.timeline-line span'), steps=qsa('.step');
function updateTimeline(){
  const r=timeline.getBoundingClientRect();
  const p=Math.max(0,Math.min(1,(innerHeight*.68-r.top)/(r.height||1)));
  if(innerWidth<=980){line.style.height=`${p*100}%`; line.style.width='1px';}
  else {line.style.width=`${p*100}%`; line.style.height='1px';}
  steps.forEach((s,i)=>s.classList.toggle('active',p>i/(steps.length-1)-.03));
}
addEventListener('scroll',updateTimeline,{passive:true});addEventListener('resize',updateTimeline);updateTimeline();

// Demo form feedback
qs('#demoSubmit').addEventListener('click',()=>{const t=qs('.toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500)});
