import "./style.css";

const faDigits = (value) => String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
const enDigits = (value) => String(value).replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit));
const pad = (value) => String(value).padStart(2, "0");

const icons = {
  grid: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  dashboard: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="4" rx="1.5"/><rect x="14" y="10" width="7" height="11" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>`,
  panel: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2m4 0h2M8 15h2m4 0h2M8 18h8"/></svg>`,
  project: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z"/><path d="m4 7 8 4 8-4M12 11v10"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>`,
  report: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16"/><path d="m7 15 3-4 3 2 5-7"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.3a2 2 0 0 1-4 0v-.2A2 2 0 0 0 5.8 18l-.1.1a2 2 0 1 1-2.8-2.8L3 15.2A2 2 0 0 0 1.6 12h-.1a2 2 0 0 1 0-4h.2A2 2 0 0 0 3 4.6l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A2 2 0 0 0 9.2.5h.2a2 2 0 0 1 4 0v.2a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A2 2 0 0 0 21 8h.2a2 2 0 0 1 0 4H21a2 2 0 0 0-1.6 3Z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.7-4L3 10m0 0V5m0 5h5M4 13a8 8 0 0 0 14.7 4L21 14m0 0v5m0-5h-5"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
  x: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>`,
  user: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>`,
  wifi: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 8.5a15 15 0 0 1 20 0M5 12a10.5 10.5 0 0 1 14 0M8.5 15.5a5.5 5.5 0 0 1 7 0M12 19h.01"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
};

const monthNames = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const weekDays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

function div(a, b) { return ~~(a / b); }
function mod(a, b) { return a - ~~(a / b) * b; }
function g2d(gy, gm, gd) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
  return d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
}
function d2g(jdn) {
  let j = 4 * jdn + 139361631;
  j += div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return [gy, gm, gd];
}
function jalCal(jy) {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jump;
  for (let i = 1; i < breaks.length && jy >= breaks[i]; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  const leap = mod(mod(n + 1, 33) - 1, 4);
  return [leap === 0 ? 0 : leap + 1, gy, march];
}
function j2d(jy, jm, jd) {
  const r = jalCal(jy);
  return g2d(r[1], 3, r[2]) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}
function d2j(jdn) {
  const g = d2g(jdn);
  let jy = g[0] - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(g[0], 3, r[2]);
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) return [jy, 1 + div(k, 31), mod(k, 31) + 1];
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r[0] === 1) k += 1;
  }
  return [jy, 7 + div(k, 30), mod(k, 30) + 1];
}
function isLeapJalaaliYear(year) { return jalCal(year)[0] === 0; }
function todayJalali() {
  const now = new Date();
  return d2j(g2d(now.getFullYear(), now.getMonth() + 1, now.getDate()));
}
function toGregorian(jy, jm, jd) {
  const [gy, gm, gd] = d2g(j2d(jy, jm, jd));
  return `${gy}-${pad(gm)}-${pad(gd)}`;
}

const today = todayJalali();
const state = { year: today[0], month: today[1], day: today[2], hour: new Date().getHours(), minute: new Date().getMinutes(), calendarOpen: false, sidebarOpen: false };
if (localStorage.getItem("fire-panel-theme") === "dark") document.documentElement.classList.add("dark");

function renderShell() {
  document.querySelector("#app").innerHTML = `
    <div class="app-shell">
      <div class="mobile-overlay" id="mobile-overlay"></div>
      <aside class="sidebar" id="sidebar">
        <div class="brand-row">
          <div class="brand-mark">${icons.panel}</div>
          <div><strong>پایش‌یار</strong><small>مدیریت پنل‌های حریق</small></div>
          <button class="icon-button sidebar-close" id="sidebar-close" aria-label="بستن منو">${icons.x}</button>
        </div>
        <div class="installer-card"><span class="online-dot"></span><div><b>حساب نصاب</b><small>دسترسی فعال</small></div><span class="tiny-chevron">${icons.chevronDown}</span></div>
        <nav class="side-nav" aria-label="منوی اصلی">
          <p class="nav-caption">فضای کاری</p>
          <a class="nav-item" href="#projects">${icons.project}<span>پروژه‌ها</span><em>۴</em></a>
          <a class="nav-item" href="#monitoring">${icons.dashboard}<span>مانیتورینگ</span><i class="live-dot"></i></a>
          <p class="nav-caption nav-space">مدیریت پنل</p>
          <a class="nav-item" href="#panels">${icons.panel}<span>پنل‌های من</span></a>
          <a class="nav-item" href="#events">${icons.bell}<span>رویدادها</span><em class="warning-count">۲</em></a>
          <a class="nav-item" href="#reports">${icons.report}<span>گزارش‌ها</span></a>
          <a class="nav-item active" href="#settings">${icons.settings}<span>تنظیمات سیستم</span></a>
        </nav>
        <div class="sidebar-footer"><div class="support-icon">${icons.wifi}</div><div><b>پشتیبانی فنی</b><small>همراه شما برای راه‌اندازی</small></div><button class="icon-button">${icons.chevronLeft}</button></div>
      </aside>
      <main class="main-content">
        <header class="topbar">
          <div class="topbar-start"><button class="icon-button menu-button" id="menu-button" aria-label="باز کردن منو">${icons.menu}</button><div><h1>تنظیمات سیستم</h1><p>مدیریت تنظیمات عمومی و ارتباط با پنل</p></div></div>
          <div class="topbar-end"><div class="connection-status"><span class="status-pulse"></span><div><b>آماده به کار</b><small>بدون اتصال به پنل</small></div></div><button class="notification-button theme-toggle" id="theme-toggle" aria-label="فعال‌سازی حالت تاریک">${icons.moon}</button><button class="notification-button" aria-label="اعلان‌ها">${icons.bell}<span></span></button><div class="profile"><span class="avatar">ح‌خ</span><div><b>حسان خسروجردی</b><small>نصاب سیستم</small></div>${icons.chevronDown}</div></div>
        </header>
        <div class="content-wrap">
          <section class="breadcrumb"><span>داشبورد</span>${icons.chevronLeft}<span>تنظیمات سیستم</span>${icons.chevronLeft}<b>تاریخ و زمان</b></section>
          <section class="page-intro"><div><div class="eyebrow">SETTING / SYSTEM</div><h2>تاریخ و زمان پنل</h2><p>تاریخ و ساعت سیستم اعلام حریق را تنظیم کنید تا ثبت رویدادها دقیق باشد.</p></div><div class="project-context"><span>${icons.project}</span><div><small>پروژه فعال</small><b>مجتمع اداری آفتاب</b></div>${icons.chevronDown}</div></section>
          <section class="workspace-grid">
            <div class="primary-column">
              <article class="panel-card date-time-card">
                <div class="card-heading"><div class="heading-icon teal">${icons.calendar}</div><div><h3>تنظیم تاریخ و ساعت</h3><p>مقدار جدید را وارد کنید و برای اعمال روی پنل آماده شوید.</p></div><span class="step-badge">مرحله ۱ از ۱</span></div>
                <div class="form-area"><div class="field-block date-field-wrap"><label for="date-input">تاریخ پنل</label><div class="input-with-icon"><input id="date-input" type="text" readonly value="${faDigits(state.year)}/${faDigits(pad(state.month))}/${faDigits(pad(state.day))}" aria-label="تاریخ پنل" aria-haspopup="dialog" aria-expanded="${state.calendarOpen}">${icons.calendar}</div>${renderCalendar()}</div><div class="field-block"><label for="time-input">ساعت پنل</label><div class="input-with-icon time-input"><input id="time-input" type="time" value="${pad(state.hour)}:${pad(state.minute)}" aria-label="ساعت پنل">${icons.clock}</div><small class="field-hint">فرمت ساعت ۲۴ ساعته</small></div></div>
                <div class="selected-summary"><div class="summary-icon">${icons.check}</div><div><span>مقدار انتخاب‌شده</span><b id="selection-summary">${faDigits(state.year)}/${faDigits(pad(state.month))}/${faDigits(pad(state.day))}، ساعت ${faDigits(pad(state.hour))}:${faDigits(pad(state.minute))}</b></div><span class="local-badge">شمسی</span></div>
                <div class="card-actions"><button class="btn-secondary" id="read-panel">${icons.refresh}خواندن از پنل</button><div><button class="btn-ghost" id="cancel-button">انصراف</button><button class="btn-primary" id="apply-button">${icons.check}اعمال روی پنل</button></div></div>
              </article>
              <article class="info-banner"><div class="banner-icon">${icons.wifi}</div><div><b>اتصال پنل برای این پروژه فعال نیست</b><p>مقادیر واردشده فعلاً در فرم نگه‌داری می‌شوند. پس از برقراری ارتباط، همین تنظیمات قابل ارسال به پنل خواهد بود.</p></div></article>
            </div>
            <aside class="secondary-column"><article class="panel-card status-card"><div class="side-heading"><div><h3>وضعیت تنظیمات</h3><p>آخرین وضعیت همگام‌سازی</p></div><span class="neutral-badge">پیش‌نویس</span></div><div class="status-illustration">${icons.panel}<span></span></div><div class="status-lines"><div><span>پنل انتخاب‌شده</span><b>FIRE-CTRL-04</b></div><div><span>آخرین همگام‌سازی</span><b>هنوز انجام نشده</b></div><div><span>منطقه زمانی</span><b>تهران (UTC+۳:۳۰)</b></div></div></article><article class="panel-card checklist-card"><div class="side-heading"><div><h3>مراحل بعدی</h3><p>امکاناتی که به‌زودی فعال می‌شوند</p></div></div><div class="check-row done"><span>${icons.check}</span><div><b>انتخاب پروژه و پنل</b><small>ساختار اولیه آماده است</small></div></div><div class="check-row current"><span>۲</span><div><b>تنظیم تاریخ و زمان</b><small>در حال پیاده‌سازی</small></div></div><div class="check-row"><span>۳</span><div><b>اتصال و همگام‌سازی</b><small>در نسخه بعدی</small></div></div></article></aside>
          </section>
        </div>
      </main>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
    </div>`;
}

function daysInMonth(year, month) { return month <= 6 ? 31 : month <= 11 ? 30 : isLeapJalaaliYear(year) ? 30 : 29; }
function renderCalendar() {
  if (!state.calendarOpen) return `<div class="calendar-popover hidden" id="calendar-popover"></div>`;
  const firstDay = new Date(`${toGregorian(state.year, state.month, 1)}T12:00:00`).getDay();
  const saturdayIndex = (firstDay + 1) % 7;
  const cells = [];
  for (let i = 0; i < saturdayIndex; i++) cells.push(`<span class="calendar-day empty"></span>`);
  for (let day = 1; day <= daysInMonth(state.year, state.month); day++) {
    const selected = day === state.day && state.month === today[1] && state.year === today[0] ? " selected" : day === state.day ? " selected" : "";
    cells.push(`<button class="calendar-day${selected}" data-day="${day}" type="button">${faDigits(day)}</button>`);
  }
  return `<div class="calendar-popover" id="calendar-popover" role="dialog" aria-label="انتخاب تاریخ"><div class="calendar-header"><button class="calendar-nav" type="button" data-month="prev" aria-label="ماه قبل">${icons.chevronRight}</button><div><b>${monthNames[state.month - 1]}</b><span>${faDigits(state.year)}</span></div><button class="calendar-nav" type="button" data-month="next" aria-label="ماه بعد">${icons.chevronLeft}</button></div><div class="week-row">${weekDays.map((day) => `<span>${day.slice(0, 2)}</span>`).join("")}</div><div class="days-grid">${cells.join("")}</div><button class="today-button" type="button" data-today="true">امروز، ${faDigits(today[0])}/${faDigits(pad(today[1]))}/${faDigits(pad(today[2]))}</button></div>`;
}

function showToast(message, tone = "success") {
  const toast = document.querySelector("#toast");
  toast.className = `toast ${tone}`;
  toast.innerHTML = `${tone === "success" ? icons.check : icons.wifi}<span>${message}</span>`;
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3600);
}
function updateSummary() {
  const dateInput = document.querySelector("#date-input");
  const timeInput = document.querySelector("#time-input");
  const summary = document.querySelector("#selection-summary");
  if (dateInput) dateInput.value = `${faDigits(state.year)}/${faDigits(pad(state.month))}/${faDigits(pad(state.day))}`;
  if (timeInput) timeInput.value = `${pad(state.hour)}:${pad(state.minute)}`;
  if (summary) summary.textContent = `${faDigits(state.year)}/${faDigits(pad(state.month))}/${faDigits(pad(state.day))}، ساعت ${faDigits(pad(state.hour))}:${faDigits(pad(state.minute))}`;
}
function redrawCalendar() {
  const wrapper = document.querySelector(".date-field-wrap");
  if (!wrapper) return;
  const old = wrapper.querySelector("#calendar-popover");
  old?.remove();
  wrapper.insertAdjacentHTML("beforeend", renderCalendar());
  document.querySelector("#date-input")?.setAttribute("aria-expanded", String(state.calendarOpen));
}
function changeMonth(delta) {
  state.month += delta;
  if (state.month === 13) { state.month = 1; state.year += 1; }
  if (state.month === 0) { state.month = 12; state.year -= 1; }
  state.day = Math.min(state.day, daysInMonth(state.year, state.month));
  redrawCalendar();
  updateSummary();
}
function updateThemeButton() {
  const button = document.querySelector("#theme-toggle");
  if (!button) return;
  const dark = document.documentElement.classList.contains("dark");
  button.innerHTML = dark ? icons.sun : icons.moon;
  button.setAttribute("aria-label", dark ? "فعال‌سازی حالت روشن" : "فعال‌سازی حالت تاریک");
  button.title = dark ? "حالت روشن" : "حالت تاریک";
}
function bindEvents() {
  const $ = (selector) => document.querySelector(selector);
  $("#menu-button").addEventListener("click", () => { state.sidebarOpen = true; $("#sidebar").classList.add("open"); $("#mobile-overlay").classList.add("show"); });
  const closeMenu = () => { state.sidebarOpen = false; $("#sidebar").classList.remove("open"); $("#mobile-overlay").classList.remove("show"); };
  $("#sidebar-close").addEventListener("click", closeMenu); $("#mobile-overlay").addEventListener("click", closeMenu);
  updateThemeButton();
  $("#theme-toggle").addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("fire-panel-theme", dark ? "dark" : "light");
    updateThemeButton();
  });
  $("#date-input").addEventListener("click", () => { state.calendarOpen = !state.calendarOpen; redrawCalendar(); });
  $(".date-field-wrap").addEventListener("click", (event) => {
    const dayButton = event.target.closest("[data-day]");
    const monthButton = event.target.closest("[data-month]");
    const todayButton = event.target.closest("[data-today]");
    if (dayButton) { state.day = Number(dayButton.dataset.day); state.calendarOpen = false; redrawCalendar(); updateSummary(); }
    if (monthButton) changeMonth(monthButton.dataset.month === "next" ? 1 : -1);
    if (todayButton) { [state.year, state.month, state.day] = today; state.calendarOpen = false; redrawCalendar(); updateSummary(); }
  });
  $("#time-input").addEventListener("input", (event) => { const [hour, minute] = event.target.value.split(":").map(Number); state.hour = hour || 0; state.minute = minute || 0; updateSummary(); });
  $("#read-panel").addEventListener("click", () => showToast("اتصال به پنل هنوز فعال نشده است.", "info"));
  $("#cancel-button").addEventListener("click", () => { [state.year, state.month, state.day] = today; state.hour = new Date().getHours(); state.minute = new Date().getMinutes(); updateSummary(); showToast("تغییرات فرم لغو شد.", "info"); });
  $("#apply-button").addEventListener("click", () => showToast("تنظیمات آماده‌ی اعمال روی پنل شد؛ اتصال پنل در نسخه بعدی فعال می‌شود."));
  document.addEventListener("click", (event) => { if (state.calendarOpen && !event.target.closest(".date-field-wrap")) { state.calendarOpen = false; redrawCalendar(); } });
}

renderShell();
bindEvents();
