import {VoiceDialog,sampleLines} from './voice-engine.js';

export function sampleConversation(profile,today){
 const dialog=new VoiceDialog(profile,today),turns=[{role:'assistant',text:dialog.greeting()}];
 let request=null;
 for(const line of sampleLines(profile,dialog.today)){
  turns.push({role:'user',text:line});
  const reply=dialog.respond(line);
  turns.push({role:'assistant',text:reply.text});
  if(reply.request)request=reply.request;
 }
 return {turns,request};
}

// Keep one HTML audio element. Calling play here must stay inside the click handler.
// If autoplay is refused, its native controls can start exactly the same recording.
export class RecordedSamplePlayer {
 constructor(audio){this.audio=audio;this.job=null;}
 stop(){
  this.job=null;
  this.audio.onpause=null;this.audio.onplaying=null;this.audio.ontimeupdate=null;this.audio.onended=null;this.audio.onerror=null;
  this.audio.pause();
  try{this.audio.currentTime=0;}catch{}
 }
 start(src,{onProgress=()=>{},onStart=()=>{},onPause=()=>{},onComplete=()=>{},onIssue=()=>{}}={}){
  this.stop();const job={completed:false};this.job=job;
  this.audio.src=src;
  this.audio.onplaying=()=>{if(this.job===job)onStart();};
  this.audio.onpause=()=>{if(this.job===job&&!job.completed&&!this.audio.ended)onPause();};
  this.audio.ontimeupdate=()=>{if(this.job===job)onProgress(this.audio.currentTime);};
  this.audio.onended=()=>{if(this.job!==job||job.completed)return;job.completed=true;onComplete();};
  this.audio.onerror=()=>{if(this.job===job)onIssue('unavailable');};
  try{
   const playing=this.audio.play();
   playing?.catch(error=>{if(this.job===job)onIssue(error.name==='NotAllowedError'?'not-allowed':'unavailable');});
  }catch(error){onIssue(error.name==='NotAllowedError'?'not-allowed':'unavailable');}
 }
}
