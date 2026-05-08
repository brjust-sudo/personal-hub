import React, { useState } from "react";

// ── THEME ─────────────────────────────────────────────────────────────────────
const T = {
  bg:       "#f5f0e8",
  surface:  "#faf7f2",
  border:   "#e8e0d0",
  text:     "#2c2825",
  muted:    "#9a8f82",
  faint:    "#c8bfb0",
  accent:   "#8b6f47",
  green:    "#6a8f6a",
  yellow:   "#b8963e",
  red:      "#a05a4a",
  blue:     "#5a7a8f",
  purple:   "#7a6a8f",
  orange:   "#a06a3a",
};

const CORRECT_PASSWORD = "dt7UK67";

const HEALTH = {
  rhr:  [52,54,54,58,52,53,56],
  steps:[11069,14817,14596,12861,16129,16102,7212],
  cals: [474,640,847,533,556,965,355],
  spo2: [95.5,95.9,98.3,96.4,94.6,95.9,98.3],
  today:{ rhr:56, spo2:98.3, sleep:"8h 32m", sleepScore:82 }
};
const AVG_RHR = Math.round(HEALTH.rhr.reduce((a,b)=>a+b,0)/HEALTH.rhr.length);
const RECOVERY = Math.round((Math.max(0,Math.min(100,100-(HEALTH.today.rhr-AVG_RHR)*5))+HEALTH.today.sleepScore)/2);
const RC = RECOVERY>=67?T.green:RECOVERY>=34?T.yellow:T.red;
const RL = RECOVERY>=67?"Good":RECOVERY>=34?"Moderate":"Low";

const INIT_SESSIONS = [
  {date:"May 5", type:"Long Toss",  dist:"150ft",    throws:40,velo:"—", notes:"Felt loose, good extension"},
  {date:"May 3", type:"Bullpen",    dist:"60ft 6in", throws:35,velo:"88",notes:"Worked on intent, 2-seam"},
  {date:"May 1", type:"Flat Ground",dist:"60ft",     throws:50,velo:"87",notes:"Leg lift timing, felt good"},
  {date:"Apr 29",type:"Long Toss",  dist:"180ft",    throws:38,velo:"—", notes:"Max effort pulls"},
];

const INIT_ATHLETES = [{
  id:1, name:"Gavin", position:"Pitcher",
  topics:[
    {id:0,label:"Pitching with intent",sub:"Shift from safe → attack mode. No walks but no K's.",color:T.orange,done:false},
    {id:1,label:"Fear of HBP (Priority)",sub:"He opened up — normalize it, mental reframe + drills.",color:T.red,done:false},
    {id:2,label:"Lower half / leg lift",sub:"Revisit mechanics for velocity gain.",color:T.yellow,done:false},
    {id:3,label:"Accountability check-in",sub:"Circle back on commitments from last session.",color:T.green,done:false},
  ],
  notes:"He opened up about fear of getting hit — this is a big deal. Keep building that trust.",
  sessionNotes:"",
}];

// ── SHARED UI ─────────────────────────────────────────────────────────────────
const font = "'Inter', 'DM Sans', sans-serif";

const Card = ({children,style={}})=>(
  <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:20,...style}}>
    {children}
  </div>
);

const Lbl = ({children,color,style={}})=>(
  <div style={{fontSize:10,color:color||T.muted,letterSpacing:1.5,marginBottom:12,fontWeight:600,textTransform:"uppercase",fontFamily:font,...style}}>{children}</div>
);

const Chip = ({children,color})=>(
  <span style={{background:`${color}18`,color,border:`1px solid ${color}30`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:500,fontFamily:font}}>{children}</span>
);

const Divider = ()=><div style={{height:1,background:T.border,margin:"2px 0"}}/>;

const MiniBar = ({values,color})=>{
  const m=Math.max(...values);
  return(
    <div style={{display:"flex",gap:3,alignItems:"flex-end",height:28}}>
      {values.map((v,i)=>(
        <div key={i} style={{flex:1,height:`${(v/m)*100}%`,background:i===values.length-1?color:`${color}40`,borderRadius:3,minHeight:3}}/>
      ))}
    </div>
  );
};

const Ring = ({value,max=100,size=76,stroke=6,color,label,sub})=>{
  const r=(size-stroke)/2,circ=2*Math.PI*r,pct=Math.min(value/max,1);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          fill={T.text} fontSize={size*0.2} fontFamily={font} fontWeight="600">{value}</text>
      </svg>
      {label&&<div style={{fontSize:10,color:T.muted,letterSpacing:1,fontFamily:font,textTransform:"uppercase"}}>{label}</div>}
      {sub&&<div style={{fontSize:9,color:T.faint,fontFamily:font}}>{sub}</div>}
    </div>
  );
};

const CheckRow = ({label,sub,done,onToggle,dot})=>(
  <div onClick={onToggle} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer",opacity:done?0.45:1}}>
    <div style={{width:18,height:18,borderRadius:5,border:done?"none":`1.5px solid ${T.faint}`,background:done?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
      {done&&<svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
    <div style={{flex:1}}>
      <div style={{fontSize:13,color:done?T.faint:T.text,fontFamily:font,textDecoration:done?"line-through":"none",fontWeight:400}}>{label}</div>
      {sub&&<div style={{fontSize:11,color:T.muted,marginTop:2,fontFamily:font}}>{sub}</div>}
    </div>
    {dot&&!done&&<div style={{width:6,height:6,borderRadius:"50%",background:dot,flexShrink:0,marginTop:6}}/>}
  </div>
);

const PillTab = ({label,active,onClick})=>(
  <button onClick={onClick} style={{background:active?T.accent:"transparent",border:`1px solid ${active?T.accent:T.border}`,borderRadius:20,padding:"5px 14px",fontSize:12,fontFamily:font,color:active?"white":T.muted,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s",fontWeight:active?500:400}}>{label}</button>
);

const Inp = ({value,onChange,placeholder,style={}})=>(
  <input value={value} onChange={onChange} placeholder={placeholder}
    style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 13px",color:T.text,fontSize:13,outline:"none",fontFamily:font,width:"100%",boxSizing:"border-box",...style}}/>
);

// ── LOCK ──────────────────────────────────────────────────────────────────────
function LockScreen({onUnlock}){
  const [input,setInput]=useState("");
  const [error,setError]=useState(false);
  const [shake,setShake]=useState(false);
  const attempt=()=>{
    if(input===CORRECT_PASSWORD){onUnlock();}
    else{setError(true);setShake(true);setInput("");setTimeout(()=>setShake(false),500);}
  };
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:font}}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
      <div style={{fontSize:13,color:T.muted,letterSpacing:3,marginBottom:8,textTransform:"uppercase"}}>Personal Hub</div>
      <div style={{fontSize:28,fontWeight:600,color:T.text,marginBottom:4}}>Welcome back</div>
      <div style={{fontSize:13,color:T.muted,marginBottom:40}}>Enter your password to continue</div>
      <div style={{width:"100%",maxWidth:300,animation:shake?"shake 0.4s ease":"none"}}>
        <input type="password" value={input} onChange={e=>{setInput(e.target.value);setError(false);}} onKeyDown={e=>e.key==="Enter"&&attempt()} placeholder="Password" autoFocus
          style={{width:"100%",background:T.surface,border:`1.5px solid ${error?"#a05a4a":T.border}`,borderRadius:12,padding:"13px 16px",color:T.text,fontSize:15,outline:"none",fontFamily:font,textAlign:"center",boxSizing:"border-box",marginBottom:10}}/>
        {error&&<div style={{fontSize:12,color:T.red,textAlign:"center",marginBottom:10}}>Incorrect password</div>}
        <button onClick={attempt} style={{width:"100%",background:T.accent,border:"none",borderRadius:12,padding:"13px",color:"white",fontWeight:600,cursor:"pointer",fontSize:14,fontFamily:font}}>Continue</button>
      </div>
    </div>
  );
}

// ── TODAY ─────────────────────────────────────────────────────────────────────
function TodayTab(){
  const [todos,setTodos]=useState([
    {id:1,label:"Morning mobility routine",done:false,dot:T.red},
    {id:2,label:"Review throwing session notes",done:false,dot:T.red},
    {id:3,label:"Gavin session prep",done:false,dot:T.orange},
    {id:4,label:"Check weekly pitching program",done:false,dot:null},
    {id:5,label:"Nutrition — hit protein goal",done:false,dot:null},
    {id:6,label:"Sleep by 11pm",done:false,dot:T.yellow},
  ]);
  const [adding,setAdding]=useState(false);
  const [txt,setTxt]=useState("");
  const toggle=id=>setTodos(t=>t.map(i=>i.id===id?{...i,done:!i.done}:i));
  const add=()=>{if(!txt.trim())return;setTodos(t=>[...t,{id:Date.now(),label:txt,done:false,dot:null}]);setTxt("");setAdding(false);};
  const done=todos.filter(t=>t.done).length;
  const pct=Math.round((done/todos.length)*100);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>

      {/* Recovery */}
      <Card>
        <Lbl>Recovery · Today</Lbl>
        <div style={{display:"flex",justifyContent:"space-around",alignItems:"center",padding:"6px 0"}}>
          <Ring value={RECOVERY} color={RC} label="Recovery" size={84}/>
          <Ring value={HEALTH.today.rhr} max={90} color={T.blue} label="Resting HR" sub="bpm" size={68}/>
          <Ring value={Math.round(HEALTH.today.spo2)} max={100} color={T.purple} label="SpO₂" sub="%" size={68}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:600,color:T.text,fontFamily:font}}>{HEALTH.today.sleep}</div>
            <div style={{fontSize:10,color:T.muted,letterSpacing:1,marginTop:4,textTransform:"uppercase",fontFamily:font}}>Sleep</div>
            <div style={{marginTop:8}}><Chip color={RC}>{RL}</Chip></div>
          </div>
        </div>
      </Card>

      {/* Trends */}
      <Card>
        <Lbl>7-Day Trends</Lbl>
        {[
          {label:"Resting HR",values:HEALTH.rhr, color:T.blue, fmt:v=>`${v} bpm`},
          {label:"Steps",     values:HEALTH.steps,color:T.green,fmt:v=>`${(v/1000).toFixed(1)}k`},
          {label:"Active Cal",values:HEALTH.cals, color:T.orange,fmt:v=>`${Math.round(v)} kcal`},
        ].map(({label,values,color,fmt})=>(
          <div key={label} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:12,color:T.muted,fontFamily:font}}>{label}</span>
              <span style={{fontSize:12,color:T.text,fontFamily:font,fontWeight:500}}>{fmt(values[values.length-1])}</span>
            </div>
            <MiniBar values={values} color={color}/>
          </div>
        ))}
      </Card>

      {/* Checklist */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <Lbl style={{marginBottom:0}}>Today's Checklist</Lbl>
          <span style={{fontSize:11,color:T.muted,fontFamily:font,marginBottom:12}}>{done} of {todos.length}</span>
        </div>
        <div style={{height:3,background:T.border,borderRadius:2,marginBottom:14}}>
          <div style={{height:"100%",width:`${pct}%`,background:T.green,borderRadius:2,transition:"width 0.4s"}}/>
        </div>
        {todos.map(t=><CheckRow key={t.id} {...t} onToggle={()=>toggle(t.id)}/>)}
        {adding?(
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <Inp value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Add task..." style={{flex:1,width:"auto"}}/>
            <button onClick={add} style={{background:T.accent,border:"none",borderRadius:10,padding:"9px 16px",color:"white",fontWeight:600,cursor:"pointer",fontSize:13,fontFamily:font,flexShrink:0}}>Add</button>
          </div>
        ):(
          <button onClick={()=>setAdding(true)} style={{marginTop:12,background:"none",border:`1px dashed ${T.faint}`,borderRadius:10,padding:"9px",color:T.muted,cursor:"pointer",fontSize:12,width:"100%",fontFamily:font}}>+ Add task</button>
        )}
      </Card>
    </div>
  );
}

// ── SCHEDULE ──────────────────────────────────────────────────────────────────
const GCAL_API_KEY = "AIzaSyD0yiOxSTzSlc8WO5YEpvZKyiBuAYkaxcA";
const GCAL_ID = "brjust@umich.edu";

function useCalendarEvents(){
  const [days,setDays]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  useState(()=>{
    const fetch7Days=async()=>{
      try{
        const now=new Date();
        const start=new Date(now);start.setHours(0,0,0,0);
        const end=new Date(start);end.setDate(end.getDate()+7);
        const url=`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GCAL_ID)}/events?key=${GCAL_API_KEY}&timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&singleEvents=true&orderBy=startTime&maxResults=50`;
        const res=await fetch(url);
        if(!res.ok)throw new Error("Failed");
        const data=await res.json();
        const grouped={};
        (data.items||[]).forEach(item=>{
          const s=item.start?.dateTime||item.start?.date;
          if(!s)return;
          const d=new Date(s);
          const key=d.toDateString();
          if(!grouped[key])grouped[key]={events:[]};
          grouped[key].events.push(item);
        });
        const result=[];
        for(let i=0;i<7;i++){
          const d=new Date(start);d.setDate(d.getDate()+i);
          const key=d.toDateString();
          result.push({
            date:d,
            label:i===0?`Today — ${d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}`:d.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}),
            isToday:i===0,
            events:(grouped[key]?.events||[]),
          });
        }
        setDays(result);
      }catch(e){setError(e.message);}
      finally{setLoading(false);}
    };
    fetch7Days();
  },[]);
  return{days,loading,error};
}

function ScheduleTab(){
  const{days,loading,error}=useCalendarEvents();
  const formatTime=(item)=>{
    if(item.start?.date&&!item.start?.dateTime)return"All day";
    const d=new Date(item.start.dateTime);
    return d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true});
  };
  if(loading)return(
    <Card><div style={{textAlign:"center",padding:40,color:T.muted,fontSize:13,fontFamily:font}}>Loading calendar...</div></Card>
  );
  if(error)return(
    <Card><div style={{color:T.red,fontSize:13,fontFamily:font}}>Could not load calendar. Check API key or permissions.</div></Card>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {days.map(({date,label,isToday,events},di)=>(
        <Card key={di} style={isToday?{border:`1.5px solid ${T.accent}`}:{}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <Lbl style={{marginBottom:0,color:isToday?T.accent:T.muted}}>{label}</Lbl>
            {isToday&&<Chip color={T.accent}>Today</Chip>}
          </div>
          {events.length===0?(
            <div style={{fontSize:12,color:T.faint,fontFamily:font,padding:"4px 0"}}>No events</div>
          ):events.map((e,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:i<events.length-1?`1px solid ${T.border}`:"none",alignItems:"flex-start"}}>
              <div style={{width:64,fontSize:11,color:T.muted,fontFamily:font,paddingTop:1,flexShrink:0}}>{formatTime(e)}</div>
              <div style={{width:2,background:T.accent,borderRadius:2,alignSelf:"stretch",flexShrink:0,minHeight:18,opacity:0.5}}/>
              <div style={{fontSize:13,color:T.text,fontFamily:font}}>{e.summary||"(No title)"}</div>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

// ── THROWING ──────────────────────────────────────────────────────────────────
function ThrowingTab(){
  const [sessions,setSessions]=useState(INIT_SESSIONS);
  const [addingSession,setAddingSession]=useState(false);
  const [form,setForm]=useState({type:"Bullpen",dist:"",throws:"",velo:"",notes:""});
  const [coachNotes,setCoachNotes]=useState([
    {id:1,cue:"Efficiently rotate pelvis into foot strike",detail:"Drive hip rotation early — pelvis should be turning as front foot lands, not after.",date:"May 2026"},
    {id:2,cue:"Add tilt to delivery",detail:"Increase lateral trunk tilt at release — create downhill plane on the ball.",date:"May 2026"},
  ]);
  const [addingCue,setAddingCue]=useState(false);
  const [newCue,setNewCue]=useState({cue:"",detail:""});
  const saveSession=()=>{setSessions(s=>[{date:"Today",...form},...s]);setForm({type:"Bullpen",dist:"",throws:"",velo:"",notes:""});setAddingSession(false);};
  const saveCue=()=>{if(!newCue.cue.trim())return;setCoachNotes(n=>[...n,{id:Date.now(),...newCue,date:"Today"}]);setNewCue({cue:"",detail:""});setAddingCue(false);};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>

      <Card>
        <Lbl>This Week — Focus Areas</Lbl>
        {[
          {label:"Pitch with intent",sub:"No safe mode. Attack the zone every pitch.",color:T.orange},
          {label:"Lower half mechanics",sub:"Leg lift timing → velocity connection.",color:T.yellow},
          {label:"Fear of HBP",sub:"Mental reframe — normalize it. Drills to follow.",color:T.red},
        ].map(({label,sub,color})=>(
          <div key={label} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.border}`,alignItems:"flex-start"}}>
            <div style={{width:3,background:color,borderRadius:2,alignSelf:"stretch",flexShrink:0,opacity:0.7}}/>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:T.text,fontFamily:font}}>{label}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:2,fontFamily:font}}>{sub}</div>
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <Lbl style={{marginBottom:0}}>Coach Notes</Lbl>
          <button onClick={()=>setAddingCue(true)} style={{background:T.accent,border:"none",borderRadius:8,padding:"5px 12px",color:"white",fontWeight:500,cursor:"pointer",fontSize:12,fontFamily:font}}>+ Add Cue</button>
        </div>
        {addingCue&&(
          <div style={{background:T.bg,borderRadius:12,padding:14,marginBottom:14,display:"flex",flexDirection:"column",gap:8,border:`1px solid ${T.border}`}}>
            <Inp value={newCue.cue} onChange={e=>setNewCue(n=>({...n,cue:e.target.value}))} placeholder="Cue or focal point..."/>
            <textarea value={newCue.detail} onChange={e=>setNewCue(n=>({...n,detail:e.target.value}))} placeholder="Coach's explanation..."
              style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 13px",color:T.text,fontSize:13,outline:"none",fontFamily:font,resize:"none",minHeight:72,lineHeight:1.5}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={saveCue} style={{flex:1,background:T.accent,border:"none",borderRadius:9,padding:9,color:"white",fontWeight:600,cursor:"pointer",fontSize:13,fontFamily:font}}>Save</button>
              <button onClick={()=>setAddingCue(false)} style={{flex:1,background:"none",border:`1px solid ${T.border}`,borderRadius:9,padding:9,color:T.muted,cursor:"pointer",fontSize:13,fontFamily:font}}>Cancel</button>
            </div>
          </div>
        )}
        {coachNotes.map((n)=>(
          <div key={n.id} style={{padding:"11px 0",borderBottom:`1px solid ${T.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <div style={{fontSize:13,fontWeight:500,color:T.text,fontFamily:font}}>{n.cue}</div>
              <span style={{fontSize:10,color:T.faint,fontFamily:font,flexShrink:0,marginLeft:8}}>{n.date}</span>
            </div>
            {n.detail&&<div style={{fontSize:12,color:T.muted,lineHeight:1.55,fontFamily:font}}>{n.detail}</div>}
          </div>
        ))}
      </Card>

      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <Lbl style={{marginBottom:0}}>Session Log</Lbl>
          <button onClick={()=>setAddingSession(true)} style={{background:T.accent,border:"none",borderRadius:8,padding:"5px 12px",color:"white",fontWeight:500,cursor:"pointer",fontSize:12,fontFamily:font}}>+ Log</button>
        </div>
        {addingSession&&(
          <div style={{background:T.bg,borderRadius:12,padding:14,marginBottom:14,display:"flex",flexDirection:"column",gap:8,border:`1px solid ${T.border}`}}>
            {[["type","Type (Bullpen, Long Toss...)"],["dist","Distance"],["throws","# of throws"],["velo","Velo (mph or —)"],["notes","Notes"]].map(([k,ph])=>(
              <Inp key={k} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={ph}/>
            ))}
            <div style={{display:"flex",gap:8}}>
              <button onClick={saveSession} style={{flex:1,background:T.accent,border:"none",borderRadius:9,padding:9,color:"white",fontWeight:600,cursor:"pointer",fontSize:13,fontFamily:font}}>Save</button>
              <button onClick={()=>setAddingSession(false)} style={{flex:1,background:"none",border:`1px solid ${T.border}`,borderRadius:9,padding:9,color:T.muted,cursor:"pointer",fontSize:13,fontFamily:font}}>Cancel</button>
            </div>
          </div>
        )}
        {sessions.map((s,i)=>(
          <div key={i} style={{padding:"11px 0",borderBottom:`1px solid ${T.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
              <div>
                <span style={{fontSize:13,fontWeight:500,color:T.text,fontFamily:font}}>{s.type}</span>
                <span style={{fontSize:11,color:T.muted,marginLeft:8,fontFamily:font}}>{s.date}</span>
              </div>
              <div style={{display:"flex",gap:5}}>
                {s.velo&&s.velo!=="—"&&<Chip color={T.orange}>{s.velo} mph</Chip>}
                <Chip color={T.blue}>{s.throws} throws</Chip>
              </div>
            </div>
            <div style={{fontSize:11,color:T.muted,fontFamily:font}}>{s.dist} · {s.notes}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── ATHLETES ──────────────────────────────────────────────────────────────────
function AthletesTab(){
  const [athletes,setAthletes]=useState(INIT_ATHLETES);
  const [activeId,setActiveId]=useState(1);
  const [addingAthlete,setAddingAthlete]=useState(false);
  const [newAthlete,setNewAthlete]=useState({name:"",position:""});
  const active=athletes.find(a=>a.id===activeId)||athletes[0];
  const toggleTopic=(aid,tid)=>setAthletes(p=>p.map(a=>a.id!==aid?a:{...a,topics:a.topics.map(t=>t.id===tid?{...t,done:!t.done}:t)}));
  const updateNotes=(aid,val)=>setAthletes(p=>p.map(a=>a.id!==aid?a:{...a,sessionNotes:val}));
  const addAthlete=()=>{
    if(!newAthlete.name.trim())return;
    const id=Date.now();
    setAthletes(p=>[...p,{id,name:newAthlete.name,position:newAthlete.position,topics:[],notes:"",sessionNotes:""}]);
    setActiveId(id);setNewAthlete({name:"",position:""});setAddingAthlete(false);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        {athletes.map(a=><PillTab key={a.id} label={a.name} active={activeId===a.id} onClick={()=>setActiveId(a.id)}/>)}
        <button onClick={()=>setAddingAthlete(true)} style={{background:"none",border:`1px dashed ${T.faint}`,borderRadius:20,padding:"5px 14px",fontSize:12,fontFamily:font,color:T.muted,cursor:"pointer"}}>+ Add</button>
      </div>
      {addingAthlete&&(
        <Card>
          <Lbl>New Athlete</Lbl>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <Inp value={newAthlete.name} onChange={e=>setNewAthlete(n=>({...n,name:e.target.value}))} placeholder="Name"/>
            <Inp value={newAthlete.position} onChange={e=>setNewAthlete(n=>({...n,position:e.target.value}))} placeholder="Position"/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={addAthlete} style={{flex:1,background:T.accent,border:"none",borderRadius:9,padding:9,color:"white",fontWeight:600,cursor:"pointer",fontSize:13,fontFamily:font}}>Add</button>
              <button onClick={()=>setAddingAthlete(false)} style={{flex:1,background:"none",border:`1px solid ${T.border}`,borderRadius:9,padding:9,color:T.muted,cursor:"pointer",fontSize:13,fontFamily:font}}>Cancel</button>
            </div>
          </div>
        </Card>
      )}
      {active&&(<>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:active.notes?12:0}}>
            <div>
              <div style={{fontSize:18,fontWeight:600,color:T.text,fontFamily:font}}>{active.name}</div>
              {active.position&&<div style={{fontSize:11,color:T.muted,fontFamily:font,marginTop:2}}>{active.position}</div>}
            </div>
            <Chip color={T.orange}>Session Prep</Chip>
          </div>
          {active.notes&&(
            <div style={{fontSize:12,color:T.muted,lineHeight:1.65,borderLeft:`2px solid ${T.accent}`,paddingLeft:12,marginTop:12,fontFamily:font,opacity:0.8}}>
              {active.notes}
            </div>
          )}
        </Card>
        {active.topics.length>0&&(
          <Card>
            <Lbl>Focus Topics</Lbl>
            {active.topics.map(t=>(
              <CheckRow key={t.id} label={t.label} sub={t.sub} done={t.done} onToggle={()=>toggleTopic(active.id,t.id)} dot={t.color}/>
            ))}
          </Card>
        )}
        <Card>
          <Lbl>Session Notes</Lbl>
          <textarea value={active.sessionNotes} onChange={e=>updateNotes(active.id,e.target.value)}
            placeholder={`Notes from session with ${active.name}...`}
            style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:13,fontFamily:font,resize:"none",outline:"none",lineHeight:1.6,minHeight:120,padding:12,boxSizing:"border-box"}}/>
        </Card>
        <Card style={{background:T.bg,border:`1px solid ${T.border}`}}>
          <Lbl>Mentorship Principles</Lbl>
          {["Build trust before technique","Vulnerability = momentum — don't waste it","One key message per session","End with a clear commitment from them"].map((p,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:`1px solid ${T.border}`,alignItems:"center"}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:T.surface,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:10,color:T.muted,fontFamily:font}}>{i+1}</span>
              </div>
              <span style={{fontSize:12,color:T.muted,fontFamily:font}}>{p}</span>
            </div>
          ))}
        </Card>
      </>)}
    </div>
  );
}

// ── GOALS ─────────────────────────────────────────────────────────────────────
function GoalsTab(){
  const [short,setShort]=useState([
    {id:1,label:"Hit 90+ mph consistent velocity",cat:"throwing",done:false},
    {id:2,label:"Pitch with intent every single outing",cat:"throwing",done:false},
    {id:3,label:"Fix lower half / leg lift for velo",cat:"throwing",done:false},
    {id:4,label:"RHR consistently under 50 bpm",cat:"health",done:false},
    {id:5,label:"8+ hours sleep 5 nights/week",cat:"health",done:false},
  ]);
  const toggle=id=>setShort(g=>g.map(i=>i.id===id?{...i,done:!i.done}:i));
  const [career,setCareer]=useState("Add career plans, next steps, upcoming opportunities...");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card>
        <Lbl>Long-Term Vision</Lbl>
        {["Compete at the highest level possible","Build an elite mentorship program","Develop complete pitcher IQ & baseball mind"].map((g,i)=>(
          <div key={i} style={{display:"flex",gap:14,padding:"11px 0",borderBottom:`1px solid ${T.border}`,alignItems:"center"}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:T.bg,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:T.muted,fontFamily:font}}>{i+1}</span>
            </div>
            <span style={{fontSize:13,color:T.text,fontFamily:font}}>{g}</span>
          </div>
        ))}
      </Card>
      <Card>
        <Lbl>Short-Term Goals</Lbl>
        <div style={{fontSize:10,color:T.orange,fontFamily:font,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase",fontWeight:600}}>Throwing</div>
        {short.filter(g=>g.cat==="throwing").map(g=><CheckRow key={g.id} label={g.label} done={g.done} onToggle={()=>toggle(g.id)}/>)}
        <div style={{fontSize:10,color:T.blue,fontFamily:font,letterSpacing:1.5,margin:"16px 0 8px",textTransform:"uppercase",fontWeight:600}}>Health & Recovery</div>
        {short.filter(g=>g.cat==="health").map(g=><CheckRow key={g.id} label={g.label} done={g.done} onToggle={()=>toggle(g.id)}/>)}
      </Card>
      <Card style={{background:T.bg}}>
        <Lbl>Career Notes</Lbl>
        <textarea value={career} onChange={e=>setCareer(e.target.value)}
          style={{width:"100%",background:"none",border:"none",color:T.muted,fontSize:13,fontFamily:font,resize:"none",outline:"none",lineHeight:1.6,minHeight:100,boxSizing:"border-box"}}/>
      </Card>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
const TABS=[
  {key:"today",    label:"Today"},
  {key:"schedule", label:"Schedule"},
  {key:"throwing", label:"Throwing"},
  {key:"athletes", label:"Athletes"},
  {key:"goals",    label:"Goals"},
];

export default function Dashboard(){
  const [unlocked,setUnlocked]=useState(false);
  const [tab,setTab]=useState("today");
  if(!unlocked)return<LockScreen onUnlock={()=>setUnlocked(true)}/>;
  return(
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:font,paddingBottom:48}}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <div style={{padding:"28px 20px 0",borderBottom:`1px solid ${T.border}`,marginBottom:20,background:T.surface}}>
        <div style={{fontSize:11,color:T.muted,letterSpacing:1.5,marginBottom:4,textTransform:"uppercase"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</div>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
          <div>
            <div style={{fontSize:22,fontWeight:600,color:T.text,fontFamily:font}}>Personal Hub</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>Good morning, Justin</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:T.muted,letterSpacing:1,marginBottom:3,textTransform:"uppercase"}}>Recovery</div>
            <div style={{fontSize:34,fontWeight:600,color:RC,lineHeight:1}}>{RECOVERY}</div>
            <div style={{marginTop:4}}><Chip color={RC}>{RL}</Chip></div>
          </div>
        </div>
        <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none",gap:4,marginLeft:-20,paddingLeft:20,marginRight:-20,paddingRight:20,paddingBottom:1}}>
          {TABS.map(({key,label})=>(
            <button key={key} onClick={()=>setTab(key)} style={{background:"none",border:"none",cursor:"pointer",padding:"10px 14px",fontSize:13,fontFamily:font,fontWeight:tab===key?600:400,color:tab===key?T.accent:T.muted,borderBottom:`2px solid ${tab===key?T.accent:"transparent"}`,whiteSpace:"nowrap",flexShrink:0,transition:"all 0.2s"}}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"0 16px"}}>
        {tab==="today"    &&<TodayTab/>}
        {tab==="schedule" &&<ScheduleTab/>}
        {tab==="throwing" &&<ThrowingTab/>}
        {tab==="athletes" &&<AthletesTab/>}
        {tab==="goals"    &&<GoalsTab/>}
      </div>
    </div>
  );
}
