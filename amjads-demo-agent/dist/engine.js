export const EXAMPLES=[
 {id:'hotel',name:'Maison Avery',agent:'Avery',kind:'hotel',category:'BOUTIQUE HOTEL',description:'A considered little stay, in the heart of the city.',location:'42 Linden Street, Charleston, SC · fictional',hours:'Reception: daily, 7 am–11 pm',policy:'Flexible example rates can be cancelled up to 48 hours before arrival. Other rate conditions require staff review.',extra:'Complimentary Wi-Fi and luggage storage are available in this fictional hotel.',services:[{name:'Classic King',price:'$189 / night',detail:'One king bed · up to 2 guests'},{name:'Garden Suite',price:'$269 / night',detail:'Garden outlook · up to 3 guests'},{name:'Family Room',price:'$309 / night',detail:'Two queen beds · up to 4 guests'}]},
 {id:'salon',name:'Studio Willow',agent:'Sophie',kind:'salon',category:'HAIR & BEAUTY SALON',description:'Good hair. A little quiet. Time that is just for you.',location:'18 Willow Lane, London · fictional',hours:'Tuesday–Saturday, 9 am–6 pm',policy:'Please request changes at least 24 hours before your appointment. Late changes are reviewed by the team.',extra:'All colour services start with a consultation. Allergy and patch-test requirements must be checked with staff.',services:[{name:'Cut & finish',price:'$65',detail:'60-minute example appointment'},{name:'Colour consultation',price:'$25',detail:'30-minute example consultation'},{name:'Blow-dry',price:'$40',detail:'45-minute example appointment'},{name:'Scalp ritual',price:'$85',detail:'60-minute example treatment'}]},
 {id:'services',name:'Harbor Home Care',agent:'Alex',kind:'services',category:'HOME SERVICES',description:'A little help, so home feels like home again.',location:'Portland, Maine · fictional service area',hours:'Monday–Friday, 8 am–6 pm',policy:'Please request cancellation at least 24 hours before your visit. Exact service terms are confirmed by the team.',extra:'Appointments depend on your address and the team schedule. Emergency work is not offered in this demo.',services:[{name:'Home cleaning',price:'from $120',detail:'Final quote depends on property size'},{name:'Handyman consultation',price:'$35',detail:'Scope and quote confirmed by the team'},{name:'Garden tidy-up',price:'from $95',detail:'Final quote depends on garden size'}]}
];
export function todayISO(d=new Date()){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
export function greeting(p){return `Hello, welcome to ${p.name}. I’m ${p.agent}, your demo receptionist. I can help with ${p.kind==='hotel'?'room options, stay enquiries':'services, appointment requests'}, opening hours, and questions about your visit. How can I help?`}
export function replyFor(text,p){
 const t=text.toLowerCase().replace(/[’]/g,"'");
 if(/\b(emergency|fire|heart attack|can't breathe|cannot breathe|danger)\b/.test(t))return {text:'If there is an immediate emergency, contact local emergency services. This demo cannot dispatch help or alert staff.'};
 if(/\b(cancel|cancellation|reschedule|change my|move my|change a booking)\b/.test(t))return {text:`${p.policy}\nI can capture a change request for the team. I cannot change a real reservation.`,action:'handoff'};
 if(/\b(human|person|staff|manager|complaint|refund|speak to|talk to|call me)\b/.test(t))return {text:'Of course. I can save your question and contact details for staff review in the local demo inbox. No message is sent to an actual team.',action:'handoff'};
 if(/\b(book|booking|reserve|reservation|appointment|availability|available|stay|haircut)\b/.test(t)&&!(/\b(check|policy|price|cost|how much)\b/.test(t)))return {text:p.kind==='hotel'?'Let’s capture a stay request. Your dates and room choice will go to the demo staff inbox for review. I cannot check live room availability.':'Let’s capture an appointment request. Choose a service, date, and time. The team would verify availability before confirming.',action:'booking'};
 if(/\b(price|prices|pricing|cost|costs|rates|how much|menu|services|rooms|treatments|offer)\b/.test(t))return {text:`Here are our fictional demo ${p.kind==='hotel'?'room rates':'services'}:\n\n${p.services.map(s=>`${s.name} — ${s.price}\n${s.detail}`).join('\n\n')}\n\n${p.kind==='hotel'?'Example rates only; taxes, final price, and availability require staff confirmation.':'All prices are illustrative demo amounts in USD.'}`,action:'booking'};
 if(p.kind==='hotel'&&/check.?in|check.?out|arriv|late arrival/.test(t))return {text:'Example check-in is from 3 pm and check-out is by 11 am. For early check-in or late arrival, I can capture a request for the team. This does not guarantee approval.',action:'handoff'};
 if(/\b(hour|hours|open|opening|close|closing|timing|timings)\b/.test(t))return {text:`${p.hours}.\nThese are the current example profile hours. You can edit them in Business knowledge.`};
 if(/\b(location|address|where|directions)\b/.test(t))return {text:`Our example location is ${p.location}. This is a fictional demo business, not an address for a real visit.`};
 if(/\b(parking|park)\b/.test(t))return {text:p.kind==='hotel'?'Example parking is available on request. Staff would need to confirm space and any charges.':'Parking information has not been added to this profile. I can capture your question for the team.',action:'handoff'};
 if(/\b(pet|pets|dog|dogs|cat|cats)\b/.test(t))return {text:'A pet policy has not been verified for this example. Please let the team review the details before making plans.',action:'handoff'};
 if(/\b(wifi|wi-fi|internet|faq|accessibility|access|payment|payments)\b/.test(t))return {text:p.extra||'That detail has not been added. I can capture a question for the team.',action:p.extra?null:'handoff'};
 if(/\b(hi|hello|hey|good morning|good evening)\b/.test(t))return {text:greeting(p)};
 if(/\b(thanks|thank you|bye|goodbye)\b/.test(t))return {text:`You’re very welcome. ${p.agent} is here if you have another question.`};
 return {text:'I don’t have a verified answer to that in this guided demo. I can answer questions about services, prices, hours, or location, or capture your question for a person.',action:'handoff'};
}
export function validateRequest(d,p,mode='booking',today=todayISO()){
 if(!d.customer?.trim())return 'Please enter a name.';
 const contact=d.contact?.trim()||'';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)&&!(/^[+\d\s().-]+$/.test(contact)&&contact.replace(/\D/g,'').length>=7&&contact.replace(/\D/g,'').length<=15))return 'Please enter a valid email address or phone number.';
 if(mode==='handoff')return !d.notes?.trim()?'Please describe your question for the team.':null;
 if(!p.services.some(s=>s.name===d.service))return 'Please select a service.';
 const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
 if(!validDate(d.date)||d.date<today)return 'Choose today or a future date.';
 if(p.kind==='hotel'){
  if(!validDate(d.end)||d.end<=d.date)return 'Check-out must be a valid date after check-in.';
  if(!/^[1-4]$/.test(String(d.party)))return 'Please choose 1–4 guests.';
  const max=d.service==='Classic King'?2:d.service==='Garden Suite'?3:4;
  if(Number(d.party)>max)return `That example room accommodates up to ${max} guests. Please choose a larger room.`;
 }else{
  if(!/^\d{2}:\d{2}$/.test(d.time||''))return 'Please choose a preferred time.';
  const day=new Date(d.date+'T12:00:00').getDay();
  if(p.kind==='salon'&&[0,1].includes(day))return 'This example salon is closed on Sundays and Mondays.';
  if(p.kind==='services'&&[0,6].includes(day))return 'This example team is available Monday–Friday.';
  const min=p.kind==='salon'?'09:00':'08:00';
  if(d.time<min||d.time>='18:00')return `Please choose a time from ${min} and before 18:00.`;
 }
 return null;
}
export function csvCell(value){let s=String(value??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'}
export function csvFor(rows){return [['ID','Business','Type','Name','Contact','Service','Date','Check-out','Time','Guests','Notes','Channel','Status','Created'],...rows.map(r=>[r.id,r.businessName,r.type,r.customer,r.contact,r.service,r.date,r.end,r.time,r.party,r.notes,r.channel,r.status,r.created])].map(row=>row.map(csvCell).join(',')).join('\r\n')}
