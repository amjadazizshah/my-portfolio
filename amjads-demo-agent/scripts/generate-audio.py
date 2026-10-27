import json,wave,subprocess,sys,tempfile
from pathlib import Path
from piper import PiperVoice,SynthesisConfig
root=Path(__file__).resolve().parents[1]
work=Path(tempfile.mkdtemp(prefix='amjad-audio-'))
model=Path(sys.argv[1]).resolve()
scripts=json.loads(subprocess.check_output(['node',str(root/'scripts/sample-script.mjs')]))
voice=PiperVoice.load(model)
config=SynthesisConfig(length_scale=.94)
manifest={}
for script in scripts:
 chunks=[];marks=[];frames=0
 for i,turn in enumerate(script['turns']):
  path=work/f'{script["id"]}-{i}.wav'
  with wave.open(str(path),'wb') as f:voice.synthesize_wav(turn['spoken'],f,syn_config=config)
  with wave.open(str(path),'rb') as f:
   rate=f.getframerate();content=f.readframes(f.getnframes())
  marks.append(round(frames/rate,3));chunks.append(content);frames+=len(content)//2
  gap=b'\0\0'*int(rate*.25);chunks.append(gap);frames+=len(gap)//2
  print(script['id'],i,flush=True)
 path=work/f'{script["id"]}.wav'
 with wave.open(str(path),'wb') as f:
  f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(b''.join(chunks))
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(path),'-codec:a','libmp3lame','-b:a','64k',str(root/'dist/audio'/f'{script["id"]}.mp3')],check=True)
 manifest[script['id']]={'src':f'audio/{script["id"]}.mp3','starts':marks,'duration':round(frames/rate,3),'spoken': [t['spoken'] for t in script['turns']]}
with wave.open(str(work/'test.wav'),'wb') as f:voice.synthesize_wav('Hello, this is Amjad’s Demo Agent. This recorded speaker test is playing. If you can hear me, your sound is working.',f,syn_config=config)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(work/'test.wav'),'-codec:a','libmp3lame','-b:a','64k',str(root/'dist/audio/test.mp3')],check=True)
(root/'dist/sample-audio.js').write_text('export const SAMPLE_AUDIO='+json.dumps(manifest,ensure_ascii=False,indent=2)+';\n')
print('Finished',flush=True)
