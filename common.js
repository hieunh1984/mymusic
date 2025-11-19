// Common helpers used by all pages
function q(sel){return document.querySelector(sel)}
function qa(sel){return Array.from(document.querySelectorAll(sel))}


// simple toast (non-blocking)
function toast(msg,duration=1800){const t=document.createElement('div');t.textContent=msg;t.style.position='fixed';t.style.right='18px';t.style.bottom='18px';t.style.background='rgba(0,0,0,0.7)';t.style.padding='10px 12px';t.style.borderRadius='10px';t.style.zIndex=9999;document.body.appendChild(t);setTimeout(()=>t.remove(),duration)}


// Keyboard friendly: space toggles play/pause when audio/video exists