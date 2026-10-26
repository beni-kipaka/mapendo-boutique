'use strict';
const ADMIN_EMAIL='benikipaka243@gmail.com',ADMIN_DEF={v:2,salt:'mp-9f3a1c7e',h:'XqKvSqIZwdQNtg20vqKuQ7zch2UIRzl7mT5Vft9TbXE='};
const AUTH=()=>{const a=Store.get('auth');return a&&a.v===2?a:ADMIN_DEF};
/* Dashboard Mapendo : auth locale (PBKDF2), CRUD articles, catégories, export/import */
let view='home',search='';
const enc=s=>new TextEncoder().encode(s);
async function hash(p,salt){const k=await crypto.subtle.importKey('raw',enc(p),'PBKDF2',false,['deriveBits']);
 return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc(salt),iterations:200000,hash:'SHA-256'},k,256))))}
const authd=()=>Number(sessionStorage.getItem('mp_s')||0)>Date.now();
const touch=()=>sessionStorage.setItem('mp_s',Date.now()+30*60000);
const strong=p=>p.length>=10&&/[a-z]/i.test(p)&&/\d/.test(p);
const cats=()=>Store.get('cats',CATS0);
const saveP=a=>{if(!Store.set('products',a)){toast('Stockage plein. Utilisez des photos plus légères.');return false}return true};
const thumbA=(p,i)=>{const s=safeImg(p.img);return s?`<img src="${s}" alt="" width="52" height="52">`:`<div class="ph c${i%6}">${esc((p.name||'?').charAt(0).toUpperCase())}</div>`};
const $r=()=>$('#root');

function render(){authd()?(touch(),app()):login()}
function login(){
 $r().innerHTML=`<div class="lg"><form class="box f" id="lf" novalidate><img src="assets/logo.png" width="160" height="90" alt="Mapendo Inc Boutik">
  <h2 class="sm">Connexion au dashboard</h2>
  <label>Email<input name="m" type="email" required autocomplete="username"></label>
  <label>Mot de passe<input name="p" type="password" required autocomplete="current-password"></label>
  <p class="err" id="er" role="alert"></p><button class="btn" type="submit">Se connecter</button><a class="mu" href="./">Retour à la boutique</a></form></div>`;
 $('#lf').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),p=String(f.get('p')),m=String(f.get('m')).trim().toLowerCase(),er=$('#er'),a=AUTH();
  const fl=Store.get('fail',{n:0,u:0});if(Date.now()<fl.u)return er.textContent=`Trop d'essais. Réessayez dans ${Math.ceil((fl.u-Date.now())/60000)} min.`;
  if(m===ADMIN_EMAIL&&await hash(p,a.salt)===a.h){Store.set('fail',{n:0,u:0});touch();render()}
  else{fl.n++;if(fl.n>=5){fl.u=Date.now()+300000;fl.n=0}Store.set('fail',fl);er.textContent='Email ou mot de passe incorrect.'}};
}
function app(){
 const L=[['home','Aperçu'],['items','Articles'],['cats','Catégories'],['set','Réglages']],T=Object.fromEntries(L);
 $r().innerHTML=`<div class="app"><aside class="sb"><img src="assets/logo.png" width="200" height="112" alt="Mapendo"><nav aria-label="Dashboard">${L.map(([k,n])=>`<button type="button" data-v="${k}" ${view===k?'aria-current="true"':''}>${n}</button>`).join('')}</nav><span class="sp"></span></aside>
  <main class="mn"><div class="top"><h1 class="h1s">${T[view]}</h1><div class="acts"><button id="theme" class="ic" type="button" aria-label="Changer de thème"></button><a class="btn ghost sm" href="./" target="_blank" rel="noopener">Voir la boutique</a><button class="btn ghost sm" type="button" id="lo">Déconnexion</button></div></div>
  ${({home,items,cats:catsV,set})[view]()}</main></div>`;
 setTheme(curTheme());$('#theme').onclick=()=>{setTheme(curTheme()==='dark'?'light':'dark')};
 $('#lo').onclick=()=>{sessionStorage.removeItem('mp_s');render()};
 const s=$('#s');if(s){s.value=search;s.oninput=e=>{search=e.target.value.toLowerCase();const p=e.target.selectionStart;app();const n=$('#s');n.focus();n.setSelectionRange(p,p)}}
}
function home(){
 const a=load(),pub=a.filter(p=>p.pub),stk=a.reduce((s,p)=>s+p.stock,0),val=a.reduce((s,p)=>s+p.stock*p.price,0),low=a.filter(p=>p.stock<=3);
 return `<div class="stats"><div class="stat"><b>${pub.length}</b><span>Articles publiés</span></div><div class="stat"><b>${a.length-pub.length}</b><span>Brouillons</span></div><div class="stat"><b>${stk}</b><span>Unités en stock</span></div><div class="stat"><b>${money(val)}</b><span>Valeur du stock</span></div></div>
 <div class="row"><h2 class="sm">Stock faible ou épuisé</h2><button class="btn sm" type="button" data-add>${ico('plus')} Nouvel article</button></div>
 <div class="tb mt">${low.length?`<table><tbody>${low.map(p=>`<tr><td><div class="thumb">${thumbA(p,0)}</div></td><td><b>${esc(p.name)}</b></td><td>${p.stock} en stock</td><td><button class="btn ghost sm" type="button" data-ed="${esc(p.id)}">Réapprovisionner</button></td></tr>`).join('')}</tbody></table>`:'<p class="empty">Tout est bien approvisionné.</p>'}</div>`;
}
function items(){
 const a=load().filter(p=>(p.name+p.cat).toLowerCase().includes(search));
 return `<div class="bar"><input id="s" type="search" placeholder="Chercher un article" aria-label="Chercher"><button class="btn" type="button" data-add>${ico('plus')} Nouvel article</button></div>
 <div class="tb">${a.length?`<table><thead><tr><th></th><th>Article</th><th>Prix</th><th>Stock</th><th>Statut</th><th></th></tr></thead><tbody>${a.map((p,i)=>`<tr><td><div class="thumb">${thumbA(p,i)}</div></td><td><b>${esc(p.name)}</b><br><span class="mu">${esc(p.cat)}</span></td><td>${money(p.price)}</td><td>${p.stock}</td>
 <td><button type="button" class="pill ${p.pub?'ok':''}" data-tg="${esc(p.id)}" title="Changer le statut">${p.pub?'Publié':'Brouillon'}</button></td>
 <td><div class="acts"><button class="ic" type="button" data-ed="${esc(p.id)}" aria-label="Modifier ${esc(p.name)}">${ico('edit')}</button><button class="ic" type="button" data-del="${esc(p.id)}" aria-label="Supprimer ${esc(p.name)}">${ico('trash')}</button></div></td></tr>`).join('')}</tbody></table>`:'<p class="empty">Aucun article. Cliquez sur « Nouvel article » pour publier le premier.</p>'}</div>`;
}
function catsV(){return `<div class="pg"><p class="mu">Ces catégories apparaissent comme filtres dans la boutique.</p><div class="cl">${cats().map(c=>`<span>${esc(c)}<button type="button" data-dc="${esc(c)}" aria-label="Supprimer ${esc(c)}">✕</button></span>`).join('')}</div>
 <form class="row" id="cf"><input name="c" maxlength="24" placeholder="Nouvelle catégorie" required aria-label="Nouvelle catégorie"><button class="btn" type="submit">Ajouter</button></form></div>`}
function set(){return `<div class="pg"><h2 class="sm">Changer le mot de passe</h2><form class="f mt" id="pw"><label>Actuel<input name="o" type="password" autocomplete="current-password" required></label><label>Nouveau<input name="n" type="password" autocomplete="new-password" required></label><p class="err" id="pe" role="alert"></p><button class="btn" type="submit">Mettre à jour</button></form></div>
 <div class="pg"><h2 class="sm">Sauvegarde</h2><p class="mu mt">Les articles sont enregistrés dans ce navigateur. Exportez régulièrement un fichier de sauvegarde.</p><div class="cta mt"><button class="btn" type="button" id="ex">Exporter (JSON)</button><label class="btn ghost">Importer<input type="file" id="im" accept="application/json" hidden></label></div></div>`}

const clean=p=>({id:String(p.id||'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)).replace(/[^\w-]/g,'').slice(0,24),name:String(p.name||'').slice(0,60),cat:String(p.cat||'Divers').slice(0,24),price:Math.max(0,+p.price||0),old:Math.max(0,+p.old||0),stock:Math.max(0,Math.floor(+p.stock||0)),desc:String(p.desc||'').slice(0,200),img:safeImg(p.img),pub:!!p.pub,t:+p.t||Date.now()});
function img2data(f){return new Promise((res,rej)=>{if(!/^image\/(png|jpeg|webp)$/.test(f.type))return rej('Format accepté : PNG, JPG ou WebP.');const r=new FileReader();r.onerror=()=>rej('Lecture impossible.');
 r.onload=()=>{const i=new Image();i.onerror=()=>rej('Image illisible.');i.onload=()=>{const s=Math.min(1,720/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*s);c.height=Math.round(i.height*s);c.getContext('2d').drawImage(i,0,0,c.width,c.height);res(c.toDataURL('image/webp',.8))};i.src=r.result};r.readAsDataURL(f)})}
function form(id){
 const dlg=$('#dlg'),p=id?load().find(x=>x.id===id):{name:'',cat:cats()[0],price:'',old:'',stock:1,desc:'',img:'',pub:true};let img=p.img||'';
 dlg.innerHTML=`<form class="f" id="pf" novalidate><h2 id="dt" class="sm">${id?'Modifier l\'article':'Nouvel article'}</h2>
  <label>Nom<input name="name" maxlength="60" required value="${esc(p.name)}"></label>
  <div class="two"><label>Catégorie<select name="cat">${cats().map(c=>`<option ${c===p.cat?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label>Stock<input name="stock" type="number" min="0" max="99999" step="1" required value="${p.stock}"></label></div>
  <div class="two"><label>Prix (${CFG.cur})<input name="price" type="number" min="0" step="0.01" required value="${p.price}"></label><label>Ancien prix (optionnel)<input name="old" type="number" min="0" step="0.01" value="${p.old||''}"></label></div>
  <label>Description<textarea name="desc" rows="3" maxlength="200">${esc(p.desc)}</textarea></label>
  <div class="row"><div class="prev" id="pv"></div><label>Photo<input type="file" id="fi" accept="image/png,image/jpeg,image/webp"></label></div>
  <label class="row"><span>Publier sur la boutique</span><input type="checkbox" name="pub" ${p.pub?'checked':''}></label><p class="err" id="pe" role="alert"></p>
  <div class="row"><button class="btn ghost" type="button" id="cx">Annuler</button><button class="btn" type="submit">Enregistrer</button></div></form>`;
 const pv=()=>{$('#pv').innerHTML=safeImg(img)?`<img src="${safeImg(img)}" alt="Aperçu">`:'<div class="ph c0">+</div>'};pv();
 $('#fi').onchange=async e=>{try{img=await img2data(e.target.files[0]);pv();$('#pe').textContent=''}catch(x){$('#pe').textContent=x}};
 $('#cx').onclick=()=>dlg.close();
 $('#pf').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),er=$('#pe');
  const r=clean({...p,name:String(f.get('name')).trim(),cat:f.get('cat'),price:f.get('price'),old:f.get('old'),stock:f.get('stock'),desc:String(f.get('desc')).trim(),img,pub:f.get('pub')==='on',t:p.t});
  if(r.name.length<2)return er.textContent='Donnez un nom à l\'article.';if(!(+f.get('price')>0))return er.textContent='Entrez un prix supérieur à 0.';
  const a=load(),i=a.findIndex(x=>x.id===r.id);i<0?a.unshift(r):a[i]=r;if(saveP(a)){dlg.close();toast(id?'Article modifié':'Article publié');app()}};
 dlg.showModal();
}
document.addEventListener('DOMContentLoaded',()=>{
 if(document.body.dataset.page!=='admin')return;paintIcons();render();
 setInterval(()=>{if(!authd()&&$('.app'))render()},30000);
 const R=$r();
 R.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!authd())return;
  if(t.dataset.v){view=t.dataset.v;search='';return app()}
  if(t.hasAttribute('data-add'))return form();
  if(t.dataset.ed)return form(t.dataset.ed);
  if(t.dataset.tg){const a=load(),p=a.find(x=>x.id===t.dataset.tg);p.pub=!p.pub;if(saveP(a)){toast(p.pub?'Publié':'Mis en brouillon');app()}return}
  if(t.dataset.del){const a=load(),p=a.find(x=>x.id===t.dataset.del);if(confirm(`Supprimer « ${p.name} » ? Cette action est définitive.`)&&saveP(a.filter(x=>x!==p))){toast('Article supprimé');app()}return}
  if(t.dataset.dc){const n=load().filter(p=>p.cat===t.dataset.dc).length;if(confirm(n?`${n} article(s) utilisent cette catégorie. Supprimer quand même ?`:'Supprimer cette catégorie ?')){Store.set('cats',cats().filter(c=>c!==t.dataset.dc));app()}return}
  if(t.id==='ex'){const b=new Blob([JSON.stringify({cats:cats(),products:load()},null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='mapendo-sauvegarde-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}});
 R.addEventListener('submit',async e=>{e.preventDefault();if(!authd())return;
  if(e.target.id==='cf'){const c=String(new FormData(e.target).get('c')).trim().slice(0,24);if(c&&!cats().includes(c)){Store.set('cats',[...cats(),c]);app()}}
  if(e.target.id==='pw'){const f=new FormData(e.target),a=AUTH(),er=$('#pe');if(await hash(String(f.get('o')),a.salt)!==a.h)return er.textContent='Mot de passe actuel incorrect.';
   const n=String(f.get('n'));if(!strong(n))return er.textContent='10 caractères minimum, avec lettres et chiffres.';const salt=crypto.randomUUID();Store.set('auth',{v:2,salt,h:await hash(n,salt)});toast('Mot de passe mis à jour');e.target.reset()}});
 R.addEventListener('change',e=>{if(e.target.id!=='im')return;const f=e.target.files[0];if(!f||f.size>8e6)return toast('Fichier trop lourd ou absent.');
  const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.products))throw 0;if(!confirm('Remplacer les articles actuels par cette sauvegarde ?'))return;
   if(saveP(d.products.slice(0,500).map(clean))){if(Array.isArray(d.cats))Store.set('cats',d.cats.slice(0,30).map(c=>String(c).slice(0,24)));toast('Sauvegarde importée');app()}}catch{toast('Fichier invalide.')}};r.readAsText(f)});
});
