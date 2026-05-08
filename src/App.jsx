import { useState } from "react";

const CORRECT_PASSWORD = "dt7UK67";

function LockScreen({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const attempt = () => {
    if (input === CORRECT_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"#0a0c0f",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;600;700&family=Bebas+Neue&display=swap" rel="stylesheet"/>
      <div style={{fontSize:38,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:4,color:"white",marginBottom:4}}>PERSONAL HUB</div>
      <div style={{fontSize:11,color:"#ffffff33",fontFamily:"'DM Mono',monospace",letterSpacing:3,marginBottom:48}}>PRIVATE ACCESS</div>
      <div style={{
        width:"100%",maxWidth:320,
        animation: shake ? "shake 0.4s ease" : "none"
      }}>
        <style>{`
          @keyframes shake {
            0%,100%{transform:translateX(0)}
            20%{transform:translateX(-8px)}
            40%{transform:translateX(8px)}
            60%{transform:translateX(-6px)}
            80%{transform:translateX(6px)}
          }
        `}</style>
        <input
          type="password"
          value={input}
          onChange={e=>{setInput(e.target.value);setError(false);}}
          onKeyDown={e=>e.key==="Enter"&&attempt()}
          placeholder="Enter password"
          autoFocus
          style={{
            width:"100%",background:"#111418",
            border:`1px solid ${error?"#f87171":"#ffffff15"}`,
            borderRadius:12,padding:"14px 18px",color:"white",
            fontSize:16,outline:"none",fontFamily:"'DM Mono',monospace",
            letterSpacing:3,textAlign:"center",boxSizing:"border-box",
            marginBottom:12,transition:"border-color 0.2s"
          }}
        />
        {error && <div style={{fontSize:11,color:"#f87171",fontFamily:"'DM Mono',monospace",textAlign:"center",marginBottom:12,letterSpacing:1}}>INCORRECT PASSWORD</div>}
        <button onClick={attempt} style={{
          width:"100%",background:"#4ade80",border:"none",borderRadius:12,
          padding:"14px",color:"#000",fontWeight:700,cursor:"pointer",
          fontSize:14,fontFamily:"'DM Mono',monospace",letterSpacing:2
        }}>ENTER</button>
      </div>
    </div>
  );
}

const HEALTH = {
  rhr:  [52,54,54,58,52,53,56],
  steps:[11069,14817,14596,12861,16129,16102,7212],
  cals: [474,640,847,533,556,965,355],
  spo2: [95.5,95.9,98.3,96.4,94.6,95.9,98.3],
  today:{ rhr:56, spo2:98.3, sleep:"8h 32m", sleepScore:82 }
};
const AVG_RHR = Math.round(HEALTH.rhr.reduce((a,b)=>a+b,0)/HEALTH.rhr.length);
const RECOVERY = Math.round((Math.max(0,Math.min(100,100-(HEALTH.today.rhr-AVG_RHR)*5))+HEALTH.today.sleepScore)/2);
const RC = RECOVERY>=67?"#4ade80":RECOVERY>=34?"#facc15":"#f87171";
const RL = RECOVERY>=67?"GREEN":RECOVERY>=34?"YELLOW":"RED";

const EVENTS = [
  {time:"10:00 AM",end:"12:00 PM",title:"Practice",tag:"⚾",color:"#4ade80",day:"today"},
  {time:"1:00 PM", end:"2:00 PM", title:"BSB — Lift",tag:"🏋",color:"#60a5fa",day:"today"},
  {time:"7:15 PM", end:"8:00 PM", title:"Gavin Session",tag:"🎯",color:"#f97316",day:"today"},
  {time:"2:00 PM", end:null,title:"Depart Ray Fisher",tag:"🚌",color:"#a78bfa",day:"thu"},
  {time:"4:36 PM", end:null,title:"Flight → Minneapolis (Delta 2203)",tag:"✈️",color:"#a78bfa",day:"thu"},
  {time:"7:30 PM", end:null,title:"Practice at Minnesota — Siebert Field",tag:"⚾",color:"#4ade80",day:"thu"},
  {time:"9:15 PM", end:null,title:"Hotel Check-In — Renaissance Depot",tag:"🏨",color:"#60a5fa",day:"thu"},
  {time:"10:00 AM",end:null,title:"Breakfast at Hotel",tag:"🍳",color:"#facc15",day:"fri"},
  {time:"3:00 PM", end:null,title:"Pregame Meal",tag:"🍽",color:"#facc15",day:"fri"},
  {time:"4:45 PM", end:null,title:"Depart for Field",tag:"🚌",color:"#60a5fa",day:"fri"},
  {time:"5:40 PM", end:null,title:"BP",tag:"⚾",color:"#4ade80",day:"fri"},
  {time:"6:30 PM", end:null,title:"I/O",tag:"⚾",color:"#4ade80",day:"fri"},
  {time:"7:02 PM", end:null,title:"BEAT MINNESOTA — Blue Jersey / Grey Pinstripe",tag:"🔥",color:"#f97316",day:"fri"},
];

const INIT_SESSIONS = [
  {date:"May 5", type:"Long Toss",  dist:"150ft",    throws:40,velo:"—", notes:"Felt loose, good extension"},
  {date:"May 3", type:"Bullpen",    dist:"60ft 6in", throws:35,velo:"88",notes:"Worked on intent, 2-seam"},
  {date:"May 1", type:"Flat Ground",dist:"60ft",     throws:50,velo:"87",notes:"Leg lift timing, felt good"},
  {date:"Apr 29",type:"Long Toss",  dist:"180ft",    throws:38,velo:"—", notes:"Max effort pulls"},
];

const INIT_ATHLETES = [
  {
    id:1,
    name:"Gavin",
    position:"Pitcher",
    topics:[
      {id:0,label:"Pitching with intent",sub:"Shift from safe → attack mode. No walks but no K's.",color:"#f97316",done:false},
      {id:1,label:"Fear of HBP (Priority)",sub:"He opened up — normalize it, mental reframe + drills.",color:"#f87171",done:false},
      {id:2,label:"Lower half / leg lift",sub:"Revisit mechanics for velocity gain.",color:"#facc15",done:false},
      {id:3,label:"Accountability check-in",sub:"Circle back on commitments from last session.",color:"#4ade80",done:false},
    ],
    notes:"He opened up about fear of getting hit — this is a big deal. Keep building that trust. Fear of HBP is the priority topic.",
    sessionNotes:"",
  }
];

// ── SHARED UI ─────────────────────────────────────────────────────────────────
const Card = ({children,style={},accent})=>(
  <div style={{background:"#111418",border:`1px solid ${accent||"#ffffff10"}`,borderRadius:16,padding:20,position:"relative",overflow:"hidden",...style}}>
    {accent&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:accent,borderRadius:"16px 16px 0 0"}}/>}
    {children}
  </div>
);
const Lbl = ({children,color="#ffffff44",style={}})=>(
  <div style={{fontSize:10,color,fontFamily:"'DM Mono',monospace",letterSpacing:2,marginBottom:12,fontWeight:600,...style}}>{children}</div>
);
const Chip = ({children,color})=>(
  <span style={{background:`${color}22`,color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 7px",fontSize:10,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>{children}</span>
);
const MiniBar = ({values,color})=>{
  const m=Math.max(...values);
  return(
    <div style={{display:"flex",gap:3,alignItems:"flex-end",height:26}}>
      {values.map((v,i)=>(
        <div key={i} style={{flex:1,height:`${(v/m)*100}%`,background:i===values.length-1?color:`${color}44`,borderRadius:2,minHeight:3}}/>
      ))}
    </div>
  );
};
const Ring = ({value,max=100,size=74,stroke=7,color,label,sub})=>{
  const r=(size-stroke)/2,circ=2*Math.PI*r,pct=Math.min(value/max,1);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#ffffff0d" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white"
          fontSize={size*0.21} fontFamily="'DM Mono',monospace" fontWeight="700">{value}</text>
      </svg>
      {label&&<div style={{fontSize:10,color:"#ffffff55",fontFamily:"'DM Mono',monospace",letterSpacing:1}}>{label}</div>}
      {sub&&<div style={{fontSize:9,color:"#ffffff33",fontFamily:"'DM Mono',monospace"}}>{sub}</div>}
    </div>
  );
};
const CheckRow = ({label,sub,done,onToggle,dot})=>(
  <div onClick={onToggle} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderBottom:"1px solid #ffffff07",cursor:"pointer",opacity:done?0.38:1}}>
    <div style={{width:18,height:18,borderRadius:5,border:done?"none":"2px solid #ffffff25",background:done?"#4ade80":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
      {done&&<svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
    <div style={{flex:1}}>
      <div style={{fontSize:13,color:done?"#ffffff33":"#ffffffcc",textDecoration:done?"line-through":"none"}}>{label}</div>
      {sub&&<div style={{fontSize:11,color:"#ffffff44",marginTop:2}}>{sub}</div>}
    </div>
    {dot&&!done&&<div style={{width:6,height:6,borderRadius:"50%",background:dot,flexShrink:0,marginTop:6}}/>}
  </div>
);
const PillTab = ({label,active,onClick})=>(
  <button onClick={onClick} style={{background:active?"#ffffff15":"none",border:`1px solid ${active?"#ffffff30":"#ffffff10"}`,borderRadius:20,padding:"5px 14px",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:1,color:active?"white":"#ffffff44",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s"}}>{label}</button>
);
const Input = ({value,onChange,placeholder,style={}})=>(
  <input value={value} onChange={onChange} placeholder={placeholder}
    style={{background:"#0a0c0f",border:"1px solid #ffffff15",borderRadius:8,padding:"8px 12px",color:"white",fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif",width:"100%",boxSizing:"border-box",...style}}/>
);

// ── TODAY ─────────────────────────────────────────────────────────────────────
function TodayTab(){
  const [todos,setTodos]=useState([
    {id:1,label:"Morning mobility routine",done:false,dot:"#f87171"},
    {id:2,label:"Review throwing session notes",done:false,dot:"#f87171"},
    {id:3,label:"Gavin session prep — review Athletes tab",done:false,dot:"#f97316"},
    {id:4,label:"Check weekly pitching program",done:false,dot:null},
    {id:5,label:"Nutrition — hit protein goal",done:false,dot:null},
    {id:6,label:"Sleep by 11pm (travel tomorrow)",done:false,dot:"#facc15"},
  ]);
  const [adding,setAdding]=useState(false);
  const [txt,setTxt]=useState("");
  const toggle=id=>setTodos(t=>t.map(i=>i.id===id?{...i,done:!i.done}:i));
  const add=()=>{if(!txt.trim())return;setTodos(t=>[...t,{id:Date.now(),label:txt,done:false,dot:null}]);setTxt("");setAdding(false);};
  const done=todos.filter(t=>t.done).length;
  const pct=Math.round((done/todos.length)*100);
  const todayEvs=EVENTS.filter(e=>e.day==="today");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card accent={RC}>
        <Lbl color={RC}>BODY STATUS · TODAY</Lbl>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Ring value={RECOVERY} color={RC} label="RECOVERY" size={84}/>
          <Ring value={HEALTH.today.rhr} max={90} color="#60a5fa" label="RHR" sub="bpm" size={68}/>
          <Ring value={Math.round(HEALTH.today.spo2)} max={100} color="#a78bfa" label="SpO₂" sub="%" size={68}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:22,fontFamily:"'DM Mono',monospace",fontWeight:700,color:"white"}}>{HEALTH.today.sleep}</div>
            <div style={{fontSize:10,color:"#ffffff44",fontFamily:"'DM Mono',monospace",letterSpacing:1,marginTop:4}}>SLEEP</div>
            <div style={{marginTop:6}}><Chip color={RC}>{RL} DAY</Chip></div>
          </div>
        </div>
      </Card>
      <Card>
        <Lbl>7-DAY TRENDS</Lbl>
        {[
          {label:"Resting HR",values:HEALTH.rhr, color:"#60a5fa",fmt:v=>`${v} bpm`},
          {label:"Steps",     values:HEALTH.steps,color:"#4ade80",fmt:v=>`${(v/1000).toFixed(1)}k`},
          {label:"Active Cal",values:HEALTH.cals, color:"#fb923c",fmt:v=>`${Math.round(v)} kcal`},
        ].map(({label,values,color,fmt})=>(
          <div key={label} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:12,color:"#ffffff77"}}>{label}</span>
              <span style={{fontSize:12,color,fontFamily:"'DM Mono',monospace"}}>{fmt(values[values.length-1])}</span>
            </div>
            <MiniBar values={values} color={color}/>
          </div>
        ))}
      </Card>
      <Card>
        <Lbl>TODAY'S SCHEDULE</Lbl>
        {todayEvs.map((e,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:"1px solid #ffffff07",alignItems:"flex-start"}}>
            <div style={{width:3,background:e.color,borderRadius:2,alignSelf:"stretch",flexShrink:0,minHeight:18}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:"white",fontWeight:500}}>{e.tag} {e.title}</div>
              <div style={{fontSize:11,color:"#ffffff44",marginTop:2,fontFamily:"'DM Mono',monospace"}}>{e.time}{e.end?` – ${e.end}`:""}</div>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <Lbl>CHECKLIST</Lbl>
          <span style={{fontSize:11,color:"#4ade80",fontFamily:"'DM Mono',monospace",marginBottom:12}}>{done}/{todos.length}</span>
        </div>
        <div style={{height:3,background:"#ffffff0f",borderRadius:2,marginBottom:14}}>
          <div style={{height:"100%",width:`${pct}%`,background:"#4ade80",borderRadius:2,transition:"width 0.4s"}}/>
        </div>
        {todos.map(t=><CheckRow key={t.id} {...t} onToggle={()=>toggle(t.id)}/>)}
        {adding?(
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <Input value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Add task..." style={{flex:1,width:"auto"}}/>
            <button onClick={add} style={{background:"#4ade80",border:"none",borderRadius:8,padding:"8px 14px",color:"#000",fontWeight:700,cursor:"pointer",fontSize:13,flexShrink:0}}>Add</button>
          </div>
        ):(
          <button onClick={()=>setAdding(true)} style={{marginTop:10,background:"none",border:"1px dashed #ffffff18",borderRadius:8,padding:"8px",color:"#ffffff33",cursor:"pointer",fontSize:11,width:"100%",fontFamily:"'DM Mono',monospace",letterSpacing:1}}>+ ADD TASK</button>
        )}
      </Card>
    </div>
  );
}

// ── SCHEDULE ──────────────────────────────────────────────────────────────────
const GCAL_API_KEY = "AIzaSyD0yiOxSTzSlc8WO5YEpvZKyiBuAYkaxcA";
const GCAL_ID = "brjust@umich.edu";

function useCalendarEvents() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useState(() => {
    const fetchEvents = async () => {
      try {
        const now = new Date();
        const start = new Date(now);
        start.setHours(0,0,0,0);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GCAL_ID)}/events?key=${GCAL_API_KEY}&timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&singleEvents=true&orderBy=startTime&maxResults=50`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Calendar fetch failed");
        const data = await res.json();
        const grouped = {};
        (data.items || []).forEach(item => {
          const startStr = item.start?.dateTime || item.start?.date;
          if (!startStr) return;
          const d = new Date(startStr);
          const key = d.toDateString();
          if (!grouped[key]) grouped[key] = { date: d, events: [] };
          grouped[key].events.push(item);
        });
        const result = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(start);
          d.setDate(d.getDate() + i);
          const key = d.toDateString();
          result.push({
            date: d,
            label: i === 0
              ? `TODAY — ${d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}).toUpperCase()}`
              : d.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}).toUpperCase(),
            accent: i === 0 ? "#4ade80" : "#ffffff20",
            events: (grouped[key]?.events || []),
          });
        }
        setDays(result);
      } catch(e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return { days, loading, error };
}

function ScheduleTab(){
  const { days, loading, error } = useCalendarEvents();

  const formatTime = (item) => {
    if (item.start?.date && !item.start?.dateTime) return "All day";
    const d = new Date(item.start.dateTime);
    return d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true});
  };

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:60}}>
      <div style={{fontSize:11,color:"#ffffff33",fontFamily:"'DM Mono',monospace",letterSpacing:2}}>LOADING CALENDAR...</div>
    </div>
  );

  if (error) return (
    <Card>
      <div style={{fontSize:12,color:"#f87171",fontFamily:"'DM Mono',monospace"}}>Could not load calendar. Check API key or calendar permissions.</div>
    </Card>
  );

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {days.map(({date,label,accent,events},di)=>(
        <Card key={di} accent={accent}>
          <Lbl color={accent||"#ffffff44"}>{label}</Lbl>
          {events.length===0 ? (
            <div style={{fontSize:12,color:"#ffffff22",fontFamily:"'DM Mono',monospace",padding:"6px 0"}}>NO EVENTS</div>
          ) : events.map((e,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:"1px solid #ffffff07",alignItems:"flex-start"}}>
              <div style={{width:60,fontSize:10,color:"#ffffff44",fontFamily:"'DM Mono',monospace",paddingTop:2,flexShrink:0}}>{formatTime(e)}</div>
              <div style={{width:3,background:accent||"#ffffff20",borderRadius:2,alignSelf:"stretch",flexShrink:0,minHeight:18}}/>
              <div style={{fontSize:13,color:"white"}}>{e.summary}</div>
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
  const saveCue=()=>{
    if(!newCue.cue.trim())return;
    setCoachNotes(n=>[...n,{id:Date.now(),...newCue,date:"Today"}]);
    setNewCue({cue:"",detail:""});setAddingCue(false);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>

      {/* Focus Areas */}
      <Card accent="#f97316">
        <Lbl color="#f97316">THIS WEEK — FOCUS AREAS</Lbl>
        {[
          {label:"Pitch with INTENT",sub:"No safe mode. Attack the zone every pitch.",color:"#f97316"},
          {label:"Lower half mechanics",sub:"Leg lift timing → velocity connection.",color:"#facc15"},
          {label:"Fear of HBP (Priority)",sub:"Mental reframe — normalize it. Drills to follow.",color:"#f87171"},
        ].map(({label,sub,color})=>(
          <div key={label} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid #ffffff07",alignItems:"flex-start"}}>
            <div style={{width:3,background:color,borderRadius:2,alignSelf:"stretch",flexShrink:0}}/>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:"white"}}>{label}</div>
              <div style={{fontSize:11,color:"#ffffff44",marginTop:2}}>{sub}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Coach Notes */}
      <Card accent="#60a5fa">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <Lbl color="#60a5fa" style={{marginBottom:0}}>COACH NOTES</Lbl>
          <button onClick={()=>setAddingCue(true)} style={{background:"#60a5fa",border:"none",borderRadius:8,padding:"5px 11px",color:"#000",fontWeight:700,cursor:"pointer",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>+ ADD CUE</button>
        </div>
        {addingCue&&(
          <div style={{background:"#1a1d22",borderRadius:12,padding:14,marginBottom:14,display:"flex",flexDirection:"column",gap:8}}>
            <Input value={newCue.cue} onChange={e=>setNewCue(n=>({...n,cue:e.target.value}))} placeholder="Cue or focal point..."/>
            <textarea value={newCue.detail} onChange={e=>setNewCue(n=>({...n,detail:e.target.value}))} placeholder="Coach's explanation / details..."
              style={{background:"#0a0c0f",border:"1px solid #ffffff15",borderRadius:8,padding:"8px 12px",color:"white",fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif",resize:"none",minHeight:72,lineHeight:1.5}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={saveCue} style={{flex:1,background:"#60a5fa",border:"none",borderRadius:8,padding:9,color:"#000",fontWeight:700,cursor:"pointer",fontSize:13}}>Save</button>
              <button onClick={()=>setAddingCue(false)} style={{flex:1,background:"none",border:"1px solid #ffffff15",borderRadius:8,padding:9,color:"#ffffff55",cursor:"pointer",fontSize:13}}>Cancel</button>
            </div>
          </div>
        )}
        {coachNotes.map((n,i)=>(
          <div key={n.id} style={{padding:"11px 0",borderBottom:"1px solid #ffffff07"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
              <div style={{fontSize:13,fontWeight:600,color:"white",flex:1,paddingRight:8}}>{n.cue}</div>
              <span style={{fontSize:10,color:"#ffffff33",fontFamily:"'DM Mono',monospace",flexShrink:0}}>{n.date}</span>
            </div>
            {n.detail&&<div style={{fontSize:12,color:"#ffffff55",lineHeight:1.55}}>{n.detail}</div>}
          </div>
        ))}
      </Card>

      {/* Session Log */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <Lbl style={{marginBottom:0}}>SESSION LOG</Lbl>
          <button onClick={()=>setAddingSession(true)} style={{background:"#f97316",border:"none",borderRadius:8,padding:"5px 11px",color:"#000",fontWeight:700,cursor:"pointer",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>+ LOG</button>
        </div>
        {addingSession&&(
          <div style={{background:"#1a1d22",borderRadius:12,padding:14,marginBottom:14,display:"flex",flexDirection:"column",gap:8}}>
            {[["type","Type (Bullpen, Long Toss, Flat Ground...)"],["dist","Distance"],["throws","# of throws"],["velo","Velo (mph or —)"],["notes","Notes"]].map(([k,ph])=>(
              <Input key={k} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={ph}/>
            ))}
            <div style={{display:"flex",gap:8}}>
              <button onClick={saveSession} style={{flex:1,background:"#f97316",border:"none",borderRadius:8,padding:9,color:"#000",fontWeight:700,cursor:"pointer",fontSize:13}}>Save Session</button>
              <button onClick={()=>setAddingSession(false)} style={{flex:1,background:"none",border:"1px solid #ffffff15",borderRadius:8,padding:9,color:"#ffffff55",cursor:"pointer",fontSize:13}}>Cancel</button>
            </div>
          </div>
        )}
        {sessions.map((s,i)=>(
          <div key={i} style={{padding:"11px 0",borderBottom:"1px solid #ffffff07"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
              <div>
                <span style={{fontSize:13,fontWeight:600,color:"white"}}>{s.type}</span>
                <span style={{fontSize:11,color:"#ffffff44",marginLeft:8,fontFamily:"'DM Mono',monospace"}}>{s.date}</span>
              </div>
              <div style={{display:"flex",gap:5}}>
                {s.velo&&s.velo!=="—"&&<Chip color="#f97316">{s.velo} mph</Chip>}
                <Chip color="#60a5fa">{s.throws} throws</Chip>
              </div>
            </div>
            <div style={{fontSize:11,color:"#ffffff44"}}>{s.dist} · {s.notes}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── ATHLETE TO ATHLETE ────────────────────────────────────────────────────────
function AthletesTab(){
  const [athletes,setAthletes]=useState(INIT_ATHLETES);
  const [activeId,setActiveId]=useState(1);
  const [addingAthlete,setAddingAthlete]=useState(false);
  const [newAthlete,setNewAthlete]=useState({name:"",position:""});

  const active=athletes.find(a=>a.id===activeId)||athletes[0];

  const toggleTopic=(athleteId,topicId)=>{
    setAthletes(prev=>prev.map(a=>a.id!==athleteId?a:{
      ...a,topics:a.topics.map(t=>t.id===topicId?{...t,done:!t.done}:t)
    }));
  };
  const updateNotes=(athleteId,val)=>{
    setAthletes(prev=>prev.map(a=>a.id!==athleteId?a:{...a,sessionNotes:val}));
  };
  const addAthlete=()=>{
    if(!newAthlete.name.trim())return;
    const id=Date.now();
    setAthletes(prev=>[...prev,{id,name:newAthlete.name,position:newAthlete.position,topics:[],notes:"",sessionNotes:""}]);
    setActiveId(id);
    setNewAthlete({name:"",position:""});
    setAddingAthlete(false);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>

      {/* Athlete selector */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        {athletes.map(a=>(
          <PillTab key={a.id} label={a.name} active={activeId===a.id} onClick={()=>setActiveId(a.id)}/>
        ))}
        <button onClick={()=>setAddingAthlete(true)} style={{background:"none",border:"1px dashed #ffffff20",borderRadius:20,padding:"5px 14px",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:1,color:"#ffffff33",cursor:"pointer"}}>+ ADD</button>
      </div>

      {/* Add athlete form */}
      {addingAthlete&&(
        <Card>
          <Lbl>NEW ATHLETE</Lbl>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <Input value={newAthlete.name} onChange={e=>setNewAthlete(n=>({...n,name:e.target.value}))} placeholder="Name"/>
            <Input value={newAthlete.position} onChange={e=>setNewAthlete(n=>({...n,position:e.target.value}))} placeholder="Position (e.g. Pitcher, Outfielder)"/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={addAthlete} style={{flex:1,background:"#4ade80",border:"none",borderRadius:8,padding:9,color:"#000",fontWeight:700,cursor:"pointer",fontSize:13}}>Add Athlete</button>
              <button onClick={()=>setAddingAthlete(false)} style={{flex:1,background:"none",border:"1px solid #ffffff15",borderRadius:8,padding:9,color:"#ffffff55",cursor:"pointer",fontSize:13}}>Cancel</button>
            </div>
          </div>
        </Card>
      )}

      {active&&(
        <>
          {/* Athlete header */}
          <Card accent="#f97316">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:active.notes?12:0}}>
              <div>
                <div style={{fontSize:18,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2,color:"white"}}>{active.name.toUpperCase()}</div>
                {active.position&&<div style={{fontSize:11,color:"#ffffff44",fontFamily:"'DM Mono',monospace",letterSpacing:1}}>{active.position.toUpperCase()}</div>}
              </div>
              <Chip color="#f97316">SESSION PREP</Chip>
            </div>
            {active.notes&&(
              <div style={{fontSize:12,color:"#ffffff55",lineHeight:1.65,borderLeft:"2px solid #f9731644",paddingLeft:10,marginTop:12}}>
                {active.notes}
              </div>
            )}
          </Card>

          {/* Topics */}
          {active.topics.length>0&&(
            <Card>
              <Lbl>FOCUS TOPICS</Lbl>
              {active.topics.map(t=>(
                <CheckRow key={t.id} label={t.label} sub={t.sub} done={t.done} onToggle={()=>toggleTopic(active.id,t.id)} dot={t.color}/>
              ))}
            </Card>
          )}

          {/* Session notes */}
          <Card>
            <Lbl>SESSION NOTES</Lbl>
            <textarea value={active.sessionNotes} onChange={e=>updateNotes(active.id,e.target.value)}
              placeholder={`Notes from session with ${active.name}...`}
              style={{width:"100%",background:"#0d0f13",border:"1px solid #ffffff10",borderRadius:10,color:"#ffffffcc",fontSize:13,fontFamily:"'DM Sans',sans-serif",resize:"none",outline:"none",lineHeight:1.6,minHeight:120,padding:12,boxSizing:"border-box"}}/>
          </Card>

          {/* Mentorship principles */}
          <Card style={{background:"#0d1117",border:"1px solid #ffffff08"}}>
            <Lbl color="#ffffff22">MENTORSHIP PRINCIPLES</Lbl>
            {["Build trust before technique","Vulnerability = momentum — don't waste it","One key message per session","End with a clear commitment from them"].map((p,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #ffffff07",alignItems:"center"}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:"#f9731611",border:"1px solid #f9731633",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:9,color:"#f97316",fontFamily:"'DM Mono',monospace"}}>{i+1}</span>
                </div>
                <span style={{fontSize:12,color:"#ffffff55"}}>{p}</span>
              </div>
            ))}
          </Card>
        </>
      )}
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
      <Card accent="#a78bfa">
        <Lbl color="#a78bfa">LONG-TERM VISION</Lbl>
        {["Compete at the highest level possible","Build an elite mentorship program","Develop complete pitcher IQ & baseball mind"].map((g,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid #ffffff07",alignItems:"center"}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:"#a78bfa15",border:"1px solid #a78bfa33",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,color:"#a78bfa",fontFamily:"'DM Mono',monospace"}}>{i+1}</span>
            </div>
            <span style={{fontSize:13,color:"#ffffffcc"}}>{g}</span>
          </div>
        ))}
      </Card>
      <Card>
        <Lbl>SHORT-TERM GOALS</Lbl>
        <div style={{fontSize:10,color:"#f97316",fontFamily:"'DM Mono',monospace",letterSpacing:2,marginBottom:8}}>THROWING</div>
        {short.filter(g=>g.cat==="throwing").map(g=><CheckRow key={g.id} label={g.label} done={g.done} onToggle={()=>toggle(g.id)}/>)}
        <div style={{fontSize:10,color:"#60a5fa",fontFamily:"'DM Mono',monospace",letterSpacing:2,margin:"16px 0 8px"}}>HEALTH & RECOVERY</div>
        {short.filter(g=>g.cat==="health").map(g=><CheckRow key={g.id} label={g.label} done={g.done} onToggle={()=>toggle(g.id)}/>)}
      </Card>
      <Card style={{background:"#0d1117",border:"1px solid #ffffff08"}}>
        <Lbl color="#ffffff22">CAREER NOTES</Lbl>
        <textarea value={career} onChange={e=>setCareer(e.target.value)}
          style={{width:"100%",background:"none",border:"none",color:"#ffffff55",fontSize:13,fontFamily:"'DM Sans',sans-serif",resize:"none",outline:"none",lineHeight:1.6,minHeight:100,boxSizing:"border-box"}}/>
      </Card>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
const TABS=[
  {key:"today",    label:"TODAY"},
  {key:"schedule", label:"SCHEDULE"},
  {key:"throwing", label:"THROWING"},
  {key:"athletes", label:"ATHLETES"},
  {key:"goals",    label:"GOALS"},
];

export default function Dashboard(){
  const [unlocked,setUnlocked]=useState(false);
  const [tab,setTab]=useState("today");
  if(!unlocked) return <LockScreen onUnlock={()=>setUnlocked(true)}/>;
  return(
    <div style={{minHeight:"100vh",background:"#0a0c0f",fontFamily:"'DM Sans',sans-serif",paddingBottom:48}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&display=swap" rel="stylesheet"/>
      <div style={{padding:"26px 20px 0",borderBottom:"1px solid #ffffff09",marginBottom:20}}>
        <div style={{fontSize:10,color:"#ffffff33",fontFamily:"'DM Mono',monospace",letterSpacing:2,marginBottom:4}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}).toUpperCase()}</div>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
          <div style={{fontSize:32,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3,color:"white",lineHeight:1}}>COMMAND<br/>CENTER</div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,color:"#ffffff33",fontFamily:"'DM Mono',monospace",marginBottom:2}}>RECOVERY</div>
            <div style={{fontSize:38,fontFamily:"'Bebas Neue',sans-serif",color:RC,letterSpacing:2,lineHeight:1}}>{RECOVERY}</div>
            <Chip color={RC}>{RL} DAY</Chip>
          </div>
        </div>
        <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none",marginLeft:-20,paddingLeft:20,marginRight:-20,paddingRight:20}}>
          {TABS.map(({key,label})=>(
            <button key={key} onClick={()=>setTab(key)} style={{background:"none",border:"none",cursor:"pointer",padding:"10px 14px",fontSize:11,letterSpacing:2,fontFamily:"'DM Mono',monospace",fontWeight:600,color:tab===key?"white":"#ffffff33",borderBottom:`2px solid ${tab===key?"#4ade80":"transparent"}`,whiteSpace:"nowrap",flexShrink:0,transition:"all 0.2s"}}>{label}</button>
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
