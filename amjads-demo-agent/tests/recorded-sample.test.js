import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {EXAMPLES} from '../dist/engine.js';
import {RecordedSamplePlayer,sampleConversation} from '../dist/recorded-sample.js';
import {SAMPLE_AUDIO} from '../dist/sample-audio.js';

function fixture(){
 const calls=[];
 const audio={currentTime:0,pause(){calls.push('pause');},play(){calls.push('play');return Promise.resolve();}};
 return {audio,calls,player:new RecordedSamplePlayer(audio)};
}
test('recorded media starts synchronously during the visitor click',()=>{
 const f=fixture();f.player.start('audio/hotel.mp3');
 assert.equal(f.audio.src,'audio/hotel.mp3');assert.deepEqual(f.calls,['pause','play']);
});
test('a blocked initial play keeps native controls usable and completion fires once',async()=>{
 const f=fixture(),issues=[];let complete=0,started=0;
 f.audio.play=()=>Promise.reject(Object.assign(new Error(),{name:'NotAllowedError'}));
 f.player.start('audio/hotel.mp3',{onIssue:code=>issues.push(code),onComplete:()=>complete++,onStart:()=>started++});
 await Promise.resolve();assert.deepEqual(issues,['not-allowed']);
 f.audio.onplaying();f.audio.onended();f.audio.onended();
 assert.equal(started,1);assert.equal(complete,1);
});
test('stop and business changes prevent old media callbacks changing the current call',()=>{
 const f=fixture();let complete=0,progress=0;
 f.player.start('one.mp3',{onComplete:()=>complete++,onProgress:()=>progress++});
 const ended=f.audio.onended,timeupdate=f.audio.ontimeupdate;
 f.player.start('two.mp3');ended();timeupdate();
 assert.equal(complete,0);assert.equal(progress,0);
 f.player.stop();assert.equal(f.audio.onended,null);assert.equal(f.audio.ontimeupdate,null);
});
test('recorded transcript and request agree with each original business across future dates',()=>{
 for(const p of EXAMPLES){
  const clip=SAMPLE_AUDIO[p.id];
  assert.ok(statSync(new URL('../dist/'+clip.src,import.meta.url)).size>1000);
  for(const date of ['2026-10-27','2027-01-01','2030-01-01']){
   const script=sampleConversation(p,date);
   assert.ok(script.request);assert.equal(script.request.service,p.services[0].name);
   assert.equal(script.turns.length,clip.starts.length);
   script.turns.forEach((turn,i)=>{
    const spoken=turn.text.replace(/\d{4}-\d{2}-\d{2}/g,'the date shown on screen').replace('jordan@example.com','Jordan at example dot com').replace('11:00','eleven A M');
    assert.equal(spoken,clip.spoken[i]);
    assert.ok(i===0||clip.starts[i]>clip.starts[i-1]);
   });
  }
 }
});
test('visible native audio controls and a recorded speaker test are shipped',()=>{
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.match(html,/<audio id="recordedAudio" controls playsinline/);
 assert.ok(statSync(new URL('../dist/audio/test.mp3',import.meta.url)).size>1000);
});
