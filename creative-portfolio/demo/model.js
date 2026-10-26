export const STATUSES=['New','Brief received','Quoted','Won','Closed'];
export function validateLead(input,existing=[]){
 const name=String(input.name||'').trim(),email=String(input.email||'').trim().toLowerCase(),service=String(input.service||'').trim(),budget=Number(input.budget),brief=String(input.brief||'').trim();
 if(name.length<2||name.length>80)throw new Error('Use a name between 2 and 80 characters.');
 if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Enter a valid example email address.');
 if(existing.some(x=>x.email.toLowerCase()===email))throw new Error('That email already has an enquiry. Open its existing card instead.');
 if(!['Video editing','Product commercial','Website & integration'].includes(service))throw new Error('Choose a supported service.');
 if(!Number.isFinite(budget)||budget<1||budget>100000)throw new Error('Enter a budget between $1 and $100,000.');
 if(brief.length<10||brief.length>600)throw new Error('Write a brief between 10 and 600 characters.');
 return {name,email,service,budget,brief,status:'New'};
}
export function csvExport(leads){
 const cell=value=>{let s=String(value??'');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
 return [['Name','Email','Service','Budget USD','Status','Brief'],...leads.map(x=>[x.name,x.email,x.service,x.budget,x.status,x.brief])].map(row=>row.map(cell).join(',')).join('\r\n');
}
export function seedLeads(){return [
 {id:'sample-1',name:'Mira / Example Studio',email:'mira@example.com',service:'Video editing',budget:220,brief:'A 15-second edit from approved product footage, one portrait format.',status:'Brief received'},
 {id:'sample-2',name:'North / Demo Brand',email:'north@example.com',service:'Product commercial',budget:500,brief:'Explore a product commercial with a storyboard and production allowance.',status:'Quoted'},
 {id:'sample-3',name:'Alex / Sample Startup',email:'alex@example.com',service:'Website & integration',budget:1200,brief:'A landing page and a single enquiry-to-CRM workflow, to be scoped.',status:'New'}
 ];}
