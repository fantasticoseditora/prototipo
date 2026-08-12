function renderQuestion(){
  const qs=visibleQuestions();
  if(state.currentIndex<0) state.currentIndex=0;
  if(state.currentIndex>=qs.length) state.currentIndex=qs.length-1;
  const q=qs[state.currentIndex];

  document.getElementById('counter').textContent=`Pergunta ${state.currentIndex+1} de ${qs.length}`;
  document.getElementById('progress').style.width=`${((state.currentIndex+1)/qs.length)*100}%`;
  document.getElementById('question-title').textContent=typeof q.title==='function' ? q.title() : q.title;
  document.getElementById('question-helper').textContent=q.helper ? (typeof q.helper==='function'?q.helper():q.helper) : '';

  const body=document.getElementById('question-body');
  body.innerHTML='';
  const opts=typeof q.options==='function' ? q.options() : q.options;
  const wrap=document.createElement('div');
  wrap.className='options';

  opts.forEach(([value,label])=>{
    const row=document.createElement('label');
    row.className='option';
    const input=document.createElement('input');
    input.type=q.type==='checkbox'?'checkbox':'radio';
    input.name=q.id;
    input.value=value;

    if(q.type==='checkbox'){
      const arr=Array.isArray(state.answers[q.id])?state.answers[q.id]:[];
      input.checked=arr.includes(value);
      input.addEventListener('change',()=>{
        let now=Array.isArray(state.answers[q.id])?[...state.answers[q.id]]:[];
        if(input.checked){
          if(now.length>=(q.max||99)){
            input.checked=false;
            alert(`Escolha no máximo ${q.max} opções.`);
            return;
          }
          now.push(value);
        }else{
          now=now.filter(x=>x!==value);
        }
        state.answers[q.id]=now;
        save();
      });
    }else{
      input.checked=state.answers[q.id]===value;
      input.addEventListener('change',()=>{
        state.answers[q.id]=value;

        if(q.id==='q2'){
          delete state.answers.q3;
        }
        if(q.id==='q6' && value==='NAO'){
          delete state.answers.q18;
        }
        if(q.id==='q17' && value==='NAO'){
          delete state.answers.q17_extra;
        }

        save();
        if(q.id==='q17') renderQuestion();
      });
    }

    const span=document.createElement('span');
    span.textContent=label;
    row.append(input,span);
    wrap.append(row);
  });

  body.append(wrap);

  if(q.id==='q17' && q.extra && q.extra(state)){
    const div=document.createElement('div');
    div.className='field';
    div.style.marginTop='18px';
    const safe=(state.answers.q17_extra||'').replace(/"/g,'&quot;');
    div.innerHTML=`<label for="q17-extra">Quando aproximadamente ocorrerá esse período?</label>
      <input id="q17-extra" placeholder="Ex.: cerca de 7 dias; segunda quinzena do próximo mês" value="${safe}">`;
    body.append(div);
    const extra=div.querySelector('input');
    extra.addEventListener('input',e=>{
      state.answers.q17_extra=e.target.value.trim();
      save();
    });
  }

  document.getElementById('prev-btn').disabled=state.currentIndex===0;
  document.getElementById('next-btn').textContent=state.currentIndex===qs.length-1?'VER MEU DIAGNÓSTICO':'CONTINUAR';
}

function answered(q){
  const a=state.answers[q.id];
  if(q.type==='checkbox') return Array.isArray(a) && a.length>0 && a.length<=(q.max||99);
  if(!a) return false;
  if(q.id==='q17' && a!=='NAO'){
    return (state.answers.q17_extra||'').trim().length>=3;
  }
  return true;
}

function hasDiff(x){ return (state.answers.q11||[]).includes(x); }

const sessionMinutes={ATE_20:15,'20_40':30,'40_60':50,'60_120':90,MAIS_120:150};
const stageLabels={
  IDEIA:'Ideia inicial', PRE_ESCRITA:'Pré-escrita', INICIO:'Início do manuscrito',
  MEIO:'Obra em desenvolvimento — aproximadamente na metade', AVANCADO:'Obra avançada',
  VERSAO_INCOMPLETA:'Primeira versão ainda incompleta'
};
