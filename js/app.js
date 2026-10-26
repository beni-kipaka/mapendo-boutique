'use strict';
/* ===== CONFIG : à modifier ===== */
const CFG={wa:'243824775595',cur:'$',site:'https://mapendo-boutique.vercel.app',
 socials:{facebook:'https://facebook.com/',instagram:'https://instagram.com/',tiktok:'https://tiktok.com/'}};
/* =============================== */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const Store={get(k,d){try{const v=localStorage.getItem('mp_'+k);return v===null?d:JSON.parse(v)}catch{return d}},
 set(k,v){try{localStorage.setItem('mp_'+k,JSON.stringify(v));return true}catch{return false}}};
const CATS0=['Homme','Femme','Enfant','Chaussures','Accessoires','Divers'];
const SEED=[
 {id:'p1',name:'Chemise en lin',cat:'Homme',price:25,old:32,stock:12,desc:'Coupe droite, tissu respirant pour les journées chaudes.',img:'',pub:true,t:6},
 {id:'p2',name:'Robe en wax',cat:'Femme',price:40,old:0,stock:8,desc:'Motifs vifs, coupe ajustée, finitions soignées.',img:'',pub:true,t:5},
 {id:'p3',name:'Baskets urbaines',cat:'Chaussures',price:55,old:65,stock:6,desc:'Semelle souple, confortables toute la journée.',img:'',pub:true,t:4},
 {id:'p4',name:'Ensemble enfant',cat:'Enfant',price:22,old:0,stock:15,desc:'Coton doux, deux pièces, facile à laver.',img:'',pub:true,t:3},
 {id:'p5',name:'Sac à main',cat:'Accessoires',price:35,old:0,stock:0,desc:'Format pratique avec fermeture sécurisée.',img:'',pub:true,t:2},
 {id:'p6',name:'Montre classique',cat:'Accessoires',price:30,old:0,stock:9,desc:'Cadran sobre, bracelet réglable.',img:'',pub:true,t:1}];
const load=()=>{let p=Store.get('products');if(!p){p=SEED;Store.set('products',p)}return p};
const money=n=>CFG.cur+Number(n).toFixed(2).replace(/\.00$/,'');
const safeImg=u=>typeof u==='string'&&/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+\/=]+$/.test(u)?u:'';
const IC={sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
 moon:'<path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/>',bag:'<path d="M5 8h14l-1 12H6zM9 8a3 3 0 016 0"/>',
 wa:'<path d="M3 21l1.5-5A9 9 0 1112 21a9 9 0 01-4.5-1.2z"/><path d="M9 8c0 4 3 7 7 7l1-2-2-1-1 1c-1-.4-2.600-2-3-3l1-1-1-2z"/>',
 doc:'<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/>',shield:'<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 fb:'<path d="M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>',ig:'<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/>',
 tt:'<path d="M14 3v11a4 4 0 11-4-4M14 3c.5 3 2.500 4.500 5 4.500"/>',plus:'<path d="M12 5v14M5 12h14"/>',edit:'<path d="M4 20l1-5L16 4l4 4L9 19zM14 6l4 4"/>',trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 out:'<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>'};
const ico=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const paintIcons=()=>$$('[data-i]').forEach(e=>{e.innerHTML=ico(e.dataset.i)});
let tT;const toast=m=>{const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('on'),3200)};
/* Thème clair / sombre */
const curTheme=()=>document.documentElement.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
const setTheme=t=>{document.documentElement.dataset.theme=t;Store.set('theme',t);const b=$('#theme');if(b)b.innerHTML=ico(t==='dark'?'sun':'moon')};
{const t=Store.get('theme');if(t)document.documentElement.dataset.theme=t}
const waLink=txt=>`https://wa.me/${CFG.wa}${txt?'?text='+encodeURIComponent(txt):''}`;
function common(){
 paintIcons();setTheme(curTheme());
 $('#theme')?.addEventListener('click',()=>setTheme(curTheme()==='dark'?'light':'dark'));
 const hd=$('.hd');if(hd)addEventListener('scroll',()=>hd.classList.toggle('sc',scrollY>10),{passive:true});
 const rv=$$('.sec>h2,.trust>div,.contact,.bar');if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});rv.forEach(e=>{e.classList.add('rv');io.observe(e)})}
}
/* ===================== BOUTIQUE ===================== */
function shop(){
 common();
 let cat='Tous',q='',sort='new';const cats=Store.get('cats',CATS0);
 $('#yr').textContent=new Date().getFullYear();
 $('#heroWa').href=waLink('Bonjour Mapendo Inc Boutik, j\'ai une question.');$('#contactWa').href=waLink('Bonjour, j\'ai une question sur un article.');
 $('#heroWa').target=$('#contactWa').target='_blank';$('#wf').href=waLink('Bonjour Mapendo Inc Boutik, j\'ai une question.');
 $('#soc').innerHTML=[['facebook','fb'],['instagram','ig'],['tiktok','tt']].map(([k,i])=>`<a href="${esc(CFG.socials[k])}" target="_blank" rel="noopener noreferrer" aria-label="${k}">${ico(i)}</a>`).join('')+`<a href="${waLink()}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">${ico('wa')}</a>`;
 const cart=()=>Store.get('cart',{}),prod=id=>load().find(p=>p.id===id);
 const lines=()=>Object.entries(cart()).map(([id,n])=>({p:prod(id),n})).filter(l=>l.p&&l.p.pub&&l.p.stock>0).map(l=>({...l,n:Math.min(l.n,l.p.stock)}));
 const total=()=>lines().reduce((s,l)=>s+l.p.price*l.n,0);
 const thumb=(p,i)=>{const s=safeImg(p.img);return s?`<img src="${s}" alt="${esc(p.name)}" loading="lazy" width="400" height="400">`:`<div class="ph c${i%6}">${esc(p.name.trim().charAt(0).toUpperCase())}</div>`};
 const idx=p=>Math.abs([...p.id].reduce((a,c)=>a+c.charCodeAt(0),0));
 function draw(){
  $('#chips').innerHTML=['Tous',...cats].map(c=>`<button class="chip" type="button" aria-pressed="${c===cat}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
  const l=load().filter(p=>p.pub&&(cat==='Tous'||p.cat===cat)&&p.name.toLowerCase().includes(q));
  l.sort((a,b)=>sort==='asc'?a.price-b.price:sort==='desc'?b.price-a.price:(b.t||0)-(a.t||0));
  $('#grid').innerHTML=l.length?l.map(p=>`<article class="card"><div class="thumb">${thumb(p,idx(p))}<button class="fav" type="button" data-fav="${esc(p.id)}" aria-label="Favori" aria-pressed="${Store.get('favs',[]).includes(p.id)}">♥</button><span class="tag">${esc(p.cat)}</span>${p.stock<1?'<span class="tag out">Épuisé</span>':''}</div>
   <div class="info"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><div class="row"><span class="pr">${money(p.price)}${p.old>p.price?`<s>${money(p.old)}</s>`:''}</span>
   <button class="btn sm" type="button" data-add="${esc(p.id)}" ${p.stock<1?'disabled':''}>Ajouter</button></div></div></article>`).join(''):'<p class="empty">Aucun article dans cette sélection. Essayez une autre catégorie.</p>';
 }
 function drawCart(){
  const l=lines(),c=l.reduce((s,x)=>s+x.n,0);$('#cnt').textContent=c;$('#cnt').hidden=!c;
  $('#lines').innerHTML=l.length?l.map(({p,n})=>`<div class="ln"><div class="thumb">${thumb(p,idx(p))}</div><div><b>${esc(p.name)}</b><div class="mu">${money(p.price)}</div>
   <span class="qty"><button type="button" data-dec="${esc(p.id)}" aria-label="Retirer un">−</button><b>${n}</b><button type="button" data-inc="${esc(p.id)}" aria-label="Ajouter un">+</button></span></div><b>${money(p.price*n)}</b></div>`).join(''):'<p class="empty">Votre panier est vide. Ajoutez un article pour commencer.</p>';
  $('#total').textContent=money(total());$('#form').hidden=!l.length;$('.row',$('#co')).hidden=!l.length;
 }
 const chg=(id,d)=>{const c=cart(),p=prod(id);if(!p)return;const n=Math.max(0,Math.min(p.stock,(c[id]||0)+d));n?c[id]=n:delete c[id];Store.set('cart',c);drawCart()};
 const dr=$('#drawer');let last;
 const open=()=>{last=document.activeElement;dr.classList.add('open');dr.setAttribute('aria-hidden','false');$('#co').hidden=false;$('#done').hidden=true;$('#lines').hidden=false;$('.pn button[data-close]',dr).focus()};
 const close=()=>{dr.classList.remove('open');dr.setAttribute('aria-hidden','true');last?.focus()};
 $('#cartBtn').onclick=open;dr.addEventListener('click',e=>{if(e.target.closest('[data-close]'))close()});
 addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 $('#q').oninput=e=>{q=e.target.value.trim().toLowerCase();draw()};$('#sort').onchange=e=>{sort=e.target.value;draw()};
 $('#chips').onclick=e=>{const b=e.target.closest('[data-c]');if(b){cat=b.dataset.c;draw()}};
 $('#grid').onclick=e=>{const b=e.target.closest('[data-add]');if(b){chg(b.dataset.add,1);toast('Ajouté au panier')}};
 $('#lines').onclick=e=>{const a=e.target.closest('[data-inc]'),b=e.target.closest('[data-dec]');if(a)chg(a.dataset.inc,1);if(b)chg(b.dataset.dec,-1)};
 $('#form').addEventListener('submit',async e=>{
  e.preventDefault();const f=new FormData(e.target),name=String(f.get('name')).trim(),tel=String(f.get('tel')).trim(),addr=String(f.get('addr')||'').trim(),er=$('#err');
  if(name.length<2)return er.textContent='Entrez votre nom.';
  if(!/^\+?[0-9 ()-]{7,20}$/.test(tel))return er.textContent='Numéro invalide. Exemple : +243 900 000 000.';
  er.textContent='';const items=lines().map(({p,n})=>({name:p.name,n,price:p.price}));if(!items.length)return;
  const d=new Date(),no='MP-'+d.toISOString().slice(2,10).replace(/-/g,'')+'-'+Math.floor(1000+Math.random()*9000);
  const o={no,date:d.toLocaleString('fr-FR'),name,tel,addr,items,total:total()};
  const sb=e.submitter;sb.disabled=true;sb.textContent='Création de la facture...';
  try{const cv=await invoice(o);done(o,cv);const hist=Store.get('orders',[]);hist.unshift({...o});Store.set('orders',hist.slice(0,50));Store.set('cart',{});drawCart();e.target.reset()}
  catch{er.textContent='Impossible de créer la facture. Réessayez.'}finally{sb.disabled=false;sb.textContent='Commander et générer la facture'}
 });
 function done(o,cv){
  const msg=`*Nouvelle commande ${o.no}*\nClient : ${o.name}\nTél : ${o.tel}\n${o.addr?'Adresse : '+o.addr+'\n':''}\n${o.items.map(i=>`- ${i.n} x ${i.name} : ${money(i.price*i.n)}`).join('\n')}\n\n*Total : ${money(o.total)}*\n(Facture jointe)`;
  $('#co').hidden=true;$('#lines').hidden=true;const dn=$('#done');dn.hidden=false;
  dn.innerHTML=`<h3>Commande ${esc(o.no)} prête</h3><p class="mu">Envoyez-la sur WhatsApp avec votre facture. La boutique confirmera le stock et la livraison.</p>
   <button class="btn wa" type="button" id="bSend">Envoyer sur WhatsApp</button><button class="btn ghost" type="button" id="bPng">Télécharger la facture (PNG)</button><button class="btn ghost" type="button" id="bPdf">Télécharger la facture (PDF)</button>`;
  const png=()=>new Promise(r=>cv.toBlob(r,'image/png'));
  const dl=(b,n)=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)};
  $('#bPng').onclick=async()=>dl(await png(),o.no+'.png');$('#bPdf').onclick=()=>dl(toPDF(cv),o.no+'.pdf');
  $('#bSend').onclick=async()=>{const file=new File([await png()],o.no+'.png',{type:'image/png'});
   if(navigator.canShare?.({files:[file]})){try{await navigator.share({files:[file],text:msg});return}catch(x){if(x.name==='AbortError')return}}
   dl(file,o.no+'.png');toast('Facture téléchargée : joignez-la dans WhatsApp');window.open(waLink(msg),'_blank','noopener')};
 }
 draw();drawCart();
}
/* ===================== FACTURE ===================== */
async function invoice(o){
 const W=900,H=470+o.items.length*54+(o.addr?30:0)+200,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),F='Figtree,Arial,sans-serif';
 x.fillStyle='#fff';x.fillRect(0,0,W,H);x.fillStyle='#000';x.fillRect(0,0,W,150);
 const im=await new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src='assets/logo.png'});if(im)x.drawImage(im,20,0,267,150);
 x.fillStyle='#fff';x.textAlign='right';x.font=`800 34px ${F}`;x.fillText('FACTURE',W-40,68);x.font=`500 20px ${F}`;x.fillStyle='#F2B25C';x.fillText('Preuve de commande',W-40,102);
 x.textAlign='left';x.fillStyle='#14221D';x.font=`700 22px ${F}`;let y=200;x.fillText('N° '+o.no,40,y);x.font=`400 20px ${F}`;x.fillStyle='#5B6B64';x.fillText(o.date,40,y+30);
 x.fillStyle='#14221D';x.font=`700 20px ${F}`;x.fillText('Client : '+o.name,40,y+76);x.font=`400 20px ${F}`;x.fillText('Tél : '+o.tel,40,y+104);if(o.addr)x.fillText('Adresse : '+o.addr.slice(0,60),40,y+132);
 y+=(o.addr?190:160);x.fillStyle='#111111';x.fillRect(40,y,W-80,44);x.fillStyle='#fff';x.font=`700 18px ${F}`;x.fillText('Article',56,y+29);x.textAlign='right';x.fillText('Qté',560,y+29);x.fillText('Prix',690,y+29);x.fillText('Total',W-56,y+29);
 y+=44;o.items.forEach((i,k)=>{if(k%2){x.fillStyle='#F6F2EA';x.fillRect(40,y,W-80,54)}x.fillStyle='#14221D';x.font=`400 19px ${F}`;x.textAlign='left';x.fillText(i.name.slice(0,34),56,y+34);x.textAlign='right';x.fillText(String(i.n),560,y+34);x.fillText(money(i.price),690,y+34);x.fillText(money(i.price*i.n),W-56,y+34);y+=54});
 x.fillStyle='#E0A030';x.fillRect(40,y+10,W-80,4);x.fillStyle='#14221D';x.font=`800 30px ${F}`;x.fillText('TOTAL : '+money(o.total),W-56,y+64);
 x.textAlign='left';x.font=`400 16px ${F}`;x.fillStyle='#5B6B64';x.fillText('Ce document prouve votre demande de commande. Stock, livraison et paiement sont confirmés par la boutique.',40,y+120);x.fillText('Mapendo Inc Boutik | Habillement et divers | '+CFG.site.replace('https://',''),40,y+148);
 return c;
}
function toPDF(c){
 const jpg=atob(c.toDataURL('image/jpeg',.92).split(',')[1]),W=c.width*.75|0,H=c.height*.75|0,x=[];let o='%PDF-1.4\n';const add=s=>{x.push(o.length);o+=s};
 add('1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n');add('2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n');
 add(`3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${W} ${H}]/Contents 5 0 R/Resources<</XObject<</I 4 0 R>>>>>>endobj\n`);
 add(`4 0 obj<</Type/XObject/Subtype/Image/Width ${c.width}/Height ${c.height}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${jpg.length}>>stream\n${jpg}\nendstream endobj\n`);
 const t=`q ${W} 0 0 ${H} 0 0 cm /I Do Q`;add(`5 0 obj<</Length ${t.length}>>stream\n${t}\nendstream endobj\n`);
 const s=o.length;o+='xref\n0 6\n0000000000 65535 f \n'+x.map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+`trailer<</Size 6/Root 1 0 R>>startxref\n${s}\n%%EOF`;
 return new Blob([Uint8Array.from(o,ch=>ch.charCodeAt(0))],{type:'application/pdf'});
}
document.addEventListener('DOMContentLoaded',()=>{if(document.body.dataset.page==='shop')shop()});

/* ===================== EXTRAS : menu, avis, formulaire ===================== */
const REVIEWS=[
 {n:'Noella Bumoko',c:'Kinshasa',t:'Commande simple, facture reçue tout de suite et livraison dans les temps. Je recommande.'},
 {n:'Celeste B.',c:'Kinshasa',t:'Les tailles ont été confirmées sur WhatsApp avant le paiement. Aucun stress, très sérieux.'},
 {n:'Beni Kipaka',c:'Lubumbashi',t:'Belle qualité pour le prix, et la boutique répond vite. Je reviendrai pour toute la famille.'}];
function extras(){
 const b=$('#burger'),nv=$('#nav');
 const shut=()=>{nv.classList.remove('open');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Ouvrir le menu')};
 b.onclick=()=>{const o=nv.classList.toggle('open');b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu')};
 nv.addEventListener('click',e=>{if(e.target.closest('a'))shut()});
 addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
 addEventListener('resize',()=>{if(innerWidth>900)shut()});
 $('#rev').innerHTML=REVIEWS.map(r=>`<figure class="rc"><span class="stars" aria-label="5 étoiles sur 5">★★★★★</span><p>${esc(r.t)}</p><figcaption class="who"><span class="av">${esc(r.n.charAt(0))}</span><span><b>${esc(r.n)}</b><small>${esc(r.c)}</small></span></figcaption></figure>`).join('');
 const f=$('#cf'),m=f.msg,mc=$('#mc'),er=$('#cerr');
 m.oninput=()=>{mc.textContent=m.value.length+' / 500'};
 f.addEventListener('submit',e=>{
  e.preventDefault();const d=new FormData(f),v=k=>String(d.get(k)||'').trim();
  [...f.elements].forEach(x=>x.classList?.remove('bad'));
  const bad=(el,t)=>{el.classList.add('bad');el.focus();er.textContent=t};
  if(v('name').length<2)return bad(f.name,'Entrez votre nom.');
  if(!/^\+?[0-9 ()-]{7,20}$/.test(v('tel')))return bad(f.tel,'Numéro invalide. Exemple : +243 900 000 000.');
  if(v('mail')&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('mail')))return bad(f.mail,'Adresse email invalide.');
  if(v('msg').length<5)return bad(f.msg,'Écrivez votre message (5 caractères minimum).');
  if(!f.ok.checked)return bad(f.ok,'Cochez la case pour continuer.');
  er.textContent='';
  const txt=`*${v('subj')}*\nNom : ${v('name')}\nTél : ${v('tel')}\n${v('mail')?'Email : '+v('mail')+'\n':''}Préfère : ${v('how')}\n\n${v('msg')}`;
  window.open(waLink(txt),'_blank','noopener');toast('Message prêt dans WhatsApp');f.reset();mc.textContent='0 / 500';
 });
}
document.addEventListener('DOMContentLoaded',()=>{if(document.body.dataset.page==='shop')extras()});

document.addEventListener('DOMContentLoaded',()=>{if(document.body.dataset.page!=='shop')return;
 $('#fWa').href=waLink('Bonjour Mapendo Inc Boutik, j\'ai une question.');$('#fWa').target='_blank';
 $('#up').onclick=e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'})};
 $('#hq').oninput=e=>{const q=$('#q');q.value=e.target.value;q.dispatchEvent(new Event('input'));if(e.target.value)q.scrollIntoView({block:'center'})};
 $('#grid').addEventListener('click',e=>{const b=e.target.closest('[data-fav]');if(!b)return;const f=Store.get('favs',[]),i=f.indexOf(b.dataset.fav);i<0?f.push(b.dataset.fav):f.splice(i,1);Store.set('favs',f);b.setAttribute('aria-pressed',i<0)});
});
document.addEventListener('DOMContentLoaded',()=>{$('.hs')?.addEventListener('submit',e=>e.preventDefault())});
