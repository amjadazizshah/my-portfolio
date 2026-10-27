import {todayISO,replyFor,validateRequest} from './engine.js';
const numbers={zero:0,oh:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,first:1,second:2,third:3,fourth:4,fifth:5,sixth:6,seventh:7,eighth:8,ninth:9,tenth:10,eleventh:11,twelfth:12,thirteenth:13,fourteenth:14,fifteenth:15,sixteenth:16,seventeenth:17,eighteenth:18,nineteenth:19,twentieth:20,thirtieth:30};
const months=['january','february','march','april','may','june','july','august','september','october','november','december'];
export function normalizeNumbers(t){return t.toLowerCase().replace(/\b(twenty|thirty)[ -](one|two|three|four|five|six|seven|eight|nine|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth)\b/g,(_,a,b)=>String(numbers[a]+numbers[b])).replace(/\b([a-z]+)\b/g,(w)=>Object.hasOwn(numbers,w)?String(numbers[w]):w)}
function addDays(s,days){const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+days);return todayISO(d)}
function validISO(s){return /^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s}
export function speechDate(text,today=todayISO()){
 const t=normalizeNumbers(text).replace(/\b(\d+)(st|nd|rd|th)\b/g,'$1');
 const iso=t.match(/\b\d{4}-\d{2}-\d{2}\b/);if(iso)return validISO(iso[0])?iso[0]:null;
 if(/day after tomorrow/.test(t))return addDays(today,2);if(/\btomorrow\b/.test(t))return addDays(today,1);if(/\btoday\b/.test(t))return today;
 const days=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];const day=days.findIndex(d=>t.includes(d));if(day>=0){let n=(day-new Date(today+'T12:00:00').getDay()+7)%7;if(n===0)n=7;return addDays(today,n)}
 for(let m=0;m<12;m++){const re=new RegExp('(?:'+months[m]+'\\s+(?:the\\s+)?(\\d{1,2})|(\\d{1,2})\\s+(?:of\\s+)?'+months[m]+')(?:[, ]+(\\d{4}))?');const hit=t.match(re);if(hit){let year=Number(hit[3]||today.slice(0,4));const date=Number(hit[1]||hit[2]);let candidate=`${year}-${String(m+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;if(!hit[3]&&candidate<today)candidate=`${++year}-${candidate.slice(5)}`;return validISO(candidate)?candidate:null}}
 return null;
}
export function speechTime(text){
 const t=normalizeNumbers(text).replace(/a\s*\.\s*m\.?/g,'am').replace(/p\s*\.\s*m\.?/g,'pm');
 const h=t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);if(h){let hour=Number(h[1]),min=Number(h[2]||0);if(hour<1||hour>12||min>59)return null;hour=hour%12+(h[3]==='pm'?12:0);return String(hour).padStart(2,'0')+':'+String(min).padStart(2,'0')}
 const full=t.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);return full?full[1].padStart(2,'0')+':'+full[2]:null;
}
export function speechContact(text){
 let t=text.trim().replace(/^(my (?:email|phone|number)(?: address| number)? is|it'?s|you can reach me at)\s+/i,'').replace(/[.,]$/,'');
 if(t.includes('@')||/\bat\b.*\bdot\b/i.test(t)){t=t.toLowerCase().replace(/\s+at\s+/g,'@').replace(/\s+dot\s+/g,'.').replace(/\s+underscore\s+/g,'_').replace(/\s+dash\s+/g,'-').replace(/\s/g,'');return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)?t:null}
 t=normalizeNumbers(t).replace(/\bplus\b/g,'+').replace(/\s/g,'');return /^[+\d().-]+$/.test(t)&&t.replace(/\D/g,'').length>=7&&t.replace(/\D/g,'').length<=15?t:null;
}
const isQuestion=t=>/\?|^(what|when|where|how|do you|are you|can you tell|is there)\b/i.test(t.trim());
export class VoiceDialog {
 constructor(profile,today=todayISO()){this.profile=profile;this.today=today;this.step='idle';this.draft={};this.mode='booking'}
 greeting(){return `Thank you for calling ${this.profile.name}. I’m ${this.profile.agent}, your demo receptionist. How may I help you today?`}
 prompt(){const p=this.profile;return {service:`Certainly. ${p.kind==='hotel'?'Which room would you prefer':'Which service would you like'}? ${p.services.map(s=>s.name).join(', ')}.`,party:'How many guests will be staying? This demo can take up to four.',date:p.kind==='hotel'?'What date would you like to check in?':'What date would you prefer for your appointment?',end:'And what date would you like to check out? You can also say how many nights.',time:'What time would you prefer? Please include AM or PM.',customer:'May I have your name, please? Use an example name for this demo.',contact:'What email or phone number should the team use? Please use example details.',notes:'What would you like the team to help you with?',confirm:this.summary()}[this.step]||'How else can I help you?'}
 summary(){const d=this.draft;return this.mode==='booking'?`Let me read that back. ${d.service}${d.party?', '+d.party+' guests':''}, ${d.date}${d.end?' to '+d.end:' at '+d.time}, for ${d.customer}. Your contact is ${d.contact}. Shall I save this demo request for staff review? Say yes to save, or start over. This does not reserve a real booking.`:`I have a message from ${d.customer}: ${d.notes}. The contact is ${d.contact}. Shall I save this for the demo team? Say yes to save, or start over. No real message will be sent.`}
 choices(){const p=this.profile;switch(this.step){case'service':return p.services.map(s=>s.name);case'party':return ['One guest','Two guests','Three guests'];case'date':return [sampleDate(p,this.today)];case'end':return ['Two nights','Three nights'];case'time':return ['11 AM','2 PM'];case'customer':return ['Jordan Example'];case'contact':return ['jordan@example.com'];case'notes':return ['Please call me about a group enquiry.'];case'confirm':return ['Yes, save the request','Start over'];default:return ['What are your prices?',p.kind==='hotel'?'I would like to book a room':'I would like to book an appointment','Can I speak to a person?']}}
 respond(input){
  const raw=input.trim().slice(0,1200),t=raw.toLowerCase();if(!raw)return {text:this.prompt()};
  if(/\b(emergency|fire|heart attack|can't breathe|cannot breathe|danger)\b/.test(t))return replyFor(raw,this.profile);
  if(/^(bye|goodbye|end (?:the )?call|hang up)[.! ]*$/.test(t)){this.step='idle';this.draft={};return{text:'Thank you for calling. Take care, and have a lovely day.',end:true}}
  if(/^(start over|restart|cancel(?: the)? (?:request|booking)|stop)[.! ]*$/.test(t)){this.step='idle';this.draft={};return {text:'Of course. I have cleared the unfinished request. How else can I help?'}}
  if(this.step!=='idle'&&isQuestion(raw)&&this.step!=='notes'){const answer=replyFor(raw,this.profile);return {text:answer.text+'\n\n'+this.prompt()}}
  if(this.step==='idle'){
   if(/\b(human|person|manager|staff|complaint|refund|speak|talk to)\b/.test(t)){this.mode='handoff';this.draft={};this.step='notes';return{text:'Of course. I can take a message for the demo team. '+this.prompt()}}
   const r=replyFor(raw,this.profile);const wantsBooking=/\b(book|booking|reserve|reservation|appointment|stay|haircut)\b/.test(t)&&!(/\b(price|prices|cost|rates|how much|policy|cancel|reschedule|available|availability)\b/.test(t));if(r.action==='booking'&&wantsBooking){this.mode='booking';this.draft={};this.step='service';return{text:this.prompt()}}return {text:r.text+(r.action==='booking'?' If you would like to make a request, say “I would like to book.”':r.action==='handoff'?' Say “speak to a person” to leave a message.':'')};
  }
  const p=this.profile,d=this.draft;
  if(this.step==='service'){
   const norm=s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();const value=norm(raw);
   let match=p.services.find(s=>value.includes(norm(s.name)));if(!match){const aliases=p.kind==='salon'?[/haircut|cut and finish|cut finish/,/colou?r/,/blow dry/,/scalp/]:p.kind==='hotel'?[/classic|king/,/garden|suite/,/family/]:[/clean/,/handyman|repair/,/garden/];match=p.services[aliases.findIndex(re=>re.test(t))]}
   if(!match)return{text:'I didn’t catch the choice. '+this.prompt()};d.service=match.name;this.step=p.kind==='hotel'?'party':'date';return{text:this.prompt()};
  }
  if(this.step==='party'){const n=Number(normalizeNumbers(raw).match(/\b[1-4]\b/)?.[0]);const max=d.service==='Classic King'?2:d.service==='Garden Suite'?3:4;if(!n||n>max)return{text:`This example room takes up to ${max} guests. Please say a number from one to ${max}, or say start over to change rooms.`};d.party=String(n);this.step='date';return{text:this.prompt()}}
  if(this.step==='date'){const date=speechDate(raw,this.today);if(!date||date<this.today)return{text:'Please choose today or a future date. You can say a weekday, or a date like November tenth.'};const day=new Date(date+'T12:00:00').getDay();if(p.kind==='salon'&&[0,1].includes(day)||p.kind==='services'&&[0,6].includes(day))return{text:'The example team is closed that day. Please choose another date.'};d.date=date;this.step=p.kind==='hotel'?'end':'time';return{text:this.prompt()}}
  if(this.step==='end'){const n=normalizeNumbers(raw).match(/\b(\d{1,2})\s+nights?\b/),date=n&&Number(n[1])>0?addDays(d.date,Number(n[1])):speechDate(raw,this.today);if(!date||date<=d.date)return{text:'Check-out needs to be after check-in. You can say “two nights” or give a later date.'};d.end=date;this.step='customer';return{text:this.prompt()}}
  if(this.step==='time'){const time=speechTime(raw),min=p.kind==='salon'?'09:00':'08:00';if(!time||time<min||time>='18:00')return{text:`Please choose a time from ${min} and before 6 PM. For example, say eleven AM.`};d.time=time;this.step='customer';return{text:this.prompt()}}
  if(this.step==='customer'){const name=raw.replace(/^(my name is|i am|i'm|this is|it's)\s+/i,'').replace(/[.!]$/,'').trim();if(name.length<2||name.length>90||!/[a-z]/i.test(name))return{text:'Please give an example name, like Jordan Example.'};d.customer=name;this.step='contact';return{text:this.prompt()}}
  if(this.step==='contact'){const contact=speechContact(raw);if(!contact)return{text:'I couldn’t verify that contact. Please try again, or type an example email like jordan@example.com.'};d.contact=contact;this.step='confirm';return{text:this.prompt()}}
  if(this.step==='notes'){d.notes=raw;this.step='customer';return{text:this.prompt()}}
  if(this.step==='confirm'){
   if(/\b(yes|confirm|correct|save|go ahead)\b/.test(t)&&!(/\b(no|not|don't|do not)\b/.test(t))){const error=validateRequest(d,p,this.mode,this.today);if(error)return{text:error+' Say start over to change your request.'};const request={...d,type:this.mode==='booking'?'Booking':'Handoff'};this.step='idle';this.draft={};return{text:'All set. I have saved your demo request for staff review. Nothing has been booked or sent outside this browser. Is there anything else I can help with?',request}}
   return{text:'Nothing has been saved yet. Say yes to save this demo request, or start over to change the details.'};
  }
  return{text:this.prompt()};
 }
}
export function sampleDate(p,today=todayISO()){let date=addDays(today,1);while(p.kind==='salon'&&[0,1].includes(new Date(date+'T12:00:00').getDay())||p.kind==='services'&&[0,6].includes(new Date(date+'T12:00:00').getDay()))date=addDays(date,1);return date}
export function sampleLines(p,today=todayISO()){return [p.kind==='hotel'?'I would like to book a room':'I would like to book an appointment',p.services[0].name,...(p.kind==='hotel'?['Two guests']:[]),sampleDate(p,today),p.kind==='hotel'?'Two nights':'11 AM','Jordan Example','jordan@example.com','Yes, save the request']}
