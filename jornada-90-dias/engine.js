function diagnose(){
  const a=state.answers;
  const nf=isNonFiction();
  const days=Number(a.q7||0);
  const mins=sessionMinutes[a.q8]||0;
  const weekly=days*mins;
  const stage=a.q1;

  const late=['MEIO','AVANCADO','VERSAO_INCOMPLETA'].includes(stage);
  const early=['IDEIA','PRE_ESCRITA','INICIO'].includes(stage);
  const discovery=a.q4==='DESCOBERTA';
  const planLow=a.q4==='IDEIA_GERAL';
  const finalUnknown=a.q5==='NAO_SABE';

  const rewriteStrong=a.q13==='CONSTANTE' || hasDiff('REESCRITA') || a.q12==='REESCREVE';
  const sessionShort=a.q8==='ATE_20' || a.q8==='20_40';
  const routineUnstable=['VARIAVEL','OPORTUNISTICA'].includes(a.q9);
  const returnRisk=['LENTA','REESCREVE','ABANDONA'].includes(a.q12);
  const longBreak=a.q17==='MAIS_SEMANA';
  const mediumBreak=a.q17==='UMA_SEMANA';

  let direction={
    title:'Direção suficiente para o estágio atual',
    text:nf
      ? 'Você possui uma estrutura suficiente para avançar sem transformar o planejamento em uma etapa infinita.'
      : 'Você possui orientação estrutural suficiente para avançar sem transformar o planejamento em uma etapa infinita.',
    action:nf
      ? 'Mantenha visível o próximo tópico ou capítulo que precisa ser desenvolvido e avance até ele antes de ampliar o planejamento.'
      : 'Mantenha visível apenas o próximo marco narrativo e avance até ele antes de ampliar o planejamento.'
  };
  let directionLevel='BOA';

  if(late && finalUnknown && (planLow || hasDiff('DIRECAO') || hasDiff('FINAL') || discovery)){
    directionLevel='BAIXA';
    direction={
      title:'Direção insuficiente para o estágio atual',
      text:nf
        ? 'Seu livro já avançou bastante, mas a conclusão ainda está indefinida. Sem uma direção de chegada, você pode gastar cada vez mais tempo decidindo quais tópicos ainda entram e como o argumento deve fechar.'
        : discovery
          ? 'Seu método de descoberta pode funcionar muito bem, mas neste ponto da obra a ausência de um destino provisório começa a aumentar o risco de você perder tempo decidindo o que acontece em seguida.'
          : 'Sua obra já avançou bastante, mas o final ainda está indefinido e a estrutura disponível não oferece uma chegada clara. Isso tende a desacelerar justamente a parte em que a narrativa deveria ganhar direção.',
      action:nf
        ? 'Reserve uma sessão curta para definir três pontos: qual transformação ou conclusão o leitor deve alcançar, qual argumento central ainda precisa ser consolidado e qual mensagem final o livro deve deixar.'
        : discovery
          ? 'Preserve seu estilo de descoberta: não faça um outline completo. Defina apenas três marcos próximos e uma chegada provisória.'
          : 'Reserve uma sessão curta para definir três coisas: onde o protagonista precisa chegar, qual conflito central ainda falta resolver e qual seria um encerramento provisório.'
    };
  } else if(finalUnknown && early){
    directionLevel='PARCIAL';
    direction={
      title:'Direção ainda aberta — compatível com seu estágio',
      text:nf
        ? 'Ainda não saber exatamente como concluir o livro não é um problema neste ponto. O risco surge se cada sessão começar sem saber qual tópico ou argumento vem a seguir.'
        : 'Não saber exatamente como o livro termina ainda não é um problema neste ponto. O risco aparece apenas se cada sessão começar sem nenhum próximo passo visível.',
      action:nf
        ? 'Defina somente os próximos três tópicos, capítulos ou argumentos. Você não precisa decidir o livro inteiro agora.'
        : 'Defina somente os próximos três movimentos da obra. Você não precisa decidir o livro inteiro agora.'
    };
  } else if(discovery){
    directionLevel='PARCIAL';
    direction={
      title:nf?'Desenvolvimento por descoberta':'Escrita por descoberta',
      text:nf
        ? 'Você desenvolve parte do conteúdo conforme escreve. Isso não é uma falha de planejamento e não precisa ser corrigido com uma estrutura rígida.'
        : 'Seu processo é mais próximo do perfil “jardineiro”: você descobre parte da história enquanto escreve. Isso não é uma falha de planejamento e não precisa ser corrigido por um outline rígido.',
      action:nf
        ? 'Mantenha liberdade para desenvolver o conteúdo, mas encerre cada sessão sabendo qual é o próximo tópico ou pergunta que deseja resolver.'
        : 'Mantenha liberdade criativa, mas encerre cada sessão sabendo qual é o próximo pequeno marco que deseja alcançar.'
    };
  }

  let capacity='MODERADA';
  let availabilityTitle='Capacidade de execução moderada';
  let availabilityText='';
  let availabilityAction='';

  if(weekly<60){
    capacity='BAIXA';
    availabilityTitle='Carga semanal reduzida';
    availabilityText=`Você informou ${days} dia(s) por semana com sessões curtas. Sua disponibilidade exige que cada sessão tenha uma função muito clara para evitar desperdício de tempo.`;
    availabilityAction=nf
      ? 'Antes de cada sessão, defina uma microtarefa: desenvolver um tópico, escrever uma explicação, fechar uma seção ou revisar apenas um ponto previamente escolhido.'
      : 'Antes de cada sessão, defina uma microtarefa executável: uma conversa, uma transição, um trecho ou um pequeno marco.';
  } else if(days>=4 && sessionShort){
    availabilityTitle='Boa frequência, sessões curtas';
    availabilityText=`Você possui ${days} oportunidades semanais para escrever, mas trabalha com janelas curtas. A força da sua rotina está na frequência, não em grandes blocos de tempo.`;
    availabilityAction='Trabalhe com número de sessões concluídas por semana e entre em cada uma já sabendo exatamente o que irá produzir.';
  } else if(weekly>=300){
    capacity='ALTA';
    availabilityTitle='Boa capacidade semanal de execução';
    availabilityText='Sua disponibilidade oferece espaço real para avanço consistente. Seu principal risco não é falta de tempo, mas usar essa carga de forma pouco direcionada.';
    availabilityAction='Divida a semana entre sessões de avanço e, quando necessário, sessões específicas de organização — sem misturar as duas funções.';
  } else {
    availabilityText='Sua disponibilidade oferece uma base razoável para construir constância sem exigir uma mudança radical de rotina.';
    availabilityAction='Proteja um número mínimo de sessões semanais e trate cada sessão como uma unidade concluída, mesmo quando não puder escrever muito.';
  }

  let execution={
    title:'Execução relativamente equilibrada',
    text:'Suas respostas não mostram um único comportamento dominando negativamente suas sessões.',
    action:'Mantenha sessões com objetivo definido e registre o que funcionou melhor nas próximas duas semanas.'
  };
  let execSeverity='BAIXA';

  if(rewriteStrong && sessionShort){
    execSeverity='ALTA';
    execution={
      title:'Tempo fragmentado + reescrita precoce',
      text:'Você trabalha com sessões relativamente curtas e também tende a revisar enquanto ainda está produzindo a primeira versão. Isso pode fazer o pouco tempo disponível ser consumido pelo que já existe, em vez de aumentar o manuscrito.',
      action:'Separe avanço de revisão. Durante sessões de avanço, anote correções em uma lista e continue escrevendo; volte a elas apenas em um momento reservado.'
    };
  } else if(hasDiff('PROCRASTINACAO') && routineUnstable){
    execSeverity='ALTA';
    execution={
      title:'Procrastinação favorecida por uma rotina instável',
      text:'Como seus horários mudam, cada sessão exige uma nova decisão sobre quando e como começar. Esse custo de início pode alimentar a procrastinação.',
      action:'Encerre cada sessão deixando escrita a primeira microtarefa da sessão seguinte. Quando a janela surgir, você começa executando — não decidindo.'
    };
  } else if(hasDiff('BLOQUEIO') && hasDiff('INSEGURANCA')){
    execSeverity='ALTA';
    execution={
      title:'Autocobrança interferindo no avanço',
      text:'Bloqueio e insegurança aparecem juntos. Isso pode fazer produção e julgamento acontecerem ao mesmo tempo, reduzindo o avanço.',
      action:'Durante a primeira versão, marque trechos duvidosos com um sinal simples e siga. Julgamento profundo fica para uma etapa separada.'
    };
  } else if(hasDiff('EXCESSO_IDEIAS')){
    execSeverity='MODERADA';
    execution={
      title:nf?'Muitos tópicos, pouca hierarquia':'Muitas possibilidades, pouca hierarquia',
      text:nf
        ? 'Ter muitos tópicos e ideias é um ativo, mas pode virar dispersão quando todos parecem igualmente importantes.'
        : 'Ter muitas ideias é um ativo, mas pode virar dispersão quando todas competem pela mesma atenção.',
      action:nf
        ? 'Crie um “estacionamento de tópicos”. Só o tópico da sessão atual entra em desenvolvimento; os demais ficam registrados sem interromper o avanço.'
        : 'Crie um “estacionamento de ideias”. Só uma ideia entra no manuscrito atual por vez; as demais ficam registradas sem interromper a sessão.'
    };
  } else if(hasDiff('TEMPO')){
    execSeverity='MODERADA';
    execution={
      title:'Sensação de falta de tempo',
      text:'A falta de tempo declarada precisa ser tratada como problema de uso da janela disponível, e não apenas como busca por horários maiores.',
      action:'Proteja primeiro um número mínimo de sessões curtas e mensuráveis por semana antes de tentar ampliar a duração de cada uma.'
    };
  }

  let continuity={
    title:'Risco de continuidade baixo',
    text:'Suas respostas sugerem que interrupções não costumam comprometer seriamente sua retomada.',
    action:nf
      ? 'Ainda assim, termine cada sessão com uma frase dizendo qual tópico ou trecho será retomado na próxima.'
      : 'Ainda assim, termine cada sessão com uma frase dizendo o que você fará na próxima.'
  };
  let continuityRisk='BAIXO';

  if((routineUnstable && returnRisk) || a.q12==='ABANDONA' || longBreak){
    continuityRisk='ALTO';
    continuity={
      title:'Risco de quebra de continuidade',
      text:longBreak
        ? 'Sua rotina já tem sinais de retomada lenta e você prevê uma interrupção relevante nos próximos 90 dias. Sem um protocolo de saída e retorno, existe risco de perder o ritmo conquistado.'
        : 'Horários instáveis combinados com dificuldade de retomada aumentam o risco de pequenas pausas virarem interrupções longas.',
      action:nf
        ? 'Antes de qualquer pausa, deixe uma nota de retomada com o próximo tópico, argumento ou trecho. Na volta, faça uma sessão curta de reentrada antes de exigir produtividade normal.'
        : 'Antes de qualquer pausa, deixe uma nota de retomada com a próxima cena ou tarefa. Na volta, faça uma sessão curta de reentrada antes de exigir produtividade normal.'
    };
  } else if(returnRisk || mediumBreak || routineUnstable){
    continuityRisk='MODERADO';
    continuity={
      title:'Continuidade merece proteção',
      text:'Sua rotina não é totalmente estável ou sua retomada exige algum esforço. Isso não impede a Jornada, mas precisa ser previsto.',
      action:'Trabalhe com quantidade de sessões por semana e deixe sempre a próxima ação escrita ao encerrar.'
    };
  }

  let stageBlock={
    title:stageLabels[stage]||'Estágio atual',
    text:'Seu estágio atual define onde a Jornada precisa começar.',
    action:'Use o estágio atual como ponto de partida e evite tratar o livro como se estivesse começando do zero.'
  };

  if(stage==='IDEIA'){
    stageBlock={
      title:'Ideia inicial',
      text:nf
        ? 'Você ainda está antes da primeira versão. O primeiro objetivo não é produzir volume, mas transformar o tema em uma direção mínima que permita começar.'
        : 'Você ainda está antes da primeira versão. O primeiro objetivo não é produzir volume, mas transformar a ideia em uma direção mínima que permita começar.',
      action:nf
        ? 'Escreva em uma frase: para quem é este livro, qual problema ou tema central ele aborda e qual transformação ou conclusão deseja entregar.'
        : 'Escreva em uma frase quem move o livro, qual problema central existe e o que precisa mudar até o fim.'
    };
  } else if(stage==='PRE_ESCRITA'){
    stageBlock={
      title:'Pré-escrita',
      text:'Você já possui algum planejamento, mas ainda não transformou essa preparação em manuscrito. O risco aqui é permanecer organizando indefinidamente.',
      action:nf
        ? 'Defina uma data para a primeira sessão de texto e escolha um capítulo ou tópico concreto para iniciar.'
        : 'Defina uma data para a primeira sessão de texto e escolha uma cena, capítulo ou trecho concreto para iniciar.'
    };
  } else if(stage==='INICIO'){
    stageBlock={
      title:'Início do manuscrito',
      text:'Você já venceu a barreira da página em branco, mas ainda precisa proteger o crescimento do texto antes de entrar em ciclos intensos de revisão.',
      action:'Priorize avanço e registre dúvidas para resolver em uma etapa separada.'
    };
  } else if(stage==='MEIO'){
    stageBlock={
      title:'Obra em desenvolvimento — aproximadamente na metade',
      text:nf
        ? 'Você já construiu material suficiente para que decisões de estrutura, progressão de ideias e fechamento passem a afetar diretamente sua velocidade.'
        : 'Você já construiu material suficiente para que decisões estruturais passem a ter impacto direto na velocidade de avanço.',
      action:finalUnknown
        ? (nf
          ? 'Antes de acelerar, defina uma conclusão provisória e os principais tópicos que ainda precisam conduzir o leitor até ela.'
          : 'Antes de acelerar, crie uma direção provisória de chegada. Ela pode mudar depois, mas precisa existir.')
        : (nf
          ? 'Identifique o próximo grande bloco de conteúdo que precisa ser concluído antes do fechamento.'
          : 'Identifique o próximo grande marco que separa a metade atual do fechamento e concentre as próximas sessões nele.')
    };
  } else if(stage==='AVANCADO'){
    stageBlock={
      title:'Obra avançada',
      text:nf
        ? 'Seu desafio já não é começar: é separar o que ainda falta para completar o argumento e a estrutura do que pode ser aperfeiçoado depois.'
        : 'Seu desafio já não é começar: é evitar que o trecho final se perca em revisão, indecisões ou dispersão.',
      action:nf
        ? 'Liste os capítulos, tópicos ou conclusões ainda ausentes e diferencie isso de melhorias que podem esperar a próxima etapa.'
        : 'Liste o que ainda precisa acontecer para existir uma primeira versão completa e diferencie isso do que pode ser melhorado depois.'
    };
  } else if(stage==='VERSAO_INCOMPLETA'){
    stageBlock={
      title:'Primeira versão ainda incompleta',
      text:'Você já possui grande parte do material, mas ainda há lacunas que impedem considerar a primeira versão encerrada.',
      action:nf
        ? 'Faça uma lista objetiva dos capítulos, tópicos ou transições ausentes e priorize completar lacunas antes de iniciar uma revisão profunda do conjunto.'
        : 'Faça uma lista objetiva das partes ausentes e priorize completar lacunas antes de iniciar uma revisão profunda do conjunto.'
    };
  }

  const availability={
    title:availabilityTitle,
    text:availabilityText,
    action:availabilityAction
  };

  const motiveTexts={
    CONCLUSAO:'ter o manuscrito completamente concluído',
    CONSTANCIA:'finalmente construir constância',
    DESTRAVAMENTO:'sair do bloqueio e voltar a avançar',
    PROGRESSO:'perceber um avanço muito maior do que conseguiu até hoje',
    DIRECAO:nf?'ter o conteúdo organizado e saber claramente para onde está indo':'ter a história organizada e saber claramente para onde está indo'
  };
  const motive=motiveTexts[a.q15]||'avançar de forma consistente';

  let risks=0;
  if(capacity==='BAIXA') risks+=2;
  if(directionLevel==='BAIXA') risks+=1;
  if(execSeverity==='ALTA') risks+=1;
  if(continuityRisk==='ALTO') risks+=1;
  if(a.q16==='POUCO') risks+=2;
  if(longBreak) risks+=1;

  let viability='ALTA';
  let viabilityText='Sua configuração atual oferece boas condições para uma Jornada de 90 dias, desde que as ações sejam ajustadas ao seu perfil real.';

  if((capacity==='BAIXA' && a.q16==='POUCO') || risks>=5){
    viability='CONDICIONADA';
    viabilityText='Concluir uma primeira versão em 90 dias não deve ser tratado como provável com a configuração atual sem uma mudança específica de capacidade, continuidade ou compromisso. A Jornada precisará começar corrigindo essa condição.';
  }else if(risks>=2){
    viability='MODERADA';
    viabilityText='Há condições reais para avanço importante, mas alguns gargalos precisam ser administrados antes de tratar a conclusão completa como uma consequência automática.';
  }

  return {
    stageBlock,direction,availability,execution,continuity,viability,viabilityText,motive,
    meta:{
      nf,stage,directionLevel,capacity,execSeverity,continuityRisk,discovery,finalUnknown,weekly,
      routineUnstable,rewriteStrong,longBreak,days,mins,manuscriptWilling:a.q18||null
    }
  };
}
