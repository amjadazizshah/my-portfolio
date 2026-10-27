import {VoiceDialog,sampleLines} from './voice-engine.js';
export function initVoiceDemo({getProfile,saveRequest,onTranscript,openInbox}){
 const $=s=>document.querySelector(s),synth=window.speechSynthesis,Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 let dialog=new VoiceDialog(getProfile()),businessId=getProfile().id,transcript=[],active=false,sampleRunning=false,fastSample=false,muted=false,audioFailed=false,generation=0,clock=null,started=0,recognition=null,listening=false,finishPlayback=null,utterance=null,voiceList=[],saved=null,busy=false;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function status(label,state='ready'){$('#voiceStatus').textContent=label;$('#voicePortrait').dataset.state=state;$('#voiceStatusDot').dataset.state=state;$('#voiceBadge').textContent=active?(sampleRunning?'SAMPLE CALL':'DEMO ACTIVE'):'READY FOR A HELLO';$('#transcriptLive').textContent=active?'DEMO ACTIVE':'DEMO';}
 function support(text){$('#voiceSupport').textContent=text||(!synth?'Spoken audio is unavailable in this browser. The conversation and transcript still work.':!Recognition?'Microphone recognition is unavailable here. Play a sample call or type your part.':'Browser speech is ready. Start a demo, then tap the microphone to speak.');}
 function voices(){if(!synth)return;const selected=$('#voiceSelect').value;voiceList=synth.getVoices().filter(v=>/^en\b/i.test(v.lang));$('#voiceSelect').innerHTML='<option value="">Browser default English voice</option>'+voiceList.map((v,i)=>`<option value="${i}">${esc(v.name)} (${esc(v.lang)})</option>`).join('');if(selected!==''&&voiceList[Number(selected)])$('#voiceSelect').value=selected;}
 function controls(){$('#voiceLaunch').hidden=active;$('#voiceControls').hidden=!active;$('#sampleProgress').hidden=!sampleRunning;$('#voiceMic').disabled=!Recognition||sampleRunning;$('#voiceReplay').disabled=sampleRunning||busy;$('#voiceTextInput').disabled=sampleRunning||busy;$('#voiceTextForm button').disabled=sampleRunning||busy;$('#autoListen').disabled=!Recognition||sampleRunning;$('#voiceSelect').disabled=sampleRunning;$('#voiceQuickReplies').querySelectorAll('button').forEach(b=>b.disabled=sampleRunning||busy);}
 function render(){
  $('#voiceTranscript').innerHTML=transcript.length?transcript.map(m=>`<div class="voice-turn ${m.role==='user'?'caller':'receptionist'}"><span>${m.role==='user'?'CALLER':esc(getProfile().agent).toUpperCase()}</span><p>${esc(m.text)}</p></div>`).join(''):'<div class="transcript-empty"><span>“</span><p>A good conversation<br>starts with hello.</p><small>Your call transcript will appear here.</small></div>';
  $('#voiceTranscript').scrollTop=$('#voiceTranscript').scrollHeight;
  $('#voiceQuickReplies').innerHTML=transcript.length?dialog.choices().map(text=>`<button type="button" data-voice-reply="${esc(text)}">${esc(text)}</button>`).join(''):'';
  const d=saved||dialog.draft,labels={service:'SERVICE / ROOM',party:'GUESTS',date:getProfile().kind==='hotel'?'CHECK-IN':'DATE',end:'CHECK-OUT',time:'PREFERRED TIME',customer:'NAME',contact:'CONTACT',notes:'MESSAGE'};
  $('#voiceCapture').innerHTML=Object.keys(d).some(k=>labels[k]&&d[k])?`${saved?'<div class="voice-saved">✓ Saved as a pending demo request</div>':'<div class="voice-draft">IN PROGRESS · NOT SAVED YET</div>'}<dl>${Object.entries(labels).filter(([k])=>d[k]).map(([k,l])=>`<div><dt>${l}</dt><dd>${esc(d[k])}</dd></div>`).join('')}</dl>`:'<p>Try requesting a booking. Your receptionist will collect the details, then ask you to review them.</p>';
  controls();
 }
 function add(role,text){transcript.push({role,text});onTranscript(transcript.map(m=>({...m})));render();}
 function abortListening(){const r=recognition;recognition=null;listening=false;$('#voiceInterim').textContent='';if(r){r.onend=null;r.onerror=null;r.onresult=null;r.onstart=null;try{r.abort()}catch{}}$('#voiceMic').classList.remove('listening');$('#voiceMic small').textContent='Tap to speak';}
 function cancelSpeech(){if(finishPlayback)finishPlayback(false);if(synth)synth.cancel();utterance=null;}
 function speak(text,role='assistant',fast=false){
  cancelSpeech();abortListening();if(muted||fast||audioFailed||!synth)return Promise.resolve(true);
  const token=generation;status(role==='user'?'Sample caller is speaking…':`${getProfile().agent} is speaking…`,'speaking');
  return new Promise(resolve=>{let done=false;const u=new SpeechSynthesisUtterance(text.replace(/\n/g,' '));utterance=u;u.lang='en-US';u.rate=role==='user'?1.08:1.02;u.pitch=role==='user'?.88:1.05;const selected=$('#voiceSelect').value;const v=selected!==''?voiceList[Number(selected)]:voiceList.find(v=>v.lang==='en-US')||voiceList[0];if(v){u.voice=v;u.lang=v.lang}if(role==='user'){const alternative=voiceList.find(x=>x.voiceURI!==v?.voiceURI);if(alternative)u.voice=alternative}
   const finish=ok=>{if(done)return;done=true;clearTimeout(watchdog);u.onend=null;u.onerror=null;if(utterance===u)utterance=null;if(finishPlayback===finish)finishPlayback=null;resolve(ok&&token===generation)};
   const watchdog=setTimeout(()=>{audioFailed=true;support('Speech playback did not finish in this browser. The transcript still works; choose another voice or use the sample without audio.');finish(true);synth.cancel()},Math.min(45000,Math.max(9000,text.length*100)));
   finishPlayback=finish;u.onend=()=>finish(true);u.onerror=e=>{if(!['interrupted','canceled'].includes(e.error)){audioFailed=true;support('Spoken audio is unavailable in this browser session. You can still try the conversation; choose another voice to retry.')}finish(true)};
   try{synth.speak(u)}catch{audioFailed=true;support('Voice playback could not start. The transcript still works.');finish(true)}
  });
 }
 function stop(message='Demo ended. Start again whenever you like.'){
  generation++;active=false;sampleRunning=false;fastSample=false;busy=false;abortListening();cancelSpeech();clearInterval(clock);clock=null;status('Demo ended','idle');$('#voicePrompt').textContent=message;controls();
 }
 async function begin(sample=false,silent=false){
  stop();const token=++generation;active=true;sampleRunning=sample;fastSample=false;audioFailed=false;support();transcript=[];saved=null;dialog=new VoiceDialog(getProfile());started=Date.now();$('#voiceTimer').textContent='00:00';clock=setInterval(()=>{const t=Math.floor((Date.now()-started)/1000);$('#voiceTimer').textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')},1000);$('#voicePrompt').textContent=sample?'A complete example conversation. Both voices are simulated.':'Tap the microphone, speak, then hear your receptionist reply.';status('Starting your demo…');add('assistant',dialog.greeting());
  const complete=silent?true:await speak(dialog.greeting());if(token!==generation)return false;if(!sample&&!busy){status('Your turn · tap to speak');if(complete&&$('#autoListen').checked)listen()}return true;
 }
 async function receive(text,{sample=false,fast=false}={}){
  if(!text.trim()||busy)return;if(!active){const ok=await begin(false,true);if(!ok)return}const token=generation;busy=true;abortListening();cancelSpeech();add('user',text.trim());
  if(sample&&!fast)await speak(text,'user');if(token!==generation)return;status('Taking a moment…','thinking');const response=dialog.respond(text);if(dialog.step!=='idle')saved=null;if(response.request){saved=saveRequest(response.request,transcript);}
  add('assistant',response.text);const completed=await speak(response.text,'assistant',fast||fastSample);if(token!==generation)return;busy=false;render();status('Your turn · tap to speak');
  if(response.end){stop('Thank you for trying the voice receptionist.');return}if(!sample&&completed&&$('#autoListen').checked)listen();
 }
 function listen(){
  if(!active||sampleRunning||!Recognition)return;
  if(listening){const r=recognition;listening=false;$('#voiceMic small').textContent='Tap to speak';$('#voiceMic').classList.remove('listening');if(r)r.stop();return}
  cancelSpeech();abortListening();busy=false;controls();const token=generation;const r=new Recognition();recognition=r;r.lang='en-US';r.interimResults=true;r.continuous=false;r.maxAlternatives=1;let delivered=false,failed=false;
  r.onstart=()=>{if(token!==generation)return;listening=true;status('Listening to you…','listening');$('#voiceMic').classList.add('listening');$('#voiceMic small').textContent='Stop listening';$('#voicePrompt').textContent='Speak naturally. Your words will appear in the transcript.'};
  r.onresult=e=>{if(token!==generation||recognition!==r)return;let final='',interim='';for(let i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal)final+=e.results[i][0].transcript+' ';else interim+=e.results[i][0].transcript}$('#voiceInterim').textContent=interim?`Hearing: ${interim}`:'';if(final.trim()&&!delivered){delivered=true;abortListening();receive(final.trim())}};
  r.onerror=e=>{if(token!==generation||recognition!==r)return;failed=true;const messages={'not-allowed':'Microphone permission was not granted. Use a sample call or type your part.','service-not-allowed':'This browser cannot start speech recognition. Use a sample call or type your part.','audio-capture':'No microphone was available. Use a sample call or type your part.','network':'The browser speech service could not connect. Use a sample call or type your part.','no-speech':'No speech was detected. Tap the microphone to try again.'};support(messages[e.error]||'Speech recognition stopped. You can try again, play a sample, or type your part.');$('#autoListen').checked=false;abortListening();status('Microphone paused · demo still available');controls()};
  r.onend=()=>{if(token!==generation||recognition!==r)return;recognition=null;listening=false;$('#voiceMic').classList.remove('listening');$('#voiceMic small').textContent='Tap to speak';if(!delivered&&!failed){status('Your turn · tap to speak');$('#voiceInterim').textContent='No final words detected. Try again or type your part.'}};
  try{r.start()}catch{abortListening();support('Microphone recognition could not start here. Try a sample call or type your part.');status('Your turn · type or choose a reply')}
 }
 async function runSample(){
  if(!await begin(true))return;const token=generation,lines=sampleLines(getProfile());for(let i=0;i<lines.length;i++){if(token!==generation||!active)return;$('#sampleProgressText').textContent=`Sample caller turn ${i+1} of ${lines.length}`;await receive(lines[i],{sample:true,fast:fastSample});if(token!==generation)return;}
  sampleRunning=false;busy=false;status('Sample complete · request captured');$('#voicePrompt').textContent='That’s the full flow: greeting, details, review, and a pending staff request.';controls();
 }
 function refresh(){
  const p=getProfile();if(businessId!==p.id){stop();businessId=p.id;transcript=[];saved=null;dialog=new VoiceDialog(p);$('#voiceTimer').textContent='00:00';status('Ready when you are','idle');$('#voicePrompt').textContent='Hear a sample call, or start a demo and speak to your receptionist.';}else dialog.profile=p;
  $('#voiceAgent').textContent=`Hello, I’m ${p.agent}.`;$('#voiceBusiness').textContent=`Your receptionist at ${p.name}`;$('#voiceMonogram').textContent=p.agent[0];render();
 }
 $('#startVoice').addEventListener('click',()=>begin());$('#sampleVoice').addEventListener('click',runSample);$('#endVoice').addEventListener('click',()=>stop());$('#voiceMic').addEventListener('click',listen);
 $('#voiceReplay').addEventListener('click',async()=>{const last=[...transcript].reverse().find(m=>m.role==='assistant');if(last){const token=generation;await speak(last.text);if(active&&token===generation)status('Your turn · tap to speak')}});
 $('#voiceMute').addEventListener('click',()=>{muted=!muted;$('#voiceMute').setAttribute('aria-pressed',String(muted));$('#voiceMute').setAttribute('aria-label',muted?'Unmute spoken replies':'Mute spoken replies');$('#voiceMute span').textContent=muted?'♪':'♫';$('#voiceMute small').textContent=muted?'Sound off':'Sound on';if(muted){cancelSpeech();status(sampleRunning?'Sample call · sound off':'Your turn · sound off')}});
 $('#finishSample').addEventListener('click',()=>{fastSample=true;cancelSpeech()});
 $('#voiceTextForm').addEventListener('submit',e=>{e.preventDefault();const input=$('#voiceTextInput');if(sampleRunning||busy)return;const text=input.value;input.value='';receive(text)});
 $('#voiceQuickReplies').addEventListener('click',e=>{const b=e.target.closest('[data-voice-reply]');if(b&&!sampleRunning)receive(b.dataset.voiceReply)});
 $('#voiceSelect').addEventListener('change',()=>{audioFailed=false;support()});
 $('#autoListen').addEventListener('change',()=>{if($('#autoListen').checked&&active&&!sampleRunning)listen();else abortListening()});
 $('#voiceOpenInbox').addEventListener('click',openInbox);window.addEventListener('pagehide',()=>stop());document.addEventListener('visibilitychange',()=>{if(document.hidden&&active)stop('Demo paused because this page was hidden. Start again to resume.')});
 if(synth){synth.addEventListener('voiceschanged',voices);voices()}support();refresh();return {stop,refresh};
}
