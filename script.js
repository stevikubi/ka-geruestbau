'use strict';
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
// No analytics, persistent storage or external scripts.
const ns='http://www.w3.org/2000/svg';
function svg(tag,attrs,parent){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);parent.append(n);return n;}
const structure=$('#structure');
const point=(x,y,z)=>[90+x*83+z*55,630-y*72-z*29];
function line3(a,b,parent,colour='#bdc8bf',width=3){const p=point(...a),q=point(...b);svg('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:colour,'stroke-width':width,'stroke-linecap':'round'},parent);}
svg('ellipse',{cx:360,cy:647,rx:260,ry:39,fill:'#000',opacity:.2},structure);
for(let y=0;y<7;y++){let g=svg('g',{class:'floor',style:`--i:${y}`},structure);for(let x=0;x<5;x++){
for(let z=0;z<2;z++){line3([x,y,z],[x,y+1,z],g,'url(#steel)',4);if(x<4){line3([x,y,z],[x+1,y,z],g);line3([x,y+.45,z],[x+1,y+.45,z],g,'#76877b',2);if((x+y)%2===0)line3([x,y,z],[x+1,y+1,z],g,'#929e95',2);}}
line3([x,y,0],[x,y,1],g,'#7b8b80',3);
if(x<4){const pts=[[x,y,0],[x+1,y,0],[x+1,y,1],[x,y,1]].map(v=>point(...v).join(',')).join(' ');svg('polygon',{points:pts,fill:y%2?'#718176':'#96a397',opacity:.6},g);line3([x,y,0],[x+1,y,0],g,y%2===0?'#ff632f':'#bac5bc',5);}
for(let z=0;z<2;z++){const p=point(x,y,z);svg('circle',{cx:p[0],cy:p[1],r:3.5,fill:'#e4e9df'},g);}
}}
for(let x=0;x<5;x++){for(let z=0;z<2;z++){const p=point(x,0,z);svg('rect',{x:p[0]-12,y:p[1]+3,width:24,height:5,fill:'#8d9a8f'},structure);}}
const motion=$('#motion');let paused=reduced.matches;
function setMotion(){document.body.classList.toggle('paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'Animation starten ▷':'Animation pausieren Ⅱ';}
motion.addEventListener('click',()=>{paused=!paused;setMotion();});setMotion();
reduced.addEventListener('change',e=>{paused=e.matches;setMotion();});
// Mobile navigation: closed links are not focusable; Escape restores focus.
const toggle=$('.menu-toggle'),menu=$('#mobile-menu');
function closeMenu(focus=false){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Menü öffnen');document.body.style.overflow='';if(focus)toggle.focus();}
toggle.addEventListener('click',()=>{if(!menu.hidden){closeMenu();return;}menu.hidden=false;toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Menü schließen');document.body.style.overflow='hidden';$('a',menu).focus();});
$$('a',menu).forEach(a=>a.addEventListener('click',()=>closeMenu()));
addEventListener('keydown',e=>{if(menu.hidden)return;if(e.key==='Escape')closeMenu(true);if(e.key==='Tab'){const all=[toggle,...$$('a',menu)],first=all[0],last=all.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
addEventListener('resize',()=>{if(innerWidth>760)closeMenu();});
// Progressive enhancement: content stays visible without JavaScript.
if('IntersectionObserver'in window){document.documentElement.classList.add('js');const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}}),{threshold:.08});$$('.reveal').forEach(el=>obs.observe(el));}
const sections=['leistungen','planer','ablauf','kontakt'].map(id=>document.getElementById(id));let ticking=false;
function scrollUpdate(){const limit=document.documentElement.scrollHeight-innerHeight;$('.reading').style.width=`${limit>0?scrollY/limit*100:0}%`;let current='';for(const s of sections)if(s.getBoundingClientRect().top<innerHeight*.42)current=s.id;$$('header nav a,.mobile-menu nav a').forEach(a=>{const active=a.hash==='#'+current;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});ticking=false;}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(scrollUpdate);ticking=true;}},{passive:true});scrollUpdate();
// Live schematic. Numeric inputs control only illustration and inquiry text.
let projectType='Fassadenarbeiten';const width=$('#width'),height=$('#height');
function drawPlan(){const w=Number(width.value),h=Number(height.value),g=$('#plan-drawing');g.replaceChildren();$('#width-out').textContent=w+' m';$('#height-out').textContent=h+' m';$('#area').textContent=w*h;$('#size').textContent=w+' × '+h;$('#view-label').textContent=projectType.toUpperCase();
const scale=Math.min(450/w,285/h),sw=w*scale,sh=h*scale,x=(600-sw)/2,y=330-sh,cols=Math.max(2,Math.ceil(w/3)),rows=Math.max(2,Math.ceil(h/2)),dx=sw/cols,dy=sh/rows;
svg('rect',{x:x+8,y:y+8,width:sw-16,height:sh-8,fill:'#a0b7a1',opacity:.06},g);
for(let i=0;i<=cols;i++){svg('line',{x1:x+i*dx,y1:y-8,x2:x+i*dx,y2:337,stroke:'#cad8c7','stroke-width':2},g);svg('rect',{x:x+i*dx-5,y:337,width:10,height:4,fill:'#a9b9a4'},g);}
for(let j=0;j<=rows;j++){const yy=y+j*dy;svg('line',{x1:x,y1:yy,x2:x+sw,y2:yy,stroke:'#ff794f','stroke-width':4},g);if(j<rows){svg('line',{x1:x,y1:yy+dy*.4,x2:x+sw,y2:yy+dy*.4,stroke:'#8d9f89','stroke-width':1},g);for(let i=0;i<cols;i++)if((i+j)%2===0)svg('line',{x1:x+i*dx,y1:yy,x2:x+(i+1)*dx,y2:yy+dy,stroke:'#889e88','stroke-width':1},g);}}
svg('line',{x1:x,y1:365,x2:x+sw,y2:365,stroke:'#a9bda2','stroke-width':1},g);const t=svg('text',{x:300,y:388,fill:'#dce7d7','text-anchor':'middle','font-family':'monospace','font-size':13},g);t.textContent=w+' m';const th=svg('text',{x:Math.max(15,x-32),y:y+sh/2,fill:'#dce7d7','text-anchor':'middle','font-family':'monospace','font-size':12,transform:`rotate(-90 ${Math.max(15,x-32)} ${y+sh/2})`},g);th.textContent=h+' m';}
[width,height].forEach(el=>el.addEventListener('input',drawPlan));
function setType(value){projectType=value;$$('#types button').forEach(b=>{const sel=b.textContent===value;b.classList.toggle('selected',sel);b.setAttribute('aria-pressed',String(sel));});drawPlan();}
$$('#types button').forEach(b=>b.addEventListener('click',()=>setType(b.textContent)));$$('[data-type]').forEach(a=>a.addEventListener('click',()=>setType(a.dataset.type)));drawPlan();
let previousPlan='';$('#use-plan').addEventListener('click',()=>{const field=$('#message');const plan=`Vorhaben: ${projectType}\nUngefähre Gebäudebreite: ${width.value} m\nUngefähre Arbeitshöhe: ${height.value} m\nZeitraum: ${$('#timing').value}`;let rest=field.value;if(previousPlan)rest=rest.replace(previousPlan,'').trim();field.value=[plan,rest].filter(Boolean).join('\n\n');previousPlan=plan;$('#form-status').textContent='Ihre Angaben aus dem Projektplaner wurden übernommen.';});
const phases=[['DER ERSTE KONTAKT','Wir hören zu.\nDann denken wir mit.','Was soll gemacht werden? Wo steht das Gebäude? Wann soll es losgehen? Gemeinsam klären wir die Eckpunkte Ihres Vorhabens.'],['DIE VORBEREITUNG','Erst verstehen.\nDann planen.','Gebäudemaße, Arbeitsbereiche, Zugänge und Baustellensituation werden aufeinander abgestimmt. Daraus ergibt sich der konkrete Leistungsumfang.'],['DIE UMSETZUNG','Aus Planung\nwird Arbeitsraum.','Der Aufbau erfolgt nach der abgestimmten Planung. Anforderungen an Nutzung und Übergabe werden für das jeweilige Projekt geklärt.'],['DER ABSCHLUSS','Vorhaben geschafft.\nGerüst zurückgebaut.','Nach Abschluss der Arbeiten stimmen wir den Rückbau ab. Auch Änderungen während der Bauphase besprechen Sie direkt mit uns.']];
const tabs=$$('[role=tab]');function phase(index,focus=false){tabs.forEach((t,i)=>{t.setAttribute('aria-selected',String(i===index));t.tabIndex=i===index?0:-1;});const panel=$('#process-panel');panel.setAttribute('aria-labelledby','tab-'+index);$('.phase-number').textContent=String(index+1).padStart(2,'0');$('.phase-kicker').textContent=phases[index][0];const heading=$('h3',panel);heading.replaceChildren();phases[index][1].split('\n').forEach((part,i)=>{if(i)heading.append(document.createElement('br'));heading.append(document.createTextNode(part));});$('p',panel).textContent=phases[index][2];if(!reduced.matches&&!paused)panel.animate([{opacity:.4,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300});if(focus)tabs[index].focus();}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>phase(i));t.addEventListener('keydown',e=>{let n=i;if(['ArrowRight','ArrowDown'].includes(e.key))n=(i+1)%4;else if(['ArrowLeft','ArrowUp'].includes(e.key))n=(i+3)%4;else if(e.key==='Home')n=0;else if(e.key==='End')n=3;else return;e.preventDefault();phase(n,true);});});
const form=$('#contact-form');function requestText(){const data=new FormData(form);return `Guten Tag KA Gerüstbau,\n\nich möchte folgendes Projekt anfragen:\n\n${data.get('message')}\n\nProjektort: ${data.get('place')}\nName / Firma: ${data.get('name')}\nE-Mail: ${data.get('email')}\nTelefon: ${data.get('phone')||'nicht angegeben'}\n\nMit freundlichen Grüßen\n${data.get('name')}`;}
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;location.href='mailto:info@kageruestbau.de?subject='+encodeURIComponent('Projektanfrage Gerüstbau – '+$('#place').value)+'&body='+encodeURIComponent(requestText());$('#form-status').textContent='Die E-Mail ist vorbereitet. Bitte in Ihrem E-Mail-Programm prüfen und senden. Falls sich nichts öffnet, kopieren Sie den Anfragetext und senden ihn an info@kageruestbau.de.';});
$('#copy-request').addEventListener('click',async()=>{if(!form.reportValidity())return;const text=requestText();try{await navigator.clipboard.writeText(text);$('#form-status').textContent='Anfragetext kopiert. Senden Sie ihn an info@kageruestbau.de.';}catch{const area=document.createElement('textarea');area.value=text;area.setAttribute('aria-label','Anfragetext zum Kopieren');form.append(area);area.focus();area.select();$('#form-status').textContent='Automatisches Kopieren ist nicht verfügbar. Der Text steht unten zum Markieren und Kopieren bereit.';}});
$$('[data-dialog]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.dialog).showModal()));$$('dialog').forEach(d=>{$('.close-dialog',d).addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
$('#year').textContent=new Date().getFullYear();
