function renderResults(){
  try{
    const d=diagnose();
    const name=state.lead.name||'Você';
    document.getElementById('result-title').textContent=`${name}, este é o seu perfil de escrita`;
    document.getElementById('result-intro').textContent='Seu diagnóstico combina estágio, direção, disponibilidade, execução e continuidade. Cada ponto abaixo já vem acompanhado de uma primeira ação. A Jornada paga entra quando precisamos transformar essas ações em uma sequência completa de 90 dias.';

    const blocks=[
      ['Seu estágio',d.stageBlock],
      ['Sua direção',d.direction],
      ['Sua disponibilidade',d.availability],
      ['Seu principal gargalo de execução',d.execution],
      ['Seu risco de continuidade',d.continuity]
    ];

    const grid=document.getElementById('results-grid');
    grid.innerHTML='';
    const icons=['✦','➜','⏱','⚙','↻'];
    blocks.forEach(([label,b],idx)=>{
      const el=document.createElement('div');
      el.className='result-card';
      el.innerHTML=`<div class="result-top">
          <div class="result-icon">${icons[idx]||'✦'}</div>
          <div>
            <div class="label">${label}</div>
            <h3>${b.title}</h3>
            <p class="muted">${b.text}</p>
          </div>
        </div>
        <div class="action-box"><b>Primeira ação recomendada</b><br>${b.action}</div>`;
      grid.append(el);
    });

    document.getElementById('viability-box').innerHTML=`<div class="label">Viabilidade dos 90 dias</div>
      <strong>${d.viability}</strong>
      <p class="muted" style="margin:10px 0 0">${d.viabilityText}</p>`;

    state.completed=true;
    save();
    show('screen-result');
  }catch(err){
    console.error(err);
    alert('Ocorreu uma falha ao montar o diagnóstico. Recarregue esta versão do protótipo e tente novamente.');
  }
}

function renderSales(){
  const d=diagnose(), a=state.answers, nf=d.meta.nf;
  const paras=[];

  if(a.q1==='MEIO'){
    paras.push(nf
      ? '<strong>Seu livro já está aproximadamente na metade.</strong> Você não precisa de um plano para “começar a escrever”; precisa de uma rota para organizar os tópicos restantes e conduzir o conteúdo até uma conclusão.'
      : '<strong>Seu livro já está aproximadamente na metade.</strong> Isso significa que você não precisa de um plano para “começar a escrever”; precisa de uma rota para transformar o que já existe em avanço consistente até o fechamento.');
  }else if(a.q1==='AVANCADO' || a.q1==='VERSAO_INCOMPLETA'){
    paras.push('<strong>Seu manuscrito já está avançado.</strong> O desafio agora é separar o que realmente falta para concluir daquilo que pode ser lapidado depois.');
  }else if(a.q1==='IDEIA' || a.q1==='PRE_ESCRITA'){
    paras.push(nf
      ? '<strong>Seu livro ainda está no início da jornada.</strong> Antes de cobrar produtividade, seu plano precisa transformar tema, proposta e estrutura em uma sequência mínima que permita começar.'
      : '<strong>Seu livro ainda está no início da jornada.</strong> Antes de cobrar produtividade, seu plano precisa criar direção suficiente para que as sessões de escrita não comecem do zero todas as vezes.');
  }else{
    paras.push('<strong>Você já começou.</strong> Agora o maior valor de um plano é proteger o crescimento da primeira versão sem transformar cada sessão numa nova decisão sobre o que fazer.');
  }

  if(d.meta.directionLevel==='BAIXA'){
    paras.push(nf
      ? '<strong>Seu diagnóstico também mostrou que falta uma direção compatível com o estágio atual da obra.</strong> A Jornada precisará organizar os tópicos, argumentos e a conclusão sem transformar o processo num esquema rígido.'
      : '<strong>Seu diagnóstico também mostrou que falta uma direção compatível com o estágio atual da obra.</strong> A Jornada precisará organizar marcos de chegada sem obrigar você a transformar seu processo criativo em um outline rígido.');
  }else if(d.meta.discovery){
    paras.push(nf
      ? '<strong>Você desenvolve parte do conteúdo conforme escreve.</strong> Sua Jornada não vai tentar impor uma estrutura engessada; ela vai criar marcos suficientes para que a liberdade de desenvolvimento não vire dispersão.'
      : '<strong>Seu processo é de descoberta.</strong> Sua Jornada não vai tentar transformar você em um escritor “arquiteto”; ela vai criar marcos suficientes para que a liberdade criativa não vire desorientação.');
  }

  if(d.meta.days>=4 && d.meta.mins<=30){
    paras.push(`<strong>Você tem ${d.meta.days} oportunidades semanais para escrever, mas em sessões curtas.</strong> O plano precisará fazer cada pequena janela começar com uma tarefa clara, em vez de desperdiçar parte do tempo tentando decidir por onde continuar.`);
  }else if(d.meta.weekly<60){
    paras.push('<strong>Sua carga semanal é reduzida.</strong> Isso não elimina a Jornada, mas torna essencial escolher metas menores, objetivas e acumulativas.');
  }else{
    paras.push('<strong>Sua disponibilidade oferece espaço real para avanço.</strong> O plano vai organizar essa capacidade para que ela produza continuidade, e não apenas sessões isoladas.');
  }

  paras.push(`<strong>${d.execution.title}.</strong> ${d.execution.text}`);

  if(d.meta.longBreak){
    paras.push('<strong>Existe ainda uma interrupção relevante prevista dentro dos 90 dias.</strong> Sua Jornada não pode tratá-la como “atraso”: ela precisa prever como você sairá e como retornará sem perder o ritmo.');
  }else if(d.meta.continuityRisk!=='BAIXO'){
    paras.push('<strong>Sua continuidade merece proteção.</strong> O plano deverá prever como você retoma o trabalho quando a rotina quebra.');
  }

  paras.push(`E há um ponto importante: você nos disse que o resultado que mais faria esta Jornada valer a pena é <strong>${d.motive}</strong>. É isso que o plano precisa perseguir — e não uma rotina genérica que funcionaria para qualquer escritor.`);

  if(d.meta.manuscriptWilling==='SIM'){
    paras.push('<strong>Como você se dispõe a enviar o manuscrito atual, sua Jornada poderá ser calibrada também pelo estágio real do texto já produzido.</strong> O arquivo será usado para planejamento, não como análise crítica ou revisão.');
  }else if(a.q6==='SIM'){
    paras.push('<strong>Mesmo sem o envio do manuscrito, a Jornada poderá ser construída com suas respostas.</strong> Apenas deixaremos claro que a calibração do estágio será feita sem leitura direta do arquivo.');
  }

  paras.push('<strong>É exatamente essa combinação que sua Jornada dos 90 Dias será construída para organizar.</strong> O diagnóstico mostrou onde estão os obstáculos. O plano pago define a sequência: o que fazer primeiro, o que vem depois, quais marcos perseguir e como recuperar a rota se uma semana sair do previsto.');

  const iconSet=['①','②','③','④','⑤','⑥','✓'];
  document.getElementById('sales-copy').innerHTML=paras.map((p,i)=>`
    <div class="sales-point">
      <div class="sales-icon">${iconSet[i]||'✓'}</div>
      <p>${p}</p>
    </div>`).join('');
}

function boot(){
  load();
  renderLead();
  if(state.completed){
    renderResults();
  }else if(Object.keys(state.answers).length>0 && leadValid()){
    show('screen-question');
    renderQuestion();
  }else{
    show('screen-lead');
  }
}

document.getElementById('lead-name').addEventListener('input',()=>syncLead(false));
document.getElementById('lead-email').addEventListener('input',()=>syncLead(true));
document.getElementById('lead-email').addEventListener('blur',()=>syncLead(true));
document.getElementById('lead-whatsapp').addEventListener('input',(e)=>{
  const cursorAtEnd=e.target.selectionStart===e.target.value.length;
  e.target.value=formatWhatsApp(e.target.value);
  if(cursorAtEnd) e.target.setSelectionRange(e.target.value.length,e.target.value.length);
  syncLead(true);
});
document.getElementById('lead-whatsapp').addEventListener('blur',()=>syncLead(true));
document.getElementById('lead-consent').addEventListener('change',()=>syncLead(false));

document.getElementById('start-btn').addEventListener('click',()=>{
  syncLead(true);
  if(!leadValid()){
    alert('Confira nome, e-mail, WhatsApp e consentimento para continuar.');
    return;
  }
  state.completed=false;
  state.currentIndex=0;
  save();
  show('screen-question');
  renderQuestion();
});

document.getElementById('next-btn').addEventListener('click',()=>{
  const qs=visibleQuestions();
  const q=qs[state.currentIndex];

  if(!answered(q)){
    if(q.id==='q17' && state.answers.q17 && state.answers.q17!=='NAO'){
      alert('Informe aproximadamente quando ocorrerá esse período.');
    }else{
      alert('Responda esta pergunta para continuar.');
    }
    return;
  }

  if(state.currentIndex<qs.length-1){
    state.currentIndex++;
    save();
    renderQuestion();
  }else{
    renderResults();
  }
});

document.getElementById('prev-btn').addEventListener('click',()=>{
  if(state.currentIndex>0){
    state.currentIndex--;
    save();
    renderQuestion();
  }
});

document.getElementById('journey-btn').addEventListener('click',()=>{
  renderSales();
  show('screen-sales');
});

document.getElementById('back-result-btn').addEventListener('click',()=>show('screen-result'));
document.getElementById('checkout-btn').addEventListener('click',()=>{
  state.checkout_started=true;
  state.checkout_mode='TESTE_001';
  state.checkout_commercial_url='https://mpago.la/1fjYJpX';
  state.checkout_started_at=new Date().toISOString();
  save();
  window.location.href='https://mpago.la/1NYZCwd';
});
document.getElementById('back-sales-btn').addEventListener('click',()=>show('screen-sales'));
document.getElementById('restart-final-btn').addEventListener('click',reset);

['reset-btn-q','reset-btn-r','reset-btn-s'].forEach(id=>{
  document.getElementById(id).addEventListener('click',()=>{
    if(confirm('Apagar as respostas deste protótipo e recomeçar?')) reset();
  });
});

boot();