import {BrowserSpeechPlayer} from './speech-player.js';
import {VoiceDialog} from './voice-engine.js';
import {EXAMPLES} from './engine.js';
import {RecordedSamplePlayer,sampleConversation} from './recorded-sample.js';
import {SAMPLE_AUDIO} from './sample-audio.js';
export function initVoiceDemo({getProfile,saveRequest,onTranscript,openInbox}){
 const $=s=>document.querySelector(s),synth=window.speechSynthesis,Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 let dialog=new VoiceDialog(getProfile()),businessId=getProfile().id,transcript=[],active=false,sampleRunning=false,fastSample=false,muted=false,generation=0,clock=null,started=0,recognition=null,listening=false,sampleRecovery=null,failedSpeech=null,voiceList=[],saved=null,busy=false;
 const audio=$('#recordedAudio'),recorded=new RecordedSamplePlayer(audio);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function status(label,state='ready'){$('#voiceStatus').textContent=label;$('#voicePortrait').dataset.state=state;$('#voiceStatusDot').dataset.state=state;$('#voiceBadge').textContent=active?(sampleRunning?'SAMPLE CALL':'DEMO ACTIVE'):'READY FOR A HELLO';$('#transcriptLive').textContent=active?'DEMO ACTIVE':'DEMO';}
 function support(text){$('#voiceSupport').textContent=text||(!synth?'Spoken audio is unavailable in this browser. The conversation and transcript still work.':!Recognition?'Microphone recognition is unavailable here. Play a sample call or type your part.':'For a recorded example, tap Play sample call. Live voice uses your browser’s speech service.');}
 function voices(){if(!synth)return;const selected=$('#voiceSelect').value;voiceList=synth.getVoices().filter(v=>/^en\b/i.test(v.lang));$('#voiceSelect').innerHTML='<option value="">Browser default English voice</option>'+voiceList.map((v,i)=>`<option value="${i}">${esc(v.name)} (${esc(v.lang)})</option>`).join('');if(selected!==''&&voiceList[Number(selected)])$('#voiceSelect').value=selected;}
 function controls(){$('#voiceLaunch').hidden=active;$('#voiceControls').hidden=!active;$('#sampleProgress').hidden=!sampleRunning;$('#voiceMic').disabled=!Recognition||sampleRunning;$('#voiceReplay').disabled=sampleRunning||busy;$('#voiceTextInput').disabled=sampleRunning||busy;$('#voiceTextForm button').disabled=sampleRunning||busy;$('#autoListen').disabled=!Recognition||sampleRunning;$('#voiceSelect').disabled=sampleRunning;$('#voiceTest').disabled=sampleRunning;$('#voiceQuickReplies').querySelectorAll('button').forEach(b=>b.disabled=sampleRunning||busy);}
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
 const player=new BrowserSpeechPlayer({synth,Utterance:window.SpeechSynthesisUtterance,onIssue:code=>{support(code==='unsupported'?'This browser does not expose speech playback. Open this page directly in Safari or another supported browser.':code==='not-allowed'||code==='not-started'?'Audio did not start. Tap “Tap to hear reply” or “Enable / test sound”. On iPhone, try opening the link directly in Safari and turn up media volume.':'Voice playback stopped. Tap to hear the reply again, or select another English voice.');}});
 function cancelSpeech(){player.stop();}
 function speak(text,role='assistant',fast=false){
  recorded.stop();$('#recordedPlayer').hidden=true;cancelSpeech();abortListening();if(muted||fast)return Promise.resolve(true);
  voices();failedSpeech={text,role};const token=generation;
  status(role==='user'?'Sample caller is speaking…':`${getProfile().agent} is speaking…`,'speaking');
  const selected=$('#voiceSelect').value;let voice=selected!==''?voiceList[Number(selected)]:voiceList.find(v=>v.lang==='en-US')||voiceList[0];
  if(role==='user')voice=voiceList.find(v=>v.voiceURI!==voice?.voiceURI)||voice;
  return player.play(text,{voice,rate:role==='user'?1.08:1.02,pitch:role==='user'?.88:1.05}).then(ok=>{if(token!==generation)return false;if(ok){failedSpeech=null;$('#voiceRetry').hidden=true;}else{$('#voiceRetry').hidden=false;status('Audio paused · tap to hear','idle');}return ok;});
 }
 async function speechTurn(text,role='assistant',fast=false){
  const token=generation,ok=await speak(text,role,fast);
  if(ok||token!==generation||!active||!sampleRunning||fastSample||muted)return ok;
  status('Sample paused · tap to hear','idle');$('#voicePrompt').textContent='Audio needs another tap. Hear this line to continue, or skip audio to view the result.';
  return new Promise(resolve=>{sampleRecovery={text,role,resolve};$('#voiceRetry').hidden=false;});
 }
 function stop(message='Demo ended. Start again whenever you like.'){
  generation++;recorded.stop();$('#recordedPlayer').hidden=true;if(sampleRecovery){sampleRecovery.resolve(false);sampleRecovery=null;}$('#voiceRetry').hidden=true;$('#voiceRetry').disabled=false;active=false;sampleRunning=false;fastSample=false;busy=false;abortListening();cancelSpeech();clearInterval(clock);clock=null;status('Demo ended','idle');$('#voicePrompt').textContent=message;controls();
 }
 async function begin(sample=false,silent=false){
  stop();const token=++generation;active=true;sampleRunning=sample;fastSample=false;support();transcript=[];saved=null;dialog=new VoiceDialog(getProfile());started=Date.now();$('#voiceTimer').textContent='00:00';clock=setInterval(()=>{const t=Math.floor((Date.now()-started)/1000);$('#voiceTimer').textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0')},1000);$('#voicePrompt').textContent=sample?'A complete example conversation. Both voices are simulated.':'Tap the microphone, speak, then hear your receptionist reply.';status('Starting your demo…');add('assistant',dialog.greeting());
  const complete=silent?true:await speechTurn(dialog.greeting());if(token!==generation)return false;if(!sample&&!busy){status(complete?'Your turn · tap to speak':'Audio paused · tap to hear');if(complete&&$('#autoListen').checked)listen()}return true;
 }
 async function receive(text,{sample=false,fast=false}={}){
  if(!text.trim()||busy)return;if(!active){const ok=await begin(false,true);if(!ok)return}const token=generation;busy=true;abortListening();cancelSpeech();add('user',text.trim());
  if(sample&&!fast)await speechTurn(text,'user');if(token!==generation)return;status('Taking a moment…','thinking');const response=dialog.respond(text);if(dialog.step!=='idle')saved=null;if(response.request){saved=saveRequest(response.request,transcript);}
  add('assistant',response.text);const completed=await speechTurn(response.text,'assistant',fast||fastSample);if(token!==generation)return;busy=false;render();status(completed?'Your turn · tap to speak':'Audio paused · tap to hear');
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
 function runSample(){
  const profile=getProfile(),original=EXAMPLES.find(p=>p.id===profile.id);
  if(!original||original.name!==profile.name||original.agent!==profile.agent||JSON.stringify(original.services)!==JSON.stringify(profile.services)){
   support('The recording uses the original example name and services. Restore the example profile in Business knowledge to hear it, or use Start live voice demo with your edited profile.');return;
  }
  // begin(true,true) performs its reset synchronously and does not start native speech.
  begin(true,true);
  const token=generation,clip=SAMPLE_AUDIO[profile.id],script=sampleConversation(profile);
  transcript=[];render();audio.muted=muted;$('#recordedPlayer').hidden=false;
  $('#voicePrompt').textContent='Recorded example conversation. Dates are shown in the transcript. Use the audio controls to play or pause.';
  support('Recorded sample · no microphone, browser voice or voice API required. Both parts use a synthetic example voice.');
  function progress(seconds){
   if(token!==generation||!sampleRunning)return;
   let last=0;for(let i=0;i<clip.starts.length;i++)if(seconds>=clip.starts[i])last=i;
   transcript=script.turns.slice(0,last+1);onTranscript(transcript.map(m=>({...m})));render();
   const turn=script.turns[last];status(turn.role==='user'?'Recorded caller is speaking…':`${profile.agent} · recorded reply`,'speaking');
   $('#sampleProgressText').textContent=`Recorded line ${last+1} of ${script.turns.length}`;
   const t=Math.floor(seconds);$('#voiceTimer').textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
  }
  clearInterval(clock);clock=null;
  function complete(){
   if(token!==generation||!sampleRunning)return;
   transcript=script.turns.map(m=>({...m}));onTranscript(transcript);
   if(script.request)saved=saveRequest(script.request,transcript);
   sampleRunning=false;busy=false;render();status('Sample complete · request captured');
   $('#voicePrompt').textContent='The sample request is saved for review in this browser. Open the staff inbox to see it.';
  }
  progress(0);
  recorded.start(clip.src,{onPause:()=>{if(token===generation&&sampleRunning)status('Sample paused · press Play','idle');},onProgress:progress,onStart:()=>progress(audio.currentTime),onComplete:complete,onIssue:code=>{
   if(token!==generation)return;status('Sample ready · press audio play','idle');
   support(code==='not-allowed'?'Tap Play on the audio player below. Your browser requires a direct tap to start sound.':'The recording could not load. Check your connection and tap Play sample call again.');
  }});
  recorded.completeSample=complete;
 }
 function refresh(){
  const p=getProfile();if(businessId!==p.id){stop();businessId=p.id;transcript=[];saved=null;dialog=new VoiceDialog(p);$('#voiceTimer').textContent='00:00';status('Ready when you are','idle');$('#voicePrompt').textContent='Hear a sample call, or start a demo and speak to your receptionist.';}else dialog.profile=p;
  $('#voiceAgent').textContent=`Hello, I’m ${p.agent}.`;$('#voiceBusiness').textContent=`Your receptionist at ${p.name}`;$('#voiceMonogram').textContent=p.agent[0];render();
 }
 $('#startVoice').addEventListener('click',()=>begin());$('#sampleVoice').addEventListener('click',runSample);$('#endVoice').addEventListener('click',()=>stop());$('#voiceMic').addEventListener('click',listen);
 $('#voiceReplay').addEventListener('click',async()=>{const last=[...transcript].reverse().find(m=>m.role==='assistant');if(last){voices();const token=generation;await speak(last.text);if(active&&token===generation)status('Your turn · tap to speak')}});
 $('#voiceMute').addEventListener('click',()=>{muted=!muted;$('#voiceMute').setAttribute('aria-pressed',String(muted));$('#voiceMute').setAttribute('aria-label',muted?'Unmute spoken replies':'Mute spoken replies');$('#voiceMute span').textContent=muted?'♪':'♫';$('#voiceMute small').textContent=muted?'Sound off':'Sound on';audio.muted=muted;if(muted&&!sampleRunning){cancelSpeech();status('Your turn · sound off')}});
 $('#finishSample').addEventListener('click',()=>{if(sampleRunning&&recorded.job){recorded.completeSample?.();recorded.stop();return;}fastSample=true;if(sampleRecovery){sampleRecovery.resolve(true);sampleRecovery=null;}$('#voiceRetry').hidden=true;cancelSpeech()});
 $('#voiceTextForm').addEventListener('submit',e=>{e.preventDefault();const input=$('#voiceTextInput');if(sampleRunning||busy)return;const text=input.value;input.value='';receive(text)});
 $('#voiceQuickReplies').addEventListener('click',e=>{const b=e.target.closest('[data-voice-reply]');if(b&&!sampleRunning)receive(b.dataset.voiceReply)});
 $('#voiceSelect').addEventListener('change',()=>{support()});
 $('#autoListen').addEventListener('change',()=>{if($('#autoListen').checked&&active&&!sampleRunning)listen();else abortListening()});
 $('#voiceTest').addEventListener('click',()=>{
  if(sampleRunning)return;cancelSpeech();abortListening();audio.muted=false;$('#recordedPlayer').hidden=false;
  support('Recorded speaker test. If needed, press Play on the audio player. Check media volume and your selected speaker or headphones.');
  recorded.start('audio/test.mp3',{onStart:()=>status('Recorded speaker test playing…','speaking'),onComplete:()=>status(active?'Your turn · tap to speak':'Speaker test complete','idle'),onIssue:()=>{status('Press Play on the audio player','idle');}});
 });
 $('#voiceRetry').addEventListener('click',()=>{const recovery=sampleRecovery;const item=recovery||failedSpeech||[...transcript].reverse().find(m=>m.role==='assistant');if(!item)return;$('#voiceRetry').disabled=true;const token=generation;speak(item.text,item.role==='user'?'user':'assistant').then(ok=>{if(token!==generation)return;$('#voiceRetry').disabled=false;if(ok&&recovery&&sampleRecovery===recovery){sampleRecovery=null;recovery.resolve(true);}else if(ok)status(active?'Your turn · tap to speak':'Audio test complete','idle');});});
 $('#voiceOpenInbox').addEventListener('click',openInbox);window.addEventListener('pagehide',()=>stop());document.addEventListener('visibilitychange',()=>{if(document.hidden&&active)stop('Demo paused because this page was hidden. Start again to resume.')});
 if(synth){synth.addEventListener('voiceschanged',voices);voices()}support();refresh();return {stop,refresh};
}
