"""Render original fictional motion-design samples; no client campaign claims."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math, subprocess, wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'creative/assets'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FPS, DURATION = 24, 12
def ease(x):
    x = min(1, max(0, x)); return 1-(1-x)**3
def font(size, bold=False): return ImageFont.truetype(BOLD if bold else FONT, round(size))
def text(d, xy, value, size, color, bold=False, anchor=None):
    d.text(xy, value, font=font(size,bold), fill=color, anchor=anchor, spacing=0)
def rect(d, box, color, r=0): d.rounded_rectangle(tuple(round(x) for x in box), radius=r, fill=color)
def scene_text(d, t, lines, color, x=52, y=160, size=67):
    scene = min(3, int(t//3)); age=t%3
    yy = y + (1-ease(age*2))*55
    for line in lines[scene]:
        text(d,(x,yy),line,size,color,True); yy+=size*1.02
    return scene
def bottle(d,cx,cy,body,ink,t):
    x=cx+math.sin(t*.9)*7; y=cy+math.sin(t*1.3)*12
    for k in range(15,0,-1):
        d.ellipse((x-102-k*3,y+185-k,x+102+k*3,y+218+k),fill=(215-k,214-k,191-k))
    rect(d,(x-77,y-137,x+77,y+190),body,30)
    rect(d,(x-49,y-196,x+49,y-125),'#253929',12)
    rect(d,(x-44,y-196,x-33,y-125),'#4e6148',7)
    rect(d,(x-65,y-118,x-54,y+166),'#b8c0a1',8)
    text(d,(x,y-48),'F O R M',25,ink,True,'mm')
    text(d,(x,y-3),'DAILY RITUAL',12,ink,False,'mm')
    d.line((x-35,y+23,x+35,y+23),fill=ink,width=1)
    text(d,(x,y+56),'01',40,ink,False,'mm')
    text(d,(x,y+136),'CONCEPT / 50 mL',10,ink,False,'mm')
def render_frame(kind,t):
    if kind=='form':
        im=Image.new('RGB',(720,900),'#efefe2'); d=ImageDraw.Draw(im)
        d.ellipse((330,-110,1020,660),fill='#dce2ce')
        d.arc((400,150,900,650),0,360,fill='#b7c3a3',width=2)
        scene=scene_text(d,t,[['A quieter','kind of','ritual.'],['Less noise.','More','intention.'],['Meet your','daily','essential.'],['Make room','for your','ritual.']],'#253929',y=158,size=63)
        text(d,(54,430),['PRODUCT FILM','EDITORIAL PACING','A STUDY IN SIMPLICITY','FORM / CONCEPT BRAND'][scene],13,'#5d6a56')
        bottle(d,500,565,'#9ba88b','#253929',t)
        text(d,(52,778),'F O R M',30,'#253929',True)
        text(d,(52,825),'Product motion study · 4:5 social creative',14,'#5d6a56')
        accent='#253929'
    elif kind=='volt':
        im=Image.new('RGB',(720,1280),'#ff5a2d'); d=ImageDraw.Draw(im)
        for i in range(7):
            x=-600+i*270+int(t*60)%270
            d.polygon([(x,0),(x+70,0),(x+1100,1280),(x+1030,1280)],fill='#f34a22')
        scene=scene_text(d,t,[['TURN','IT UP.'],['BIG','CITRUS.'],['BOLD','BY DESIGN.'],['MEET','VOLT.']],'#ffef9f',y=200,size=100)
        cx,cy=370+math.sin(t*1.5)*20,775+math.sin(t*2)*15
        d.ellipse((cx-142,cy+217,cx+170,cy+260),fill='#cc371c')
        rect(d,(cx-115,cy-185,cx+115,cy+218),'#ffe98b',42)
        rect(d,(cx-100,cy-170,cx-77,cy+197),'#fff7bd',12)
        d.ellipse((cx-114,cy-202,cx+114,cy-162),fill='#d5d8d3')
        d.ellipse((cx-97,cy-193,cx+97,cy-169),outline='#767c7b',width=3)
        rect(d,(cx-17,cy-188,cx+36,cy-176),'#777d79',5)
        text(d,(cx,cy-39),'VOLT',62,'#f24420',True,'mm')
        text(d,(cx,cy+28),'C I T R U S',20,'#f24420',True,'mm')
        d.polygon([(cx+12,cy+62),(cx-20,cy+109),(cx+3,cy+109),(cx-8,cy+151),(cx+35,cy+95),(cx+10,cy+95)],fill='#f24420')
        text(d,(52,1105),['A FRESH PRODUCT DIRECTION','COLOUR. RHYTHM. IMPACT.','A VERTICAL SOCIAL CUT','A FICTIONAL BRAND STUDY'][scene],17,'#ffef9f',True)
        text(d,(52,1160),'Original motion design / 9:16',17,'#ffef9f')
        accent='#ffef9f'
    elif kind=='type':
        im=Image.new('RGB',(1280,720),'#11140f'); d=ImageDraw.Draw(im)
        for yy in range(100,700,60):d.line((45,yy,1235,yy),fill='#23291b')
        age=t%3; scene=min(3,int(t//3)); x=55+(1-ease(age*2))*100
        lines=[['MAKE','IT MOVE.'],['CUT TO','THE FEELING.'],['TYPE.','TIMING.','TENSION.'],['YOUR STORY.','A NEW RHYTHM.']][scene]
        size=[132,110,95,99][scene]
        for i,line in enumerate(lines):text(d,(x,155+i*size*1.03),line,size,'#d2fa69' if i%2==0 else '#f0f0e6',True)
        # The moving timeline and playhead make the edit rhythm visible.
        for i in range(18):
            h=12+abs(math.sin(t*3+i*.8))*33
            rect(d,(57+i*32,607-h,78+i*32,607),'#d2fa69',3)
        text(d,(830,586),'KINETIC TYPE / 16:9',17,'#d2fa69')
        accent='#d2fa69'
    else:
        im=Image.new('RGB',(1280,720),'#e9eeff'); d=ImageDraw.Draw(im)
        d.ellipse((560,-150,1450,810),fill='#d5defd')
        scene=scene_text(d,t,[['Your next','big idea.'],['One space.','Clear focus.'],['From draft','to done.'],['Meet','ORBIT.']],'#1d2d63',x=52,y=180,size=78)
        text(d,(55,405),['PRODUCT LAUNCH STUDY','INTERFACE IN MOTION','A CALMER WAY TO CREATE','FICTIONAL SOFTWARE CONCEPT'][scene],14,'#4d5e96')
        x=657+math.sin(t)*5;y=174+math.sin(t*1.5)*10
        rect(d,(x+15,y+22,x+557,y+392),'#b0bde8',23)
        rect(d,(x,y,x+545,y+375),'#ffffff',20)
        rect(d,(x,y,x+545,y+52),'#1d2d63',18)
        text(d,(x+23,y+14),'O R B I T',18,'white',True)
        for i in range(3):d.ellipse((x+464+i*22,y+20,x+471+i*22,y+27),fill='#a7b9f1')
        for i in range(3):
            xx=x+22+i*173;rect(d,(xx,y+80,xx+155,y+349),'#f0f3ff',10)
            text(d,(xx+14,y+98),['Ideas','In motion','Complete'][i],12,'#526596',True)
            for k in range(2):
                cy=y+133+k*98+math.sin(t*2+i+k)*4
                rect(d,(xx+10,cy,xx+145,cy+77),['#d6ccff','#cce9de','#ffdcca'][(i+k)%3],9)
                rect(d,(xx+22,cy+20,xx+100,cy+26),'#7284b7',3)
                rect(d,(xx+22,cy+38,xx+119,cy+42),'#9aa9cb',2)
                d.ellipse((xx+22,cy+53,xx+34,cy+65),fill='#526596')
        text(d,(54,608),'ORBIT / LAUNCH FILM',19,'#1d2d63',True)
        accent='#5266c9'
    d=ImageDraw.Draw(im)
    w,h=im.size
    text(d,(52,38),'AMJAD SHAH  /  MOTION DESIGN',12,accent,True)
    text(d,(w-52,38),'SPEC CONCEPT',12,accent,True,'ra')
    rect(d,(52,h-28,w-52,h-26),'#999b8e',1)
    rect(d,(52,h-28,52+(w-104)*t/DURATION,h-26),accent,1)
    # Global frame holds briefly, transitions with an intentional quick paper flash.
    phase=t%3
    if phase<.09 and t>.1:
        overlay=Image.new('RGB',im.size,'#f4f3e9');im=Image.blend(im,overlay,(.09-phase)/.09*.55)
    return im

def soundtrack(path):
    rate=44100; tt=np.arange(rate*DURATION)/rate
    # Original minimal synthesised pulse, kept deliberately quiet.
    samples=np.zeros_like(tt)
    for beat in np.arange(0,DURATION,.5):
        age=tt-beat;mask=(age>=0)&(age<.18)
        samples[mask]+=.13*np.sin(2*np.pi*(54*age[mask]+3*(1-np.exp(-age[mask]*35))))*np.exp(-age[mask]*24)
    for i,freq in enumerate([220,261.63,329.63,293.66]):
        age=tt-i*3;mask=(age>=0)&(age<2.5)
        samples[mask]+=.025*np.sin(2*np.pi*freq*age[mask])*np.exp(-age[mask]*1.8)
    samples*=np.minimum(1,tt*8)*np.minimum(1,(DURATION-tt)*3)
    with wave.open(str(path),'wb') as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes((samples*32767).astype('<i2').tobytes())

if __name__=='__main__':
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        audio=Path(tmp)/'original.wav';soundtrack(audio)
        for kind in ['form','volt','type','orbit']:
            first=render_frame(kind,1.2);w,h=first.size
            cmd=['ffmpeg','-y','-v','error','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{w}x{h}','-r',str(FPS),'-i','-','-i',str(audio),'-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart','-shortest',str(OUT/f'{kind}-motion.mp4')]
            process=subprocess.Popen(cmd,stdin=subprocess.PIPE)
            for n in range(FPS*DURATION):process.stdin.write(render_frame(kind,n/FPS).tobytes())
            process.stdin.close()
            if process.wait():raise RuntimeError(kind)
            first.save(OUT/f'{kind}-poster.jpg',quality=92)
            print(f'Rendered {kind}: {w}×{h}, {DURATION}s',flush=True)
