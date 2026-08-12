const STORAGE_KEY = 'j90_escrita_v6_teste';

const state = {
  lead: { name:'', email:'', whatsapp:'', consent:false },
  answers: {},
  currentIndex: 0,
  completed: false
};

const FICTION = 'FICCAO';
const NONFICTION = 'NAO_FICCAO';

function isNonFiction(){ return state.answers.q2 === NONFICTION; }
function isFiction(){ return state.answers.q2 === FICTION; }

const questions = [
  {
    id:'q1', title:()=> 'Em que momento seu livro está hoje?', type:'radio',
    options:()=>[
      ['IDEIA','Tenho apenas a ideia'],
      ['PRE_ESCRITA','Já planejei parte do livro, mas ainda não comecei a escrever'],
      ['INICIO','Comecei a escrever'],
      ['MEIO','Estou aproximadamente na metade'],
      ['AVANCADO','Já escrevi boa parte e quero finalmente concluir'],
      ['VERSAO_INCOMPLETA','Tenho uma primeira versão, mas ainda considero a obra incompleta']
    ]
  },
  {
    id:'q2', title:()=> 'O que você está escrevendo?', type:'radio',
    options:()=>[['FICCAO','Ficção'],['NAO_FICCAO','Não ficção']]
  },
  {
    id:'q3', title:()=> isNonFiction() ? 'Qual é a natureza principal da sua obra?' : 'Qual é o gênero principal da sua obra?', type:'radio',
    options:()=> isNonFiction() ? [
      ['MEMORIAS','Biografia / memórias'],['NEGOCIOS','Negócios'],['DESENVOLVIMENTO','Desenvolvimento pessoal'],
      ['RELIGIAO','Religião / espiritualidade'],['TECNICO','Técnico / profissional'],['EDUCACAO','Educação'],['SAUDE','Saúde'],['OUTRO','Outro']
    ] : [
      ['FANTASIA','Fantasia'],['ROMANCE','Romance'],['TERROR','Terror'],['SUSPENSE','Suspense'],['FC','Ficção científica'],
      ['DRAMA','Drama'],['AVENTURA','Aventura'],['INFANTOJUVENIL','Infantil / juvenil'],['OUTRO','Outro']
    ]
  },
  {
    id:'q4', title:()=> 'Quanto da estrutura do livro você já planejou?', type:'radio',
    options:()=> isNonFiction() ? [
      ['DESCOBERTA','Não planejei a estrutura; desenvolvo o conteúdo conforme escrevo'],
      ['IDEIA_GERAL','Tenho apenas a ideia central'],
      ['MARCOS','Tenho os principais tópicos definidos'],
      ['SINOPSE','Tenho um resumo estruturado'],
      ['CENAS_CAPITULOS','Tenho capítulos parcialmente planejados'],
      ['TRAJETORIA','Tenho praticamente toda a estrutura do livro planejada']
    ] : [
      ['DESCOBERTA','Não planejo previamente; descubro a história enquanto escrevo'],
      ['IDEIA_GERAL','Tenho apenas uma ideia geral'],
      ['MARCOS','Conheço o começo e alguns acontecimentos importantes'],
      ['SINOPSE','Tenho uma sinopse ou resumo estruturado'],
      ['CENAS_CAPITULOS','Tenho capítulos ou cenas parcialmente planejados'],
      ['TRAJETORIA','Tenho praticamente toda a trajetória planejada']
    ]
  },
  {
    id:'q5',
    title:()=> isNonFiction() ? 'Você sabe como pretende concluir o livro?' : 'Você sabe como seu livro termina?',
    type:'radio',
    options:()=> isNonFiction() ? [
      ['CLARO','Sim, sei claramente qual conclusão ou mensagem final quero deixar'],
      ['APROXIMADO','Tenho uma ideia aproximada'],
      ['POSSIBILIDADES','Tenho algumas possibilidades'],
      ['NAO_SABE','Ainda não sei']
    ] : [
      ['CLARO','Sim, claramente'],
      ['APROXIMADO','Tenho uma ideia aproximada'],
      ['POSSIBILIDADES','Tenho algumas possibilidades'],
      ['NAO_SABE','Ainda não sei']
    ]
  },
  {
    id:'q6', title:()=> 'Você já possui texto escrito dessa obra?', type:'radio',
    options:()=>[['SIM','Sim'],['NAO','Não']]
  },
  {
    id:'q7', title:()=> 'Em quantos dias da semana você realmente conseguiria escrever?', type:'radio',
    options:()=>[['1','1 dia'],['2','2 dias'],['3','3 dias'],['4','4 dias'],['5','5 dias'],['6','6 dias'],['7','7 dias']]
  },
  {
    id:'q8', title:()=> 'Quanto tempo você normalmente consegue reservar em cada sessão de escrita?', type:'radio',
    options:()=>[
      ['ATE_20','Até 20 minutos'],['20_40','20 a 40 minutos'],['40_60','40 minutos a 1 hora'],['60_120','1 a 2 horas'],['MAIS_120','Mais de 2 horas']
    ]
  },
  {
    id:'q9', title:()=> 'Esses períodos para escrever costumam ser previsíveis?', type:'radio',
    options:()=>[
      ['ESTAVEL','Sim, tenho dias e horários relativamente definidos'],
      ['VARIAVEL','Mudam bastante a cada semana'],
      ['OPORTUNISTICA','Só consigo escrever quando aparece uma oportunidade']
    ]
  },
  {
    id:'q10', title:()=> 'Em qual período do dia você geralmente teria maior facilidade para escrever?', type:'radio',
    options:()=>[['MANHA','Manhã'],['TARDE','Tarde'],['NOITE','Noite'],['MADRUGADA','Madrugada'],['VARIA','Varia muito']]
  },
  {
    id:'q11',
    title:()=> 'Quais são hoje as suas maiores dificuldades para terminar esse livro?',
    helper:()=> 'Escolha até duas opções.',
    type:'checkbox', max:2,
    options:()=> isNonFiction() ? [
      ['TEMPO','Falta de tempo'],['PROCRASTINACAO','Procrastinação'],['DIRECAO','Não sei como desenvolver o conteúdo'],
      ['EXCESSO_IDEIAS','Tenho muitos tópicos ou ideias e me perco'],['REESCRITA','Começo e reescrevo constantemente'],
      ['ROTINA','Não consigo manter uma rotina'],['BLOQUEIO','Bloqueio na escrita'],['INSEGURANCA','Insegurança com a qualidade do texto'],
      ['FINAL','Não sei como concluir o livro'],['OUTRA','Outra']
    ] : [
      ['TEMPO','Falta de tempo'],['PROCRASTINACAO','Procrastinação'],['DIRECAO','Não sei como desenvolver a história'],
      ['EXCESSO_IDEIAS','Tenho muitas ideias e me perco'],['REESCRITA','Começo e reescrevo constantemente'],
      ['ROTINA','Não consigo manter uma rotina'],['BLOQUEIO','Bloqueio criativo'],['INSEGURANCA','Insegurança com a qualidade do texto'],
      ['FINAL','Não sei como terminar'],['OUTRA','Outra']
    ]
  },
  {
    id:'q12', title:()=> 'Quando você passa alguns dias sem escrever, o que normalmente acontece?', type:'radio',
    options:()=>[
      ['RETOMA','Retomo tranquilamente'],['LENTA','Demoro um pouco para reencontrar o ritmo'],
      ['REESCREVE','Volto e começo a reescrever o que já havia feito'],['ABANDONA','Acabo abandonando por semanas ou meses'],
      ['NAO_SEI','Ainda não tenho experiência suficiente para saber']
    ]
  },
  {
    id:'q13', title:()=> 'Você costuma revisar o texto enquanto ainda está escrevendo a primeira versão?', type:'radio',
    options:()=>[['CONSTANTE','Constantemente'],['AS_VEZES','Às vezes'],['RARO','Raramente'],['DEPOIS','Prefiro terminar primeiro e revisar depois']]
  },
  {
    id:'q14', title:()=> 'Pensar em terminar seu livro nos próximos 90 dias parece:', type:'radio',
    options:()=>[['MUITO_POSSIVEL','Muito possível'],['DESAFIADOR','Desafiador, mas possível'],['DIFICIL','Difícil'],['QUASE_IMPOSSIVEL','Quase impossível'],['NAO_SEI','Não sei avaliar']]
  },
  {
    id:'q15', title:()=> 'Ao final desses 90 dias, qual resultado faria você sentir que a Jornada realmente valeu a pena?', type:'radio',
    options:()=> isNonFiction() ? [
      ['CONCLUSAO','Ter o manuscrito completamente concluído'],['CONSTANCIA','Finalmente conseguir escrever com constância'],
      ['DESTRAVAMENTO','Sair do bloqueio e voltar a avançar'],['PROGRESSO','Avançar muito mais do que avancei até hoje'],
      ['DIRECAO','Ter o conteúdo organizado e saber exatamente para onde estou indo']
    ] : [
      ['CONCLUSAO','Ter o manuscrito completamente concluído'],['CONSTANCIA','Finalmente conseguir escrever com constância'],
      ['DESTRAVAMENTO','Sair do bloqueio e voltar a avançar'],['PROGRESSO','Avançar muito mais do que avancei até hoje'],
      ['DIRECAO','Ter minha história organizada e saber exatamente para onde estou indo']
    ]
  },
  {
    id:'q16', title:()=> 'Quanto você está disposto a reorganizar sua rotina para transformar o livro em uma prioridade durante esses 90 dias?', type:'radio',
    options:()=>[
      ['POUCO','Muito pouco'],['PEQUENOS_AJUSTES','Consigo fazer pequenos ajustes'],
      ['REORGANIZAR','Estou disposto a reorganizar algumas prioridades'],['PRIORIDADE','Quero tratar a conclusão do livro como uma meta importante']
    ]
  },
  {
    id:'q17', title:()=> 'Existe algum período nos próximos 90 dias em que você já sabe que terá pouca ou nenhuma disponibilidade para escrever?', type:'radio',
    options:()=>[
      ['NAO','Não'],['ALGUNS_DIAS','Sim, alguns dias'],['UMA_SEMANA','Sim, aproximadamente uma semana'],['MAIS_SEMANA','Sim, mais de uma semana']
    ],
    extra:(s)=> s.answers.q17 && s.answers.q17!=='NAO'
  },
  {
    id:'q18',
    title:()=> 'Você estaria disposto a enviar o manuscrito atual para analisarmos o estágio da obra e calibrarmos sua Jornada?',
    helper:()=> 'O envio será opcional e usado apenas para calibrar o plano. Não corresponde a revisão nem análise crítica.',
    type:'radio',
    showIf:(s)=> s.answers.q6==='SIM',
    options:()=>[['SIM','Sim, estou disposto(a) a enviar'],['NAO','Prefiro não enviar neste momento']]
  }
];

function visibleQuestions(){
  return questions.filter(q => !q.showIf || q.showIf(state));
}

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function load(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return;
  try{
    const old = JSON.parse(raw);
    if(old && typeof old==='object') Object.assign(state, old);
  }catch(e){}
}

function reset(){
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

function show(id){
  ['screen-lead','screen-question','screen-result','screen-sales','screen-checkout'].forEach(x=>{
    document.getElementById(x).classList.toggle('hidden', x!==id);
  });
  window.scrollTo({top:0,behavior:'smooth'});
}

function currentQuestion(){
  return visibleQuestions()[state.currentIndex];
}

const commonEmailTypos = {
  'gmail.con':'gmail.com','gmai.com':'gmail.com','gmial.com':'gmail.com','gmail.co':'gmail.com',
  'hotmail.con':'hotmail.com','hotmai.com':'hotmail.com','outlook.con':'outlook.com',
  'yahoo.con':'yahoo.com','icloud.con':'icloud.com'
};

function validateEmail(value){
  const email = (value||'').trim().toLowerCase();
  if(!email) return {ok:false, message:'Informe seu e-mail.'};
  const basic = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  if(!basic.test(email)) return {ok:false, message:'Confira o formato do e-mail.'};
  const domain = email.split('@')[1];
  if(commonEmailTypos[domain]){
    return {ok:false, warn:true, message:`Você quis dizer @${commonEmailTypos[domain]}?`};
  }
  if(email.includes('..') || domain.startsWith('.') || domain.endsWith('.')){
    return {ok:false, message:'Confira o formato do e-mail.'};
  }
  return {ok:true, message:'Formato de e-mail válido.'};
}

const validBrazilDDD = new Set([
  '11','12','13','14','15','16','17','18','19','21','22','24','27','28',
  '31','32','33','34','35','37','38','41','42','43','44','45','46','47','48','49',
  '51','53','54','55','61','62','63','64','65','66','67','68','69',
  '71','73','74','75','77','79','81','82','83','84','85','86','87','88','89',
  '91','92','93','94','95','96','97','98','99'
]);

function normalizeBrazilPhone(value){
  let d=(value||'').replace(/\D/g,'');
  if(d.startsWith('55') && d.length>=12) d=d.slice(2);
  return d;
}

function validateWhatsApp(value){
  const d=normalizeBrazilPhone(value);
  if(!d) return {ok:false, message:'Informe seu WhatsApp com DDD.'};
  if(!(d.length===10 || d.length===11)) return {ok:false, message:'Use DDD + número, com 10 ou 11 dígitos.'};
  if(!validBrazilDDD.has(d.slice(0,2))) return {ok:false, message:'Confira o DDD informado.'};
  if(d.length===11 && d[2]!=='9') return {ok:false, message:'Celulares brasileiros com 11 dígitos devem começar com 9 após o DDD.'};
  return {ok:true, message:'Formato de WhatsApp válido.'};
}

function formatWhatsApp(value){
  let d=normalizeBrazilPhone(value).slice(0,11);
  if(d.length<=2) return d;
  if(d.length<=6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if(d.length<=10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

function paintValidation(inputId, msgId, result){
  const input=document.getElementById(inputId);
  const msg=document.getElementById(msgId);
  input.classList.remove('is-ok','is-error');
  msg.className='validation';
  msg.textContent=result.message||'';
  if(result.ok){
    input.classList.add('is-ok');
    msg.classList.add('ok');
  }else if(result.warn){
    input.classList.add('is-error');
    msg.classList.add('warn');
  }else{
    if(input.value.trim()) input.classList.add('is-error');
    msg.classList.add('error');
  }
}

function leadValid(){
  const emailResult=validateEmail(state.lead.email);
  const phoneResult=validateWhatsApp(state.lead.whatsapp);
  return state.lead.name.trim().length>=2 && emailResult.ok && phoneResult.ok && state.lead.consent;
}

function syncLead(showMessages=true){
  state.lead.name=document.getElementById('lead-name').value.trim();
  state.lead.email=document.getElementById('lead-email').value.trim();
  state.lead.whatsapp=document.getElementById('lead-whatsapp').value.trim();
  state.lead.consent=document.getElementById('lead-consent').checked;
  if(showMessages){
    paintValidation('lead-email','email-validation',validateEmail(state.lead.email));
    paintValidation('lead-whatsapp','whatsapp-validation',validateWhatsApp(state.lead.whatsapp));
  }
  save();
}

function renderLead(){
  document.getElementById('lead-name').value=state.lead.name||'';
  document.getElementById('lead-email').value=state.lead.email||'';
  document.getElementById('lead-whatsapp').value=state.lead.whatsapp||'';
  document.getElementById('lead-consent').checked=!!state.lead.consent;
  if(state.lead.email) paintValidation('lead-email','email-validation',validateEmail(state.lead.email));
  if(state.lead.whatsapp) paintValidation('lead-whatsapp','whatsapp-validation',validateWhatsApp(state.lead.whatsapp));
}
