/**
 * PIUSS — Salão de Festas & Eventos
 * Interatividade, Simulador de Reserva Automática, Galeria & Calendário Airbnb
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // CONFIGURAÇÕES GERAIS DA MARCA PIUSS
  // ==========================================
  const CONFIG = {
    whatsappNumber: '5511921422403', // WhatsApp oficial: (11) 92142-2403
    airbnbUrls: {
      casaToda: 'https://www.airbnb.com.br/rooms/1597439801435361378?guests=1&adults=1&s=67&unique_share_id=e0e79d63-2d7c-4f73-b2c6-f8e935d0dec6',
      espacoPalco: 'https://www.airbnb.com.br/rooms/1618862847098039723?guests=1&adults=1&s=67&unique_share_id=6f9f4611-872f-46c4-8391-85737fd554a1',
      salaoKaraoke: 'https://www.airbnb.com.br/rooms/1652316286556122188?guests=1&adults=1&s=67&unique_share_id=91205b42-eb3b-4d89-a00f-32675e31c67e'
    },
    instagramUrl: 'https://www.instagram.com/seu.piuss/',
    mapsUrl: 'https://share.google/geKV5Cpukdi5pftjX',
    basePriceWeekday: 1500,
    basePriceWeekend: 1890,
    currentYear: 2026,
    currentMonth: 9 // 0-indexed: 9 = Outubro
  };

  // Toast notification helper (iframe safe, avoids window.alert)
  function showNotification(message) {
    let toast = document.getElementById('piuss-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'piuss-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '85px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.backgroundColor = '#17181d';
      toast.style.color = '#fff';
      toast.style.padding = '14px 22px';
      toast.style.borderRadius = '12px';
      toast.style.boxShadow = '0 12px 30px rgba(0,0,0,0.6)';
      toast.style.border = '1px solid rgba(224, 90, 43, 0.4)';
      toast.style.zIndex = '999999';
      toast.style.fontSize = '14px';
      toast.style.fontWeight = '500';
      toast.style.textAlign = 'center';
      toast.style.maxWidth = '90vw';
      toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 4000);
  }

  // ==========================================
  // 1. HEADER SCROLL, BOTÕES DE ROLAGEM & MOBILE DRAWER
  // ==========================================
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navButtons = document.querySelectorAll('.nav-btn');
  const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn, .mobile-nav-link');

  // Sticky Header Blur & Shadow on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Drawer Toggle & Fechamento Suave
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileSectionIndicator = document.getElementById('mobileSectionIndicator');
  const mobileIndicatorText = document.getElementById('mobileIndicatorText');
  const mobileIndicatorIcon = document.getElementById('mobileIndicatorIcon');
  const mobileIndicatorStep = document.getElementById('mobileIndicatorStep');

  const spySections = [
    { id: 'espaco', target: 'espaco', title: '1. O Espaço', icon: '✨', step: '1/8' },
    { id: 'estrutura', target: 'estrutura', title: '2. Estrutura', icon: '🎸', step: '2/8' },
    { id: 'modalidades', target: 'modalidades', title: '3. Modalidades', icon: '🏢', step: '3/8' },
    { id: 'galeria', target: 'galeria', title: '4. Galeria de Fotos', icon: '📸', step: '4/8' },
    { id: 'calendario', target: 'calendario', title: '5. Calendário Airbnb', icon: '📅', step: '5/8' },
    { id: 'simulador', target: 'simulador', title: '6. Simular Reserva', icon: '⚡', step: '6/8' },
    { id: 'contato', target: 'contato', title: '7. Contatos', icon: '📞', step: '7/8' },
    { id: 'faq', target: 'faq', title: '8. Perguntas Frequentes', icon: '❓', step: '8/8' }
  ];

  function closeMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (mobileToggle) {
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (mobileToggle) {
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', closeMobileDrawer);
    }

    // Fechar ao clicar fora do drawer
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileDrawer();
      }
    });
  }

  // Ao clicar no indicador flutuante no mobile, abre o menu de seções
  if (mobileSectionIndicator) {
    mobileSectionIndicator.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  // Smooth scroll handler com compensação exata e independente do estado do menu
  function smoothScrollToSection(targetSelector) {
    const targetEl = document.querySelector(targetSelector);
    if (!targetEl) return;
    const headerHeight = 74; // Altura fixa garantida do cabeçalho
    const elementTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementTop - headerHeight;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth'
    });
  }

  // Interceptar cliques em botões de navegação para rolagem fluida e efeito sutil de slide/fade no mobile
  document.querySelectorAll('.nav-btn, .mobile-nav-btn, a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          const isMobileNav = link.classList.contains('mobile-nav-btn') || window.innerWidth <= 900;
          closeMobileDrawer();
          
          const targetId = href.replace('#', '');
          
          setTimeout(() => {
            smoothScrollToSection(href);
            
            // Aplica efeito sutil de slide & fade na seção de destino no mobile
            if (isMobileNav) {
              // Remove de todas para garantir que apenas o destino anime
              document.querySelectorAll('.section-nav-transition').forEach(el => el.classList.remove('section-nav-transition'));
              void targetEl.offsetWidth; // Força reflow para reiniciar animação
              targetEl.classList.add('section-nav-transition');
              setTimeout(() => {
                targetEl.classList.remove('section-nav-transition');
              }, 1200);
            }
          }, 40);
          
          updateActiveSectionUI(targetId);
        }
      }
    });
  });

  // ==========================================
  // INTERSECTION OBSERVER & SECTION SPY
  // ==========================================
  let activeSectionId = '';
  let indicatorAnimationTimeout = null;

  function updateActiveSectionUI(currentSectionId) {
    if (!currentSectionId || currentSectionId === activeSectionId) return;
    activeSectionId = currentSectionId;

    const secMeta = spySections.find(s => s.id === currentSectionId) || {
      id: currentSectionId,
      title: currentSectionId,
      icon: '📍',
      step: ''
    };

    // 1. Atualiza botões da barra desktop
    navButtons.forEach(btn => {
      if (btn.getAttribute('data-target') === currentSectionId) {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
      }
    });

    // 2. Atualiza botões no drawer mobile
    document.querySelectorAll('.mobile-nav-btn').forEach(mBtn => {
      if (mBtn.getAttribute('data-target') === currentSectionId) {
        mBtn.classList.add('active');
        mBtn.setAttribute('aria-current', 'page');
      } else {
        mBtn.classList.remove('active');
        mBtn.removeAttribute('aria-current');
      }
    });

    // 3. Atualiza destaque visual na seção ativa do documento
    spySections.forEach(s => {
      const sEl = document.getElementById(s.id);
      if (sEl) {
        if (s.id === currentSectionId) {
          sEl.classList.add('section-active');
        } else {
          sEl.classList.remove('section-active');
        }
      }
    });

    // 4. Atualiza o indicador flutuante no mobile (#mobileSectionIndicator)
    if (mobileSectionIndicator) {
      if (mobileIndicatorText) {
        mobileIndicatorText.textContent = secMeta.title;
      }
      if (mobileIndicatorIcon && secMeta.icon) {
        mobileIndicatorIcon.textContent = secMeta.icon;
      }
      if (mobileIndicatorStep && secMeta.step) {
        mobileIndicatorStep.textContent = secMeta.step;
      }

      // Reinicia a animação de feedback visual no mobile
      mobileSectionIndicator.classList.remove('section-changed');
      // Forçar reflow para reiniciar animação CSS suavemente
      void mobileSectionIndicator.offsetWidth;
      mobileSectionIndicator.classList.add('section-changed');

      if (indicatorAnimationTimeout) clearTimeout(indicatorAnimationTimeout);
      indicatorAnimationTimeout = setTimeout(() => {
        mobileSectionIndicator.classList.remove('section-changed');
      }, 1400);
    }
  }

  // IntersectionObserver para atualizar #mobileSectionIndicator dinamicamente conforme rolagem
  if ('IntersectionObserver' in window) {
    const visibleSectionRatios = new Map();

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleSectionRatios.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSectionRatios.delete(entry.target.id);
        }
      });

      // Se o usuário rolou para o topo da página, define a 1ª seção (Espaço)
      if (window.scrollY < 120) {
        updateActiveSectionUI('espaco');
        return;
      }

      // Escolhe a seção que tem a maior presença na área de leitura
      if (visibleSectionRatios.size > 0) {
        let maxRatio = -1;
        let bestSectionId = '';
        visibleSectionRatios.forEach((ratio, secId) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            bestSectionId = secId;
          }
        });
        if (bestSectionId) {
          updateActiveSectionUI(bestSectionId);
        }
      }
    }, {
      root: null,
      rootMargin: '-74px 0px -35% 0px',
      threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.7, 0.85]
    });

    spySections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el) {
        sectionObserver.observe(el);
      }
    });
  }

  // Scroll listener complementar para garantir precisão no topo e fim da página
  window.addEventListener('scroll', () => {
    if (window.scrollY < 100) {
      updateActiveSectionUI('espaco');
    }
  }, { passive: true });

  // ==========================================
  // 2. SIMULADOR DE RESERVA AUTOMÁTICA
  // ==========================================
  const spaceModalitySelect = document.getElementById('spaceModality');
  const eventTypeSelect = document.getElementById('eventType');
  const eventDateInput = document.getElementById('eventDate');
  const eventStartTimeSelect = document.getElementById('eventStartTime');
  const eventEndTimeSelect = document.getElementById('eventEndTime');
  const durationInfoBadge = document.getElementById('durationInfoBadge');
  const feeBreakdownCard = document.getElementById('feeBreakdownCard');
  const guestCountInput = document.getElementById('guestCount');
  const guestCountDisplay = document.getElementById('guestCountDisplay');
  const modalityLimitBadge = document.getElementById('modalityLimitBadge');
  const capacityWarning = document.getElementById('capacityWarning');
  const customOptionalNotes = document.getElementById('customOptionalNotes');
  const estimatedPriceEl = document.getElementById('estimatedPrice');
  const estimatedPricePeriod = document.getElementById('estimatedPricePeriod');
  const btnAutoBooking = document.getElementById('btnAutoBooking');
  const btnAirbnbBooking = document.getElementById('btnAirbnbBooking');
  const extraCheckboxes = document.querySelectorAll('.extras-grid input[type="checkbox"]');

  // Regras de Capacidade e Pacote Base por Modalidade
  // - Principal (Casa Toda) e Palco: Pacote de 8 horas
  // - Karaokê: Pacote de 6 horas
  // Regras de Capacidade e Pacote Base por Modalidade (8h padrão de pacote base)
  const MODALITY_LIMITS = {
    casaToda: { max: 160, label: 'até 160 pessoas em pé', multiplier: 1.15, url: CONFIG.airbnbUrls.casaToda, name: 'Casa Toda (Térreo + Superior)', packageHours: 8 },
    espacoPalco: { max: 100, label: 'até 100 pessoas em pé', multiplier: 0.85, url: CONFIG.airbnbUrls.espacoPalco, name: 'Espaço Palco (Térreo)', packageHours: 8 },
    salaoKaraoke: { max: 50, label: 'até 50 pessoas sentadas', multiplier: 0.75, url: CONFIG.airbnbUrls.salaoKaraoke, name: 'Salão Karaokê (Piso Superior)', packageHours: 8 }
  };

  function getCurrentModalityConfig() {
    if (!spaceModalitySelect) return MODALITY_LIMITS.casaToda;
    const val = spaceModalitySelect.value;
    if (val.includes('Palco')) return MODALITY_LIMITS.espacoPalco;
    if (val.includes('Karaokê')) return MODALITY_LIMITS.salaoKaraoke;
    return MODALITY_LIMITS.casaToda;
  }

  // Atualiza o link do Airbnb conforme a modalidade selecionada
  function updateAirbnbLink() {
    if (!btnAirbnbBooking) return;
    const mod = getCurrentModalityConfig();
    btnAirbnbBooking.href = mod.url;
    btnAirbnbBooking.setAttribute('title', `Ver anúncio oficial da modalidade ${mod.name} no Airbnb`);
    const span = btnAirbnbBooking.querySelector('span');
    if (span) {
      span.textContent = 'Ver Anúncio no Airbnb';
    }
  }

  // Define data mínima como amanhã
  if (eventDateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    eventDateInput.min = `${yyyy}-${mm}-${dd}`;
    eventDateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    return parts[0] * 60 + (parts[1] || 0);
  }

  // Calcula duração e horas adicionais automaticamente
  // Regra 1: Duração superior às 8h base do pacote
  // Regra 2: Encerramento da casa após 02h conta horas adicionais
  function getEventTimingDetails(startTimeStr, endTimeStr, basePackageHours = 8) {
    const startMins = parseTimeToMinutes(startTimeStr || '18:00');
    let endMins = parseTimeToMinutes(endTimeStr || '02:00');

    // Se o término for menor ou igual ao início, o evento cruza a meia-noite (madrugada)
    if (endMins <= startMins) {
      endMins += 24 * 60;
    }

    const durationMins = endMins - startMins;
    const durationHours = Math.round((durationMins / 60) * 10) / 10;

    // Horas que ultrapassam as 8h base
    const extraHoursFromDuration = Math.max(0, Math.ceil(durationHours - basePackageHours));

    // Regra do encerramento da casa às 02h (26h ou 1560 minutos)
    let curfewExtraHours = 0;
    const curfewMins = 26 * 60; // 02:00 da madrugada
    if (endMins >= curfewMins) {
      curfewExtraHours = Math.ceil((endMins - curfewMins) / 60) + 1;
    }

    // Total de horas adicionais necessárias
    const totalExtraHours = Math.max(extraHoursFromDuration, curfewExtraHours);

    return {
      durationHours,
      extraHoursFromDuration,
      curfewExtraHours,
      totalExtraHours
    };
  }

  function calculateSimulation() {
    if (!estimatedPriceEl) return;

    const mod = getCurrentModalityConfig();
    const startTimeStr = eventStartTimeSelect ? eventStartTimeSelect.value : '18:00';
    const endTimeStr = eventEndTimeSelect ? eventEndTimeSelect.value : '02:00';

    const timing = getEventTimingDetails(startTimeStr, endTimeStr, mod.packageHours);
    const { durationHours, totalExtraHours, curfewExtraHours } = timing;
    const extraHourRate = 200;
    const extraHourCost = totalExtraHours * extraHourRate;

    // Atualiza limites e badge de capacidade se existirem
    if (modalityLimitBadge) {
      modalityLimitBadge.textContent = `(Capacidade máxima: ${mod.label})`;
    }

    // Badge com recálculo automático de duração e ALERTA VISUAL EM VERMELHO se exceder 8h base
    if (durationInfoBadge) {
      const hasExtra = totalExtraHours > 0 || durationHours > 8;
      const isUnderPackage = durationHours < 8;
      const remainingHours = 8 - durationHours;

      if (hasExtra) {
        durationInfoBadge.classList.add('has-extra');
        durationInfoBadge.classList.remove('has-remaining');
      } else if (isUnderPackage) {
        durationInfoBadge.classList.add('has-remaining');
        durationInfoBadge.classList.remove('has-extra');
      } else {
        durationInfoBadge.classList.remove('has-extra', 'has-remaining');
      }

      if (hasExtra) {
        durationInfoBadge.innerHTML = `
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span>⏱️ Tempo Total Calculado: <strong>${durationHours} horas</strong> (${startTimeStr} às ${endTimeStr})</span>
            <span class="badge-duration-danger">⚠️ +${totalExtraHours}h adicionais</span>
          </div>
          <div class="duration-alert-red">
            🚨 Horário de ${durationHours}h ultrapassa as <strong>8 horas do pacote base</strong> (+${totalExtraHours}h adicionais). Sugerimos contratar hora(s) extra(s) a R$ 200/h ou ajustar o horário para 8h para usufruir do pacote base sem custos extras.
          </div>
        `;
      } else if (isUnderPackage) {
        durationInfoBadge.innerHTML = `
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span>⏱️ Tempo Total Calculado: <strong>${durationHours} horas</strong> (${startTimeStr} às ${endTimeStr})</span>
            <span class="badge-duration-remaining">💡 Restam ${remainingHours}h no pacote base</span>
          </div>
          <div class="duration-alert-blue">
            Você selecionou ${durationHours}h. Ainda tem <strong>${remainingHours} hora(s) sobrando</strong> no seu pacote base de 8h sem nenhum custo adicional!
          </div>
        `;
      } else {
        durationInfoBadge.innerHTML = `
          <div class="flex items-center justify-between flex-wrap gap-2">
            <span>⏱️ Tempo Total Calculado: <strong>8 horas</strong> (${startTimeStr} às ${endTimeStr})</span>
            <span class="text-emerald-400 font-semibold">✓ 8h inclusas (pacote base)</span>
          </div>
          <div class="duration-alert-green">
            ✓ Duração exata de 8 horas: tempo padrão ideal incluso no seu pacote base.
          </div>
        `;
      }
    }

    // Verifica se a data é sexta, sábado ou domingo
    let isWeekend = true;
    if (eventDateInput && eventDateInput.value) {
      const selectedDate = new Date(eventDateInput.value + 'T12:00:00');
      const dayOfWeek = selectedDate.getDay();
      isWeekend = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6); // Dom, Sex, Sáb
    }

    const baseUnitRate = isWeekend ? CONFIG.basePriceWeekend : CONFIG.basePriceWeekday;
    const base = Math.round(baseUnitRate * mod.multiplier);

    // Soma extras selecionados com a regra de combo Buffet + Bebidas
    let extrasTotal = 0;
    const fees = [];

    // 1. Pacote Base da Modalidade
    fees.push({
      name: `Pacote Base: ${mod.name}`,
      detail: `Fórmula: ${baseUnitRate.toLocaleString('pt-BR')} (${isWeekend ? 'Fim de Semana: Sex/Sáb/Dom' : 'Dia de Semana: Seg a Qui'}) × multiplicador ${mod.multiplier} • ${mod.packageHours}h inclusas`,
      badge: `${mod.packageHours}h inclusas`,
      badgeClass: '',
      value: base,
      displayValue: `R$ ${base.toLocaleString('pt-BR')}`,
      isExtra: false
    });

    // 2. Horas Adicionais Calculadas (se houver)
    if (totalExtraHours > 0) {
      let extraReason = '';
      if (curfewExtraHours > 0) {
        extraReason = `Encerramento às ${endTimeStr} (Casa encerra às 02h) • ${totalExtraHours}h adicionais`;
      } else {
        extraReason = `Duração de ${durationHours}h excede pacote de ${mod.packageHours}h • ${totalExtraHours}h adicionais`;
      }

      fees.push({
        name: `Horas Adicionais (${totalExtraHours}h extras)`,
        detail: `Fórmula: ${totalExtraHours} hora(s) adicional(is) × R$ 200/h (${extraReason})`,
        badge: `+${totalExtraHours}h adicionais`,
        badgeClass: 'badge-extra badge-danger',
        value: extraHourCost,
        displayValue: `+ R$ ${extraHourCost.toLocaleString('pt-BR')}`,
        isExtra: true
      });
    }

    // 3. Checagem dos checkboxes opcionais
    const churrascoCb = document.getElementById('extraChurrasco');
    const buffetCb = document.getElementById('extraBuffet');
    const bebidasCb = document.getElementById('extraBebidas');
    const bandaCb = document.getElementById('extraBanda');
    const djCb = document.getElementById('extraDJ');

    const hasChurrasco = churrascoCb && churrascoCb.checked;
    const hasBuffet = buffetCb && buffetCb.checked;
    const hasBebidas = bebidasCb && bebidasCb.checked;
    const hasBanda = bandaCb && bandaCb.checked;
    const hasDJ = djCb && djCb.checked;

    if (hasChurrasco) {
      fees.push({
        name: 'Churrasqueira & Fogão',
        detail: 'Estrutura completa pronta para uso mediante pré-agendamento (Cortesia)',
        badge: 'Cortesia (R$ 0)',
        badgeClass: 'badge-free',
        value: 0,
        displayValue: 'R$ 0 (Cortesia)',
        isExtra: false
      });
    }

    // Regra da Taxa de Limpeza Pesada (Buffet e Bebidas)
    // Caso seja selecionada buffet externo e bebidas de fora a cobrança será única, devendo destacar o desconto em uma delas no somatório total.
    if (hasBuffet && hasBebidas) {
      // Buffet cobra R$ 350
      extrasTotal += 350;
      fees.push({
        name: 'Taxa de Limpeza Pesada — Buffet Externo',
        detail: 'Higienização integral e descarte de resíduos de buffet no pós-evento',
        badge: '+ R$ 350',
        badgeClass: '',
        value: 350,
        displayValue: 'R$ 350',
        isExtra: false
      });

      // Bebidas recebe o desconto combo de R$ 350 (cobrança única)
      fees.push({
        name: 'Bebidas Alcoólicas de Fora',
        detail: 'Cobrança única de taxa de limpeza pesada aplicada com o Buffet Externo',
        badge: 'Desconto Combo: -R$ 350',
        badgeClass: 'badge-free badge-discount',
        value: 0,
        displayValue: 'R$ 0 (-R$ 350 Desconto)',
        isExtra: false,
        isDiscount: true
      });
    } else {
      if (hasBuffet) {
        extrasTotal += 350;
        fees.push({
          name: 'Taxa de Limpeza Pesada — Buffet Externo',
          detail: 'Higienização integral e descarte de resíduos de buffet no pós-evento (R$ 350)',
          badge: '+ R$ 350',
          badgeClass: '',
          value: 350,
          displayValue: 'R$ 350',
          isExtra: false
        });
      }
      if (hasBebidas) {
        extrasTotal += 350;
        fees.push({
          name: 'Taxa de Limpeza Pesada — Bebidas Alcoólicas de Fora',
          detail: 'Higienização e recolhimento de garrafas/embalagens trazidas de fora (R$ 350)',
          badge: '+ R$ 350',
          badgeClass: '',
          value: 350,
          displayValue: 'R$ 350',
          isExtra: false
        });
      }
    }

    if (hasBanda) {
      extrasTotal += 300;
      fees.push({
        name: 'Serviço Especializado de Técnico de Som (Banda ao Vivo)',
        detail: 'Operação profissional de som de palco, retorno, microfones e iluminação cênica (R$ 300)',
        badge: '+ R$ 300',
        badgeClass: '',
        value: 300,
        displayValue: 'R$ 300',
        isExtra: false
      });
    }

    if (hasDJ) {
      // Altere o check box hora adicional para o cliente informar se terá DJ, nesse caso não informe que não tem cobrança.
      fees.push({
        name: 'DJ no Evento',
        detail: 'Atração musical com DJ contratado pelo cliente para animar a festa',
        badge: 'Confirmado',
        badgeClass: 'badge-dj',
        value: 0,
        displayValue: 'Confirmado',
        isExtra: false
      });
    }

    const total = Math.round(base + extraHourCost + extrasTotal);
    estimatedPriceEl.textContent = total.toLocaleString('pt-BR');
    if (estimatedPricePeriod) {
      estimatedPricePeriod.textContent = `/ total da reserva (${durationHours}h de evento)`;
    }

    // Renderiza o somatório detalhado das taxas de forma limpa, consolidada e sem redundâncias
    if (feeBreakdownCard) {
      const feesHtml = fees.map(f => `
        <div class="fee-row ${f.isExtra ? 'fee-row-extra' : ''} ${f.isDiscount ? 'fee-row-discount' : ''}">
          <div class="fee-row-left">
            <div class="fee-row-title-line">
              <span class="fee-row-name">${f.name}</span>
              <span class="fee-row-badge ${f.badgeClass}">${f.badge}</span>
            </div>
            <span class="fee-row-detail">${f.detail}</span>
          </div>
          <span class="fee-row-value">${f.displayValue}</span>
        </div>
      `).join('');

      feeBreakdownCard.innerHTML = feesHtml;
    }

    updateAirbnbLink();
    return total;
  }

  // Event Listeners para recálculo dinâmico
  if (spaceModalitySelect) {
    spaceModalitySelect.addEventListener('change', calculateSimulation);
  }
  if (eventTypeSelect) eventTypeSelect.addEventListener('change', calculateSimulation);
  if (eventDateInput) eventDateInput.addEventListener('change', calculateSimulation);
  if (eventStartTimeSelect) eventStartTimeSelect.addEventListener('change', calculateSimulation);
  if (eventEndTimeSelect) eventEndTimeSelect.addEventListener('change', calculateSimulation);
  extraCheckboxes.forEach(cb => cb.addEventListener('change', calculateSimulation));

  // Executa o cálculo inicial
  calculateSimulation();

  // Ação de Reserva Automática com envio formatado para WhatsApp e confirmação visual
  if (btnAutoBooking) {
    btnAutoBooking.addEventListener('click', () => {
      // Evita duplo envio se já estiver em processamento
      if (btnAutoBooking.classList.contains('is-sending') || btnAutoBooking.classList.contains('is-confirmed')) {
        return;
      }

      const mod = getCurrentModalityConfig();
      const modality = mod.name;
      const eventType = eventTypeSelect ? eventTypeSelect.value : 'Festa';
      const eventDateRaw = eventDateInput ? eventDateInput.value : '';
      let formattedDate = 'A definir';
      if (eventDateRaw) {
        const parts = eventDateRaw.split('-');
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      const startTimeStr = eventStartTimeSelect ? eventStartTimeSelect.value : '18:00';
      const endTimeStr = eventEndTimeSelect ? eventEndTimeSelect.value : '02:00';
      const timing = getEventTimingDetails(startTimeStr, endTimeStr, mod.packageHours);
      const { durationHours, totalExtraHours } = timing;
      const extraHourCost = totalExtraHours * 200;

      const churrascoCb = document.getElementById('extraChurrasco');
      const buffetCb = document.getElementById('extraBuffet');
      const bebidasCb = document.getElementById('extraBebidas');
      const bandaCb = document.getElementById('extraBanda');
      const djCb = document.getElementById('extraDJ');

      const hasChurrasco = churrascoCb && churrascoCb.checked;
      const hasBuffet = buffetCb && buffetCb.checked;
      const hasBebidas = bebidasCb && bebidasCb.checked;
      const hasBanda = bandaCb && bandaCb.checked;
      const hasDJ = djCb && djCb.checked;

      const selectedExtras = [];
      if (hasChurrasco) {
        selectedExtras.push('Churrasqueira & Fogão: Sim, pré-agendamento da estrutura (Cortesia)');
      }
      if (hasBuffet && hasBebidas) {
        selectedExtras.push('Buffet Externo: Sim (Taxa de limpeza pesada: R$ 350)');
        selectedExtras.push('Bebidas Alcoólicas de Fora: Sim (Cobrança única de limpeza pesada com Buffet — Desconto combo de -R$ 350 aplicado: R$ 0)');
      } else {
        if (hasBuffet) {
          selectedExtras.push('Buffet Externo: Sim (Taxa de limpeza pesada: R$ 350)');
        }
        if (hasBebidas) {
          selectedExtras.push('Bebidas Alcoólicas de Fora: Sim (Taxa de limpeza pesada: R$ 350)');
        }
      }
      if (hasBanda) {
        selectedExtras.push('Banda ao Vivo: Sim (Serviço especializado de técnico de som: R$ 300)');
      }
      if (hasDJ) {
        selectedExtras.push('DJ no Evento: Sim, teremos DJ');
      }

      const extrasText = selectedExtras.length > 0 ? selectedExtras.map(item => `  • ${item}`).join('\n') : '  • Nenhum item opcional selecionado';
      const notes = customOptionalNotes && customOptionalNotes.value.trim() ? customOptionalNotes.value.trim() : 'Nenhuma observação extra';
      const totalPrice = estimatedPriceEl ? estimatedPriceEl.textContent : 'Consulte';

      // Mensagem direta sem pedidos de desconto, com confirmação de reserva imediata e detalhamento completo
      const message = `🎉 *SOLICITAÇÃO DE RESERVA IMEDIATA — PIUSS*

Olá, equipe do Piuss! Simulei todas as opções do meu evento no site oficial e quero confirmar de imediato a reserva desta data com vocês:

📋 *DETALHES COMPLETOS DO MEU ORÇAMENTO:*
• *Modalidade Selecionada:* ${modality}
• *Tipo de Evento:* ${eventType}
• *Data Solicitada:* ${formattedDate}
• *Horário:* Das ${startTimeStr} às ${endTimeStr} (${durationHours} horas de duração total)
• *Regras do Pacote e Horas:*
  - Pacote Base: ${mod.packageHours} horas inclusas
  - Horas Adicionais: ${totalExtraHours > 0 ? `${totalExtraHours}h extras (+ R$ ${extraHourCost.toLocaleString('pt-BR')})` : 'Nenhuma hora extra (dentro do pacote base)'}
  - Horário Limite de Encerramento Padrão: 02h da madrugada

✨ *ITENS OPCIONAIS & SERVIÇOS:*
${extrasText}

✍️ *OBSERVAÇÕES E PEDIDOS ESPECIAIS:*
${notes}

💰 *TOTAL CONSOLIDADO DO ORÇAMENTO:* R$ ${totalPrice}

Gostaria de verificar a disponibilidade e os próximos passos para confirmarmos e garantirmos a data! Aguardo retorno. 🤝`;

      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;

      // Feedback Visual Imediato no Botão: Barra de Progresso + Alteração de Cor
      const bookingContent = document.getElementById('btnBookingContent');
      const progressBar = document.getElementById('btnBookingProgress');

      btnAutoBooking.classList.remove('pulse-btn');
      btnAutoBooking.classList.add('is-sending');
      if (bookingContent) {
        bookingContent.innerHTML = `
          <span class="btn-spinner"></span>
          <span>Preparando orçamento para o WhatsApp...</span>
        `;
      }
      if (progressBar) {
        progressBar.style.width = '70%';
      }

      // Etapa 2: Confirmação visual em verde esmeralda vibrante e conclusão do progresso
      setTimeout(() => {
        btnAutoBooking.classList.remove('is-sending');
        btnAutoBooking.classList.add('is-confirmed');
        if (progressBar) {
          progressBar.style.width = '100%';
        }
        if (bookingContent) {
          bookingContent.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>✓ Orçamento Pronto! Abrindo WhatsApp...</span>
          `;
        }

        // Abre o link do WhatsApp
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Etapa 3: Restaura suavemente o estado padrão do botão após 3.5 segundos
        setTimeout(() => {
          btnAutoBooking.classList.remove('is-confirmed', 'is-sending');
          btnAutoBooking.classList.add('pulse-btn');
          if (progressBar) {
            progressBar.style.width = '0%';
          }
          if (bookingContent) {
            bookingContent.innerHTML = `
              <svg class="icon icon-whatsapp" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.02.571 1.813.784 2.806.784h.003c3.18 0 5.767-2.587 5.768-5.766.001-3.181-2.586-5.767-5.771-5.771zm7.42 5.766c-.001 4.093-3.332 7.424-7.423 7.424-1.255 0-2.484-.319-3.564-.925l-4.717 1.238 1.26-4.593c-.696-1.144-1.064-2.464-1.064-3.815.001-4.093 3.332-7.425 7.424-7.425 4.091 0 7.422 3.332 7.424 7.425z"/></svg>
              <span class="btn-label-text">Reservar de Imediato via WhatsApp</span>
            `;
          }
        }, 3500);

      }, 450);
    });
  }

  // ==========================================
  // 3. CALENDÁRIO INTEGRADO AO AIRBNB
  // ==========================================
  const currentMonthLabel = document.getElementById('currentMonthLabel');
  const daysGrid = document.getElementById('daysGrid');
  const calPrevBtn = document.getElementById('calPrevMonth');
  const calNextBtn = document.getElementById('calNextMonth');
  const btnSelectFromCalendar = document.getElementById('btnSelectFromCalendar');

  let calendarYear = 2026;
  let calendarMonth = 9; // Outubro (0 = Jan, 9 = Out)
  let selectedDateStr = null;

  // Base de reservas sincronizadas (simuladas a partir do histórico real do Airbnb)
  const bookedDates = [
    '2026-10-23', '2026-10-24', '2026-10-31',
    '2026-11-07', '2026-11-14', '2026-11-20', '2026-11-21',
    '2026-12-11', '2026-12-12', '2026-12-17', '2026-12-18', '2026-12-19'
  ];

  const highDemandDates = [
    '2026-10-30', '2026-11-06', '2026-11-13', '2026-11-27', '2026-11-28',
    '2026-12-04', '2026-12-05'
  ];

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Feriados Nacionais Brasileiros (Fixos e Móveis para 2026/2027)
  const BRAZIL_HOLIDAYS_FIXED = {
    '01-01': 'Confraternização Universal (Ano Novo)',
    '04-21': 'Tiradentes',
    '05-01': 'Dia do Trabalho',
    '09-07': 'Independência do Brasil',
    '10-12': 'Nossa Senhora Aparecida',
    '11-02': 'Finados',
    '11-15': 'Proclamação da República',
    '11-20': 'Dia da Consciência Negra',
    '12-25': 'Natal'
  };

  const BRAZIL_HOLIDAYS_MOVABLE = {
    '2026-02-16': 'Carnaval',
    '2026-02-17': 'Carnaval',
    '2026-04-03': 'Sexta-feira Santa',
    '2026-06-04': 'Corpus Christi',
    '2027-02-08': 'Carnaval',
    '2027-02-09': 'Carnaval',
    '2027-03-26': 'Sexta-feira Santa',
    '2027-05-27': 'Corpus Christi'
  };

  function getHolidayName(dateStr) {
    if (BRAZIL_HOLIDAYS_MOVABLE[dateStr]) return BRAZIL_HOLIDAYS_MOVABLE[dateStr];
    const mmDd = dateStr.slice(5); // 'MM-DD'
    return BRAZIL_HOLIDAYS_FIXED[mmDd] || null;
  }

  function renderCalendar() {
    if (!daysGrid || !currentMonthLabel) return;

    currentMonthLabel.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;
    daysGrid.innerHTML = '';

    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    // Células vazias do início do mês
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-day empty';
      daysGrid.appendChild(emptyCell);
    }

    // Dias do mês
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement('div');
      const formattedMonth = String(calendarMonth + 1).padStart(2, '0');
      const formattedDay = String(d).padStart(2, '0');
      const dateStr = `${calendarYear}-${formattedMonth}-${formattedDay}`;

      dayEl.className = 'cal-day';
      dayEl.textContent = d;
      dayEl.setAttribute('data-date', dateStr);

      const dayDate = new Date(calendarYear, calendarMonth, d);
      const dayOfWeek = dayDate.getDay(); // 0 = Domingo, 6 = Sábado
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
      const holidayName = getHolidayName(dateStr);
      const isWeekendOrHoliday = isWeekend || !!holidayName;

      if (bookedDates.includes(dateStr)) {
        dayEl.classList.add('status-booked');
        dayEl.title = 'Data reservada via Airbnb';
      } else if (isWeekendOrHoliday) {
        dayEl.classList.add('status-weekend-holiday');
        if (holidayName) {
          dayEl.classList.add('is-holiday');
          dayEl.title = `🇧🇷 Feriado Nacional: ${holidayName} (Alta Demanda)`;
        } else {
          dayEl.title = `Fim de Semana (${dayOfWeek === 6 ? 'Sábado' : 'Domingo'}) • Alta Demanda`;
        }
      } else if (highDemandDates.includes(dateStr)) {
        dayEl.classList.add('status-high-demand');
        dayEl.title = 'Data com alta procura (quase esgotada)';
      } else {
        dayEl.classList.add('status-available');
        dayEl.title = 'Disponível para reserva imediata';
      }

      if (selectedDateStr === dateStr) {
        dayEl.classList.add('selected');
      }

      // Evento de clique para seleção de data
      dayEl.addEventListener('click', () => {
        if (dayEl.classList.contains('status-booked')) {
          showNotification('Esta data já se encontra reservada na agenda oficial do Airbnb. Por favor, escolha uma data disponível marcada em verde ou laranja!');
          return;
        }

        document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('selected'));
        dayEl.classList.add('selected');
        selectedDateStr = dateStr;

        // Atualiza o formulário de simulação
        if (eventDateInput) {
          eventDateInput.value = dateStr;
          calculateSimulation();
        }
      });

      daysGrid.appendChild(dayEl);
    }
  }

  if (calPrevBtn && calNextBtn) {
    calPrevBtn.addEventListener('click', () => {
      calendarMonth--;
      if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear--;
      }
      renderCalendar();
    });

    calNextBtn.addEventListener('click', () => {
      calendarMonth++;
      if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear++;
      }
      renderCalendar();
    });
  }

  if (btnSelectFromCalendar) {
    btnSelectFromCalendar.addEventListener('click', () => {
      if (!selectedDateStr) {
        showNotification('Por favor, clique em uma data disponível no calendário acima para selecioná-la.');
        return;
      }
      // Rola suavemente até o simulador com a data marcada
      const simSection = document.getElementById('simulador');
      if (simSection) {
        simSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  renderCalendar();

  // ==========================================
  // 4. GALERIA DE FOTOS INTERATIVA & LIGHTBOX
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentPhotoIndex = 0;
  const visiblePhotos = [];

  function updateVisiblePhotos() {
    visiblePhotos.length = 0;
    galleryItems.forEach(item => {
      if (item.style.display !== 'none') {
        visiblePhotos.push(item);
      }
    });
  }

  function filterGalleryByCategory(category) {
    galleryItems.forEach(item => {
      const itemCat = item.getAttribute('data-category');
      if (category === 'all' || itemCat === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
    updateVisiblePhotos();
  }

  // Filtragem pelos Botões de Ambientes
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');
      filterGalleryByCategory(category);
    });
  });

  updateVisiblePhotos();

  function openLightbox(index) {
    if (!visiblePhotos[index]) return;
    currentPhotoIndex = index;
    const item = visiblePhotos[index];
    const src = item.getAttribute('data-src');
    const caption = item.getAttribute('data-caption');

    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % visiblePhotos.length;
    openLightbox(currentPhotoIndex);
  }

  function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
    openLightbox(currentPhotoIndex);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = visiblePhotos.indexOf(item);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextPhoto);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevPhoto);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Teclado para acessibilidade na galeria
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextPhoto();
    if (e.key === 'ArrowLeft') showPrevPhoto();
  });

  // ==========================================
  // 5. FAQ ACCORDION
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Fecha todos os outros itens
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

});
