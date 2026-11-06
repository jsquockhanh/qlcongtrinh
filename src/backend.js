const API='/api';
let activeSession=null;let listeners=[];
export function apiHeaders(){return {'Content-Type':'application/json',Authorization:`Bearer ${localStorage.getItem('qlct_token')||''}`}}
export async function readApi(response){const body=await response.json().catch(()=>({}));if(!response.ok)throw new Error(body.error||'Yêu cầu không thành công');return body}
async function call(path,options={}){return fetch(API+path,{...options,headers:{...apiHeaders(),...(options.headers||{})}}).then(readApi)}
export const initializeApp=config=>({config});
export const getAuth=()=>({get currentUser(){return activeSession?.user||null}});
export function onAuthStateChanged(auth,callback){let alive=true;const emit=()=>{if(alive)callback(activeSession?.user||null)};const token=localStorage.getItem('qlct_token');if(token){call('/auth/me').then(r=>{activeSession={user:{...r.user,uid:r.user.id}};emit()}).catch(()=>{localStorage.removeItem('qlct_token');activeSession=null;emit()})}else emit();listeners.push(emit);return()=>{alive=false;listeners=listeners.filter(x=>x!==emit)}}
function notify(){listeners.forEach(fn=>fn())}
export async function signInWithEmailAndPassword(auth,username,password){const r=await call('/auth/login',{method:'POST',body:JSON.stringify({username,password})});localStorage.setItem('qlct_token',r.token);activeSession={user:{...r.user,uid:r.user.id}};notify();return {user:{...r.user,uid:r.user.id}}}
export async function signOut(){localStorage.removeItem('qlct_token');activeSession=null;notify();}
export async function createUserWithEmailAndPassword(){throw new Error('Chỉ Admin được tạo tài khoản trong mục Quản trị.')}
export async function sendPasswordResetEmail(){throw new Error('Vui lòng liên hệ Admin để được cấp lại mật khẩu.')}
export async function updatePassword(user,password){return call('/auth/password',{method:'PATCH',body:JSON.stringify({password})})}
export const getFirestore=()=>({});
export const collection=(db,name)=>({name});
export const doc=(dbOrCollection,name,id)=>{if(id===undefined)return {name: name||crypto.randomUUID(),collection:dbOrCollection?.name};return {collection:name,id}};
export const where=(field,op,value)=>({field,op,value});
export const query=(ref,...filters)=>({name:ref.name,filters:filters.filter(x=>x?.field)});
const refInfo=ref=>({name:ref.collection||ref.name,id:ref.id});
export async function getDocs(ref){const r=await call(`/data/${encodeURIComponent(ref.name)}`);let rows=r.rows||[];for(const f of ref.filters||[])rows=rows.filter(x=>f.op==='=='?x[f.field]===f.value:true);return {docs:rows.map(x=>({id:x.id,data:()=>{const {id,...v}=x;return v},ref:{collection:ref.name,id:x.id}})),size:rows.length,empty:!rows.length}}
export async function getDoc(ref){const r=await call(`/data/${encodeURIComponent(ref.collection)}/${encodeURIComponent(ref.id)}`);return {exists:()=>!!r.row,data:()=>r.row||{}}}
export async function setDoc(ref,data,options={}){return call(`/data/${encodeURIComponent(ref.collection)}/${encodeURIComponent(ref.id)}`,{method:options.merge?'PATCH':'PUT',body:JSON.stringify(data)})}
export async function updateDoc(ref,data){return setDoc(ref,data,{merge:true})}
export async function deleteDoc(ref){return call(`/data/${encodeURIComponent(ref.collection)}/${encodeURIComponent(ref.id)}`,{method:'DELETE'})}
export function writeBatch(){const ops=[];return {set:(ref,data)=>ops.push({method:'PUT',ref,data}),update:(ref,data)=>ops.push({method:'PATCH',ref,data}),commit:async()=>call('/data/batch',{method:'POST',body:JSON.stringify({operations:ops.map(o=>({...o,collection:o.ref.collection,id:o.ref.id}))})})}}
export function onSnapshot(ref,callback,error){let stopped=false;const run=()=>getDocs(ref).then(x=>{if(!stopped)callback({docs:x.docs})}).catch(e=>{if(!stopped&&error)error(e)});run();const timer=setInterval(run,12000);return()=>{stopped=true;clearInterval(timer)}}
