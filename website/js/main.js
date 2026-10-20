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
  // 1. HEADER SCROLL & MOBILE DRAWER
  // ==========================================
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 2. SIMULADOR DE RESERVA AUTOMÁTICA
  // ==========================================
  const spaceModalitySelect = document.getElementById('spaceModality');
  const eventTypeSelect = document.getElementById('eventType');
  const eventDateInput = document.getElementById('eventDate');
  const eventPeriodSelect = document.getElementById('eventPeriod');
  const guestCountInput = document.getElementById('guestCount');
  const guestCountDisplay = document.getElementById('guestCountDisplay');
  const modalityLimitBadge = document.getElementById('modalityLimitBadge');
  const capacityWarning = document.getElementById('capacityWarning');
  const customOptionalNotes = document.getElementById('customOptionalNotes');
  const estimatedPriceEl = document.getElementById('estimatedPrice');
  const btnAutoBooking = document.getElementById('btnAutoBooking');
  const btnAirbnbBooking = document.getElementById('btnAirbnbBooking');
  const extraCheckboxes = document.querySelectorAll('.extras-grid input[type="checkbox"]');

  // Regras de Capacidade por Modalidade
  const MODALITY_LIMITS = {
    casaToda: { max: 160, label: 'até 160 pessoas em pé', multiplier: 1.15, url: CONFIG.airbnbUrls.casaToda, name: 'Casa Toda' },
    espacoPalco: { max: 100, label: 'até 100 pessoas em pé', multiplier: 0.85, url: CONFIG.airbnbUrls.espacoPalco, name: 'Espaço Palco (Térreo)' },
    salaoKaraoke: { max: 50, label: 'até 50 pessoas sentadas', multiplier: 0.75, url: CONFIG.airbnbUrls.salaoKaraoke, name: 'Salão Karaokê (Piso Superior)' }
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
    btnAirbnbBooking.querySelector('span').textContent = `Ver Anúncio: ${mod.name} no Airbnb`;
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

  function calculateSimulation() {
    if (!guestCountInput || !estimatedPriceEl) return;

    const mod = getCurrentModalityConfig();

    // Atualiza limites e badge
    if (modalityLimitBadge) {
      modalityLimitBadge.textContent = `(Capacidade máxima: ${mod.label} • 8 horas)`;
    }

    let guests = parseInt(guestCountInput.value, 10);
    guestCountDisplay.textContent = `${guests} convidados`;

    // Alerta de capacidade excedida
    if (guests > mod.max) {
      if (capacityWarning) {
        capacityWarning.textContent = `⚠️ Atenção: O ${mod.name} comporta no máximo ${mod.label}! Reduza os convidados ou selecione uma modalidade maior.`;
        capacityWarning.classList.add('visible');
      }
    } else {
      if (capacityWarning) {
        capacityWarning.classList.remove('visible');
      }
    }

    // Verifica se a data é sexta, sábado ou domingo
    let isWeekend = true;
    if (eventDateInput && eventDateInput.value) {
      const selectedDate = new Date(eventDateInput.value + 'T12:00:00');
      const dayOfWeek = selectedDate.getDay();
      isWeekend = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6); // Dom, Sex, Sáb
    }

    let base = (isWeekend ? CONFIG.basePriceWeekend : CONFIG.basePriceWeekday) * mod.multiplier;

    // Duração: 8 horas base + adicional de horas extras
    let extraHourCost = 0;
    if (eventPeriodSelect) {
      const periodOption = eventPeriodSelect.options[eventPeriodSelect.selectedIndex];
      if (periodOption) {
        extraHourCost = parseFloat(periodOption.getAttribute('data-extra') || '0');
      }
    }

    // Soma extras selecionados
    let extrasTotal = 0;
    extraCheckboxes.forEach(cb => {
      if (cb.checked) {
        extrasTotal += parseFloat(cb.getAttribute('data-price') || '0');
      }
    });

    const total = Math.round(base + extraHourCost + extrasTotal);
    estimatedPriceEl.textContent = total.toLocaleString('pt-BR');
    updateAirbnbLink();
    return total;
  }

  // Event Listeners para recálculo dinâmico
  if (spaceModalitySelect) {
    spaceModalitySelect.addEventListener('change', () => {
      const mod = getCurrentModalityConfig();
      if (guestCountInput) {
        guestCountInput.max = mod.max;
        if (parseInt(guestCountInput.value, 10) > mod.max) {
          guestCountInput.value = mod.max;
        }
      }
      calculateSimulation();
    });
  }
  if (guestCountInput) guestCountInput.addEventListener('input', calculateSimulation);
  if (eventTypeSelect) eventTypeSelect.addEventListener('change', calculateSimulation);
  if (eventDateInput) eventDateInput.addEventListener('change', calculateSimulation);
  if (eventPeriodSelect) eventPeriodSelect.addEventListener('change', calculateSimulation);
  extraCheckboxes.forEach(cb => cb.addEventListener('change', calculateSimulation));

  // Executa o cálculo inicial
  calculateSimulation();

  // Ação de Reserva Automática com envio formatado para WhatsApp
  if (btnAutoBooking) {
    btnAutoBooking.addEventListener('click', () => {
      const mod = getCurrentModalityConfig();
      const modality = mod.name;
      const eventType = eventTypeSelect ? eventTypeSelect.value : 'Festa';
      const eventDateRaw = eventDateInput ? eventDateInput.value : '';
      let formattedDate = 'A definir';
      if (eventDateRaw) {
        const parts = eventDateRaw.split('-');
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      const period = eventPeriodSelect ? eventPeriodSelect.value : '8 horas corridas (até às 02h)';
      const guests = guestCountInput ? guestCountInput.value : '50';

      const selectedExtras = [];
      extraCheckboxes.forEach(cb => {
        if (cb.checked) {
          selectedExtras.push(cb.value);
        }
      });
      const extrasText = selectedExtras.length > 0 ? selectedExtras.join('\n• ') : 'Apenas o espaço básico da modalidade (8h)';
      const notes = customOptionalNotes && customOptionalNotes.value.trim() ? customOptionalNotes.value.trim() : 'Nenhuma observação extra';
      const totalPrice = estimatedPriceEl ? estimatedPriceEl.textContent : 'Consulte';

      // Mensagem consultiva e vendedora para conversão imediata
      const message = `🎉 *SOLICITAÇÃO DE RESERVA — PIUSS*

Olá, equipe do Piuss! Simulei meu evento no site oficial e quero confirmar a disponibilidade desta data:

• *Modalidade Desejada:* ${modality} (8 horas corridas)
• *Tipo de Evento:* ${eventType}
• *Data Desejada:* ${formattedDate}
• *Duração & Horário:* ${period}
• *Qtd. de Convidados:* ${guests} pessoas
• *Itens Opcionais Inclusos:*
• ${extrasText}
• *Outros Pedidos do Cliente:* ${notes}

• *Estimativa Gerada:* R$ ${totalPrice}

Gostaria de verificar se esta data continua livre na agenda e tirar dúvidas para confirmarmos a reserva! 😊`;

      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();
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

      if (bookedDates.includes(dateStr)) {
        dayEl.classList.add('status-booked');
        dayEl.title = 'Data reservada via Airbnb';
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

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      updateVisiblePhotos();
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
