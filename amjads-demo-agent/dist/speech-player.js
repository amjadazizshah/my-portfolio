// Keep the first native speak() call synchronous with the visitor's tap.
export class BrowserSpeechPlayer {
 constructor({synth,Utterance,onStart=()=>{},onIssue=()=>{},setTimer=setTimeout,clearTimer=clearTimeout}){Object.assign(this,{synth,Utterance,onStart,onIssue,setTimer,clearTimer});this.current=null}
 stop(){
  const job=this.current;
  const needsCancel=!!job||!!(this.synth&&(this.synth.speaking||this.synth.pending));
  if(job)job.finish(false,'interrupted');
  if(needsCancel){try{this.synth?.cancel()}catch{}}
 }
 play(text,{voice,lang='en-US',rate=1,pitch=1}={}){
  this.stop();
  if(!this.synth||!this.Utterance){this.onIssue('unsupported');return Promise.resolve(false)}
  return new Promise(resolve=>{
   let u;try{u=new this.Utterance(text.replace(/\n/g,' '))}catch{this.onIssue('unavailable');resolve(false);return}
   u.lang=voice?.lang||lang;if(voice)u.voice=voice;u.volume=1;u.rate=rate;u.pitch=pitch;
   let startTimer,endTimer,done=false;
   const job={utterance:u,finish:(ok,issue)=>{if(done)return;done=true;this.clearTimer(startTimer);this.clearTimer(endTimer);u.onstart=null;u.onend=null;u.onerror=null;if(this.current===job)this.current=null;if(issue&&issue!=='interrupted'&&issue!=='canceled')this.onIssue(issue);resolve(ok)}};
   this.current=job;
   u.onstart=()=>{if(this.current!==job)return;this.clearTimer(startTimer);this.onStart()};
   u.onend=()=>job.finish(true);
   u.onerror=e=>job.finish(false,e.error||'unavailable');
   startTimer=this.setTimer(()=>{if(this.current!==job)return;job.finish(false,'not-started');try{this.synth.cancel()}catch{}},6000);
   endTimer=this.setTimer(()=>{if(this.current!==job)return;job.finish(false,'timeout');try{this.synth.cancel()}catch{}},Math.max(15000,Math.min(120000,text.length*120+5000)));
   try{if(this.synth.paused)this.synth.resume();this.synth.speak(u)}catch{job.finish(false,'unavailable')}
  });
 }
}
