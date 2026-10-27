import {EXAMPLES} from '../dist/engine.js';
import {sampleConversation} from '../dist/recorded-sample.js';
const scripts=EXAMPLES.map(profile=>({id:profile.id,turns:sampleConversation(profile,'2030-01-01').turns.map(turn=>({...turn,spoken:turn.text.replace(/\d{4}-\d{2}-\d{2}/g,'the date shown on screen').replace('jordan@example.com','Jordan at example dot com').replace('11:00','eleven A M')}))}));
console.log(JSON.stringify(scripts));
