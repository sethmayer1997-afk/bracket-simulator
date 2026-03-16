import { useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const BRACKET = {
  East: [
    {seed:1,name:"Duke",record:"32-2"},{seed:16,name:"Siena",record:"23-11"},
    {seed:8,name:"Ohio State",record:"21-12"},{seed:9,name:"TCU",record:"22-11"},
    {seed:5,name:"St. John's",record:"28-6"},{seed:12,name:"Northern Iowa",record:"23-12"},
    {seed:4,name:"Kansas",record:"23-10"},{seed:13,name:"Cal Baptist",record:"25-8"},
    {seed:6,name:"Louisville",record:"23-10"},{seed:11,name:"South Florida",record:"25-8"},
    {seed:3,name:"Michigan State",record:"25-7"},{seed:14,name:"North Dakota St.",record:"27-7"},
    {seed:7,name:"UCLA",record:"23-11"},{seed:10,name:"UCF",record:"21-11"},
    {seed:2,name:"UConn",record:"29-5"},{seed:15,name:"Furman",record:"22-12"},
  ],
  South: [
    {seed:1,name:"Florida",record:"26-7"},{seed:16,name:"Prairie View A&M",record:"18-17"},
    {seed:8,name:"Clemson",record:"24-10"},{seed:9,name:"Iowa",record:"21-12"},
    {seed:5,name:"Vanderbilt",record:"26-8"},{seed:12,name:"McNeese",record:"28-5"},
    {seed:4,name:"Nebraska",record:"26-6"},{seed:13,name:"Troy",record:"22-11"},
    {seed:6,name:"North Carolina",record:"24-8"},{seed:11,name:"VCU",record:"27-7"},
    {seed:3,name:"Illinois",record:"24-8"},{seed:14,name:"Penn",record:"18-11"},
    {seed:7,name:"Saint Mary's",record:"27-5"},{seed:10,name:"Texas A&M",record:"21-11"},
    {seed:2,name:"Houston",record:"28-6"},{seed:15,name:"Idaho",record:"21-14"},
  ],
  West: [
    {seed:1,name:"Arizona",record:"32-2"},{seed:16,name:"LIU",record:"24-10"},
    {seed:8,name:"Villanova",record:"24-8"},{seed:9,name:"Utah State",record:"28-6"},
    {seed:5,name:"Wisconsin",record:"24-10"},{seed:12,name:"High Point",record:"30-4"},
    {seed:4,name:"Arkansas",record:"26-8"},{seed:13,name:"Hawaii",record:"24-8"},
    {seed:6,name:"BYU",record:"23-11"},{seed:11,name:"Texas",record:"18-14"},
    {seed:3,name:"Gonzaga",record:"30-3"},{seed:14,name:"Kennesaw State",record:"21-13"},
    {seed:7,name:"Miami (FL)",record:"25-8"},{seed:10,name:"Missouri",record:"20-12"},
    {seed:2,name:"Purdue",record:"27-8"},{seed:15,name:"Queens",record:"21-13"},
  ],
  Midwest: [
    {seed:1,name:"Michigan",record:"31-3"},{seed:16,name:"UMBC",record:"24-8"},
    {seed:8,name:"Georgia",record:"22-10"},{seed:9,name:"Saint Louis",record:"28-5"},
    {seed:5,name:"Texas Tech",record:"22-10"},{seed:12,name:"Akron",record:"29-5"},
    {seed:4,name:"Alabama",record:"23-9"},{seed:13,name:"Hofstra",record:"24-10"},
    {seed:6,name:"Tennessee",record:"22-11"},{seed:11,name:"Miami (OH)",record:"31-1"},
    {seed:3,name:"Virginia",record:"29-5"},{seed:14,name:"Wright State",record:"23-11"},
    {seed:7,name:"Kentucky",record:"21-13"},{seed:10,name:"Santa Clara",record:"26-8"},
    {seed:2,name:"Iowa State",record:"27-7"},{seed:15,name:"Tennessee State",record:"23-9"},
  ],
};

const RATINGS = {
  // East — Duke #1 overall KenPom, but Caleb Foster injury knocks them down
  "Duke":93,"Siena":42,"Ohio State":72,"TCU":70,
  "St. John's":82,"Northern Iowa":60,"Kansas":76,"Cal Baptist":55,
  "Louisville":74,"South Florida":66,"Michigan State":84,
  "North Dakota St.":55,"UCLA":73,"UCF":68,"UConn":91,"Furman":44,
  // South — Florida top-10 both ends, Vanderbilt #12 KenPom dark horse
  "Florida":90,"Prairie View A&M":38,"Clemson":76,"Iowa":69,
  "Vanderbilt":83,"McNeese":62,"Nebraska":80,"Troy":50,
  // UNC loses Caleb Wilson (season-ending thumb), knocked down
  "North Carolina":71,"VCU":70,"Illinois":85,
  "Penn":55,"Saint Mary's":76,"Texas A&M":72,"Houston":89,"Idaho":48,
  // West — Arizona best team per KenPom (top-5 O, top-3 D), Gonzaga down w/ Huff injury
  "Arizona":96,"LIU":40,"Villanova":74,"Utah State":73,
  "Wisconsin":75,"High Point":63,
  // Arkansas top-5 offense, 46th defense — offensive powerhouse
  "Arkansas":83,"Hawaii":56,
  // BYU loses Richie Saunders (knee), but still has AJ Dybantsa
  "BYU":78,"Texas":65,
  // Gonzaga down — Braden Huff out with knee injury
  "Gonzaga":83,"Kennesaw State":48,
  "Miami (FL)":78,"Missouri":66,"Purdue":88,"Queens":46,
  // Midwest — Michigan #1 defense nationally per KenPom
  "Michigan":93,"UMBC":45,"Georgia":74,"Saint Louis":71,
  // Texas Tech down — JT Toppin ACL tear
  "Texas Tech":69,"Akron":67,"Alabama":79,"Hofstra":52,
  "Tennessee":78,"Miami (OH)":76,"Virginia":86,"Wright State":54,
  // Kentucky — Jayden Quaintance played just 4 games, limited depth
  "Kentucky":70,"Santa Clara":67,"Iowa State":88,"Tennessee State":46,
};

const RC = {
  East:    {a:"#4a9eff",d:"#4a9eff20",l:"EAST"},
  South:   {a:"#ff5566",d:"#ff556620",l:"SOUTH"},
  West:    {a:"#33dd88",d:"#33dd8820",l:"WEST"},
  Midwest: {a:"#ffaa22",d:"#ffaa2220",l:"MIDWEST"},
};

const ALL_TEAMS = Object.values(BRACKET).flatMap(r=>r);
function teamSeed(n){return ALL_TEAMS.find(t=>t.name===n)?.seed;}
function teamRegion(n){return Object.entries(BRACKET).find(([,ts])=>ts.some(t=>t.name===n))?.[0];}
function teamRecord(n){return ALL_TEAMS.find(t=>t.name===n)?.record||"";}

// ─────────────────────────────────────────────────────────────
// TEAM LOGO BADGES
// ─────────────────────────────────────────────────────────────
const TEAM_COLORS = {
  "Duke":{bg:"#003087",fg:"#ffffff",abbr:"DU"},"Siena":{bg:"#1a5c2a",fg:"#f5c518",abbr:"SU"},
  "Ohio State":{bg:"#bb0000",fg:"#ffffff",abbr:"OSU"},"TCU":{bg:"#4d1979",fg:"#c1a875",abbr:"TCU"},
  "St. John's":{bg:"#cc0000",fg:"#ffffff",abbr:"SJU"},"Northern Iowa":{bg:"#4b116f",fg:"#ffcc00",abbr:"UNI"},
  "Kansas":{bg:"#0051a5",fg:"#e8000d",abbr:"KU"},"Cal Baptist":{bg:"#002868",fg:"#c8a84b",abbr:"CBU"},
  "Louisville":{bg:"#ad0000",fg:"#ffffff",abbr:"UL"},"South Florida":{bg:"#006747",fg:"#cfc493",abbr:"USF"},
  "Michigan State":{bg:"#18453b",fg:"#ffffff",abbr:"MSU"},"North Dakota St.":{bg:"#006633",fg:"#ffc72c",abbr:"NDSU"},
  "UCLA":{bg:"#2d68c4",fg:"#f2a900",abbr:"UCLA"},"UCF":{bg:"#ba9b37",fg:"#000000",abbr:"UCF"},
  "UConn":{bg:"#002868",fg:"#ffffff",abbr:"UCONN"},"Furman":{bg:"#582c83",fg:"#ffffff",abbr:"FU"},
  "Florida":{bg:"#0021a5",fg:"#fa4616",abbr:"UF"},"Prairie View A&M":{bg:"#500000",fg:"#a57c00",abbr:"PVAM"},
  "Clemson":{bg:"#f56600",fg:"#522d80",abbr:"CU"},"Iowa":{bg:"#ffcd00",fg:"#000000",abbr:"IOWA"},
  "Vanderbilt":{bg:"#866d4b",fg:"#000000",abbr:"VU"},"McNeese":{bg:"#005596",fg:"#ffc72c",abbr:"MCN"},
  "Nebraska":{bg:"#e41c38",fg:"#ffffff",abbr:"NU"},"Troy":{bg:"#8b0000",fg:"#c0a35e",abbr:"TROY"},
  "North Carolina":{bg:"#7bafd4",fg:"#ffffff",abbr:"UNC"},"VCU":{bg:"#000000",fg:"#f6c02d",abbr:"VCU"},
  "Illinois":{bg:"#e84a27",fg:"#ffffff",abbr:"ILL"},"Penn":{bg:"#011f5b",fg:"#990000",abbr:"PENN"},
  "Saint Mary's":{bg:"#cc0000",fg:"#003082",abbr:"SMC"},"Texas A&M":{bg:"#500000",fg:"#ffffff",abbr:"A&M"},
  "Houston":{bg:"#cc0000",fg:"#ffffff",abbr:"UH"},"Idaho":{bg:"#b3a369",fg:"#000000",abbr:"UI"},
  "Arizona":{bg:"#cc0033",fg:"#003366",abbr:"UA"},"LIU":{bg:"#00539b",fg:"#f0ab00",abbr:"LIU"},
  "Villanova":{bg:"#00205b",fg:"#ffffff",abbr:"VU"},"Utah State":{bg:"#00263a",fg:"#8a8b8c",abbr:"USU"},
  "Wisconsin":{bg:"#c5050c",fg:"#ffffff",abbr:"UW"},"High Point":{bg:"#5f1f7e",fg:"#ffffff",abbr:"HPU"},
  "Arkansas":{bg:"#9d2235",fg:"#ffffff",abbr:"ARK"},"Hawaii":{bg:"#024731",fg:"#ffffff",abbr:"UH"},
  "BYU":{bg:"#002e5d",fg:"#ffffff",abbr:"BYU"},"Texas":{bg:"#bf5700",fg:"#ffffff",abbr:"UT"},
  "Gonzaga":{bg:"#002469",fg:"#cc0033",abbr:"GU"},"Kennesaw State":{bg:"#fdbb30",fg:"#000000",abbr:"KSU"},
  "Miami (FL)":{bg:"#005030",fg:"#f47321",abbr:"UM"},"Missouri":{bg:"#f1b82d",fg:"#000000",abbr:"MIZ"},
  "Purdue":{bg:"#cfb991",fg:"#000000",abbr:"PU"},"Queens":{bg:"#004b8d",fg:"#ffffff",abbr:"QU"},
  "Michigan":{bg:"#00274c",fg:"#ffcb05",abbr:"UM"},"UMBC":{bg:"#000000",fg:"#f9a01b",abbr:"UMBC"},
  "Georgia":{bg:"#ba0c2f",fg:"#000000",abbr:"UGA"},"Saint Louis":{bg:"#003da5",fg:"#ffffff",abbr:"SLU"},
  "Texas Tech":{bg:"#cc0000",fg:"#000000",abbr:"TTU"},"Akron":{bg:"#041e42",fg:"#a89968",abbr:"UA"},
  "Alabama":{bg:"#9e1b32",fg:"#ffffff",abbr:"ALA"},"Hofstra":{bg:"#00adef",fg:"#003087",abbr:"HU"},
  "Tennessee":{bg:"#ff8200",fg:"#ffffff",abbr:"UT"},"Miami (OH)":{bg:"#b61e2e",fg:"#ffffff",abbr:"MU"},
  "Virginia":{bg:"#232d4b",fg:"#f84c1e",abbr:"UVA"},"Wright State":{bg:"#008000",fg:"#c69214",abbr:"WSU"},
  "Kentucky":{bg:"#0033a0",fg:"#ffffff",abbr:"UK"},"Santa Clara":{bg:"#aa0000",fg:"#ffffff",abbr:"SCU"},
  "Iowa State":{bg:"#c8102e",fg:"#f1be48",abbr:"ISU"},"Tennessee State":{bg:"#00539f",fg:"#ffffff",abbr:"TSU"},
};

function Logo({name,size=18,style={}}){
  const cfg=TEAM_COLORS[name];
  if(!cfg) return null;
  const fs=Math.max(Math.floor(size*0.38),7);
  return(
    <div style={{width:size,height:size,borderRadius:"3px",flexShrink:0,background:cfg.bg,
      display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${cfg.fg}22`,...style}}>
      <span style={{fontSize:`${fs}px`,fontWeight:800,color:cfg.fg,fontFamily:"'Oswald',sans-serif",
        letterSpacing:"-0.03em",lineHeight:1,userSelect:"none"}}>{cfg.abbr}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SIMULATION ENGINE
// ─────────────────────────────────────────────────────────────
function simGame(a,b,locks){
  const key=[a,b].sort().join("|");
  if(locks&&locks[key]) return locks[key];
  const ra=(RATINGS[a]||65)+Math.random()*22-11+(RATINGS[a]<RATINGS[b]?Math.random()*16:0);
  const rb=(RATINGS[b]||65)+Math.random()*22-11+(RATINGS[b]<RATINGS[a]?Math.random()*16:0);
  return ra>rb?a:b;
}
function simRegion(teams,locks){
  const r64=[],r32=[],s16=[];
  for(let i=0;i<16;i+=2) r64.push(simGame(teams[i].name,teams[i+1].name,locks));
  for(let i=0;i<8;i+=2)  r32.push(simGame(r64[i],r64[i+1],locks));
  for(let i=0;i<4;i+=2)  s16.push(simGame(r32[i],r32[i+1],locks));
  const e8=simGame(s16[0],s16[1],locks);
  return{r64,r32,s16,e8};
}
function runSimulations(n,locks){
  const roundWins={},champC={},ffC={},finalsC={},h2h={};
  const roundUpsets=Array.from({length:6},()=>({upsets:0,total:0}));
  const inc=(t,ri)=>{if(!roundWins[t])roundWins[t]=[0,0,0,0,0,0];roundWins[t][ri]++;};
  const recordH2H=(a,b,w)=>{const k=[a,b].sort().join("|");if(!h2h[k])h2h[k]={teams:[a,b].sort(),wins:{}};h2h[k].wins[w]=(h2h[k].wins[w]||0)+1;};
  let lastBracket=null;
  for(let i=0;i<n;i++){
    const rr={};
    for(const reg of["East","South","West","Midwest"]){
      rr[reg]=simRegion(BRACKET[reg],locks);
      const{r64,r32,s16,e8}=rr[reg],teams=BRACKET[reg];
      for(let j=0;j<8;j++){inc(r64[j],0);recordH2H(teams[j*2].name,teams[j*2+1].name,r64[j]);}
      for(let j=0;j<4;j++){inc(r32[j],1);recordH2H(r64[j*2],r64[j*2+1],r32[j]);}
      for(let j=0;j<2;j++){inc(s16[j],2);recordH2H(r32[j*2],r32[j*2+1],s16[j]);}
      inc(e8,3);recordH2H(s16[0],s16[1],e8);
    }
    const ff1=simGame(rr.East.e8,rr.South.e8,locks);
    const ff2=simGame(rr.West.e8,rr.Midwest.e8,locks);
    inc(ff1,4);inc(ff2,4);
    recordH2H(rr.East.e8,rr.South.e8,ff1);
    recordH2H(rr.West.e8,rr.Midwest.e8,ff2);
    [rr.East.e8,rr.South.e8,rr.West.e8,rr.Midwest.e8].forEach(t=>{ffC[t]=(ffC[t]||0)+1;});
    const champ=simGame(ff1,ff2,locks);
    inc(champ,5);
    champC[champ]=(champC[champ]||0)+1;
    [ff1,ff2].forEach(t=>{finalsC[t]=(finalsC[t]||0)+1;});
    recordH2H(ff1,ff2,champ);
    lastBracket={rr,ff:[rr.East.e8,rr.South.e8,rr.West.e8,rr.Midwest.e8],final:[ff1,ff2],champ};
  }
  const avgW={};
  for(const[t,arr]of Object.entries(roundWins)) avgW[t]=+(arr.reduce((a,b)=>a+b,0)/n).toFixed(2);
  return{roundWins,avgW,champC,ffC,finalsC,roundUpsets,h2h,lastBracket,n};
}

// ─────────────────────────────────────────────────────────────
// MY PICKS — build a full bracket by clicking matchups
// Returns a locks map {key: winner} covering all 63 games
// ─────────────────────────────────────────────────────────────

// Given a picks state, resolve which teams appear in each round
function resolvePicks(picks){
  // picks = { matchKey: winner }
  const regionWinners={};
  for(const reg of["East","South","West","Midwest"]){
    const teams=BRACKET[reg];
    // R64: 8 matchups
    const r64=Array.from({length:8},(_,i)=>{
      const a=teams[i*2].name,b=teams[i*2+1].name;
      return picks[[a,b].sort().join("|")]||null;
    });
    // R32: needs all r64 filled
    const r32=Array.from({length:4},(_,i)=>{
      const a=r64[i*2],b=r64[i*2+1];
      if(!a||!b) return null;
      return picks[[a,b].sort().join("|")]||null;
    });
    // S16
    const s16=Array.from({length:2},(_,i)=>{
      const a=r32[i*2],b=r32[i*2+1];
      if(!a||!b) return null;
      return picks[[a,b].sort().join("|")]||null;
    });
    // E8
    const e8=(s16[0]&&s16[1])?picks[[s16[0],s16[1]].sort().join("|")]||null:null;
    regionWinners[reg]={r64,r32,s16,e8};
  }
  const{East,South,West,Midwest}=regionWinners;
  const ff1=(East.e8&&South.e8)?picks[[East.e8,South.e8].sort().join("|")]||null:null;
  const ff2=(West.e8&&Midwest.e8)?picks[[West.e8,Midwest.e8].sort().join("|")]||null:null;
  const champ=(ff1&&ff2)?picks[[ff1,ff2].sort().join("|")]||null:null;
  return{regionWinners,ff:[East.e8,South.e8,West.e8,Midwest.e8],final:[ff1,ff2],champ};
}

function countPicksTotal(picks){ return Object.keys(picks).length; }
const TOTAL_GAMES=63;

function PickMatchup({t1,t1seed,t2,t2seed,winner,onPick,accent,disabled}){
  if(!t1||!t2) return(
    <div style={{background:"#040810",border:"1px dashed #1a2838",borderRadius:"4px",padding:"4px 6px",opacity:0.4,minHeight:"56px",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span style={{fontSize:"0.58rem",color:"#2a3a4a"}}>TBD</span>
    </div>
  );
  return(
    <div style={{background:"#060c18",border:`1px solid ${winner?accent+"44":"#0d1a28"}`,borderRadius:"4px",overflow:"hidden"}}>
      {[{name:t1,seed:t1seed},{name:t2,seed:t2seed}].map(({name,seed},i)=>{
        const picked=winner===name;
        const other=i===0?t2:t1;
        const faded=winner&&!picked;
        return(
          <div key={i}>
            {i===1&&<div style={{height:"1px",background:"#0c1828"}}/>}
            <div
              onClick={!disabled?()=>onPick(name,other):undefined}
              style={{display:"flex",alignItems:"center",gap:"5px",padding:"5px 7px",minHeight:"28px",
                cursor:disabled?"default":"pointer",userSelect:"none",
                background:picked?accent+"22":"transparent",
                borderLeft:`3px solid ${picked?accent:"transparent"}`,
                opacity:faded?0.35:1,
                transition:"all 0.15s"}}
            >
              <span style={{fontSize:"0.62rem",fontWeight:700,color:picked?accent:accent+"55",minWidth:"14px",textAlign:"right",flexShrink:0}}>{seed}</span>
              <Logo name={name} size={16} style={{opacity:faded?0.4:1}}/>
              <span style={{fontSize:"0.7rem",color:picked?"#fff":"#5a7890",fontFamily:"'Oswald',sans-serif",flex:1,fontWeight:picked?600:400}}>{name}</span>
              {picked&&<span style={{fontSize:"0.6rem",color:accent,flexShrink:0}}>✓</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MyPicksRegion({region,resolved,picks,onPick}){
  const teams=BRACKET[region];
  const col=RC[region];
  const{r64,r32,s16,e8}=resolved;

  const rounds=[
    {label:"ROUND OF 64",count:8,matchups:Array.from({length:8},(_,i)=>({
      t1:teams[i*2].name,t1s:teams[i*2].seed,
      t2:teams[i*2+1].name,t2s:teams[i*2+1].seed,
      w:r64[i],
    }))},
    {label:"ROUND OF 32",count:4,matchups:Array.from({length:4},(_,i)=>({
      t1:r64[i*2]||null,t1s:r64[i*2]?teamSeed(r64[i*2]):null,
      t2:r64[i*2+1]||null,t2s:r64[i*2+1]?teamSeed(r64[i*2+1]):null,
      w:r32[i],
    }))},
    {label:"SWEET 16",count:2,matchups:Array.from({length:2},(_,i)=>({
      t1:r32[i*2]||null,t1s:r32[i*2]?teamSeed(r32[i*2]):null,
      t2:r32[i*2+1]||null,t2s:r32[i*2+1]?teamSeed(r32[i*2+1]):null,
      w:s16[i],
    }))},
    {label:"ELITE 8",count:1,matchups:[{
      t1:s16[0]||null,t1s:s16[0]?teamSeed(s16[0]):null,
      t2:s16[1]||null,t2s:s16[1]?teamSeed(s16[1]):null,
      w:e8,
    }]},
  ];

  return(
    <div style={{background:"#040a16",border:`1px solid ${col.a}22`,borderRadius:"8px",padding:"10px",marginBottom:"8px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px",paddingBottom:"6px",borderBottom:`1px solid ${col.a}18`}}>
        <div style={{background:col.d,border:`1px solid ${col.a}44`,borderRadius:"3px",padding:"2px 8px",fontFamily:"'Oswald',sans-serif",fontSize:"0.7rem",letterSpacing:"0.15em",color:col.a}}>{col.l}</div>
        {e8&&<div style={{fontSize:"0.68rem",color:"#c0d8f0",fontFamily:"'Oswald',sans-serif"}}>Elite 8 → <span style={{color:col.a,fontWeight:600}}>{e8}</span></div>}
      </div>
      <div style={{display:"flex",gap:"4px",overflowX:"auto"}}>
        {rounds.map((rd,ri)=>(
          <div key={ri} style={{flex:1,minWidth:"148px"}}>
            <div style={{fontSize:"0.5rem",color:col.a+"77",letterSpacing:"0.1em",textAlign:"center",marginBottom:"3px",fontFamily:"'Oswald',sans-serif"}}>{rd.label}</div>
            <div style={{display:"flex",flexDirection:"column",gap:ri===0?"3px":ri===1?"32px":ri===2?"94px":"220px"}}>
              {rd.matchups.map((m,mi)=>(
                <PickMatchup key={mi}
                  t1={m.t1} t1seed={m.t1s} t2={m.t2} t2seed={m.t2s} winner={m.w}
                  accent={col.a}
                  disabled={!m.t1||!m.t2}
                  onPick={(w,l)=>onPick(w,l)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyPicksFinalFour({resolved,onPick}){
  const{ff,final,champ}=resolved;
  return(
    <div style={{background:"#030912",border:"1px solid #1e90ff33",borderRadius:"8px",padding:"14px 18px",marginBottom:"8px"}}>
      <div style={{textAlign:"center",color:"#1e90ff",fontFamily:"'Oswald',sans-serif",fontSize:"0.65rem",letterSpacing:"0.22em",marginBottom:"12px"}}>FINAL FOUR → NATIONAL CHAMPIONSHIP</div>
      <div style={{display:"flex",gap:"14px",alignItems:"center",justifyContent:"center",flexWrap:"wrap"}}>
        {[[ff[0],ff[1],final[0],0],[ff[2],ff[3],final[1],1]].map(([ta,tb,fin,si])=>(
          <div key={si} style={{display:"flex",flexDirection:"column",gap:"3px",alignItems:"center",minWidth:"170px"}}>
            <div style={{fontSize:"0.5rem",color:"#1e90ff66",letterSpacing:"0.15em",marginBottom:"2px",fontFamily:"'Oswald',sans-serif"}}>SEMIFINAL {si+1}</div>
            <PickMatchup t1={ta} t1seed={ta?teamSeed(ta):null} t2={tb} t2seed={tb?teamSeed(tb):null}
              winner={fin} accent="#1e90ff" disabled={!ta||!tb}
              onPick={(w,l)=>onPick(w,l)}/>
            {fin&&<div style={{fontSize:"0.56rem",color:"#2a4a60",marginTop:"2px"}}>→ <span style={{color:"#7ab8f0",fontFamily:"'Oswald',sans-serif"}}>{fin}</span></div>}
          </div>
        ))}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"5px",padding:"0 6px"}}>
          <div style={{fontSize:"0.6rem",color:"#f0c040",fontFamily:"'Oswald',sans-serif",letterSpacing:"0.12em"}}>🏆 CHAMPION</div>
          {final[0]&&final[1]?(
            <PickMatchup t1={final[0]} t1seed={teamSeed(final[0])} t2={final[1]} t2seed={teamSeed(final[1])}
              winner={champ} accent="#88ee44" disabled={false}
              onPick={(w,l)=>onPick(w,l)}/>
          ):(
            <div style={{background:"#0a1828",border:"1px dashed #1a2838",borderRadius:"6px",padding:"12px 20px",textAlign:"center",opacity:0.5}}>
              <div style={{color:"#2a4050",fontSize:"0.7rem"}}>Pick Final Four first</div>
            </div>
          )}
          {champ&&(
            <div style={{background:"linear-gradient(135deg,#1e3408,#2c4a0c)",border:"2px solid #88ee44",borderRadius:"6px",padding:"6px 14px",textAlign:"center",marginTop:"4px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
                <Logo name={champ} size={22}/>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"0.95rem",fontWeight:700,color:"#fff"}}>{champ}</span>
              </div>
              <div style={{fontSize:"0.5rem",color:"#66cc22",marginTop:"2px"}}>YOUR CHAMPION</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SIMULATION BRACKET VISUAL (results view)
// ─────────────────────────────────────────────────────────────
function TeamRow({name,seed,isWinner,accent,avgW}){
  const w=avgW[name]||0;
  return(
    <div style={{display:"flex",alignItems:"center",gap:"4px",padding:"3px 6px",
      background:isWinner?accent+"18":"transparent",
      borderLeft:`3px solid ${isWinner?accent:"#0a1828"}`,minHeight:"26px"}}>
      <span style={{fontSize:"0.62rem",fontWeight:700,color:isWinner?accent:accent+"44",minWidth:"14px",textAlign:"right",flexShrink:0}}>{seed}</span>
      <Logo name={name} size={16} style={{opacity:isWinner?1:0.5}}/>
      <span style={{fontSize:"0.68rem",color:isWinner?"#fff":"#4a6880",fontFamily:"'Oswald',sans-serif",flex:1,fontWeight:isWinner?600:400}}>{name}</span>
      <span style={{fontSize:"0.5rem",color:"#1e3040",flexShrink:0}}>{w}w</span>
    </div>
  );
}
function MatchupBox({t1,t1s,t2,t2s,winner,accent,avgW}){
  return(
    <div style={{background:"#060c18",border:`1px solid ${accent}22`,borderRadius:"4px",overflow:"hidden"}}>
      <TeamRow name={t1} seed={t1s} isWinner={winner===t1} accent={accent} avgW={avgW}/>
      <div style={{height:"1px",background:"#0c1828"}}/>
      <TeamRow name={t2} seed={t2s} isWinner={winner===t2} accent={accent} avgW={avgW}/>
    </div>
  );
}
function RegionSection({region,rr,avgW}){
  const teams=BRACKET[region];
  const{r64,r32,s16,e8}=rr;
  const col=RC[region];
  const rounds=[
    {label:"R64",matchups:Array.from({length:8},(_,i)=>({t1:teams[i*2].name,t1s:teams[i*2].seed,t2:teams[i*2+1].name,t2s:teams[i*2+1].seed,w:r64[i]}))},
    {label:"R32",matchups:Array.from({length:4},(_,i)=>({t1:r64[i*2],t1s:teamSeed(r64[i*2]),t2:r64[i*2+1],t2s:teamSeed(r64[i*2+1]),w:r32[i]}))},
    {label:"S16",matchups:Array.from({length:2},(_,i)=>({t1:r32[i*2],t1s:teamSeed(r32[i*2]),t2:r32[i*2+1],t2s:teamSeed(r32[i*2+1]),w:s16[i]}))},
    {label:"E8", matchups:[{t1:s16[0],t1s:teamSeed(s16[0]),t2:s16[1],t2s:teamSeed(s16[1]),w:e8}]},
  ];
  return(
    <div style={{background:"#040a16",border:`1px solid ${col.a}22`,borderRadius:"8px",padding:"10px",marginBottom:"8px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"7px",paddingBottom:"5px",borderBottom:`1px solid ${col.a}18`}}>
        <div style={{background:col.d,border:`1px solid ${col.a}44`,borderRadius:"3px",padding:"2px 8px",fontFamily:"'Oswald',sans-serif",fontSize:"0.7rem",letterSpacing:"0.15em",color:col.a}}>{col.l}</div>
        <span style={{fontSize:"0.68rem",color:"#c0d8f0",fontFamily:"'Oswald',sans-serif"}}>→ <span style={{color:col.a,fontWeight:600}}>{e8}</span></span>
      </div>
      <div style={{display:"flex",gap:"4px",overflowX:"auto"}}>
        {rounds.map((rd,ri)=>(
          <div key={ri} style={{flex:1,minWidth:"148px"}}>
            <div style={{fontSize:"0.5rem",color:col.a+"66",letterSpacing:"0.1em",textAlign:"center",marginBottom:"3px",fontFamily:"'Oswald',sans-serif"}}>{rd.label}</div>
            <div style={{display:"flex",flexDirection:"column",gap:ri===0?"3px":ri===1?"32px":ri===2?"94px":"220px"}}>
              {rd.matchups.map((m,mi)=>(
                <MatchupBox key={mi} t1={m.t1} t1s={m.t1s} t2={m.t2} t2s={m.t2s} winner={m.w} accent={col.a} avgW={avgW}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function FinalFourSection({last,avgW}){
  const{ff,final,champ}=last;
  return(
    <div style={{background:"#030912",border:"1px solid #1e90ff33",borderRadius:"8px",padding:"14px 18px",marginBottom:"8px"}}>
      <div style={{textAlign:"center",color:"#1e90ff",fontFamily:"'Oswald',sans-serif",fontSize:"0.65rem",letterSpacing:"0.22em",marginBottom:"12px"}}>FINAL FOUR → NATIONAL CHAMPIONSHIP</div>
      <div style={{display:"flex",gap:"14px",alignItems:"center",justifyContent:"center",flexWrap:"wrap"}}>
        {[[ff[0],ff[1],final[0],0],[ff[2],ff[3],final[1],1]].map(([ta,tb,fin,si])=>(
          <div key={si} style={{display:"flex",flexDirection:"column",gap:"3px",alignItems:"center",minWidth:"175px"}}>
            <div style={{fontSize:"0.5rem",color:"#1e90ff66",letterSpacing:"0.15em",marginBottom:"2px",fontFamily:"'Oswald',sans-serif"}}>SEMIFINAL {si+1}</div>
            {[ta,tb].map((name,i)=>{
              const reg=teamRegion(name),col=RC[reg]||RC.East,seed=teamSeed(name),won=fin===name;
              return(
                <div key={i} style={{width:"100%",background:won?col.d:"#060c18",border:`1px solid ${won?col.a:"#0d1a28"}`,
                  borderRadius:"4px",padding:"5px 8px",display:"flex",alignItems:"center",gap:"6px"}}>
                  <span style={{fontSize:"0.62rem",color:col.a,fontWeight:700,minWidth:"20px"}}>#{seed}</span>
                  <Logo name={name} size={18} style={{opacity:won?1:0.5}}/>
                  <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"0.78rem",color:won?"#fff":"#5a7890",flex:1}}>{name}</span>
                  <span style={{fontSize:"0.5rem",color:"#1e3040"}}>{col.l}</span>
                </div>
              );
            })}
            <div style={{fontSize:"0.56rem",color:"#2a4a60",marginTop:"2px"}}>→ <span style={{color:"#7ab8f0",fontFamily:"'Oswald',sans-serif"}}>{fin}</span></div>
          </div>
        ))}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"5px",padding:"0 6px"}}>
          <div style={{fontSize:"0.6rem",color:"#f0c040",fontFamily:"'Oswald',sans-serif",letterSpacing:"0.12em"}}>🏆 CHAMPION</div>
          <div style={{background:"linear-gradient(135deg,#1e3408,#2c4a0c)",border:"2px solid #88ee44",borderRadius:"7px",padding:"8px 16px",textAlign:"center"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginBottom:"2px"}}>
              <Logo name={champ} size={28}/>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"1.1rem",fontWeight:700,color:"#fff"}}>{champ}</div>
            </div>
            <div style={{fontSize:"0.52rem",color:"#66cc22",marginTop:"2px"}}>#{teamSeed(champ)} · {avgW[champ]||0} avg wins</div>
          </div>
          <div style={{fontSize:"0.54rem",color:"#1e3040",textAlign:"center"}}>{final[0]} vs {final[1]}</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STATS TABS
// ─────────────────────────────────────────────────────────────
function RoundStatsTab({roundWins,n}){
  const sorted=Object.entries(roundWins).map(([t,arr])=>({team:t,arr,total:arr.reduce((a,b)=>a+b,0),seed:teamSeed(t)})).sort((a,b)=>b.total-a.total);
  const RN=["R64","R32","S16","E8","FF","🏆"];
  const rcols=["#3a6090","#5a80b0","#4aaa88","#f0c040","#ff9922","#88ee44"];
  return(
    <div>
      <div style={{color:"#3a5268",fontSize:"0.68rem",letterSpacing:"0.14em",marginBottom:"10px"}}>WIN RATE PER ROUND — each bar = wins in that round ÷ {n} sims</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"5px"}}>
        {sorted.map(({team,arr,seed})=>{
          const reg=teamRegion(team),col=reg?RC[reg]:{a:"#1e90ff"};
          return(
            <div key={team} style={{background:"#060c18",border:`1px solid ${col.a}18`,borderRadius:"4px",padding:"8px 10px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"5px",marginBottom:"5px"}}>
                <Logo name={team} size={18}/>
                {seed&&<span style={{fontSize:"0.6rem",background:col.a+"20",color:col.a,padding:"1px 4px",borderRadius:"2px",flexShrink:0}}>{seed}</span>}
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"0.82rem",color:"#c0d8f0",flex:1}}>{team}</span>
                <span style={{fontSize:"0.58rem",color:"#3a5a70"}}>{teamRecord(team)}</span>
              </div>
              <div style={{display:"flex",gap:"3px",alignItems:"flex-end",height:"32px"}}>
                {arr.map((wins,ri)=>{const pct=wins/n;return(
                  <div key={ri} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"1px"}}>
                    <div style={{width:"100%",background:rcols[ri],borderRadius:"2px 2px 0 0",height:`${Math.max(pct*30,pct>0?2:0)}px`,opacity:pct>0?1:0.15,transition:"height 0.8s ease"}}/>
                    <span style={{fontSize:"0.44rem",color:pct>0?rcols[ri]:"#1e3040"}}>{RN[ri]}</span>
                  </div>
                );})}
              </div>
              <div style={{display:"flex",gap:"3px",marginTop:"3px"}}>
                {arr.map((wins,ri)=>(
                  <div key={ri} style={{flex:1,textAlign:"center",fontSize:"0.48rem",color:wins>0?rcols[ri]:"#1e3040"}}>{wins>0?`${Math.round(wins/n*100)}%`:"—"}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CinderellaTab({roundWins,champC,n}){
  const cinScores=Object.entries(roundWins).map(([team,arr])=>{
    const seed=teamSeed(team)||8,weights=[1,2,4,8,16,32];
    const rawScore=arr.reduce((acc,w,ri)=>acc+w*weights[ri],0)/n;
    const score=+(rawScore*Math.max(seed/8,1)).toFixed(2);
    const deepRound=arr.map((w,ri)=>w>0?ri:-1).filter(x=>x>=0).pop()??-1;
    return{team,seed,arr,score,titles:champC[team]||0,deepRound};
  }).filter(x=>x.seed>=5).sort((a,b)=>b.score-a.score).slice(0,20);
  const deepNames=["—","R64","R32","S16","E8","FF","🏆"];
  return(
    <div>
      <div style={{color:"#3a5268",fontSize:"0.68rem",letterSpacing:"0.14em",marginBottom:"4px"}}>CINDERELLA LEADERBOARD — seeds 5+ ranked by weighted upset performance</div>
      <div style={{color:"#2a4050",fontSize:"0.62rem",marginBottom:"12px"}}>Score = avg bracket points × seed factor</div>
      {cinScores.map(({team,seed,arr,score,titles,deepRound},i)=>{
        const reg=teamRegion(team),col=reg?RC[reg]:{a:"#ff9922"},maxScore=cinScores[0].score||1;
        return(
          <div key={team} style={{background:i<3?"linear-gradient(135deg,#1a1408,#262010)":"#060c18",border:`1px solid ${i<3?"#f0c04044":col.a+"18"}`,borderRadius:"5px",padding:"8px 12px",marginBottom:"5px",display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{fontSize:"0.9rem",minWidth:"22px",textAlign:"center"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":<span style={{color:"#2a4050",fontSize:"0.75rem"}}>{i+1}.</span>}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"3px",flexWrap:"wrap"}}>
                <Logo name={team} size={20}/>
                <span style={{background:col.a+"22",color:col.a,fontSize:"0.6rem",padding:"1px 5px",borderRadius:"2px",flexShrink:0}}>#{seed}</span>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"0.88rem",color:i<3?"#fff":"#c0d8f0"}}>{team}</span>
                <span style={{fontSize:"0.58rem",color:"#2a4050"}}>{teamRecord(team)}</span>
                {titles>0&&<span style={{fontSize:"0.55rem",color:"#88ee44",background:"#142408",padding:"1px 4px",borderRadius:"2px"}}>🏆 {titles}x</span>}
              </div>
              <div style={{background:"#0a1622",borderRadius:"2px",height:"4px",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(score/maxScore)*100}%`,background:i<3?"linear-gradient(90deg,#f0c040,#ffe066)":"linear-gradient(90deg,#ff6620,#ffaa44)",transition:"width 1s ease"}}/>
              </div>
              <div style={{fontSize:"0.54rem",color:"#2a4050",marginTop:"2px"}}>Deepest: <span style={{color:col.a}}>{deepNames[deepRound+1]}</span> · Avg wins: <span style={{color:"#6090b0"}}>{(arr.reduce((a,b)=>a+b,0)/n).toFixed(2)}</span></div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"1.1rem",fontWeight:700,color:i<3?"#f0c040":"#7aaae0"}}>{score}</div>
              <div style={{fontSize:"0.5rem",color:"#2a4050"}}>score</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function H2HTab({h2h,n}){
  const allTeamNames=[...new Set(ALL_TEAMS.map(t=>t.name))].sort();
  const[teamA,setTeamA]=useState("Duke");
  const[teamB,setTeamB]=useState("Arizona");
  const key=[teamA,teamB].sort().join("|"),data=h2h[key];
  const winsA=data?.wins[teamA]||0,winsB=data?.wins[teamB]||0,total=winsA+winsB;
  const pctA=total>0?Math.round(winsA/total*100):null,pctB=total>0?Math.round(winsB/total*100):null;
  const seedA=teamSeed(teamA),seedB=teamSeed(teamB);
  const regA=teamRegion(teamA),regB=teamRegion(teamB);
  const colA=regA?RC[regA]:{a:"#4a9eff",d:"#4a9eff20"},colB=regB?RC[regB]:{a:"#ff5566",d:"#ff556620"};
  const sel={background:"#060c18",border:"1px solid #1e90ff22",borderRadius:"4px",padding:"6px 10px",color:"#c0d8f0",fontFamily:"'Oswald',sans-serif",fontSize:"0.8rem",cursor:"pointer",width:"100%"};
  return(
    <div>
      <div style={{color:"#3a5268",fontSize:"0.68rem",letterSpacing:"0.14em",marginBottom:"12px"}}>HEAD-TO-HEAD WIN % — based on all simulated matchups between these teams</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:"10px",alignItems:"center",marginBottom:"16px"}}>
        <select style={sel} value={teamA} onChange={e=>setTeamA(e.target.value)}>{allTeamNames.map(t=><option key={t} value={t}>{t}</option>)}</select>
        <span style={{color:"#2a4060",fontFamily:"'Oswald',sans-serif",fontSize:"0.8rem",textAlign:"center"}}>vs</span>
        <select style={sel} value={teamB} onChange={e=>setTeamB(e.target.value)}>{allTeamNames.map(t=><option key={t} value={t}>{t}</option>)}</select>
      </div>
      {total===0?(
        <div style={{background:"#060c18",border:"1px solid #1e90ff18",borderRadius:"6px",padding:"20px",textAlign:"center"}}>
          <div style={{color:"#3a5268",fontSize:"0.82rem"}}>These teams didn't meet in any of the {n} simulations.</div>
          <div style={{color:"#2a4050",fontSize:"0.7rem",marginTop:"6px"}}>They may be in the same region or paths didn't cross.</div>
        </div>
      ):(
        <div>
          <div style={{background:"#060c18",border:"1px solid #1e90ff18",borderRadius:"6px",padding:"16px",marginBottom:"10px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"12px"}}>
              {[{name:teamA,seed:seedA,reg:regA,col:colA,wins:winsA,pct:pctA},{name:teamB,seed:seedB,reg:regB,col:colB,wins:winsB,pct:pctB}].map((t,i)=>(
                <div key={i} style={{flex:1,textAlign:"center"}}>
                  <div style={{background:t.col.d,border:`1px solid ${t.col.a}`,borderRadius:"5px",padding:"8px 12px",marginBottom:"4px"}}>
                    <div style={{fontSize:"0.6rem",color:t.col.a,marginBottom:"2px"}}>#{t.seed} {t.reg}</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
                      <Logo name={t.name} size={22}/>
                      <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"1rem",color:"#fff"}}>{t.name}</div>
                    </div>
                  </div>
                  <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"2rem",fontWeight:700,color:t.wins>=(i===0?winsB:winsA)&&t.wins>0?"#88ee44":"#5a8ab0"}}>{t.pct}%</div>
                  <div style={{fontSize:"0.62rem",color:"#3a5a70"}}>{t.wins} wins in {total} meetings</div>
                </div>
              ))}
            </div>
            <div style={{background:"#0a1622",borderRadius:"4px",height:"10px",overflow:"hidden",display:"flex"}}>
              <div style={{width:`${pctA}%`,background:`linear-gradient(90deg,${colA.a},${colA.a}aa)`,transition:"width 1s ease"}}/>
              <div style={{flex:1,background:`linear-gradient(90deg,${colB.a}aa,${colB.a})`}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:"4px"}}>
              <span style={{fontSize:"0.6rem",color:colA.a}}>{teamA}</span>
              <span style={{fontSize:"0.6rem",color:colB.a}}>{teamB}</span>
            </div>
          </div>
          <div style={{background:"#060c18",border:"1px solid #1e90ff18",borderRadius:"6px",padding:"12px",fontSize:"0.75rem",color:"#7a98b0",lineHeight:1.6}}>
            {winsA>winsB?`${teamA} wins this matchup ${pctA}% of the time — a ${pctA>65?"dominant":"meaningful"} edge.`
              :winsB>winsA?`${teamB} wins this matchup ${pctB}% of the time — a ${pctB>65?"dominant":"meaningful"} edge.`
              :`Dead even matchup — the simulation called it a coin flip.`}
            {" "}They met {total} times across {n} simulations.
          </div>
        </div>
      )}
    </div>
  );
}

function ChampTab({champC,avgW,n}){
  const sorted=Object.entries(champC).sort((a,b)=>b[1]-a[1]),max=sorted[0]?.[1]||1;
  return(
    <div>
      <div style={{color:"#3a5268",fontSize:"0.68rem",letterSpacing:"0.14em",marginBottom:"10px"}}>CHAMPION FREQUENCY — {n} SIMULATIONS</div>
      {sorted.map(([team,count],i)=>{
        const seed=teamSeed(team),reg=teamRegion(team),col=reg?RC[reg]:{a:"#1e90ff",d:"#1e90ff20"};
        return(
          <div key={team} style={{background:i===0?"linear-gradient(135deg,#162808,#223810)":"#060c18",border:`1px solid ${i===0?"#77dd33":col.a+"28"}`,borderRadius:"5px",padding:"8px 12px",marginBottom:"4px",display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"0.95rem",color:i===0?"#f0c040":i===1?"#b0bcd0":i===2?"#cc8833":"#1e3040",minWidth:"20px",textAlign:"center"}}>{i===0?"🏆":i===1?"🥈":i===2?"🥉":`${i+1}.`}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"2px",flexWrap:"wrap"}}>
                <Logo name={team} size={20}/>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"0.9rem",color:i===0?"#fff":"#b0c8e0"}}>{team}</span>
                {seed!=null&&<span style={{fontSize:"0.58rem",color:col.a,background:col.a+"18",padding:"1px 5px",borderRadius:"2px"}}>#{seed} {reg}</span>}
                <span style={{fontSize:"0.56rem",color:"#2a4050"}}>{avgW[team]||0} avg wins</span>
              </div>
              <div style={{background:"#0a1622",borderRadius:"2px",height:"4px",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(count/max)*100}%`,background:i===0?"linear-gradient(90deg,#77dd33,#bbff55)":"linear-gradient(90deg,#1e70d0,#50a8ff)",transition:"width 1.2s ease"}}/>
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"1.3rem",fontWeight:700,color:i===0?"#f0c040":"#7aaae0"}}>{count}</div>
              <div style={{fontSize:"0.52rem",color:"#1e3040"}}>/{n}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ANALYSIS
// ─────────────────────────────────────────────────────────────
const TEAM_CTX={
  "Duke":{notes:"#4 offense, #2 defense per KenPom — elite balance. Caleb Foster (foot fracture) and Patrick Ngongba II (foot soreness) both injured entering tournament",risk:"Two key players injured — Foster unlikely unless Duke makes deep run"},
  "Arizona":{notes:"Best team per KenPom — top-5 offense, top-3 defense. Jaden Bradley (Big 12 POY), Brayden Burries (15.9 ppg), Koa Peat healthy. No weaknesses. Tied with Duke for most ranked wins ever (12)",risk:"Highest expectations = most pressure. Any off night ends the run"},
  "Michigan":{notes:"#1 defense in the nation per KenPom, top-10 offense. L.J. Cason injury a concern entering tournament",risk:"L.J. Cason injury limits offensive ceiling — lost Big Ten final to Purdue"},
  "Florida":{notes:"Defending national champions, top-10 offense (#9) and defense (#6) per KenPom. Battle-tested identity under Todd Golden",risk:"Lost to Vanderbilt by 17 in SEC semis — confidence questions entering March"},
  "UConn":{notes:"Dan Hurley dynasty, elite defense, deep experienced roster, 29-5",risk:"Took some soft February losses — not as dominant as last two years"},
  "Houston":{notes:"Top-5 defense nationally, playing home regionals in Houston. Elite rebounding and physical defense under Kelvin Sampson",risk:"Halfcourt offense can stall against elite defenses — scored just 47 pts vs Kansas in Big 12 tourney"},
  "Iowa State":{notes:"Elite 3-pt shooting, physical defense, Keshon Gilbert is one of the best guards in the field. 27-7",risk:"Jaden Bradley hit an all-timer to beat them in the Big 12 semis — vulnerabilities vs elite guards"},
  "Purdue":{notes:"Big Ten champions, beat Michigan in title game. #2 offense nationally per KenPom, Matt Painter tournament experience",risk:"#37 defense is a real concern — opponents can score on them"},
  "Gonzaga":{notes:"30-3, WCC dominance, Mark Few system. Elite pace and spacing",risk:"Braden Huff (knee injury) out — unlikely to play first two games. Losing their best big man is massive"},
  "Virginia":{notes:"29-5, pack-line defense suffocates opponents, Tony Bennett system is tournament-tested, #13 KenPom",risk:"Slow pace can backfire vs elite athletes in single-elimination"},
  "Michigan State":{notes:"Tom Izzo March magic — 9 Final Fours. Elite toughness and experience in big moments",risk:"Inconsistent offense limits ceiling — not the most talented Izzo squad"},
  "Illinois":{notes:"#1 offense nationally per KenPom, Kasparas Jakucionis is a lottery pick. Big Ten battle-tested, 24-8",risk:"#28 defense — opponents can score on them, and they've been inconsistent late in the season"},
  "Arkansas":{notes:"SEC champions, #5 offense nationally per KenPom, Darius Acuff Jr. is one of the most electric guards in the field. John Calipari motivated",risk:"#46 defense is a glaring weakness — can be exposed by patient, efficient offenses"},
  "Vanderbilt":{notes:"#12 KenPom Net Rating — massively underseeded at 5. Beat Florida (defending champions) by 17 in the SEC semis. Best dark horse bet in the field",risk:"#95 defensive efficiency — solid but not elite. Rely on offense to carry them"},
  "BYU":{notes:"AJ Dybantsa is the consensus #1 pick in the 2026 NBA Draft — generational talent. 23-11",risk:"Lost Richie Saunders to a season-ending knee injury in February — losing a senior leader hurts"},
  "Texas Tech":{notes:"#12 offense per KenPom — can score with anyone",risk:"JT Toppin (21.8 pts, 10.8 reb) tore his ACL — their best player is gone. Without him they are a completely different team. Fade hard"},
  "North Carolina":{notes:"Beat Duke this season, Seth Trimble is an elite defender, Henri Veesaar is a tough matchup for opposing bigs",risk:"Caleb Wilson (best player) has a season-ending broken thumb. Hard ceiling without him. Outside top-30 KenPom in both O and D"},
  "Miami (OH)":{notes:"31-1, near-perfect season, MAC champion. Travis Steele system. One of the best mid-major rosters in years",risk:"MAC schedule concerns — haven't faced anyone close to a high-major opponent all season"},
  "Akron":{notes:"29-5, school-record wins, three straight MAC titles. Larry Johnson, Tyshawn Archie, Javon Garcia combine for 44 ppg. Top-70 KenPom",risk:"First-weekend opponent matters — matchup-dependent upset threat"},
  "Saint Mary's":{notes:"Top-25 KenPom Net Rating, 18th in defensive efficiency, 27-5. Randy Bennett system is elite",risk:"109th in effective field goal % — can't shoot well enough to make a deep run"},
  "Tennessee":{notes:"Elite defense (#39 defensive efficiency), physical and versatile under Rick Barnes",risk:"173rd in effective field goal % — almost no offense. Gets exposed when forced to score"},
  "St. John's":{notes:"Big East champion, beat UConn in conference tourney, Rick Pitino. Top-15 defense nationally",risk:"Struggles to score in halfcourt — ranked poorly in offensive efficiency. Shot 35.8% in last year's tournament loss"},
  "Kansas":{notes:"Bill Self coaching, top-15 defense. Tournament pedigree is unmatched",risk:"Darryn Peterson injury/drama hurt them all year — scored just 47 points in Big 12 loss to Houston. No offensive consistency"},
};
function generateAnalysis(res){
  const{champC,ffC,roundWins,avgW,n,finalsC}=res;
  const byChamp=Object.entries(champC).sort((a,b)=>b[1]-a[1]);
  const byFF=Object.entries(ffC).sort((a,b)=>b[1]-a[1]);
  const top1=byChamp[0],top2=byChamp[1],top3=byChamp[2];
  const ff4=byFF.slice(0,4);
  const upsets=Object.entries(avgW).map(([t,w])=>({team:t,seed:teamSeed(t)||8,avgW:w,titles:champC[t]||0})).filter(x=>x.seed>=9&&x.avgW>=0.5).sort((a,b)=>b.avgW-a.avgW).slice(0,3);
  const traps=Object.entries(avgW).map(([t,w])=>({team:t,seed:teamSeed(t)||8,avgW:w})).filter(x=>x.seed<=5&&x.avgW<1.0).sort((a,b)=>a.avgW-b.avgW).slice(0,2);
  const ctx1=TEAM_CTX[top1?.[0]]||{},ctx2=TEAM_CTX[top2?.[0]]||{};
  const sections=[];
  sections.push({icon:"🏆",title:"SIMULATION VERDICT",body:[
    `After ${n} simulations, ${top1[0]} emerges as the clear favorite — winning the title ${top1[1]} times (${Math.round(top1[1]/n*100)}%). ${ctx1.notes||"elite metrics across the board"}.`,
    `${top2[0]} is the strongest challenger at ${top2[1]} titles: ${ctx2.notes||"strong resume and favorable path"}.`,
    top3?`${top3[0]} (${top3[1]} titles) rounds out the top three — a legitimate dark horse.`:"",
  ].filter(Boolean)});
  sections.push({icon:"📊",title:"FINAL FOUR PICTURE",body:[
    `Most common Final Four: ${ff4.map(([t,c])=>`${t} (${c} appearances)`).join(", ")}.`,
    `${ff4[0]?.[0]} dominates Final Four appearances — nearly impossible to game-plan for across six rounds.`,
    traps[0]?`Fade ${traps[0].team} (#${traps[0].seed} seed, only ${traps[0].avgW} avg wins) — the sim sees them going out early.`:"",
  ].filter(Boolean)});
  sections.push({icon:"🔥",title:"TOP UPSET ALERTS",bullets:upsets.map(u=>{
    const reg=teamRegion(u.team),teams=BRACKET[reg]||[];
    const idx=teams.findIndex(t=>t.name===u.team);
    const opp=teams[idx%2===0?idx+1:idx-1];
    const ctx=TEAM_CTX[u.team]||{};
    return `${u.seed}-seed ${u.team} over ${opp?`${opp.seed}-seed ${opp.name}`:"opponent"}: ${ctx.notes||"legitimate mid-major threat"} (${u.avgW} avg wins)`;
  })});
  sections.push({icon:"💀",title:"TEAMS TO FADE",bullets:traps.map(t=>`${t.team} (#${t.seed} seed, ${t.avgW} avg wins): ${(TEAM_CTX[t.team]||{}).risk||"underperformed relative to seeding"}`)});
  const champion=byChamp[0]?.[0]||"Duke";
  const runnerUp=Object.entries(finalsC||{}).sort((a,b)=>b[1]-a[1]).find(([t])=>t!==champion)?.[0]||byChamp[1]?.[0]||"Arizona";
  const finalFour=ff4.map(([t])=>t);
  const bu=upsets[0];
  sections.push({icon:"🎯",title:"OPTIMAL BRACKET PICKS",picks:{champion,runnerUp,finalFour,
    bestUpset:bu?(()=>{const reg=teamRegion(bu.team),ts=BRACKET[reg]||[];const idx=ts.findIndex(t=>t.name===bu.team);const opp=ts[idx%2===0?idx+1:idx-1];return `${bu.seed}-seed ${bu.team} over ${opp?`${opp.seed}-seed ${opp.name}`:"opponent"}`;})():"See Cinderella tab"}});
  return sections;
}
function AnalysisTab({simResults}){
  if(!simResults) return <div style={{color:"#1e3040",textAlign:"center",padding:"40px",fontFamily:"'Oswald',sans-serif"}}>Run simulations first.</div>;
  const sections=generateAnalysis(simResults);
  const S={card:{background:"#030912",border:"1px solid #1e90ff18",borderRadius:"6px",padding:"14px 18px",marginBottom:"10px"},h:{color:"#f0c040",fontFamily:"'Oswald',sans-serif",fontSize:"0.95rem",margin:"0 0 8px",letterSpacing:"0.05em"},p:{color:"#8ab0cc",fontSize:"0.83rem",margin:"0 0 6px",lineHeight:1.65},bullet:{color:"#8ab0cc",fontSize:"0.83rem",margin:"3px 0 3px 4px",lineHeight:1.6,display:"flex",gap:"7px"}};
  return(
    <div>
      {sections.map((sec,si)=>(
        <div key={si} style={S.card}>
          <div style={S.h}>{sec.icon} {sec.title}</div>
          {sec.body?.map((l,i)=><p key={i} style={S.p}>{l}</p>)}
          {sec.bullets?.map((b,i)=><div key={i} style={S.bullet}><span style={{color:"#1e90ff",flexShrink:0}}>▸</span><span>{b}</span></div>)}
          {sec.picks&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginTop:"4px"}}>
              <div><div style={{fontSize:"0.6rem",color:"#3a5268",letterSpacing:"0.1em",marginBottom:"2px"}}>CHAMPION</div><div style={{fontFamily:"'Oswald',sans-serif",color:"#f0c040",fontSize:"1rem"}}>🏆 {sec.picks.champion}</div></div>
              <div><div style={{fontSize:"0.6rem",color:"#3a5268",letterSpacing:"0.1em",marginBottom:"2px"}}>RUNNER-UP</div><div style={{fontFamily:"'Oswald',sans-serif",color:"#c0d8f0",fontSize:"0.9rem"}}>🥈 {sec.picks.runnerUp}</div></div>
              <div style={{gridColumn:"1/-1"}}><div style={{fontSize:"0.6rem",color:"#3a5268",letterSpacing:"0.1em",marginBottom:"2px"}}>FINAL FOUR</div><div style={{fontFamily:"'Oswald',sans-serif",color:"#c0d8f0",fontSize:"0.85rem"}}>{sec.picks.finalFour.map((t,i)=><span key={i}>{i>0&&<span style={{color:"#2a4060"}}> · </span>}{t}</span>)}</div></div>
              <div style={{gridColumn:"1/-1"}}><div style={{fontSize:"0.6rem",color:"#3a5268",letterSpacing:"0.1em",marginBottom:"2px"}}>BEST UPSET</div><div style={{fontFamily:"'Oswald',sans-serif",color:"#ffaa22",fontSize:"0.85rem"}}>⚡ {sec.picks.bestUpset}</div></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SHARE CARD
// ─────────────────────────────────────────────────────────────
function ShareCard({simResults,myPicks,onClose}){
  if(!simResults) return null;
  const{champC,ffC,avgW,n,roundUpsets}=simResults;
  const byChamp=Object.entries(champC).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const byFF=Object.entries(ffC).sort((a,b)=>b[1]-a[1]).slice(0,4);
  const upsets=Object.entries(avgW).map(([t,w])=>({team:t,seed:teamSeed(t)||8,avgW:w})).filter(x=>x.seed>=9&&x.avgW>=0.5).sort((a,b)=>b.avgW-a.avgW).slice(0,3);
  const r64UpsetPct=roundUpsets[0].total>0?Math.round(roundUpsets[0].upsets/roundUpsets[0].total*100):0;
  const copyText=()=>{
    const lines=[
      `🏀 2026 NCAA MARCH MADNESS — ${n} SIM RESULTS`,
      "─────────────────────────────",
      "🏆 CHAMPION ODDS:",
      ...byChamp.map(([t,c],i)=>`  ${["🥇","🥈","🥉","4.","5."][i]} ${t}: ${c}/${n} (${Math.round(c/n*100)}%)`),
      "","🎯 FINAL FOUR:",
      byFF.map(([t,c])=>`${t} (${Math.round(c/n*100)}%)`).join(" · "),
      "","🔥 UPSET THREATS:",
      ...upsets.map(u=>`  #${u.seed} ${u.team}: ${u.avgW} avg wins/sim`),
      ...(myPicks?.champ?[`\n✏️ MY PICK: ${myPicks.champ}`]:[]),
      "─────────────────────────────",
      "Simulated with 2026 NCAA Bracket Simulator",
    ];
    navigator.clipboard.writeText(lines.join("\n")).catch(()=>{});
  };
  return(
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:"420px",width:"100%"}}>
        <div style={{background:"linear-gradient(135deg,#04080f,#0a1428)",border:"2px solid #1e90ff44",borderRadius:"12px",padding:"20px",fontFamily:"'Oswald',sans-serif"}}>
          <div style={{textAlign:"center",marginBottom:"14px"}}>
            <div style={{fontSize:"0.65rem",letterSpacing:"0.3em",color:"#1e90ff",marginBottom:"3px"}}>🏀 2026 NCAA MARCH MADNESS</div>
            <div style={{fontSize:"1.4rem",fontWeight:700,color:"#fff"}}>{n}-SIM RESULTS</div>
            <div style={{fontSize:"0.6rem",color:"#3a5268",marginTop:"2px"}}>Selection Sunday · March 15, 2026</div>
          </div>
          <div style={{marginBottom:"12px"}}>
            <div style={{fontSize:"0.58rem",color:"#f0c040",letterSpacing:"0.15em",marginBottom:"6px"}}>🏆 CHAMPION ODDS</div>
            {byChamp.map(([t,c],i)=>{const reg=teamRegion(t),col=reg?RC[reg]:{a:"#1e90ff"};return(
              <div key={t} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"3px"}}>
                <span style={{fontSize:"0.8rem",minWidth:"20px"}}>{["🥇","🥈","🥉","4.","5."][i]}</span>
                <Logo name={t} size={16}/><span style={{fontSize:"0.78rem",color:"#c0d8f0",flex:1}}>{t}</span>
                <span style={{background:col.a+"22",color:col.a,fontSize:"0.65rem",padding:"1px 6px",borderRadius:"3px",fontWeight:700}}>{Math.round(c/n*100)}%</span>
              </div>
            );})}
          </div>
          <div style={{marginBottom:"12px"}}>
            <div style={{fontSize:"0.58rem",color:"#4a9eff",letterSpacing:"0.15em",marginBottom:"5px"}}>🎯 FINAL FOUR</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>
              {byFF.map(([t,c])=>{const reg=teamRegion(t),col=reg?RC[reg]:{a:"#1e90ff"};return <span key={t} style={{background:col.a+"18",border:`1px solid ${col.a}44`,color:col.a,fontSize:"0.68rem",padding:"2px 7px",borderRadius:"3px"}}>{t} <span style={{opacity:0.6}}>({Math.round(c/n*100)}%)</span></span>;})}
            </div>
          </div>
          {myPicks?.champ&&(
            <div style={{marginBottom:"12px",background:"#1a2c0a",border:"1px solid #88ee4444",borderRadius:"5px",padding:"8px 12px"}}>
              <div style={{fontSize:"0.58rem",color:"#88ee44",letterSpacing:"0.15em",marginBottom:"4px"}}>✏️ MY CHAMPION PICK</div>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <Logo name={myPicks.champ} size={22}/>
                <span style={{fontFamily:"'Oswald',sans-serif",fontSize:"0.9rem",color:"#ccff88"}}>{myPicks.champ}</span>
                <span style={{fontSize:"0.62rem",color:"#3a6020",marginLeft:"auto"}}>{Math.round((champC[myPicks.champ]||0)/n*100)}% sim odds</span>
              </div>
            </div>
          )}
          <div style={{borderTop:"1px solid #1e90ff22",paddingTop:"8px",display:"flex",justifyContent:"space-between",fontSize:"0.58rem",color:"#2a4050"}}>
            <span>R64 upset rate: <span style={{color:"#f0c040"}}>{r64UpsetPct}%</span></span>
            <span>{n} simulations run</span>
          </div>
        </div>
        <div style={{display:"flex",gap:"8px",marginTop:"10px"}}>
          <button onClick={copyText} style={{flex:1,cursor:"pointer",background:"#0e2a52",border:"1px solid #1e90ff44",color:"#80b8f0",padding:"9px",borderRadius:"5px",fontFamily:"'Oswald',sans-serif",fontSize:"0.8rem",letterSpacing:"0.1em"}}>📋 COPY AS TEXT</button>
          <button onClick={onClose} style={{cursor:"pointer",background:"#160808",border:"1px solid #ff444430",color:"#ff8888",padding:"9px 14px",borderRadius:"5px",fontFamily:"'Oswald',sans-serif",fontSize:"0.8rem"}}>✕</button>
        </div>
        <div style={{textAlign:"center",marginTop:"6px",fontSize:"0.6rem",color:"#1e3040"}}>Screenshot this card to share · or copy as text</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FANDUEL AFFILIATE BANNER
// ─────────────────────────────────────────────────────────────
const FANDUEL_URL = "https://fndl.co/gk69d1s";

function FanDuelBanner({position="top"}){
  const isTop = position === "top";
  return(
    <a
      href={FANDUEL_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{display:"block",textDecoration:"none",margin: isTop ? "0 0 12px" : "12px 0 0"}}
    >
      <div style={{
        background:"linear-gradient(135deg,#1a4a1a,#0a2a0a)",
        border:"1px solid #1a6b1a",
        borderRadius:"8px",
        padding:"10px 16px",
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        gap:"12px",
        flexWrap:"wrap",
        cursor:"pointer",
        transition:"all 0.2s",
      }}
        onMouseEnter={e=>e.currentTarget.style.borderColor="#22aa22"}
        onMouseLeave={e=>e.currentTarget.style.borderColor="#1a6b1a"}
      >
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <div style={{background:"#1493ff",borderRadius:"5px",padding:"4px 10px",fontFamily:"'Oswald',sans-serif",fontWeight:700,fontSize:"0.85rem",color:"#fff",letterSpacing:"0.05em",flexShrink:0}}>
            FanDuel
          </div>
          <div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"0.82rem",color:"#88ee44",letterSpacing:"0.06em"}}>
              🏆 BET ON YOUR BRACKET PICKS
            </div>
            <div style={{fontSize:"0.62rem",color:"#3a6a3a",marginTop:"1px"}}>
              Get a No Sweat First Bet up to $1,000 · Must be 21+ · Terms apply
            </div>
          </div>
        </div>
        <div style={{
          background:"#1493ff",
          color:"#fff",
          padding:"7px 16px",
          borderRadius:"5px",
          fontFamily:"'Oswald',sans-serif",
          fontSize:"0.78rem",
          letterSpacing:"0.1em",
          fontWeight:600,
          flexShrink:0,
          whiteSpace:"nowrap",
        }}>
          BET NOW →
        </div>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────
export default function App(){
  const[results,  setResults]  = useState(null);
  const[loading,  setLoading]  = useState(false);
  const[prog,     setProg]     = useState(0);
  const[tab,      setTab]      = useState("bracket");
  const[mode,     setMode]     = useState("sim");    // "sim" | "picks"
  const[myPicks,  setMyPicks]  = useState({});       // matchKey -> winner
  const[showShare,setShowShare]= useState(false);

  const handlePick = useCallback((winner, loser) => {
    const key = [winner, loser].sort().join("|");
    setMyPicks(prev => {
      const next = {...prev};
      if (next[key] === winner) {
        // clicking same pick again = unset it and all downstream picks
        // simple approach: just remove this pick (downstream auto-become null via resolvePicks)
        delete next[key];
      } else {
        next[key] = winner;
      }
      return next;
    });
  }, []);

  const picksResolved = resolvePicks(myPicks);
  const pickCount = countPicksTotal(myPicks);
  const picksComplete = pickCount === TOTAL_GAMES;

  async function runSim(locks={}){
    setMode("sim");
    setLoading(true); setProg(0); setResults(null); setTab("bracket");
    let p=0;
    const iv=setInterval(()=>{p=Math.min(p+5,93);setProg(p);},55);
    await new Promise(r=>setTimeout(r,60));
    const res=runSimulations(500,locks);
    clearInterval(iv); setProg(100);
    setResults(res); setLoading(false);
  }

  const TABS=[
    {id:"bracket",   label:"📋 BRACKET"},
    {id:"roundstats",label:"📊 ROUND STATS"},
    {id:"cinderella",label:"🔥 CINDERELLA"},
    {id:"h2h",       label:"⚔️ HEAD-TO-HEAD"},
    {id:"champions", label:"🏆 CHAMPIONS"},
    {id:"analysis",  label:"🧠 ANALYSIS"},
  ];

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#020810,#050c18 60%,#030810)",fontFamily:"'Barlow Condensed','Oswald',sans-serif",color:"#e0eeff"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Barlow+Condensed:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:#1e90ff28;border-radius:3px}
        .tab{cursor:pointer;padding:5px 11px;border-radius:3px;font-family:'Oswald',sans-serif;font-size:0.74rem;letter-spacing:0.07em;border:1px solid transparent;transition:all 0.15s;background:transparent;color:#3a5268}
        .tab.on{background:#1e90ff14;border-color:#1e90ff44;color:#80b8f0}
        .tab:hover:not(.on){color:#6090b0;border-color:#1e90ff20}
        .rbtn{cursor:pointer;border-radius:5px;font-family:'Oswald',sans-serif;letter-spacing:0.12em;transition:all 0.25s;border:none}
        select option{background:#0a1828;color:#c0d8f0}
        .modetab{cursor:pointer;padding:8px 20px;border-radius:5px;font-family:'Oswald',sans-serif;font-size:0.82rem;letter-spacing:0.1em;transition:all 0.2s;border:1px solid transparent}
      `}</style>

      <div style={{background:"linear-gradient(180deg,#06122a,transparent)",padding:"16px 16px 10px",textAlign:"center",borderBottom:"1px solid #1e90ff12"}}>
        <div style={{fontSize:"0.58rem",letterSpacing:"0.3em",color:"#1e90ff",marginBottom:"2px",fontFamily:"'Oswald',sans-serif"}}>🏀 2026 NCAA MARCH MADNESS</div>
        <h1 style={{fontSize:"clamp(1.3rem,3.2vw,2.1rem)",fontFamily:"'Oswald',sans-serif",fontWeight:700,margin:"0 0 2px",background:"linear-gradient(135deg,#fff,#80b8f0)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>BRACKET SIMULATOR</h1>
        <p style={{color:"#8aaccc",fontSize:"0.62rem",margin:0,letterSpacing:"0.12em"}}>500 SIMS · ROUND STATS · CINDERELLA · H2H · MY PICKS · SHARE</p>
      </div>

      <div style={{maxWidth:"1100px",margin:"0 auto",padding:"12px 10px"}}>

        {/* MODE SWITCHER */}
        <div style={{display:"flex",gap:"6px",justifyContent:"center",marginBottom:"12px"}}>
          <button className="modetab" onClick={()=>setMode("sim")}
            style={{background:mode==="sim"?"#0e2a52":"#060c18",border:`1px solid ${mode==="sim"?"#1e90ff55":"#1e3040"}`,color:mode==="sim"?"#80b8f0":"#8aaccc"}}>
            🎲 SIMULATE
          </button>
          <button className="modetab" onClick={()=>setMode("picks")}
            style={{background:mode==="picks"?"#1a3a0a":"#060c18",border:`1px solid ${mode==="picks"?"#88ee44":"#1e3040"}`,color:mode==="picks"?"#88ee44":"#8aaccc"}}>
            ✏️ MY PICKS {pickCount>0?`(${pickCount}/${TOTAL_GAMES})`:""}
          </button>
        </div>

        {/* SIMULATE MODE */}
        {mode==="sim"&&(
          <>
            <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"10px",flexWrap:"wrap",justifyContent:"center"}}>
              <button className="rbtn" onClick={()=>runSim({})}
                style={{background:"linear-gradient(135deg,#0e2a52,#071830)",color:"#80b8f0",padding:"10px 28px",fontSize:"0.9rem",opacity:loading?0.4:1,cursor:loading?"not-allowed":"pointer"}}
                disabled={loading}>
                {loading?"⚙️  SIMULATING 500 TOURNAMENTS...":results?"🔄  RE-RUN 500 SIMS":"🚀  RUN 500 SIMULATIONS"}
              </button>
              {pickCount>0&&!loading&&(
                <button className="rbtn" onClick={()=>runSim(myPicks)}
                  style={{background:"linear-gradient(135deg,#1a3a0a,#0e2208)",color:"#88ee44",padding:"10px 22px",fontSize:"0.88rem",border:"1px solid #88ee4444",cursor:"pointer"}}>
                  🔒 RUN WITH MY {pickCount} PICKS LOCKED
                </button>
              )}
              {results&&(
                <button className="rbtn" onClick={()=>setShowShare(true)}
                  style={{background:"#060c18",color:"#6090b0",padding:"10px 18px",fontSize:"0.82rem",border:"1px solid #1e90ff22",cursor:"pointer"}}>
                  📤 SHARE
                </button>
              )}
            </div>
            {loading&&(
              <div style={{textAlign:"center",marginBottom:"10px"}}>
                <div style={{background:"#0a1520",borderRadius:"3px",height:"4px",width:"220px",margin:"0 auto 4px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${prog}%`,background:"linear-gradient(90deg,#1e90ff,#00d0ff)",transition:"width 0.15s"}}/>
                </div>
                <div style={{color:"#1e3040",fontSize:"0.62rem",letterSpacing:"0.1em"}}>{Math.round(prog)}% of 500{pickCount>0?` · ${pickCount} picks locked`:""}</div>
              </div>
            )}
            {results&&(
              <>
                <div style={{display:"flex",gap:"4px",marginBottom:"12px",flexWrap:"wrap"}}>
                  {TABS.map(t=>(
                    <button key={t.id} className={`tab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
                  ))}
                </div>
                {tab==="bracket"&&(
                  <div>
                    <div style={{color:"#1e3a50",fontSize:"0.6rem",letterSpacing:"0.1em",marginBottom:"8px"}}>Most recent simulation · winners highlighted · "w" = avg wins/500 sims</div>
                    <RegionSection region="East"    rr={results.lastBracket.rr.East}    avgW={results.avgW}/>
                    <RegionSection region="South"   rr={results.lastBracket.rr.South}   avgW={results.avgW}/>
                    <FinalFourSection last={results.lastBracket} avgW={results.avgW}/>
                    <RegionSection region="West"    rr={results.lastBracket.rr.West}    avgW={results.avgW}/>
                    <RegionSection region="Midwest" rr={results.lastBracket.rr.Midwest} avgW={results.avgW}/>
                  </div>
                )}
                {tab==="roundstats" && <RoundStatsTab roundWins={results.roundWins} n={results.n}/>}
                {tab==="cinderella" && <CinderellaTab roundWins={results.roundWins} champC={results.champC} n={results.n}/>}
                {tab==="h2h"        && <H2HTab h2h={results.h2h} n={results.n}/>}
                {tab==="champions"  && <ChampTab champC={results.champC} avgW={results.avgW} n={results.n}/>}
                {tab==="analysis"   && <AnalysisTab simResults={results}/>}
              </>
            )}
            {!results&&!loading&&(
              <div style={{textAlign:"center",padding:"44px 20px"}}>
                <div style={{fontSize:"2rem",marginBottom:"8px"}}>🎲</div>
                <div style={{fontFamily:"'Oswald',sans-serif",fontSize:"0.85rem",letterSpacing:"0.1em",color:"#8aaccc"}}>Run 500 simulations of the full 2026 bracket</div>
                <div style={{fontSize:"0.68rem",marginTop:"5px",color:"#8aaccc"}}>Or switch to ✏️ My Picks to fill out your own bracket first</div>
              </div>
            )}
          </>
        )}

        {/* MY PICKS MODE */}
        {mode==="picks"&&(
          <div>
            {/* Progress bar */}
            <div style={{background:"#060c18",border:"1px solid #88ee4422",borderRadius:"6px",padding:"10px 14px",marginBottom:"10px",display:"flex",alignItems:"center",gap:"12px"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                  <span style={{fontSize:"0.65rem",color:"#88ee44",fontFamily:"'Oswald',sans-serif",letterSpacing:"0.08em"}}>✏️ MY BRACKET</span>
                  <span style={{fontSize:"0.65rem",color:picksComplete?"#88ee44":"#4a6880"}}>{pickCount}/{TOTAL_GAMES} games picked {picksComplete?"✓":""}</span>
                </div>
                <div style={{background:"#0a1828",borderRadius:"3px",height:"5px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(pickCount/TOTAL_GAMES)*100}%`,background:"linear-gradient(90deg,#44aa44,#88ee44)",transition:"width 0.3s"}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:"6px",flexShrink:0}}>
                <button onClick={()=>setMyPicks({})}
                  style={{cursor:"pointer",background:"transparent",border:"1px solid #ff444430",color:"#ff6666",padding:"4px 10px",borderRadius:"3px",fontFamily:"'Oswald',sans-serif",fontSize:"0.7rem"}}>
                  CLEAR
                </button>
                <button onClick={()=>runSim(myPicks)}
                  style={{cursor:"pointer",background:picksComplete?"linear-gradient(135deg,#1a3a0a,#0e2208)":"#060c18",
                    border:`1px solid ${picksComplete?"#88ee44":"#2a4050"}`,
                    color:picksComplete?"#88ee44":"#3a5268",
                    padding:"4px 12px",borderRadius:"3px",fontFamily:"'Oswald',sans-serif",fontSize:"0.72rem",
                    letterSpacing:"0.08em",opacity:pickCount===0?0.4:1}}>
                  {picksComplete?"🔒 SIM WITH MY PICKS":`SIM (${pickCount} locked)`}
                </button>
              </div>
            </div>
            <div style={{color:"#1e3a50",fontSize:"0.6rem",letterSpacing:"0.1em",marginBottom:"8px"}}>
              Click either team in any matchup to pick the winner → the next round unlocks automatically
            </div>
            <MyPicksRegion region="East"    resolved={picksResolved.regionWinners.East}    picks={myPicks} onPick={handlePick}/>
            <MyPicksRegion region="South"   resolved={picksResolved.regionWinners.South}   picks={myPicks} onPick={handlePick}/>
            <MyPicksFinalFour resolved={picksResolved} onPick={handlePick}/>
            <MyPicksRegion region="West"    resolved={picksResolved.regionWinners.West}     picks={myPicks} onPick={handlePick}/>
            <MyPicksRegion region="Midwest" resolved={picksResolved.regionWinners.Midwest}  picks={myPicks} onPick={handlePick}/>
          </div>
        )}

        {/* BOTTOM FANDUEL BANNER */}
        <FanDuelBanner position="bottom"/>

        {/* FOOTER / DISCLAIMER */}
        <div style={{marginTop:"16px",paddingTop:"12px",borderTop:"1px solid #0d1828",textAlign:"center"}}>
          <div style={{fontSize:"0.54rem",color:"#8aaccc",letterSpacing:"0.1em",marginBottom:"6px"}}>
            REAL 2026 NCAA BRACKET · SELECTION SUNDAY MARCH 15 2026
          </div>
          <div style={{fontSize:"0.56rem",color:"#8aaccc",lineHeight:1.6,maxWidth:"700px",margin:"0 auto"}}>
            This site is not affiliated with or endorsed by the NCAA, any university, or any athletic conference.
            Team names and related marks are the property of their respective institutions.
            Simulation results are for entertainment purposes only and do not constitute betting advice.
            Must be 21+ and present in a legal sports betting state to wager with FanDuel. Gambling problem?
            Call 1-800-GAMBLER.
          </div>
        </div>
      </div>

      {showShare&&<ShareCard simResults={results} myPicks={picksResolved} onClose={()=>setShowShare(false)}/>}
    </div>
  );
}
