import "./style.css";

let activeLanguage = localStorage.getItem("fire-panel-language") || "fa";
const faDigits = (value) => String(value).replace(/\d/g, (digit) => activeLanguage === "en" ? digit : "۰۱۲۳۴۵۶۷۸۹"[digit]);
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
const englishMonthNames = ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"];
const englishWeekDays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const loopDeviceTypes = [
  { key: "smoke", fa: "دتکتور دود", en: "Smoke Detector", category: "other" },
  { key: "heat", fa: "دتکتور حرارت", en: "Heat Detector", category: "other" },
  { key: "multi", fa: "دتکتور ترکیبی", en: "Multi Detector", category: "other" },
  { key: "manual", fa: "شستی اعلام حریق", en: "Manual Call Point", category: "control" },
  { key: "sounder", fa: "آژیر / خروجی", en: "Sounder/Output", category: "relay" },
  { key: "zone", fa: "ماژول زون", en: "Zone Module", category: "control" },
  { key: "input", fa: "ماژول ورودی", en: "Input Module", category: "control" },
  { key: "io", fa: "ماژول ورودی/خروجی", en: "Input/output Module", category: "control" },
];
const loopCategories = ["relay", "control", "other", "cl-b-s-b", "cl-b-s-c"];

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
const state = {
  year: today[0], month: today[1], day: today[2],
  draftYear: today[0], draftMonth: today[1], draftDay: today[2],
  hour: new Date().getHours(), minute: new Date().getMinutes(),
  draftHour: new Date().getHours(), draftMinute: new Date().getMinutes(),
  calendarOpen: false, calendarMode: "days", calendarYearPage: Math.floor(today[0] / 12) * 12,
  timeOpen: false, sidebarOpen: false, sidebarCollapsed: false,
  dailyDayNightEnabled: true, nightStartHour: 22, nightStartMinute: 0, nightEndHour: 7, nightEndMinute: 0,
  weekendEnabled: true, weekendDay1: "friday", weekendDay2: "thursday", holidayEnabled: false,
  nightTimeOpen: null, draftNightStartHour: 22, draftNightStartMinute: 0, draftNightEndHour: 7, draftNightEndMinute: 0,
  holidayYear: today[0], holidayMonth: 1, holidayDay: 1,
  draftHolidayYear: today[0], draftHolidayMonth: 1, draftHolidayDay: 1,
  holidayCalendarOpen: false, holidayCalendarMode: "days", holidayCalendarYearPage: Math.floor(today[0] / 12) * 12,
  selectedHolidayIndex: 0, holidayDates: [{ year: today[0], month: 1, day: 1 }, { year: today[0], month: 1, day: 13 }],
  view: "projects", selectedProjectId: null, selectedPanelId: null, connectedPanelId: null, selectedSettingId: "date-time",
  panelMenuOpen: false, panelMenuFloating: false, settingsTreeCollapsed: true,
  selectedLoopCardId: "loop-1", loopDeviceFilter: "all", selectedLoopDeviceId: null, loopAddError: "", loopCards: [],
  groupTab: "zone", zoneGroupNumber: 1, zoneLoopCardId: "loop-1", zonePreAlarm: {}, zoneGroups: {},
  ioInputGroupNumber: 1, ioOutputGroupNumber: 1, ioLoopCardId: "loop-1", ioGroups: {}, ioInputGroups: {}, ioOutputGroups: {}, ioRelations: {}, ioSavedRelations: {}, groupSelectedDeviceKey: null, groupPreviewOpen: false,
  language: localStorage.getItem("fire-panel-language") || "fa",
  openSettingsSections: { system: true, advanced: true, gsm: true },
};
if (localStorage.getItem("fire-panel-theme") === "dark") document.documentElement.classList.add("dark");

const projects = [
  { id: "aftab", name: "مجتمع اداری آفتاب", location: "تهران، خیابان ولیعصر", type: "مجتمع اداری", status: "آنلاین", panels: [{ id: "aftab-main", name: "پنل اصلی ساختمان", code: "FIRE-CTRL-04", status: "متصل", alarms: 0 }, { id: "aftab-parking", name: "پنل پارکینگ", code: "FIRE-CTRL-05", status: "متصل", alarms: 1 }, { id: "aftab-west", name: "پنل ساختمان غربی", code: "FIRE-CTRL-06", status: "آفلاین", alarms: 0 }] },
  { id: "shahrak", name: "برج مسکونی شهرک غرب", location: "تهران، شهرک غرب", type: "برج مسکونی", status: "آنلاین", panels: [{ id: "shahrak-main", name: "پنل مرکزی برج", code: "FIRE-CTRL-11", status: "متصل", alarms: 0 }, { id: "shahrak-west", name: "پنل لابی و پارکینگ", code: "FIRE-CTRL-12", status: "متصل", alarms: 2 }] },
  { id: "mehr", name: "کارخانه صنایع مهر", location: "البرز، شهرک صنعتی", type: "کارخانه صنعتی", status: "نیازمند بررسی", panels: [{ id: "mehr-main", name: "پنل سالن تولید", code: "FIRE-CTRL-21", status: "متصل", alarms: 0 }, { id: "mehr-office", name: "پنل ساختمان اداری", code: "FIRE-CTRL-22", status: "آفلاین", alarms: 0 }, { id: "mehr-storage", name: "پنل انبار", code: "FIRE-CTRL-23", status: "متصل", alarms: 1 }, { id: "mehr-gate", name: "پنل نگهبانی", code: "FIRE-CTRL-24", status: "متصل", alarms: 0 }] },
  { id: "nik", name: "هتل نیکان", location: "مشهد، بلوار سجاد", type: "هتل", status: "آنلاین", panels: [{ id: "nik-main", name: "پنل اصلی هتل", code: "FIRE-CTRL-31", status: "متصل", alarms: 0 }, { id: "nik-kitchen", name: "پنل آشپزخانه", code: "FIRE-CTRL-32", status: "متصل", alarms: 0 }] },
];

function makeLoopDevice(cardId, number, typeKey, overrides = {}) {
  const type = loopDeviceTypes.find((item) => item.key === typeKey) || loopDeviceTypes[0];
  return {
    id: `${cardId}-device-${number}`,
    number,
    enabled: true,
    style: "class-b",
    type: type.key,
    category: type.category,
    ip: `001.${String(number).padStart(3, "0")}`,
    inputType: "alarm",
    deactivation: "silence",
    sensitivity: "medium",
    nightMode: "day",
    location: "طبقه ۱ / راهروی شمالی",
    ...overrides,
  };
}

function createInitialLoopCards() {
  return [
    { id: "loop-1", label: "LoopCard1", devices: [makeLoopDevice("loop-1", 1, "smoke"), makeLoopDevice("loop-1", 2, "heat", { location: "طبقه ۱ / موتورخانه" }), makeLoopDevice("loop-1", 3, "manual", { category: "control", location: "طبقه ۱ / ورودی اصلی" }), makeLoopDevice("loop-1", 4, "sounder", { category: "relay", enabled: false, nightMode: "night" })] },
    { id: "loop-2", label: "LoopCard2", devices: [makeLoopDevice("loop-2", 1, "multi"), makeLoopDevice("loop-2", 2, "zone", { category: "control", location: "پارکینگ / تابلو زون" }), makeLoopDevice("loop-2", 3, "input", { location: "پارکینگ / ورودی" })] },
    { id: "loop-3", label: "LoopCard3", devices: [makeLoopDevice("loop-3", 1, "io", { location: "طبقه ۲ / اتاق کنترل" }), makeLoopDevice("loop-3", 2, "sounder", { category: "relay", location: "طبقه ۲ / راهرو" })] },
    { id: "loop-4", label: "LoopCard4", devices: [] },
  ];
}

state.loopCards = createInitialLoopCards();
state.zoneGroups = { 1: [{ loopId: "loop-1", deviceId: "loop-1-device-1" }] };
state.zonePreAlarm = { 1: true };
state.ioGroups = { "1-1": { inputs: [], outputs: [], activeCount: 1, outputActiveFor: "fire", delay: 0, status: true } };
state.ioInputGroups = { 1: [] };
state.ioOutputGroups = { 1: [] };
state.ioRelations = { "1-1": { activeCount: 1, outputActiveFor: "fire", delay: 0, status: true } };
state.ioSavedRelations = {};

const settingsTree = [
  { id: "system", label: "سیستم", en: "System", icon: "settings", children: [
    { id: "setting", label: "تنظیمات عمومی", en: "Setting", icon: "settings", children: [
      { id: "date-time", label: "تاریخ و زمان", en: "Date & Time", icon: "calendar" },
      { id: "language", label: "زبان", en: "Language", icon: "settings" },
      { id: "panel-caption", label: "عنوان پنل", en: "Panel Caption", icon: "panel" },
      { id: "password-change", label: "تغییر پسورد", en: "Password Change", icon: "settings" },
    ] },
    { id: "relay", label: "خروجی رله‌ها", en: "Relay Output", icon: "panel" },
    { id: "advanced", label: "پیشرفته", en: "Advanced", icon: "settings", children: [
      { id: "loop-active", label: "کارت لوپ فعال", en: "Active Loop Card", icon: "panel" },
      { id: "network", label: "شبکه", en: "Network", icon: "wifi" },
    ] },
    { id: "night-mode", label: "حالت شب و روز", en: "Night Mode", icon: "clock" },
  ] },
  { id: "loop-card", label: "کارت لوپ", en: "Loop Card", icon: "panel" },
  { id: "group", label: "گروه‌بندی", en: "Group", icon: "grid" },
  { id: "features", label: "قابلیت‌ها", en: "Features", icon: "settings" },
  { id: "events", label: "رویدادها", en: "Events", icon: "bell" },
  { id: "remote-panel", label: "پنل از راه دور", en: "Remote Panel", icon: "wifi" },
  { id: "report", label: "گزارش‌ها", en: "Report", icon: "report" },
  { id: "gsm", label: "تلفن‌کننده", en: "GSM", icon: "bell", children: [
    { id: "customize", label: "سفارشی‌سازی", en: "Customize", icon: "settings" },
    { id: "location", label: "موقعیت", en: "Location", icon: "project" },
  ] },
  { id: "monitoring", label: "مانیتورینگ", en: "Monitoring", icon: "dashboard" },
];

const findProject = () => projects.find((project) => project.id === state.selectedProjectId) || projects[0];
const findPanel = () => findProject().panels.find((panel) => panel.id === state.selectedPanelId) || findProject().panels[0];

const translations = {
  "فضای کاری": "Workspace", "پروژه‌ها": "Projects", "فضای مانیتورینگ": "Monitoring workspace", "پنل‌های من": "My panels", "رویدادها": "Events", "گزارش‌ها": "Reports", "مدیریت پنل": "Panel management", "حساب نصاب": "Installer account", "دسترسی فعال": "Active access", "پشتیبانی فنی": "Technical support", "همراه شما برای راه‌اندازی": "Here to help with setup", "آماده به کار": "Ready", "بدون اتصال به پنل": "No panel connected", "متصل به پنل": "Connected to panel", "تنظیمات پنل": "Panel settings", "تنظیمات پروژه": "Project settings", "پروژه‌های من": "My projects", "پروژه را انتخاب کنید تا پنل‌ها و تنظیمات آن را مدیریت کنید.": "Select a project to manage its panels and settings.", "پروژه‌ها و پنل‌های تحت مدیریت شما": "Projects and panels under your management", "فضای کاری شما": "Your workspace", "پروژه فعال": "Active projects", "پنل ثبت‌شده": "Registered panels", "نیازمند بررسی": "Needs attention", "پروژه آنلاین": "Online projects", "پروژه": "Project", "پنل": "Panel", "پنل‌های پروژه": "Project panels", "در این پروژه": "in this project", "پنل جدید اضافه کنید": "Add a new panel", "اتصال پنل در نسخه بعدی": "Panel connection is coming next", "راهنمای تنظیمات": "Settings guide", "برای مشاهده هر بخش، گزینه‌ی آن را انتخاب کنید.": "Select an item to view its settings.", "فضای نصاب": "Installer workspace", "پنل‌ها": "Panels", "پیکربندی پنل": "Panel configuration", "پروژه‌های فعال": "Active projects", "خواندن": "Read", "خواندن از پنل": "Read from panel", "ذخیره تنظیمات": "Save settings", "ذخیره تغییرات": "Save changes", "اعمال روی پنل": "Apply to panel", "انصراف": "Cancel", "اتصال": "Connect", "قطع اتصال": "Disconnect", "اتصال پنل برای این پروژه فعال نیست": "Panel is not connected for this project", "مقادیر فعلاً در فرم نگه‌داری می‌شوند و بعد از اتصال قابل ارسال خواهند بود.": "Values stay in this form until the panel connection is established.", "تنظیم تاریخ و ساعت": "Set date and time", "تاریخ پنل": "Panel date", "ساعت پنل": "Panel time", "فرمت ساعت ۲۴ ساعته": "24-hour format", "مقدار انتخاب‌شده": "Selected value", "معادل میلادی": "Gregorian equivalent", "شمسی": "Jalali", "زبان رابط کاربری": "Interface language", "زبان نرم‌افزار": "Application language", "نام پروژه‌ها و پنل‌ها بدون تغییر باقی می‌ماند.": "Project and panel names stay unchanged.", "وضعیت تنظیمات": "Settings status", "آخرین وضعیت همگام‌سازی": "Latest synchronization status", "پنل انتخاب‌شده": "Selected panel", "آخرین همگام‌سازی": "Last synchronization", "هنوز انجام نشده": "Not synchronized yet", "منطقه زمانی": "Time zone", "تهران (UTC+۳:۳۰)": "Tehran (UTC+3:30)", "مراحل بعدی": "Next steps", "امکاناتی که به‌زودی فعال می‌شوند": "Features coming soon", "انتخاب پروژه و پنل": "Select project and panel", "ساختار اولیه آماده است": "Initial structure is ready", "در حال پیاده‌سازی": "In progress", "اتصال و همگام‌سازی": "Connection and synchronization", "در نسخه بعدی": "In the next version", "فعال": "Active", "آماده": "Ready", "پیش‌نویس": "Draft", "آنلاین": "Online", "آفلاین": "Offline", "متصل": "Connected", "هشدار": "Alert", "همه پروژه‌ها": "All projects", "مجتمع اداری": "Office complex", "برج مسکونی": "Residential tower", "کارخانه صنعتی": "Industrial factory", "هتل": "Hotel", "تهران، خیابان ولیعصر": "Tehran, Valiasr Street", "تهران، شهرک غرب": "Tehran, Shahrak-e Gharb", "البرز، شهرک صنعتی": "Alborz, Industrial Town", "مشهد، بلوار سجاد": "Mashhad, Sajjad Boulevard",
};

Object.assign(translations, {
  "تنظیمات سیستم": "System settings",
  "مدیریت تنظیمات عمومی و ارتباط با پنل": "Manage general settings and panel connection",
  "تنظیمات عمومی و ارتباط با پنل": "General settings and panel connection",
  "تنظیمات": "Settings",
  "سیستم": "System",
  "خروجی رله‌ها": "Relay output",
  "پیشرفته": "Advanced",
  "کارت لوپ فعال": "Active loop card",
  "کارت‌های لوپ فعال": "Active loop cards",
  "شبکه": "Network",
  "حالت شب و روز": "Night mode",
  "کارت لوپ": "Loop card",
  "دیوایس‌های کارت لوپ": "Loop card devices",
  "دیوایس‌های شناسایی‌شده در Loop Card 1": "Devices detected on Loop Card 1",
  "گروه‌بندی ورودی و خروجی": "Input and output groups",
  "قابلیت‌های پنل": "Panel features",
  "رویدادهای پنل": "Panel events",
  "پنل‌های همکار": "Partner panels",
  "گزارش تنظیمات پنل": "Panel configuration report",
  "تلفن‌کننده GSM": "GSM dialer",
  "سفارشی‌سازی اعلان‌ها": "Notification customization",
  "موقعیت پنل": "Panel location",
  "مرکز مانیتورینگ": "Monitoring center",
  "فعال‌سازی کارت‌های لوپ": "Activate loop cards",
  "کارت‌هایی را که در این پنل نصب شده‌اند فعال کنید.": "Activate the cards installed in this panel.",
  "تنظیمات شبکه پنل‌ها": "Panel network settings",
  "ارتباط چند پنل و فرمان‌های سراسری را مدیریت کنید.": "Manage multi-panel communication and global commands.",
  "برنامه روز و شب": "Day and night schedule",
  "بازه‌های زمانی حالت شب و روز پنل را تعیین کنید.": "Set the panel's day and night time ranges.",
  "تعطیلات ثبت‌شده": "Registered holidays",
  "تاریخ‌های خاص پروژه": "Project-specific dates",
  "عملکرد هر رله را برای رخدادهای پنل تعیین کنید.": "Define the behavior of each relay for panel events.",
  "خروجی قابل تنظیم پنل": "Configurable panel output",
  "نظارت / Supervisory": "Supervisory",
  "غیرفعال": "Disabled",
  "نکته کاربردی": "Useful tip",
  "تنظیم خروجی رله‌ها رفتار تجهیزات جانبی مانند آژیر، فن و سیستم‌های اعلان را مشخص می‌کند.": "Relay output settings define the behavior of accessories such as sounders, fans, and notification systems.",
  "آخرین خواندن: امروز، ۱۰:۲۴": "Last read: Today, 10:24",
  "فعال و آماده‌ی استفاده": "Active and ready to use",
  "وضعیت شبکه": "Network status",
  "پشتیبانی از حداکثر ۸ پنل": "Supports up to 8 panels",
  "آخر هفته": "Weekend",
  "اعمال حالت شب در روزهای تعطیل": "Apply night mode on holidays",
  "تعطیلات رسمی": "Public holidays",
  "استفاده از تقویم تعطیلات پروژه": "Use the project holiday calendar",
  "دیوایس‌ها را برای اجرای سناریوهای مشترک گروه‌بندی کنید.": "Group devices to run shared scenarios.",
  "رفتارهای پیشرفته‌ی سیستم اعلام حریق را کنترل کنید.": "Control advanced fire alarm system behavior.",
  "آخرین رخدادهای ثبت‌شده برای": "Latest recorded events for",
  "اتصال برقرار نیست": "Not connected",
  "برای مشاهده و همگام‌سازی پنل‌های دور، ابتدا ارتباط اینترنتی یا شبکه را تنظیم کنید.": "Configure an internet or network connection before viewing and synchronizing remote panels.",
  "تنظیم ارتباط": "Configure connection",
  "در انتظار اتصال": "Waiting for connection",
  "گزارش خلاصه از وضعیت پیکربندی و دیوایس‌ها": "A summary of configuration and device status",
  "تولید گزارش": "Generate report",
  "دانلود": "Download",
  "وضعیت پنل": "Panel status",
  "تعداد دیوایس‌ها": "Device count",
  "رویدادهای باز": "Open events",
  "گروه‌های تنظیم‌شده": "Configured groups",
  "وضعیت ارسال پیامک و تماس صوتی": "SMS and voice-call delivery status",
  "آماده‌سازی": "Preparing",
  "شماره اصلی دریافت هشدار": "Primary alert number",
  "ویرایش": "Edit",
  "رویدادهای قابل ارسال": "Sendable events",
  "انتخاب رخدادهای مهم": "Select important events",
  "متن و قالب پیام‌های ارسالی تلفن‌کننده را تعیین کنید.": "Define the text and format of dialer messages.",
  "عنوان پروژه در پیامک": "Project title in SMS",
  "زبان پیام": "Message language",
  "قالب پیام حریق": "Fire message template",
  "ثبت شده": "Registered",
  "محل نصب پنل را برای نمایش در نقشه ثبت کنید.": "Register the panel location for map display.",
  "طبقه / بخش": "Floor / section",
  "مختصات پروژه": "Project coordinates",
  "وضعیت پنل‌ها، اتصال‌ها و رخدادها را از یک نمای واحد دنبال کنید.": "Track panel status, connections, and events from one view.",
  "مانیتورینگ آماده": "Monitoring ready",
  "ورود به مانیتورینگ": "Open monitoring",
  "وضعیت سرویس‌ها": "Service status",
  "آخرین بررسی خودکار سیستم": "Last automatic system check",
  "مدیریت تنظیمات و مانیتورینگ": "Settings and monitoring",
  "منوی تنظیمات بر اساس مستندات سیستم": "Settings menu based on the system documentation",
  "خواندن رویدادها": "Read events",
  "خروجی گزارش": "Export report",
  "شناسایی": "Detect",
  "+ افزودن دیوایس": "+ Add device",
  "+ گروه جدید": "+ New group",
  "+ افزودن": "+ Add",
  "مدیریت": "Management",
  "نسخه حرفه‌ای پایش‌": "Paya-yar Pro version",
  "گزارش‌های پیشرفته را فعال کنید.": "Enable advanced reports.",
  "ارتقای حساب": "Upgrade account",
  "مدیریت پنل‌های حریق": "Fire panel management",
  "جمع کردن منو": "Collapse menu",
  "باز کردن منو": "Expand menu",
  "بستن منو": "Close menu",
  "فعال‌سازی حالت تاریک": "Enable dark mode",
  "غیرفعال‌سازی حالت تاریک": "Disable dark mode",
  "اعلان‌ها": "Notifications",
  "فارسی": "Persian",
  "۳ رله فعال": "3 active relays",
  "حریق / Fire": "Fire",
  "خطا / Fault": "Fault",
  "پیش‌هشدار / Pre-Alarm": "Pre-Alarm",
  "اعلام حریق روی شبکه": "Fire alarm on network",
  "اعلام خطای پنل روی شبکه": "Panel fault on network",
  "همگام‌سازی خروجی آژیر": "Synchronize sounder output",
  "ارسال فرمان سکوت به پنل‌ها": "Send silence command to panels",
  "پذیرش فرمان سکوت": "Accept silence command",
  "ارسال فرمان تخلیه": "Send evacuation command",
  "تنظیمات شبکه پنل‌ها": "Panel network settings",
  "۴ کارت": "4 cards",
  "۵ فعال": "5 active",
  "همه": "All",
  "دتکتور": "Detector",
  "ماژول": "Module",
  "خروجی": "Output",
  "شماره": "Number",
  "نوع دیوایس": "Device type",
  "وضعیت": "Status",
  "عملیات": "Actions",
  "گروه جدید": "New group",
  "گزارش پیکربندی FIRE-CTRL-04": "Configuration report FIRE-CTRL-04",
  "آخرین تولید: امروز، ۱۰:۳۰ · PDF": "Last generated: Today, 10:30 · PDF",
  "حریق": "Fire",
  "خطا": "Fault",
  "نظارت": "Supervisory",
  "بازگشت به حالت عادی": "Return to normal",
  "هشدار حریق در {PROJECT} - {PANEL} - {TIME}": "Fire alarm at {PROJECT} - {PANEL} - {TIME}",
  "اتاق کنترل، طبقه همکف": "Control room, ground floor",
  "نوروز": "Nowruz",
  "روز طبیعت": "Nature Day",
  "Master Silence · ارسال": "Master Silence · Send",
  "Master Silence · دریافت": "Master Silence · Receive",
  "Master Evacuate · ارسال": "Master Evacuate · Send",
  "خروجی حریق": "Fire output",
  "خروجی خطا": "Fault output",
  "شروع حالت شب": "Night mode starts",
  "پایان حالت شب": "Night mode ends",
  "اتاق کنترل، طبقه همکف": "Control room, ground floor",
  "دیوایس‌ها را برای اجرای سناریوهای مشترک گروه‌بندی کنید.": "Group devices for shared scenarios.",
  "۱۲ دیوایس · خروجی آژیر · تأخیر ۰ ثانیه": "12 devices · Sounder output · 0 sec delay",
  "۴ دیوایس · خروجی رله ۲ · تأخیر ۵ ثانیه": "4 devices · Relay 2 output · 5 sec delay",
  "۸ دیوایس · وضعیت نظارتی": "8 devices · Supervisory status",
  "تأخیر پیش‌هشدار": "Pre-alarm delay",
  "مدت تأخیر قبل از فعال شدن آژیر": "Delay before sounder activation",
  "یادآوری خطا": "Fault reminder",
  "نمایش یادآوری برای خطاهای باز": "Show reminders for open faults",
  "خاموش‌سازی خودکار": "Automatic shutdown",
  "خاموشی خودکار خروجی پس از رخداد": "Automatically shut down output after an event",
  "قفل خروجی صدا": "Sound output lock",
  "جلوگیری از قطع صدای آژیر": "Prevent sounder interruption",
  "تأیید دو مرحله‌ای": "Two-step confirmation",
  "تأیید عملیات حساس روی پنل": "Confirm sensitive panel operations",
  "ثبت تاریخچه عملیات": "Operation history",
  "ذخیره اقدامات کاربران": "Save user actions",
  "آخرین رخدادهای ثبت‌شده برای": "Latest recorded events for",
  "دتکتور دود · طبقه ۲": "Smoke detector · Floor 2",
  "خطای ارتباط": "Communication fault",
  "بازگشت به حالت عادی": "Return to normal",
  "امروز، ۰۹:۴۲": "Today, 09:42",
  "امروز، ۰۸:۱۵": "Today, 08:15",
  "دیروز، ۱۸:۲۱": "Yesterday, 18:21",
  "پنل‌هایی که برای همگام‌سازی انتخاب شده‌اند": "Panels selected for synchronization",
  "در انتظار اتصال": "Waiting for connection",
  "آفلاین": "Offline",
  "غیرفعال": "Disabled",
  "وضعیت ارسال پیامک و تماس صوتی": "SMS and voice call delivery status",
  "تماس صوتی هنگام حریق": "Voice call during fire alarm",
  "ارسال تماس به شماره‌های ثبت‌شده": "Call registered numbers",
  "ارسال پیامک خطا": "Send fault SMS",
  "گزارش خطاهای پنل از طریق پیامک": "Report panel faults by SMS",
  "عنوان پروژه در پیامک": "Project title in SMS",
  "قالب پیام حریق": "Fire message template",
  "هشدار حریق در {PROJECT} - {PANEL} - {TIME}": "Fire alarm at {PROJECT} - {PANEL} - {TIME}",
  "ثبت شده": "Registered",
  "ثبت‌شده": "Registered",
  "محل نصب پنل را برای نمایش در نقشه ثبت کنید.": "Register the panel location for map display.",
  "وضعیت سرویس‌ها": "Service status",
  "مانیتورینگ زنده": "Live monitoring",
  "دریافت وضعیت پنل‌ها در لحظه": "Receive panel status in real time",
  "اعلان رخداد جدید": "New event notifications",
  "نمایش هشدار در داشبورد نصاب": "Show alerts on the installer dashboard",
  "ثبت لاگ ارتباطات": "Connection logs",
  "ثبت زمان و کاربر هر اتصال": "Log the time and user for each connection",
});

function translateUI(root) {
  if (!root || state.language !== "en") return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const original = node.nodeValue.trim();
    if (!original) return;
    if (translations[original]) { node.nodeValue = node.nodeValue.replace(original, translations[original]); return; }
    let translated = original.replace(/^(\d+) پنل در این پروژه$/, "$1 panels in this project").replace(/^(\d+) پروژه فعال · (\d+) پنل$/, "$1 active projects · $2 panels").replace(/^(\d+) پنل · (.+)$/, "$1 panels · $2").replace(/^(\d+) متصل$/, "$1 connected").replace(/^(\d+) هشدار$/, "$1 alerts").replace(/^(\d+) پنل$/, "$1 panels").replace("مدیریت تنظیمات و مانیتورینگ", "Settings and monitoring");
    translated = translated.replace(/^(\d+) panels · (.+)$/, (_, count, label) => `${count} panels · ${translations[label] || label}`).replace(/^آخرین رخدادهای ثبت‌شده برای (.+)$/, (_, name) => `Latest recorded events for ${name}`);
    if (translated !== original) node.nodeValue = node.nodeValue.replace(original, translated);
  });
  root.querySelectorAll("[aria-label]").forEach((element) => {
    const label = element.getAttribute("aria-label");
    if (translations[label]) element.setAttribute("aria-label", translations[label]);
  });
}

function updateConnectionStatus() {
  const title = document.querySelector("#connection-title");
  const subtitle = document.querySelector("#connection-subtitle");
  const status = document.querySelector(".connection-status");
  const panel = state.connectedPanelId ? projects.flatMap((project) => project.panels).find((item) => item.id === state.connectedPanelId) : null;
  if (!title || !subtitle) return;
  title.textContent = panel ? (state.language === "en" ? "Connected to panel" : "متصل به پنل") : (state.language === "en" ? "Ready" : "آماده به کار");
  subtitle.textContent = panel ? panel.code : (state.language === "en" ? "No panel connected" : "بدون اتصال به پنل");
  status?.classList.toggle("connected", Boolean(panel));
}

function updateSidebarState() {
  const shell = document.querySelector(".app-shell");
  shell?.classList.toggle("sidebar-collapsed", state.sidebarCollapsed);
  document.querySelector("#sidebar-collapse")?.setAttribute("aria-label", state.sidebarCollapsed ? "باز کردن منو" : "جمع کردن منو");
}

function updateConnectionControl() {
  const actions = document.querySelector(".detail-actions");
  const panel = findPanel();
  if (!actions || !panel) return;
  let button = actions.querySelector("[data-connect-selected]");
  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.dataset.connectSelected = "true";
    actions.prepend(button);
  }
  const connected = state.connectedPanelId === panel.id;
  button.className = `panel-connect-button detail-connect-button${connected ? " connected" : ""}`;
  button.dataset.connectPanel = panel.id;
  button.setAttribute("aria-pressed", String(connected));
  button.innerHTML = connected
    ? `${icons.check}${state.language === "en" ? "Disconnect panel" : "قطع اتصال پنل"}`
    : `${icons.wifi}${state.language === "en" ? "Connect panel" : "اتصال پنل"}`;
}

function renderShell() {
  document.querySelector("#app").innerHTML = `
    <div class="app-shell">
      <div class="mobile-overlay" id="mobile-overlay"></div>
      <aside class="sidebar" id="sidebar">
        <div class="brand-row">
          <div class="brand-mark">${icons.panel}</div>
          <div><strong>پایش‌</strong><small>مدیریت پنل‌های حریق</small></div>
          <button class="icon-button sidebar-collapse" id="sidebar-collapse" aria-label="جمع کردن منو">${icons.chevronRight}</button>
          <button class="icon-button sidebar-close" id="sidebar-close" aria-label="بستن منو">${icons.x}</button>
        </div>
        <nav class="side-nav" aria-label="منوی اصلی">
          <p class="nav-caption">فضای کاری</p>
          <button class="nav-item active" type="button" data-nav-view="projects">${icons.project}<span>پروژه‌ها</span><em>۴</em></button>
          <button class="nav-item" type="button" data-nav-view="workspace">${icons.dashboard}<span>فضای مانیتورینگ</span><i class="live-dot"></i></button>
          <p class="nav-caption nav-space">مدیریت</p>
          <button class="nav-item" type="button" data-nav-view="workspace" data-nav-setting="loop-card">${icons.panel}<span>پنل‌های من</span></button>
          <button class="nav-item" type="button" data-nav-view="workspace" data-nav-setting="language">${icons.settings}<span>زبان</span></button>
          <button class="nav-item" type="button" data-nav-view="workspace" data-nav-setting="events">${icons.bell}<span>رویدادها</span><em class="warning-count">۲</em></button>
          <button class="nav-item" type="button" data-nav-view="workspace" data-nav-setting="report">${icons.report}<span>گزارش‌ها</span></button>
        </nav>
        <div class="sidebar-promo"><div class="sidebar-promo-head"><span class="sidebar-promo-icon">${icons.settings}</span><div><strong>نسخه حرفه‌ای پایش‌</strong><p>گزارش‌های پیشرفته را فعال کنید.</p></div></div><button type="button">ارتقای حساب</button></div>
      </aside>
      <main class="main-content">
        <header class="topbar">
          <div class="topbar-start"><button class="icon-button menu-button" id="menu-button" aria-label="باز کردن منو">${icons.menu}</button><div><h1 id="topbar-title">پروژه‌ها</h1><p id="topbar-subtitle">پروژه‌ها و پنل‌های تحت مدیریت شما</p></div></div>
          <div class="topbar-end"><div class="connection-status"><span class="status-pulse"></span><div><b id="connection-title">آماده به کار</b><small id="connection-subtitle">بدون اتصال به پنل</small></div></div><button class="notification-button theme-toggle" id="theme-toggle" aria-label="فعال‌سازی حالت تاریک">${icons.moon}</button><button class="notification-button" aria-label="اعلان‌ها">${icons.bell}<span></span></button><div class="profile"><span class="avatar">ح‌خ</span><div><b>حسان خسروجردی</b><small>نصاب سیستم</small></div>${icons.chevronDown}</div></div>
        </header>
        <div class="content-wrap" id="content-root"></div>
      </main>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
    </div>`;
}

function renderProjectsPage() {
  const totalPanels = projects.reduce((sum, project) => sum + project.panels.length, 0);
  return `<section class="breadcrumb"><b>پروژه‌ها</b></section><section class="page-intro"><div><div class="eyebrow">فضای نصاب</div><h2>پروژه‌های من</h2><p>پروژه را انتخاب کنید تا پنل‌ها و تنظیمات آن را مدیریت کنید.</p></div><div class="project-summary"><span>${icons.project}</span><div><small>فضای کاری شما</small><b>${faDigits(projects.length)} پروژه فعال · ${faDigits(totalPanels)} پنل</b></div></div></section><section class="project-stats"><div><span class="stat-dot green"></span><b>${faDigits(projects.filter((project) => project.status === "آنلاین").length)}</b><small>پروژه آنلاین</small></div><div><span class="stat-dot blue"></span><b>${faDigits(totalPanels)}</b><small>پنل ثبت‌شده</small></div><div><span class="stat-dot amber"></span><b>۳</b><small>نیازمند بررسی</small></div></section><section class="projects-grid">${projects.map(renderProjectCard).join("")}</section>`;
}

function renderProjectCard(project) {
  const online = project.panels.filter((panel) => panel.status === "متصل").length;
  const alarms = project.panels.reduce((sum, panel) => sum + panel.alarms, 0);
  return `<button type="button" class="project-card" data-project-id="${project.id}"><div class="project-card-visual"><div class="building-illustration">${icons.project}<span></span><span></span><span></span></div><span class="project-status ${project.status === "آنلاین" ? "online" : "attention"}"><i></i>${project.status}</span><span class="project-card-arrow">${icons.chevronLeft}</span></div><div class="project-card-body"><div class="project-card-title"><div><small>${project.type}</small><h3>${project.name}</h3></div><span class="project-more">•••</span></div><p>${icons.project}${project.location}</p><div class="project-card-footer"><span>${icons.panel}<b>${faDigits(project.panels.length)}</b> پنل</span><span class="online-count"><i></i>${faDigits(online)} متصل</span>${alarms ? `<span class="alarm-count">${faDigits(alarms)} هشدار</span>` : ""}</div></div></button>`;
}

function renderProjectStrip(project) {
  return `<div class="project-strip-wrap"><div class="project-strip-head"><div><span class="eyebrow">پروژه‌های فعال</span><b>پروژه‌ها</b></div><button type="button" class="strip-back" data-back-projects>${icons.chevronRight}همه پروژه‌ها</button></div><div class="project-strip">${projects.map((item) => `<button type="button" class="project-strip-item${item.id === project.id ? " active" : ""}" data-project-id="${item.id}"><span class="strip-icon">${icons.project}</span><span><b>${item.name}</b><small>${faDigits(item.panels.length)} پنل · ${item.status}</small></span>${item.id === project.id ? `<i class="strip-check">${icons.check}</i>` : ""}</button>`).join("")}</div></div>`;
}

function renderPanelList(project, panel) {
  const english = state.language === "en";
  const panelConnection = state.connectedPanelId === panel.id;
  return `<section class="panel-popup-wrap${state.panelMenuOpen ? " open" : " collapsed"}${state.panelMenuFloating ? " floating-open" : ""}" aria-label="${english ? "Project panels" : "پنل‌های پروژه"}">
    <div class="panel-popup-head">
      <div class="panel-popup-title"><span class="panel-popup-icon">${icons.panel}</span><div><span class="eyebrow">${english ? "PROJECT PANELS" : "پنل‌های پروژه"}</span><h3>${english ? "Panels in this project" : "پنل‌های این پروژه"}</h3><p>${faDigits(project.panels.length)} ${english ? "registered panels" : "پنل ثبت‌شده"}</p></div></div>
      <div class="panel-current-selection"><span>${icons.check}</span><div><small>${english ? "Selected panel" : "پنل انتخاب‌شده"}</small><b>${panel.name}</b><em>${panel.code}${panelConnection ? ` · ${english ? "Connected" : "متصل"}` : ""}</em></div></div>
      <div class="panel-popup-actions"><button type="button" class="icon-button small-icon" data-panel-refresh aria-label="${english ? "Refresh panels" : "به‌روزرسانی پنل‌ها"}">${icons.refresh}</button><button type="button" class="icon-button small-icon panel-popup-toggle" data-panel-menu-toggle aria-expanded="${state.panelMenuOpen}" aria-label="${state.panelMenuOpen ? (english ? "Minimize panels" : "مینیمایز کردن پنل‌ها") : (english ? "Expand panels" : "باز کردن پنل‌ها")}">${state.panelMenuOpen ? icons.chevronRight : icons.chevronLeft}</button></div>
    </div>
    <div class="panel-popup-body"><div class="panel-popup-list">${project.panels.map((item) => { const itemConnected = state.connectedPanelId === item.id; return `<div class="panel-list-item${item.id === panel.id ? " active" : ""}" data-panel-row="${item.id}"><button type="button" class="panel-select" data-panel-id="${item.id}"><span class="panel-list-icon">${icons.panel}</span><span class="panel-list-copy"><b>${item.name}</b><small>${item.code}</small><em class="panel-connection ${itemConnected ? "connected" : "offline"}"><i></i>${itemConnected ? (english ? "Connected" : "متصل") : (english ? "Offline" : item.status)}</em></span>${item.alarms ? `<span class="panel-alarm">${faDigits(item.alarms)}</span>` : ""}${item.id === panel.id ? `<span class="selected-line"></span>` : ""}</button><button type="button" class="panel-connect-button ${itemConnected ? "connected" : ""}" data-connect-panel="${item.id}">${itemConnected ? icons.check + (english ? "Disconnect" : "قطع اتصال") : icons.wifi + (english ? "Connect" : "اتصال")}</button></div>`; }).join("")}</div><div class="add-panel-hint">${icons.wifi}<span><b>${english ? "Add a new panel" : "پنل جدید اضافه کنید"}</b><small>${english ? "Panel connection is coming next" : "اتصال پنل در نسخه بعدی"}</small></span></div></div>
  </section>`;
}

function renderSettingsTree() {
  const renderNode = (node, depth = 0) => {
    const label = state.language === "en" ? node.en : node.label;
    const isOpen = state.openSettingsSections[node.id] !== false;
    return `<div class="tree-node depth-${depth}">${node.children ? `<button type="button" class="tree-parent${isOpen ? " open" : ""}" data-tree-parent="${node.id}"><span class="tree-chevron">${icons.chevronDown}</span>${icons[node.icon] || icons.settings}<span>${label}</span></button><div class="tree-children${isOpen ? " open" : " collapsed"}">${node.children.map((child) => renderNode(child, depth + 1)).join("")}</div>` : `<button type="button" class="tree-item${node.id === state.selectedSettingId ? " active" : ""}" data-setting-id="${node.id}">${icons[node.icon] || icons.settings}<span>${label}</span></button>`}</div>`;
  };
  const english = state.language === "en";
  return `<aside class="settings-tree-column${state.settingsTreeCollapsed ? " minimized" : ""}"><div class="column-heading"><div class="settings-tree-heading"><span class="settings-tree-icon">${icons.settings}</span><div><span class="eyebrow">${english ? "PANEL CONFIGURATION" : "پیکربندی پنل"}</span><h3>${english ? "Panel settings" : "تنظیمات پنل"}</h3><p>${english ? "System configuration menu" : "منوی تنظیمات بر اساس مستندات سیستم"}</p></div></div><button type="button" class="icon-button small-icon settings-tree-toggle" data-settings-collapse aria-expanded="${!state.settingsTreeCollapsed}" aria-label="${state.settingsTreeCollapsed ? (english ? "Expand panel configuration" : "باز کردن پیکربندی پنل") : (english ? "Minimize panel configuration" : "مینیمایز کردن پیکربندی پنل")}">${state.settingsTreeCollapsed ? icons.chevronLeft : icons.chevronRight}</button></div><div class="settings-tree">${settingsTree.map((node) => renderNode(node)).join("")}</div><div class="tree-note">${icons.check}<span><b>${english ? "Settings guide" : "راهنمای تنظیمات"}</b><small>${english ? "Select an item to view its settings." : "برای مشاهده هر بخش، گزینه‌ی آن را انتخاب کنید."}</small></span></div></aside>`;
}

function renderDetailHeader(panel, settingTitle, settingEn) {
  const isConnected = state.connectedPanelId === panel.id;
  return `<section class="detail-header"><div><div class="eyebrow">${state.language === "en" ? "PANEL SETTINGS" : "تنظیمات پنل"}</div><h2>${settingTitle}</h2><p>${state.language === "en" ? "Configuration for" : "تنظیمات"} <b>${panel.name}</b> · ${panel.code}</p></div><div class="detail-actions"><button type="button" class="btn-secondary" data-read-setting>${icons.refresh}${state.language === "en" ? "Read" : "خواندن"}</button><button type="button" class="btn-primary${isConnected ? "" : " disabled"}" data-save-setting ${isConnected ? "" : "disabled"}>${icons.check}${isConnected ? (state.language === "en" ? "Save changes" : "ذخیره تغییرات") : (state.language === "en" ? "Connect panel first" : "ابتدا پنل را متصل کنید")}</button></div></section>`;
}

function renderSettingDetail(panel) {
  const labels = { setting: ["تنظیمات عمومی", "Setting"], "date-time": ["تاریخ و زمان", "Date & Time"], language: ["زبان رابط کاربری", "Language"], "panel-caption": ["عنوان پنل", "Panel Caption"], "password-change": ["تغییر پسورد", "Password Change"], relay: ["خروجی رله‌ها", "Relay Output"], "loop-active": ["کارت‌های لوپ فعال", "Active Loop Card"], network: ["تنظیمات شبکه", "Network"], "night-mode": ["حالت شب و روز", "Night Mode"], "loop-card": ["کارت لوپ", "Loop Card"], group: ["گروه‌بندی", "Group"], features: ["قابلیت‌ها", "Features"], events: ["رویدادها", "Events"], "remote-panel": ["پنل از راه دور", "Remote Panel"], report: ["گزارش‌ها", "Report"], gsm: ["تلفن‌کننده GSM", "GSM"], customize: ["سفارشی‌سازی تلفن‌کننده", "Customize"], location: ["موقعیت پنل", "Location"], monitoring: ["مانیتورینگ", "Monitoring"] };
  const [titleFa, titleEn] = labels[state.selectedSettingId] || labels["date-time"];
  const title = state.language === "en" ? titleEn : titleFa;
  const body = { setting: renderSystemSetting(), "date-time": renderDateTimeSetting(), language: renderLanguageSetting(), "panel-caption": renderPanelCaptionSetting(), "password-change": renderPasswordChangeSetting(), relay: renderRelaySetting(), "loop-active": renderLoopSetting(), network: renderNetworkSetting(), "night-mode": renderNightSetting(), "loop-card": renderLoopCardSetting(), group: renderGroupSetting(), features: renderFeaturesSetting(), events: renderEventsSetting(), "remote-panel": renderRemoteSetting(), report: renderReportSetting(), gsm: renderGsmSetting(), customize: renderCustomizeSetting(), location: renderLocationSetting(), monitoring: renderMonitoringSetting() }[state.selectedSettingId] || renderDateTimeSetting();
  return `${renderDetailHeader(panel, title, titleEn)}<section class="detail-body">${body}</section>`;
}

function renderSystemSetting() {
  const english = state.language === "en";
  return `<div class="system-overview-grid"><article class="sub-card system-overview-card"><div class="sub-card-head"><div><h3>${english ? "System settings" : "تنظیمات سیستم"}</h3><p>${english ? "Manage the panel-wide settings used for events, reports, access, and identification." : "تنظیمات کلی پنل برای ثبت رویدادها، گزارش‌ها، دسترسی و شناسایی پنل را مدیریت کنید."}</p></div><span class="status-chip green">${english ? "4 sections" : "۴ بخش"}</span></div><div class="system-setting-list"><div><span>${icons.calendar}</span><b>${english ? "Date & Time" : "تاریخ و زمان"}</b><small>${english ? "Keep event timestamps accurate" : "دقت زمان ثبت رویدادها"}</small></div><div><span>${icons.settings}</span><b>${english ? "Language" : "زبان"}</b><small>${english ? "Choose the interface language" : "انتخاب زبان رابط کاربری"}</small></div><div><span>${icons.panel}</span><b>${english ? "Panel Caption" : "عنوان پنل"}</b><small>${english ? "Identify this panel across the workspace" : "شناسایی پنل در بخش‌های مختلف"}</small></div><div><span>${icons.settings}</span><b>${english ? "Password Change" : "تغییر پسورد"}</b><small>${english ? "Protect installer account access" : "امن‌سازی دسترسی حساب نصاب"}</small></div></div>${renderSettingActions()}</article><article class="sub-card helper-card"><div class="helper-icon">${icons.settings}</div><h3>${english ? "System overview" : "نمای کلی سیستم"}</h3><p>${english ? "Use the expanded Setting menu to configure identity, language, time, and account security." : "از زیرمنوی تنظیمات عمومی برای پیکربندی هویت پنل، زبان، زمان و امنیت حساب استفاده کنید."}</p></article></div>`;
}

function renderPanelCaptionSetting() {
  const english = state.language === "en";
  const panel = findPanel();
  const displayCaption = `FIRE PANEL ${panel.code.split("-").pop()}`;
  return `<article class="sub-card"><div class="sub-card-head"><div><h3>${english ? "Panel Caption" : "عنوان پنل"}</h3><p>${english ? "Set the names used to identify this fire alarm panel." : "نام‌های مورد استفاده برای شناسایی پنل اعلام حریق را تعیین کنید."}</p></div><span class="status-chip green">${english ? "Ready" : "آماده"}</span></div><div class="compact-form panel-caption-form"><div class="field-block full"><label>${english ? "Panel name" : "نام پنل"}</label><div class="input-with-icon"><input type="text" value="${panel.name}" aria-label="${english ? "Panel name" : "نام پنل"}"></div><small class="field-hint">${english ? "This name remains unchanged when the interface language changes." : "این نام با تغییر زبان رابط کاربری بدون تغییر باقی می‌ماند."}</small></div><div class="field-block full"><label>${english ? "Display Caption" : "عنوان نمایشی پنل"}</label><div class="input-with-icon"><input class="english-input" type="text" value="${displayCaption}" maxlength="24" pattern="[A-Za-z0-9 _-]+" inputmode="text" data-english-only aria-label="${english ? "Display Caption" : "عنوان نمایشی پنل"}"></div><small class="field-hint display-caption-hint">${english ? "This value is shown on the panel display and must use English characters only (A-Z, 0-9, spaces, - or _)." : "این مقدار روی دیسپلی پنل نمایش داده می‌شود و حتماً باید فقط از کاراکترهای انگلیسی استفاده شود (حروف A-Z، اعداد، فاصله، - یا _)."}</small></div></div>${renderSettingActions()}</article>`;
}

function renderPasswordChangeSetting() {
  const english = state.language === "en";
  return `<article class="sub-card"><div class="sub-card-head"><div><h3>${english ? "Password Change" : "تغییر پسورد"}</h3><p>${english ? "Update the installer account password to keep access secure." : "برای حفظ امنیت دسترسی، رمز حساب نصاب را به‌روزرسانی کنید."}</p></div><span class="status-chip amber">${english ? "Local demo" : "نمونه محلی"}</span></div><div class="compact-form password-form"><div class="field-block"><label>${english ? "Current password" : "رمز فعلی"}</label><input class="password-input" type="password" placeholder="••••••••"></div><div class="field-block"><label>${english ? "New password" : "رمز جدید"}</label><input class="password-input" type="password" placeholder="••••••••"></div><div class="field-block full"><label>${english ? "Confirm new password" : "تکرار رمز جدید"}</label><input class="password-input" type="password" placeholder="••••••••"></div></div>${renderSettingActions()}</article>`;
}

function renderDateTimeSetting() {
  const english = state.language === "en";
  const gregorian = toGregorian(state.year, state.month, state.day);
  const date = `${faDigits(state.year)}/${faDigits(pad(state.month))}/${faDigits(pad(state.day))}`;
  const time = `${faDigits(pad(state.hour))}:${faDigits(pad(state.minute))}`;
  return `<article class="panel-card date-time-card detail-card"><div class="card-heading"><div class="heading-icon teal">${icons.calendar}</div><div><h3>${english ? "Set date and time" : "تنظیم تاریخ و ساعت"}</h3><p>${english ? "Keep the fire alarm panel date and time accurate for event logs." : "تاریخ و ساعت سیستم اعلام حریق را تنظیم کنید تا ثبت رویدادها دقیق باشد."}</p></div><span class="step-badge">${english ? "Active" : "فعال"}</span></div><div class="form-area"><div class="field-block date-field-wrap"><label for="date-input">${english ? "Panel date" : "تاریخ پنل"}</label><div class="input-with-icon"><input id="date-input" type="text" readonly value="${date}" aria-label="${english ? "Panel date" : "تاریخ پنل"}" aria-haspopup="dialog" aria-expanded="${state.calendarOpen}">${icons.calendar}</div>${renderCalendar()}</div><div class="field-block time-field-wrap"><label for="time-input">${english ? "Panel time" : "ساعت پنل"}</label><div class="input-with-icon time-input"><input id="time-input" type="text" readonly value="${time}" aria-label="${english ? "Panel time" : "ساعت پنل"}" aria-haspopup="dialog" aria-expanded="${state.timeOpen}">${icons.clock}</div>${renderTimePicker()}<small class="field-hint">${english ? "24-hour format" : "فرمت ساعت ۲۴ ساعته"}</small></div></div><div class="selected-summary"><div class="summary-icon">${icons.check}</div><div><span>${english ? "Selected value" : "مقدار انتخاب‌شده"}</span><b id="selection-summary">${date}${english ? ", time " : "، ساعت "}${time}</b><small id="gregorian-summary">${english ? "Gregorian equivalent: " : "معادل میلادی: "}${gregorian}</small></div><span class="local-badge">${english ? "Jalali" : "شمسی"}</span></div><div class="info-banner compact-banner"><div class="banner-icon">${icons.wifi}</div><div><b>${english ? "Panel is not connected for this project" : "اتصال پنل برای این پروژه فعال نیست"}</b><p>${english ? "Values stay in this form until the panel connection is established." : "مقادیر فعلاً در فرم نگه‌داری می‌شوند و بعد از اتصال قابل ارسال خواهند بود."}</p></div></div></article>`;
}

function renderLanguageSetting() {
  const english = state.language === "en";
  return `<article class="sub-card language-card"><div class="sub-card-head"><div><h3>${english ? "Interface language" : "زبان رابط کاربری"}</h3><p>${english ? "Choose the language for all menus and controls." : "زبان نمایش منوها، دکمه‌ها و کنترل‌های نرم‌افزار را انتخاب کنید."}</p></div><span class="status-chip green">${english ? "Ready" : "آماده"}</span></div><div class="language-form"><label for="language-select">${english ? "Application language" : "زبان نرم‌افزار"}</label><div class="language-select-wrap">${icons.settings}<select id="language-select" data-language-select aria-label="${english ? "Application language" : "زبان نرم‌افزار"}"><option value="fa" ${!english ? "selected" : ""}>فارسی</option><option value="en" ${english ? "selected" : ""}>English</option></select>${icons.chevronDown}</div><p class="language-note">${english ? "Project and panel names stay unchanged." : "نام پروژه‌ها و پنل‌ها بدون تغییر باقی می‌ماند."}</p></div></article>`;
}

function renderToggleRow(label, description, checked = true) {
  return `<label class="toggle-row"><span><b>${label}</b><small>${description}</small></span><input type="checkbox" ${checked ? "checked" : ""}><i></i></label>`;
}

function renderSettingActions() {
  const disabled = state.connectedPanelId ? "" : " disabled";
  return `<div class="inline-actions"><button type="button" class="btn-secondary${disabled}" data-read-setting${disabled}>${icons.refresh}خواندن از پنل</button><button type="button" class="btn-primary${disabled}" data-save-setting${disabled}>${icons.check}ذخیره تنظیمات</button></div>`;
}

function renderRelaySetting() {
  return `<div class="setting-panel-grid"><article class="sub-card"><div class="sub-card-head"><div><h3>خروجی رله‌ها</h3><p>عملکرد هر رله را برای رخدادهای پنل تعیین کنید.</p></div><span class="status-chip green">۳ رله فعال</span></div><div class="relay-list">${[["Relay 1", "حریق / Fire", "fire"], ["Relay 2", "خطا / Fault", "fault"], ["Relay 3", "پیش‌هشدار / Pre-Alarm", "pre"]].map(([name, value, key]) => `<div class="relay-row"><span class="relay-number">${icons.panel}</span><div><b>${name}</b><small>خروجی قابل تنظیم پنل</small></div><select data-setting-input="${key}"><option selected>${value}</option><option>نظارت / Supervisory</option><option>غیرفعال</option></select></div>`).join("")}</div>${renderSettingActions()}</article><article class="sub-card helper-card"><div class="helper-icon">${icons.bell}</div><h3>نکته کاربردی</h3><p>تنظیم خروجی رله‌ها رفتار تجهیزات جانبی مانند آژیر، فن و سیستم‌های اعلان را مشخص می‌کند.</p><div class="mini-status"><span class="status-pulse"></span>آخرین خواندن: امروز، ۱۰:۲۴</div></article></div>`;
}

function renderLoopSetting() {
  return `<article class="sub-card"><div class="sub-card-head"><div><h3>فعال‌سازی کارت‌های لوپ</h3><p>کارت‌هایی را که در این پنل نصب شده‌اند فعال کنید.</p></div><span class="status-chip green">۴ کارت</span></div><div class="loop-grid">${[1, 2, 3, 4].map((loop) => `<label class="loop-card-option"><input type="checkbox" checked><span>${icons.panel}<b>Loop Card ${faDigits(loop)}</b><small>فعال و آماده‌ی استفاده</small><i>${icons.check}</i></span></label>`).join("")}</div>${renderSettingActions()}</article>`;
}

function renderNetworkSetting() {
  const english = state.language === "en";
  const option = (label, description, enabled = true) => `<label class="network-option"><div><b>${label}</b><small>${description}</small></div><input type="checkbox" ${enabled ? "checked" : ""} aria-label="${label}"><i class="network-toggle" aria-hidden="true"></i></label>`;
  const section = (title, description, rows) => `<section class="network-section"><div class="network-section-head"><h4>${title}</h4><small>${description}</small></div><div class="network-section-list">${rows}</div></section>`;
  return `<article class="sub-card"><div class="sub-card-head"><div><h3>${english ? "Panel network settings" : "تنظیمات شبکه پنل‌ها"}</h3><p>${english ? "Configure network availability, master commands, and shared outputs." : "وضعیت شبکه، فرمان‌های سراسری و خروجی‌های مشترک را تنظیم کنید."}</p></div><span class="status-chip amber">${english ? "Draft" : "پیش‌نویس"}</span></div><div class="network-settings">${section(english ? "Network Status" : "وضعیت شبکه", english ? "Enable or disable panel networking." : "فعال یا غیرفعال کردن ارتباط شبکه پنل.", option(english ? "Network Status" : "وضعیت شبکه", english ? "Panel network communication" : "ارتباط شبکه پنل", true))}${section("Master Silence", english ? "Global silence command permissions." : "مجوزهای فرمان سکوت سراسری.", option(english ? "Send" : "ارسال", english ? "Send the silence command to network panels." : "ارسال فرمان سکوت به پنل‌های شبکه.", true) + option(english ? "Accept" : "دریافت", english ? "Accept silence commands from the network." : "پذیرش فرمان‌های سکوت از شبکه.", true))}${section("Master Evacuate", english ? "Global evacuation command permissions." : "مجوزهای فرمان تخلیه سراسری.", option(english ? "Send" : "ارسال", english ? "Send the evacuation command to network panels." : "ارسال فرمان تخلیه به پنل‌های شبکه.", false) + option(english ? "Accept" : "دریافت", english ? "Accept evacuation commands from the network." : "پذیرش فرمان‌های تخلیه از شبکه.", false))}${section(english ? "Network Output Configuration" : "پیکربندی خروجی شبکه", english ? "Choose which output states are shared across the network." : "انتخاب وضعیت خروجی‌هایی که در شبکه به اشتراک گذاشته می‌شوند.", option(english ? "Fire Output" : "خروجی حریق", english ? "Share fire output status on the network." : "اشتراک وضعیت خروجی حریق در شبکه.", true) + option(english ? "Fault Output" : "خروجی خطا", english ? "Share fault output status on the network." : "اشتراک وضعیت خروجی خطا در شبکه.", true) + option(english ? "Supervisory Output" : "خروجی نظارتی", english ? "Share supervisory output status on the network." : "اشتراک وضعیت خروجی نظارتی در شبکه.", true) + option("NAC’s", english ? "Share notification appliance circuit output." : "اشتراک خروجی مدار آژیر در شبکه.", false))}</div>${renderSettingActions()}</article>`;
}

function renderNightSetting() {
  const english = state.language === "en";
  const disabled = !state.connectedPanelId;
  const disabledAttr = disabled ? " disabled" : "";
  const statusLabel = (enabled) => enabled ? (english ? "Enabled" : "فعال") : (english ? "Disabled" : "غیرفعال");
  const timeValue = (hour, minute) => `${faDigits(pad(hour))}:${faDigits(pad(minute))}`;
  const switchRow = (id, label, description, enabled) => `<label class="night-switch-row${disabled ? " is-disabled" : ""}"><span><b>${label}</b><small>${description}</small></span><span class="night-switch-wrap"><em>${statusLabel(enabled)}</em><input type="checkbox" data-night-toggle="${id}" ${enabled ? "checked" : ""}${disabledAttr}><i class="night-switch"></i></span></label>`;
  const timeField = (kind, label, hour, minute) => `<div class="field-block night-time-field"><label for="night-time-${kind}">${label}</label><div class="input-with-icon time-input"><input id="night-time-${kind}" class="night-time-input" type="text" readonly value="${timeValue(hour, minute)}" data-night-time-input="${kind}" aria-label="${label}"${disabledAttr}>${icons.clock}</div>${renderNightTimePicker(kind, english)}</div>`;
  const weekendDays = english ? [["saturday", "Saturday"], ["sunday", "Sunday"], ["monday", "Monday"], ["tuesday", "Tuesday"], ["wednesday", "Wednesday"], ["thursday", "Thursday"], ["friday", "Friday"]] : [["saturday", "شنبه"], ["sunday", "یکشنبه"], ["monday", "دوشنبه"], ["tuesday", "سه‌شنبه"], ["wednesday", "چهارشنبه"], ["thursday", "پنجشنبه"], ["friday", "جمعه"]];
  const dayOptions = (selected) => weekendDays.map(([value, label]) => `<option value="${value}" ${selected === value ? "selected" : ""}>${label}</option>`).join("");
  const selectedHoliday = state.holidayDates[state.selectedHolidayIndex] || { year: state.holidayYear, month: state.holidayMonth, day: state.holidayDay };
  const holidayRows = state.holidayDates.length ? state.holidayDates.map((holiday, index) => `<button type="button" class="holiday-entry${index === state.selectedHolidayIndex ? " selected" : ""}" data-holiday-select="${index}"><span>${faDigits(holiday.year)}/${faDigits(pad(holiday.month))}/${faDigits(pad(holiday.day))}</span><b>${english ? `Holiday ${index + 1}` : `تعطیلی ${faDigits(index + 1)}`}</b>${index === state.selectedHolidayIndex ? icons.check : ""}</button>`).join("") : `<p class="holiday-empty">${english ? "No holidays added yet." : "هنوز تعطیلی‌ای اضافه نشده است."}</p>`;
  return `<div class="night-settings-root"><div class="setting-panel-grid"><article class="sub-card"><div class="sub-card-head"><div><h3>${english ? "Day / Night Mode" : "حالت شب و روز"}</h3><p>${english ? "Schedule when the panel uses day or night behavior." : "زمان اجرای حالت روز و شب پنل را برنامه‌ریزی کنید."}</p></div><span class="status-chip ${state.dailyDayNightEnabled ? "green" : "amber"}">${statusLabel(state.dailyDayNightEnabled)}</span></div><div class="night-setting-sections"><section class="night-setting-section"><div class="night-section-head"><h4>${english ? "Daily Day/Night" : "روز و شب روزانه"}</h4><small>${english ? "Automatic day and night schedule" : "برنامه خودکار حالت روز و شب"}</small></div>${switchRow("daily", english ? "Status" : "وضعیت", english ? "Enable or disable the daily schedule." : "برنامه روزانه را فعال یا غیرفعال کنید.", state.dailyDayNightEnabled)}${state.dailyDayNightEnabled ? `<div class="night-control-panel${disabled ? " is-disabled" : ""}">${timeField("start", english ? "Start Time" : "ساعت شروع", state.nightStartHour, state.nightStartMinute)}${timeField("end", english ? "End Time" : "ساعت پایان", state.nightEndHour, state.nightEndMinute)}</div>` : ""}</section><section class="night-setting-section"><div class="night-section-head"><h4>${english ? "Weekend" : "آخر هفته"}</h4><small>${english ? "Apply the night schedule on selected days" : "اعمال برنامه شب در روزهای انتخاب‌شده"}</small></div>${switchRow("weekend", english ? "Status" : "وضعیت", english ? "Enable or disable weekend behavior." : "عملکرد آخر هفته را فعال یا غیرفعال کنید.", state.weekendEnabled)}${state.weekendEnabled ? `<div class="night-control-panel weekend-panel${disabled ? " is-disabled" : ""}"><div class="field-block"><label>${english ? "Day 1" : "روز ۱"}</label><select data-weekend-day="1"${disabledAttr}>${dayOptions(state.weekendDay1)}</select></div><div class="field-block"><label>${english ? "Day 2" : "روز ۲"}</label><select data-weekend-day="2"${disabledAttr}>${dayOptions(state.weekendDay2)}</select></div></div>` : ""}</section><section class="night-setting-section holiday-setting-section"><div class="night-section-head"><h4>${english ? "Holiday" : "تعطیلات"}</h4><small>${english ? "Apply the night schedule on selected holidays" : "اعمال برنامه شب در تعطیلات انتخاب‌شده"}</small></div>${switchRow("holiday", english ? "Status" : "وضعیت", english ? "Enable or disable holiday behavior." : "عملکرد تعطیلات را فعال یا غیرفعال کنید.", state.holidayEnabled)}${state.holidayEnabled ? `<div class="night-control-panel holiday-control-panel${disabled ? " is-disabled" : ""}"><div class="field-block holiday-date-field"><label for="holiday-date-input">${english ? "Date" : "تاریخ"}</label><div class="input-with-icon"><input id="holiday-date-input" type="text" readonly value="${faDigits(selectedHoliday.year)}/${faDigits(pad(selectedHoliday.month))}/${faDigits(pad(selectedHoliday.day))}" data-holiday-date-input aria-label="${english ? "Holiday date" : "تاریخ تعطیلی"}"${disabledAttr}>${icons.calendar}</div>${renderHolidayCalendar()}</div><div class="holiday-actions"><button type="button" class="btn-primary compact" data-holiday-add${disabledAttr}>+ ${english ? "Add" : "افزودن"}</button><button type="button" class="btn-secondary compact" data-holiday-delete${disabledAttr}>${english ? "Delete" : "حذف"}</button></div><div class="holiday-list" role="listbox" aria-label="${english ? "Holiday dates" : "تاریخ‌های تعطیلات"}">${holidayRows}</div></div>` : ""}</section></div><div class="night-danger-actions"><button type="button" class="btn-danger compact" data-night-delete-all${disabledAttr}>${english ? "Delete All" : "حذف همه"}</button></div>${renderSettingActions()}</article></div></div>`;
}

function renderLoopCardSettingLegacy() {
  const english = state.language === "en";
  const disabled = !state.connectedPanelId;
  const disabledAttr = disabled ? " disabled" : "";
  const card = state.loopCards.find((item) => item.id === state.selectedLoopCardId) || state.loopCards[0];
  const devices = card?.devices || [];
  const typeLabel = (key) => { const type = loopDeviceTypes.find((item) => item.key === key) || loopDeviceTypes[0]; return english ? type.en : type.fa; };
  const categoryLabel = (key) => ({ relay: english ? "Relay" : "رله", control: english ? "Control" : "کنترل", other: english ? "Other" : "سایر", "cl-b-s-b": "CL-B-S-B", "cl-b-s-c": "CL-B-S-C" }[key] || key);
  const selectOptions = (options, selected) => options.map(([value, label]) => `<option value="${value}" ${selected === value ? "selected" : ""}>${label}</option>`).join("");
  const visibleDevices = state.loopDeviceFilter === "all" ? devices : devices.filter((device) => device.type === state.loopDeviceFilter);
  const rows = visibleDevices.length ? visibleDevices.map((device) => `<div class="loop-device-row${state.selectedLoopDeviceId === device.id ? " selected" : ""}"><label class="loop-row-selector"><input type="radio" name="loop-device-select" data-loop-device-select="${device.id}" ${state.selectedLoopDeviceId === device.id ? "checked" : ""}${disabledAttr}><span></span></label><div class="loop-number">${faDigits(pad(device.number))}</div><select data-loop-device-field="enabled" data-loop-device-id="${device.id}" aria-label="${english ? "Status" : "وضعیت"}"${disabledAttr}>${selectOptions([["enabled", english ? "Enable" : "فعال"], ["disabled", english ? "Disable" : "غیرفعال"]], device.enabled ? "enabled" : "disabled")}</select><select data-loop-device-field="style" data-loop-device-id="${device.id}" aria-label="${english ? "Wiring style" : "نوع سیم‌کشی"}"${disabledAttr}>${selectOptions([["class-b", "Class B"], ["class-a", "Class A"]], device.style)}</select><select data-loop-device-field="type" data-loop-device-id="${device.id}" aria-label="${english ? "Device" : "دیوایس"}"${disabledAttr}>${loopDeviceTypes.map((type) => `<option value="${type.key}" ${device.type === type.key ? "selected" : ""}>${english ? type.en : type.fa}</option>`).join("")}</select><select data-loop-device-field="category" data-loop-device-id="${device.id}" aria-label="${english ? "Category" : "دسته‌بندی"}"${disabledAttr}>${selectOptions(loopCategories.map((item) => [item, categoryLabel(item)]), device.category)}</select><input type="text" value="${device.ip}" data-loop-device-field="ip" data-loop-device-id="${device.id}" aria-label="IP"${disabledAttr}><select data-loop-device-field="deactivation" data-loop-device-id="${device.id}" aria-label="${english ? "Deactivation" : "غیرفعال‌سازی"}"${disabledAttr}>${selectOptions([["no", english ? "No" : "خیر"], ["yes", english ? "Yes" : "بله"]], device.deactivation ? "yes" : "no")}</select><select data-loop-device-field="sensitivity" data-loop-device-id="${device.id}" aria-label="${english ? "Sensitivity" : "حساسیت"}"${disabledAttr}>${selectOptions([["low", english ? "Low" : "کم"], ["medium", english ? "Medium" : "متوسط"], ["high", english ? "High" : "زیاد"]], device.sensitivity)}</select><select data-loop-device-field="nightMode" data-loop-device-id="${device.id}" aria-label="${english ? "Night mode" : "حالت کارکرد"}"${disabledAttr}>${selectOptions([["day", english ? "Day" : "روز"], ["night", english ? "Night" : "شب"]], device.nightMode)}</select><input type="text" value="${device.location}" data-loop-device-field="location" data-loop-device-id="${device.id}" aria-label="${english ? "Location" : "آدرس"}"${disabledAttr}></div>`).join("") : `<div class="loop-empty-state">${english ? "No devices match the selected filter." : "دیوایسی مطابق فیلتر انتخاب‌شده پیدا نشد."}</div>`;
  const cardChoices = state.loopCards.map((loopCard) => `<button type="button" class="loop-card-choice${loopCard.id === card?.id ? " selected" : ""}" data-loop-card-select="${loopCard.id}"${disabledAttr}><span><b>${loopCard.label}</b><small>${faDigits(loopCard.devices.length)} ${english ? "devices" : "دیوایس"}</small></span></button>`).join("");
  const filterOptions = [["all", english ? "All devices" : "همه دیوایس‌ها"], ...loopDeviceTypes.map((type) => [type.key, english ? type.en : type.fa])];
  return `<article class="sub-card loop-card-setting"><div class="sub-card-head"><div><h3>${english ? "Loop Card" : "کارت لوپ"}</h3><p>${english ? "Select a loop card and manage the devices installed on it." : "یک کارت لوپ را انتخاب کنید و دیوایس‌های نصب‌شده روی آن را مدیریت کنید."}</p></div><span class="status-chip ${disabled ? "amber" : "green"}">${disabled ? (english ? "Not connected" : "اتصال برقرار نیست") : (english ? "Connected" : "متصل")}</span></div><div class="loop-card-picker">${cardChoices}</div><div class="loop-toolbar"><div class="loop-toolbar-actions"><button type="button" class="btn-secondary compact" data-loop-read${disabledAttr}>${icons.refresh}${english ? "Read Device" : "شناسایی دیوایس"}</button><select class="loop-add-select" data-loop-new-type aria-label="${english ? "New device type" : "نوع دیوایس جدید"}"${disabledAttr}>${loopDeviceTypes.map((type) => `<option value="${type.key}">${english ? type.en : type.fa}</option>`).join("")}</select><button type="button" class="btn-primary compact" data-loop-add${disabledAttr}>+ ${english ? "Add Device" : "افزودن دیوایس"}</button><button type="button" class="btn-secondary compact" data-loop-print${disabledAttr}>${icons.report}${english ? "Print" : "چاپ"}</button></div><div class="loop-filter-controls"><label>${english ? "Filter Device" : "فیلتر دیوایس"}<select data-loop-filter-select${disabledAttr}>${filterOptions.map(([value, label]) => `<option value="${value}" ${state.loopDeviceFilter === value ? "selected" : ""}>${label}</option>`).join("")}</select></label><button type="button" class="btn-ghost compact" data-loop-filter-all${disabledAttr}>${english ? "Show All" : "نمایش همه"}</button></div></div><div class="loop-summary"><span>${english ? "Selected card" : "کارت انتخاب‌شده"}: <b>${card?.label || "LoopCard1"}</b></span><span>${english ? "Visible devices" : "دیوایس‌های قابل نمایش"}: <b>${faDigits(visibleDevices.length)}</b></span><span>${english ? "Total devices" : "مجموع دیوایس‌ها"}: <b>${faDigits(devices.length)}</b></span></div><div class="loop-device-scroller"><div class="loop-device-table"><div class="loop-device-head"><span></span><span>${english ? "Number Device" : "شماره دیوایس"}</span><span>${english ? "Status" : "وضعیت"}</span><span>${english ? "Style" : "نوع سیم‌کشی"}</span><span>${english ? "Device" : "دیوایس"}</span><span>${english ? "Category" : "دسته‌بندی"}</span><span>IP</span><span>${english ? "Deactivation" : "غیرفعال‌سازی"}</span><span>${english ? "Sensitivity" : "حساسیت"}</span><span>${english ? "Night Mode" : "حالت کارکرد"}</span><span>${english ? "Location" : "آدرس"}</span></div>${rows}</div></div><div class="loop-device-actions"><button type="button" class="btn-danger compact" data-loop-delete${disabledAttr}>${english ? "Delete" : "حذف"}</button><button type="button" class="btn-danger compact" data-loop-delete-all${disabledAttr}>${english ? "Delete All" : "حذف همه"}</button><span class="loop-action-spacer"></span><button type="button" class="btn-secondary compact" data-loop-save${disabledAttr}>${icons.check}${english ? "Save" : "ذخیره"}</button></div>${renderSettingActions()}</article>`;
}

function renderLoopCardSetting() {
  const english = state.language === "en";
  const disabled = !state.connectedPanelId;
  const disabledAttr = disabled ? " disabled" : "";
  const card = state.loopCards.find((item) => item.id === state.selectedLoopCardId) || state.loopCards[0];
  const devices = card?.devices || [];
  const deviceByAddress = new Map(devices.map((device) => [Number(device.number), device]));
  const typeLabel = (key) => { const type = loopDeviceTypes.find((item) => item.key === key) || loopDeviceTypes[0]; return english ? type.en : type.fa; };
  const categoryLabel = (key) => ({ relay: english ? "Relay" : "رله", control: english ? "Control" : "کنترل", other: english ? "Other" : "سایر", "cl-b-s-b": "CL-B-S-B", "cl-b-s-c": "CL-B-S-C" }[key] || key);
  const selectOptions = (options, selected) => options.map(([value, label]) => `<option value="${value}" ${selected === value ? "selected" : ""}>${label}</option>`).join("");
  const field = (device, name, content) => name === "location" ? `<input type="text" value="${content}" data-loop-device-field="${name}" data-loop-device-id="${device.id}" aria-label="${name}"${disabledAttr}>` : `<select data-loop-device-field="${name}" data-loop-device-id="${device.id}" aria-label="${name}"${disabledAttr}>${content}</select>`;
  const renderDeviceRow = (device) => `<div class="loop-device-row${state.selectedLoopDeviceId === device.id ? " selected" : ""}"><label class="loop-row-selector"><input type="radio" name="loop-device-select" data-loop-device-select="${device.id}" ${state.selectedLoopDeviceId === device.id ? "checked" : ""}${disabledAttr}><span></span></label><div class="loop-number">${faDigits(device.number)}</div>${field(device, "enabled", selectOptions([["enabled", english ? "Enable" : "فعال"], ["disabled", english ? "Disable" : "غیرفعال"]], device.enabled ? "enabled" : "disabled"))}${field(device, "style", selectOptions([["class-b", "Class B"], ["class-a", "Class A"]], device.style))}${field(device, "type", loopDeviceTypes.map((type) => [type.key, english ? type.en : type.fa]).map(([value, label]) => `<option value="${value}" ${device.type === value ? "selected" : ""}>${label}</option>`).join(""))}${field(device, "category", selectOptions(loopCategories.map((item) => [item, categoryLabel(item)]), device.category))}${field(device, "inputType", selectOptions([["alarm", "Alarm"], ["supervisory", "Supervisory"]], device.inputType || "alarm"))}${field(device, "deactivation", selectOptions([["silence", english ? "Silence" : "سایلنس"], ["reset", english ? "Reset" : "ریست"], ["auto-reset", english ? "Auto Reset" : "اتو ریست"]], device.deactivation || "silence"))}${field(device, "sensitivity", selectOptions([["low", english ? "Low" : "کم"], ["medium", english ? "Medium" : "متوسط"], ["high", english ? "High" : "زیاد"]], device.sensitivity))}${field(device, "nightMode", selectOptions([["day", english ? "Day" : "روز"], ["night", english ? "Night" : "شب"]], device.nightMode))}${field(device, "location", device.location || "")}</div>`;
  const renderEmptyRow = (address) => `<div class="loop-device-row loop-empty-row"><span></span><button type="button" class="loop-empty-address" data-loop-empty-address="${address}"${disabledAttr}>${faDigits(address)}</button><span>—</span><span>—</span><span>—</span><span>—</span><span>—</span><span>—</span><span>—</span><span>—</span><span>${english ? "Empty slot" : "خانه خالی"}</span></div>`;
  const renderFilteredRow = (device) => `<div class="loop-device-row loop-filtered-row"><span></span><span class="loop-number">${faDigits(device.number)}</span><span class="loop-filtered-label">${english ? "Filtered" : "فیلتر شده"}</span><span>—</span><span>${typeLabel(device.type)}</span><span>—</span><span>—</span><span>—</span><span>—</span><span>—</span><span>—</span></div>`;
  const rows = Array.from({ length: 254 }, (_, index) => {
    const address = index + 1;
    const device = deviceByAddress.get(address);
    if (!device) return renderEmptyRow(address);
    if (state.loopDeviceFilter !== "all" && device.type !== state.loopDeviceFilter) return renderFilteredRow(device);
    return renderDeviceRow(device);
  }).join("");
  const countCards = loopDeviceTypes.map((type) => `<div class="loop-type-count"><span>${typeLabel(type.key)}</span><b>${faDigits(devices.filter((device) => device.type === type.key).length)}</b></div>`).join("");
  const filterOptions = [["all", english ? "All devices" : "همه دیوایس‌ها"], ...loopDeviceTypes.map((type) => [type.key, typeLabel(type.key)])];
  const cardChoices = state.loopCards.map((loopCard) => `<button type="button" class="loop-card-choice${loopCard.id === card?.id ? " selected" : ""}" data-loop-card-select="${loopCard.id}"${disabledAttr}><span><b>${loopCard.label}</b><small>${faDigits(loopCard.devices.length)} ${english ? "devices" : "دیوایس"}</small></span></button>`).join("");
  return `<article class="sub-card loop-card-setting"><div class="sub-card-head"><div><h3>${english ? "Loop Card" : "کارت لوپ"}</h3><p>${english ? "Select a loop card and manage its 1–254 device addresses." : "یک کارت لوپ را انتخاب کنید و آدرس‌های ۱ تا ۲۵۴ دیوایس آن را مدیریت کنید."}</p></div><span class="status-chip ${disabled ? "amber" : "green"}">${disabled ? (english ? "Not connected" : "اتصال برقرار نیست") : (english ? "Connected" : "متصل")}</span></div><div class="loop-card-picker">${cardChoices}</div><div class="loop-type-counts">${countCards}<div class="loop-type-count total"><span>${english ? "Total" : "مجموع"}</span><b>${faDigits(devices.length)}</b></div></div><div class="loop-toolbar"><div class="loop-toolbar-actions"><button type="button" class="btn-secondary compact" data-loop-read${disabledAttr}>${icons.refresh}${english ? "Read Device" : "شناسایی دیوایس"}</button></div><div class="loop-filter-controls"><label>${english ? "Filter Device" : "فیلتر دیوایس"}<select data-loop-filter-select${disabledAttr}>${filterOptions.map(([value, label]) => `<option value="${value}" ${state.loopDeviceFilter === value ? "selected" : ""}>${label}</option>`).join("")}</select></label><button type="button" class="btn-ghost compact" data-loop-filter-all${disabledAttr}>${english ? "Show All" : "نمایش همه"}</button></div></div><div class="loop-add-panel"><div class="loop-add-field"><label for="loop-address-input">${english ? "Device Address" : "آدرس دیوایس"}</label><input id="loop-address-input" type="number" min="1" max="254" step="1" inputmode="numeric" placeholder="${english ? "1–254 or automatic" : "۱ تا ۲۵۴ یا انتخاب خودکار"}" data-loop-address-input${disabledAttr}></div><div class="loop-add-field"><label>${english ? "Device Type" : "نوع دیوایس"}</label><select class="loop-add-select" data-loop-new-type${disabledAttr}>${loopDeviceTypes.map((type) => `<option value="${type.key}">${typeLabel(type.key)}</option>`).join("")}</select></div><button type="button" class="btn-primary compact loop-add-button" data-loop-add${disabledAttr}>+ ${english ? "Add Device" : "افزودن دیوایس"}</button><small class="loop-add-hint">${english ? "Click an empty address below to fill it automatically." : "برای تکمیل خودکار، روی یکی از آدرس‌های خالی زیر کلیک کنید."}</small><small class="loop-add-error">${state.loopAddError || ""}</small></div><div class="loop-summary"><span>${english ? "Selected card" : "کارت انتخاب‌شده"}: <b>${card?.label || "LoopCard1"}</b></span><span>${english ? "Empty addresses" : "آدرس‌های خالی"}: <b>${faDigits(254 - devices.length)}</b></span><span>${english ? "Address range" : "محدوده آدرس"}: <b dir="ltr">1–254</b></span></div><div class="loop-device-scroller"><div class="loop-device-table"><div class="loop-device-head"><span></span><span>${english ? "Address" : "آدرس"}</span><span>${english ? "Status" : "وضعیت"}</span><span>${english ? "Style" : "نوع سیم‌کشی"}</span><span>${english ? "Device" : "دیوایس"}</span><span>${english ? "Category" : "دسته‌بندی"}</span><span>${english ? "Input Type" : "نوع ورودی"}</span><span>${english ? "Deactivation" : "عملکرد غیرفعال‌سازی"}</span><span>${english ? "Sensitivity" : "حساسیت"}</span><span>${english ? "Night Mode" : "حالت کارکرد"}</span><span>${english ? "Location" : "موقعیت"}</span></div>${rows}</div></div><div class="loop-device-actions"><button type="button" class="btn-danger compact" data-loop-delete${disabledAttr}>${english ? "Delete" : "حذف"}</button><button type="button" class="btn-danger compact" data-loop-delete-all${disabledAttr}>${english ? "Delete All" : "حذف همه"}</button><span class="loop-action-spacer"></span><button type="button" class="btn-secondary compact" data-loop-print${disabledAttr}>${icons.report}${english ? "Print" : "چاپ"}</button><button type="button" class="btn-primary compact" data-loop-save${disabledAttr}>${icons.check}${english ? "Save" : "ذخیره"}</button></div></article>`;
}

function selectedLoopCard() {
  return state.loopCards.find((card) => card.id === state.selectedLoopCardId) || state.loopCards[0];
}

function redrawLoopCardSetting() {
  const root = document.querySelector(".loop-card-setting");
  if (!root) return;
  root.outerHTML = renderLoopCardSetting();
  bindLoopCardEvents();
}

function readLoopCardDevices(card) {
  card.devices = loopDeviceTypes.map((type, index) => makeLoopDevice(card.id, index + 1, type.key, {
    enabled: index !== 4,
    style: index % 3 === 0 ? "class-a" : "class-b",
    category: type.category,
    ip: `001.${String(index + 1).padStart(3, "0")}`,
    inputType: index % 3 === 0 ? "supervisory" : "alarm",
    deactivation: index === 4 ? "auto-reset" : index === 5 ? "reset" : "silence",
    sensitivity: index % 3 === 0 ? "high" : index % 3 === 1 ? "medium" : "low",
    nightMode: index % 2 === 0 ? "day" : "night",
    location: index % 2 === 0 ? "طبقه ۱ / راهروی مرکزی" : "طبقه ۲ / اتاق کنترل",
  }));
}

function bindLoopCardEventsLegacy() {
  const root = document.querySelector(".loop-card-setting");
  if (!root) return;
  const connected = Boolean(state.connectedPanelId);
  root.querySelectorAll("[data-loop-card-select]").forEach((button) => button.addEventListener("click", () => {
    if (!connected) return;
    state.selectedLoopCardId = button.dataset.loopCardSelect;
    state.selectedLoopDeviceId = null;
    state.loopDeviceFilter = "all";
    redrawLoopCardSetting();
  }));
  root.querySelectorAll("[data-loop-device-select]").forEach((input) => input.addEventListener("change", () => {
    if (!connected) return;
    state.selectedLoopDeviceId = input.dataset.loopDeviceSelect;
    root.querySelectorAll(".loop-device-row").forEach((row) => row.classList.toggle("selected", row.querySelector("[data-loop-device-select]")?.checked));
  }));
  const updateDeviceField = (control) => {
    const card = selectedLoopCard();
    const device = card?.devices.find((item) => item.id === control.dataset.loopDeviceId);
    if (!device) return;
    const field = control.dataset.loopDeviceField;
    if (field === "enabled") device.enabled = control.value === "enabled";
    else if (field === "deactivation") device.deactivation = control.value === "yes";
    else device[field] = control.value;
    if (field === "type") {
      const type = loopDeviceTypes.find((item) => item.key === device.type);
      if (type) {
        device.category = type.category;
        const categoryControl = root.querySelector(`[data-loop-device-field="category"][data-loop-device-id="${device.id}"]`);
        if (categoryControl) categoryControl.value = type.category;
      }
    }
  };
  root.querySelectorAll("[data-loop-device-field]").forEach((control) => {
    control.addEventListener("change", () => { if (connected) updateDeviceField(control); });
    if (control.tagName === "INPUT") control.addEventListener("input", () => { if (connected) updateDeviceField(control); });
  });
  root.querySelector("[data-loop-filter-select]")?.addEventListener("change", (event) => { if (!connected) return; state.loopDeviceFilter = event.target.value; redrawLoopCardSetting(); });
  root.querySelector("[data-loop-filter-all]")?.addEventListener("click", () => { if (!connected) return; state.loopDeviceFilter = "all"; redrawLoopCardSetting(); });
  root.querySelector("[data-loop-read]")?.addEventListener("click", () => {
    if (!connected) return;
    const card = selectedLoopCard();
    if (!card) return;
    readLoopCardDevices(card);
    state.loopDeviceFilter = "all";
    state.selectedLoopDeviceId = card.devices[0]?.id || null;
    redrawLoopCardSetting();
    showToast(state.language === "en" ? "Devices were read from the loop card." : "دیوایس‌های کارت لوپ شناسایی شدند.");
  });
  root.querySelector("[data-loop-add]")?.addEventListener("click", () => {
    if (!connected) return;
    const card = selectedLoopCard();
    const typeKey = root.querySelector("[data-loop-new-type]")?.value || loopDeviceTypes[0].key;
    const nextNumber = (card?.devices.reduce((max, device) => Math.max(max, Number(device.number) || 0), 0) || 0) + 1;
    const device = makeLoopDevice(card.id, nextNumber, typeKey, { location: "آدرس جدید دیوایس" });
    card.devices.push(device);
    state.loopDeviceFilter = "all";
    state.selectedLoopDeviceId = device.id;
    redrawLoopCardSetting();
    showToast(state.language === "en" ? "New device added." : "دیوایس جدید اضافه شد.");
  });
  root.querySelector("[data-loop-delete]")?.addEventListener("click", () => {
    if (!connected || !state.selectedLoopDeviceId) return;
    const card = selectedLoopCard();
    const index = card.devices.findIndex((device) => device.id === state.selectedLoopDeviceId);
    if (index < 0) return;
    card.devices.splice(index, 1);
    state.selectedLoopDeviceId = card.devices[index]?.id || card.devices[index - 1]?.id || null;
    redrawLoopCardSetting();
  });
  root.querySelector("[data-loop-delete-all]")?.addEventListener("click", () => {
    if (!connected) return;
    const message = state.language === "en" ? "Delete all devices from this loop card?" : "همه دیوایس‌های این کارت لوپ حذف شوند؟";
    if (!window.confirm(message)) return;
    const card = selectedLoopCard();
    card.devices = [];
    state.selectedLoopDeviceId = null;
    redrawLoopCardSetting();
    showToast(state.language === "en" ? "All loop card devices were deleted." : "تمام دیوایس‌های کارت لوپ حذف شدند.", "info");
  });
  root.querySelector("[data-loop-save]")?.addEventListener("click", () => {
    if (!connected) return;
    showToast(state.language === "en" ? "Loop card changes were saved." : "تغییرات کارت لوپ ذخیره شد.");
  });
  root.querySelector("[data-loop-print]")?.addEventListener("click", () => {
    if (connected) window.print();
  });
}

function setLoopAddError(message) {
  state.loopAddError = message;
  const error = document.querySelector(".loop-add-error");
  if (error) error.textContent = message;
}

function bindLoopCardEvents() {
  const root = document.querySelector(".loop-card-setting");
  if (!root) return;
  const connected = Boolean(state.connectedPanelId);
  const card = selectedLoopCard();
  root.querySelectorAll("[data-loop-card-select]").forEach((button) => button.addEventListener("click", () => {
    if (!connected) return;
    state.selectedLoopCardId = button.dataset.loopCardSelect;
    state.selectedLoopDeviceId = null;
    state.loopDeviceFilter = "all";
    state.loopAddError = "";
    redrawLoopCardSetting();
  }));
  root.querySelectorAll("[data-loop-device-select]").forEach((input) => input.addEventListener("change", () => {
    if (!connected) return;
    state.selectedLoopDeviceId = input.dataset.loopDeviceSelect;
    root.querySelectorAll(".loop-device-row").forEach((row) => row.classList.toggle("selected", row.querySelector("[data-loop-device-select]")?.checked));
  }));
  const updateDeviceField = (control) => {
    const device = card?.devices.find((item) => item.id === control.dataset.loopDeviceId);
    if (!device) return;
    device[control.dataset.loopDeviceField] = control.value;
    if (control.dataset.loopDeviceField === "enabled") device.enabled = control.value === "enabled";
    if (control.dataset.loopDeviceField === "type") {
      const type = loopDeviceTypes.find((item) => item.key === device.type);
      if (type) {
        device.category = type.category;
        const categoryControl = root.querySelector(`[data-loop-device-field="category"][data-loop-device-id="${device.id}"]`);
        if (categoryControl) categoryControl.value = type.category;
      }
    }
  };
  root.querySelectorAll("[data-loop-device-field]").forEach((control) => {
    control.addEventListener("change", () => { if (connected) updateDeviceField(control); });
    if (control.tagName === "INPUT") control.addEventListener("input", () => { if (connected) updateDeviceField(control); });
  });
  root.querySelector("[data-loop-address-input]")?.addEventListener("input", () => { if (state.loopAddError) setLoopAddError(""); });
  root.querySelectorAll("[data-loop-empty-address]").forEach((button) => button.addEventListener("click", () => {
    if (!connected) return;
    const input = root.querySelector("[data-loop-address-input]");
    if (!input) return;
    input.value = button.dataset.loopEmptyAddress;
    setLoopAddError("");
    input.focus();
  }));
  root.querySelector("[data-loop-filter-select]")?.addEventListener("change", (event) => { if (!connected) return; state.loopDeviceFilter = event.target.value; redrawLoopCardSetting(); });
  root.querySelector("[data-loop-filter-all]")?.addEventListener("click", () => { if (!connected) return; state.loopDeviceFilter = "all"; redrawLoopCardSetting(); });
  root.querySelector("[data-loop-read]")?.addEventListener("click", () => {
    if (!connected || !card) return;
    readLoopCardDevices(card);
    state.loopDeviceFilter = "all";
    state.selectedLoopDeviceId = card.devices[0]?.id || null;
    state.loopAddError = "";
    redrawLoopCardSetting();
    showToast(state.language === "en" ? "Devices were read from the loop card." : "دیوایس‌های کارت لوپ شناسایی شدند.");
  });
  root.querySelector("[data-loop-add]")?.addEventListener("click", () => {
    if (!connected || !card) return;
    const input = root.querySelector("[data-loop-address-input]");
    const rawAddress = input?.value.trim() || "";
    const occupied = new Set(card.devices.map((device) => Number(device.number)));
    let address;
    if (!rawAddress) address = Array.from({ length: 254 }, (_, index) => index + 1).find((candidate) => !occupied.has(candidate));
    else if (!/^\d+$/.test(rawAddress)) {
      setLoopAddError(state.language === "en" ? "Device address must be a whole number from 1 to 254." : "آدرس دیوایس باید یک عدد صحیح بین ۱ تا ۲۵۴ باشد.");
      return;
    } else address = Number(rawAddress);
    if (!rawAddress && !address) {
      setLoopAddError(state.language === "en" ? "All 254 device addresses are already occupied." : "هر ۲۵۴ آدرس دیوایس قبلاً استفاده شده‌اند.");
      return;
    }
    if (!address || address < 1 || address > 254) {
      setLoopAddError(state.language === "en" ? "Device address must be between 1 and 254." : "آدرس دیوایس باید بین ۱ تا ۲۵۴ باشد.");
      return;
    }
    if (occupied.has(address)) {
      setLoopAddError(state.language === "en" ? `Address ${address} is already assigned to a device.` : `آدرس ${faDigits(address)} قبلاً به یک دیوایس اختصاص داده شده است.`);
      return;
    }
    const typeKey = root.querySelector("[data-loop-new-type]")?.value || loopDeviceTypes[0].key;
    const device = makeLoopDevice(card.id, address, typeKey, { location: "آدرس جدید دیوایس" });
    card.devices.push(device);
    state.loopDeviceFilter = "all";
    state.selectedLoopDeviceId = device.id;
    state.loopAddError = "";
    redrawLoopCardSetting();
    showToast(state.language === "en" ? "New device added." : "دیوایس جدید اضافه شد.");
  });
  root.querySelector("[data-loop-delete]")?.addEventListener("click", () => {
    if (!connected || !card || !state.selectedLoopDeviceId) return;
    const index = card.devices.findIndex((device) => device.id === state.selectedLoopDeviceId);
    if (index < 0) return;
    card.devices.splice(index, 1);
    state.selectedLoopDeviceId = card.devices[index]?.id || card.devices[index - 1]?.id || null;
    redrawLoopCardSetting();
  });
  root.querySelector("[data-loop-delete-all]")?.addEventListener("click", () => {
    if (!connected || !card) return;
    const message = state.language === "en" ? "Delete all devices from this loop card?" : "همه دیوایس‌های این کارت لوپ حذف شوند؟";
    if (!window.confirm(message)) return;
    card.devices = [];
    state.selectedLoopDeviceId = null;
    redrawLoopCardSetting();
    showToast(state.language === "en" ? "All loop card devices were deleted." : "تمام دیوایس‌های کارت لوپ حذف شدند.", "info");
  });
  root.querySelector("[data-loop-save]")?.addEventListener("click", () => {
    if (connected) showToast(state.language === "en" ? "Loop card changes were saved." : "تغییرات کارت لوپ ذخیره شد.");
  });
  root.querySelector("[data-loop-print]")?.addEventListener("click", () => { if (connected) window.print(); });
}

function groupDeviceKey(loopId, deviceId) { return `${loopId}:${deviceId}`; }
function findGroupDevice(ref) {
  const card = state.loopCards.find((item) => item.id === ref?.loopId);
  return { card, device: card?.devices.find((item) => item.id === ref?.deviceId) };
}
function groupDeviceLabel(ref, english) {
  const { card, device } = findGroupDevice(ref);
  if (!device) return english ? "Unknown device" : "دیوایس ناشناخته";
  const type = loopDeviceTypes.find((item) => item.key === device.type) || loopDeviceTypes[0];
  return `${card?.label || ref.loopId} · ${english ? type.en : type.fa} · ${faDigits(device.number)}`;
}
function groupNumberOptions(selected, max = 64) {
  return Array.from({ length: max }, (_, index) => index + 1).map((number) => `<option value="${number}" ${Number(selected) === number ? "selected" : ""}>${faDigits(number)}</option>`).join("");
}
function groupLoopOptions(selected) {
  return state.loopCards.map((card) => `<option value="${card.id}" ${card.id === selected ? "selected" : ""}>${card.label}</option>`).join("");
}
function isOutputGroupDevice(device) { return device?.type === "sounder" || device?.type === "io" || device?.category === "relay"; }
function getIoGroup() {
  const key = `${state.ioInputGroupNumber}-${state.ioOutputGroupNumber}`;
  if (!state.ioRelations[key]) state.ioRelations[key] = { activeCount: 1, outputActiveFor: "fire", delay: 0, status: true };
  return state.ioRelations[key];
}
function renderGroupListItem(ref, english, selected = false) {
  const { card, device } = findGroupDevice(ref);
  if (!device) return "";
  const type = loopDeviceTypes.find((item) => item.key === device.type) || loopDeviceTypes[0];
  return `<button type="button" class="group-device-entry${selected ? " selected" : ""}" data-group-selected-key="${groupDeviceKey(ref.loopId, ref.deviceId)}"><span class="group-device-address">${faDigits(device.number)}</span><span><b>${english ? type.en : type.fa}</b><small>${card?.label || ref.loopId} · ${device.location || "—"}</small></span>${selected ? icons.check : icons.chevronLeft}</button>`;
}

function renderGroupSettingZone() {
  const english = state.language === "en";
  const disabled = !state.connectedPanelId;
  const disabledAttr = disabled ? " disabled" : "";
  const title = english ? "Group" : "گروه‌بندی";
  const description = english ? "Create and manage zone, input, and output device groups." : "گروه‌بندی زون و دیوایس‌های ورودی و خروجی را مدیریت کنید.";
  const selectField = (label, attr, options) => `<label class="group-field"><span>${label}</span><select ${attr}${disabledAttr}>${options}</select></label>`;
  const tabs = `<div class="group-tabs" role="tablist"><button type="button" class="group-tab${state.groupTab === "zone" ? " active" : ""}" data-group-tab="zone" role="tab" aria-selected="${state.groupTab === "zone"}">${english ? "Zone Group" : "گروهبندی زون"}</button><button type="button" class="group-tab${state.groupTab === "io" ? " active" : ""}" data-group-tab="io" role="tab" aria-selected="${state.groupTab === "io"}">${english ? "Input & Output Group" : "گروهبندی ورودی و خروجی"}</button></div>`;
  const toolbar = (kind) => `<div class="group-toolbar"><button type="button" class="btn-secondary compact" data-group-read-all="${kind}"${disabledAttr}>${icons.refresh}${english ? "Read All Groups" : "خواندن همه گروه‌ها"}</button><span class="group-connection-note ${disabled ? "offline" : "online"}">${disabled ? (english ? "Connect a panel to manage groups" : "برای مدیریت گروه‌ها پنل را متصل کنید") : (english ? "Panel connection active" : "اتصال پنل فعال است")}</span></div>`;
  const actions = (kind, includePrint = false) => `<div class="group-actions"><button type="button" class="btn-danger compact" data-group-delete="${kind}"${disabledAttr}>${english ? "Delete" : "حذف"}</button><button type="button" class="btn-danger compact" data-group-delete-all="${kind}"${disabledAttr}>${english ? "Delete All" : "حذف همه"}</button><span></span>${includePrint ? `<button type="button" class="btn-secondary compact" data-group-print${disabledAttr}>${icons.report}${english ? "Print" : "چاپ"}</button>` : ""}<button type="button" class="btn-secondary compact" data-group-save="${kind}"${disabledAttr}>${icons.check}${english ? "Save" : "ذخیره"}</button><button type="button" class="btn-primary compact" data-group-update="${kind}"${disabledAttr}>${icons.refresh}${english ? "Update All" : "به‌روزرسانی همه"}</button></div>`;

  if (state.groupTab === "zone") {
    const group = state.zoneGroups[state.zoneGroupNumber] || [];
    const selectedLoop = state.loopCards.find((card) => card.id === state.zoneLoopCardId) || state.loopCards[0];
    const groupedKeys = new Set(group.map((ref) => groupDeviceKey(ref.loopId, ref.deviceId)));
    const inputDevices = (selectedLoop?.devices || []).filter((device) => !groupedKeys.has(groupDeviceKey(selectedLoop.id, device.id)));
    const inputList = inputDevices.length ? inputDevices.map((device) => `<button type="button" class="group-device-entry" data-zone-input-device="${device.id}"${disabledAttr}><span class="group-device-address">${faDigits(device.number)}</span><span><b>${groupDeviceLabel({ loopId: selectedLoop.id, deviceId: device.id }, english)}</b><small>${device.location || "—"}</small></span>${icons.chevronLeft}</button>`).join("") : `<div class="group-device-empty">${english ? "No available input devices on this loop." : "دیوایس ورودی قابل انتخابی در این لوپ وجود ندارد."}</div>`;
    const groupedList = group.length ? group.map((ref) => renderGroupListItem(ref, english, state.groupSelectedDeviceKey === groupDeviceKey(ref.loopId, ref.deviceId))).join("") : `<div class="group-device-empty">${english ? "Click a device to add it to this group." : "برای افزودن دیوایس به گروه روی آن کلیک کنید."}</div>`;
    return `<article class="sub-card group-setting"><div class="sub-card-head"><div><h3>${title}</h3><p>${description}</p></div><span class="status-chip ${disabled ? "amber" : "green"}">${disabled ? (english ? "Not connected" : "متصل نیست") : (english ? "Ready" : "آماده")}</span></div>${tabs}${toolbar("zone")}<div class="group-form-grid">${selectField(english ? "Group Number" : "شماره گروه", "data-zone-group-number", groupNumberOptions(state.zoneGroupNumber))}${selectField(english ? "Loop Number" : "شماره لوپ کارت", "data-zone-loop", groupLoopOptions(state.zoneLoopCardId))}<label class="group-switch-field"><span><b>${english ? "Pre Alarm" : "پیش هشدار"}</b><small>${english ? "Enable pre-alarm for this zone group." : "پیش‌هشدار این گروه زون را فعال کنید."}</small></span><span class="group-switch-wrap"><em>${state.zonePreAlarm[state.zoneGroupNumber] ? (english ? "Enable" : "فعال") : (english ? "Disable" : "غیرفعال")}</em><input type="checkbox" data-zone-prealarm ${state.zonePreAlarm[state.zoneGroupNumber] ? "checked" : ""}${disabledAttr}><i class="network-toggle"></i></span></label></div><div class="group-device-columns zone-columns"><section class="group-device-panel"><div class="group-panel-head"><div><h4>${english ? "Input Devices" : "دیوایس‌های ورودی"}</h4><small>${english ? "Click a device to add it to the selected group." : "برای افزودن به گروه، دیوایس را انتخاب کنید."}</small></div><b>${faDigits(inputDevices.length)}</b></div><div class="group-device-list">${inputList}</div></section><section class="group-device-panel grouped-panel"><div class="group-panel-head"><div><h4>${english ? "Zone Grouped Devices List" : "لیست دیوایس‌های گروه‌بندی‌شده"}</h4><small>${english ? `Group ${state.zoneGroupNumber}` : `گروه ${faDigits(state.zoneGroupNumber)}`}</small></div><b>${faDigits(group.length)}</b></div><div class="group-device-list">${groupedList}</div></section></div>${actions("zone")}</article>`;
  }

  const group = getIoGroup();
  const selectedLoop = state.loopCards.find((card) => card.id === state.ioLoopCardId) || state.loopCards[0];
  const inputRefs = group.inputs || [];
  const outputRefs = group.outputs || [];
  const usedInputs = new Set(inputRefs.map((ref) => groupDeviceKey(ref.loopId, ref.deviceId)));
  const usedOutputs = new Set(outputRefs.map((ref) => groupDeviceKey(ref.loopId, ref.deviceId)));
  const availableInputs = (selectedLoop?.devices || []).filter((device) => !isOutputGroupDevice(device) && !usedInputs.has(groupDeviceKey(selectedLoop.id, device.id)));
  const availableOutputs = (selectedLoop?.devices || []).filter((device) => isOutputGroupDevice(device) && !usedOutputs.has(groupDeviceKey(selectedLoop.id, device.id)));
  const availableList = (items, kind) => items.length ? items.map((device) => `<button type="button" class="group-device-entry" data-io-add-device="${device.id}" data-io-kind="${kind}"${disabledAttr}><span class="group-device-address">${faDigits(device.number)}</span><span><b>${groupDeviceLabel({ loopId: selectedLoop.id, deviceId: device.id }, english)}</b><small>${device.location || "—"}</small></span>${icons.chevronLeft}</button>`).join("") : `<div class="group-device-empty">${english ? "No devices available." : "دیوایسی برای انتخاب وجود ندارد."}</div>`;
  const grouped = [...inputRefs.map((ref) => ({ ref, kind: "input" })), ...outputRefs.map((ref) => ({ ref, kind: "output" }))];
  const groupedList = grouped.length ? grouped.map(({ ref }) => renderGroupListItem(ref, english, state.groupSelectedDeviceKey === groupDeviceKey(ref.loopId, ref.deviceId))).join("") : `<div class="group-device-empty">${english ? "Add devices from the lists." : "دیوایس‌ها را از لیست‌های ورودی و خروجی اضافه کنید."}</div>`;
  const activeMax = inputRefs.length;
  const outputOptions = [["fire", english ? "Fire" : "حریق"], ["supervisory", english ? "Supervisory" : "نظارتی"], ["fault", english ? "Fault" : "خطا"], ["reset", english ? "Reset" : "ریست"], ["pre-alarm", english ? "Pre Alarm" : "پیش هشدار"]];
  return `<article class="sub-card group-setting"><div class="sub-card-head"><div><h3>${title}</h3><p>${description}</p></div><span class="status-chip ${disabled ? "amber" : "green"}">${disabled ? (english ? "Not connected" : "متصل نیست") : (english ? "Ready" : "آماده")}</span></div>${tabs}${toolbar("io")}<div class="group-form-grid io-group-selects">${selectField(english ? "Input Group Number" : "شماره گروه ورودی", "data-io-input-group", groupNumberOptions(state.ioInputGroupNumber))}${selectField(english ? "Output Group Number" : "شماره گروه خروجی", "data-io-output-group", groupNumberOptions(state.ioOutputGroupNumber))}${selectField(english ? "Loop Number" : "شماره لوپ کارت", "data-io-loop", groupLoopOptions(state.ioLoopCardId))}</div><div class="group-device-columns io-columns"><section class="group-device-panel"><div class="group-panel-head"><div><h4>${english ? "Input Devices" : "دیوایس‌های ورودی"}</h4><small>${english ? "Click or move all available inputs." : "انتخاب تکی یا گروهی دیوایس‌های ورودی"}</small></div><b>${faDigits(availableInputs.length)}</b></div><div class="group-device-list">${availableList(availableInputs, "input")}</div><button type="button" class="group-transfer-button" data-io-add-all="input"${disabledAttr}>&lt;&lt; ${english ? "Add all inputs" : "افزودن همه ورودی‌ها"}</button></section><section class="group-device-panel"><div class="group-panel-head"><div><h4>${english ? "Output Devices" : "دیوایس‌های خروجی"}</h4><small>${english ? "Click or move all available outputs." : "انتخاب تکی یا گروهی دیوایس‌های خروجی"}</small></div><b>${faDigits(availableOutputs.length)}</b></div><div class="group-device-list">${availableList(availableOutputs, "output")}</div><button type="button" class="group-transfer-button" data-io-add-all="output"${disabledAttr}>&lt;&lt; ${english ? "Add all outputs" : "افزودن همه خروجی‌ها"}</button></section><section class="group-device-panel grouped-panel"><div class="group-panel-head"><div><h4>${english ? "Input / Output Grouping" : "گروهبندی ورودی / خروجی"}</h4><small>${english ? `${inputRefs.length} inputs · ${outputRefs.length} outputs` : `${faDigits(inputRefs.length)} ورودی · ${faDigits(outputRefs.length)} خروجی`}</small></div><b>${faDigits(grouped.length)}</b></div><div class="group-device-list">${groupedList}</div></section></div><div class="group-form-grid group-parameters"><label class="group-field"><span>${english ? "Active Count" : "تعداد فعال"}</span><input type="number" min="${activeMax ? 1 : 0}" max="${Math.max(activeMax, 0)}" value="${Math.min(group.activeCount || (activeMax ? 1 : 0), activeMax)}" data-io-active-count${disabledAttr}></label><label class="group-field"><span>${english ? "Output Active for" : "فعال‌سازی خروجی برای"}</span><select data-io-output-active${disabledAttr}>${outputOptions.map(([value, label]) => `<option value="${value}" ${group.outputActiveFor === value ? "selected" : ""}>${label}</option>`).join("")}</select></label><label class="group-field"><span>${english ? "Delay (0–999 Sec)" : "تاخیر (۰ تا ۹۹۹ ثانیه)"}</span><input type="number" min="0" max="999" value="${group.delay ?? 0}" data-io-delay${disabledAttr}></label><label class="group-switch-field"><span><b>${english ? "Status" : "وضعیت"}</b><small>${english ? "Enable or disable this grouping." : "این گروه‌بندی را فعال یا غیرفعال کنید."}</small></span><span class="group-switch-wrap"><em>${group.status ? (english ? "Enable" : "فعال") : (english ? "Disable" : "غیرفعال")}</em><input type="checkbox" data-io-status ${group.status ? "checked" : ""}${disabledAttr}><i class="network-toggle"></i></span></label></div><div class="group-preview-row"><button type="button" class="btn-secondary compact" data-io-preview${disabledAttr}>${icons.dashboard}${english ? "Pre View" : "پیش نمایش"}</button>${state.groupPreviewOpen ? `<div class="group-preview"><b>${english ? "Input & Output Group Preview" : "پیش‌نمایش گروه ورودی و خروجی"}</b><span>${grouped.length ? grouped.map(({ ref }) => groupDeviceLabel(ref, english)).join(" · ") : (english ? "No devices selected" : "دیوایسی انتخاب نشده است")}</span></div>` : ""}</div>${actions("io", true)}</article>`;
}

function renderGroupSettingLegacy() {
  return `<article class="sub-card"><div class="sub-card-head"><div><h3>گروه‌بندی ورودی و خروجی</h3><p>دیوایس‌ها را برای اجرای سناریوهای مشترک گروه‌بندی کنید.</p></div><button type="button" class="btn-primary compact">+ گروه جدید</button></div><div class="group-list"><div><span class="group-color teal">۱</span><div><b>گروه حریق طبقات</b><small>۱۲ دیوایس · خروجی آژیر · تأخیر ۰ ثانیه</small></div><em>فعال</em>${icons.chevronLeft}</div><div><span class="group-color amber">۲</span><div><b>گروه ورودی‌های اضطراری</b><small>۴ دیوایس · خروجی رله ۲ · تأخیر ۵ ثانیه</small></div><em>فعال</em>${icons.chevronLeft}</div><div><span class="group-color sky">۳</span><div><b>گروه تجهیزات موتورخانه</b><small>۸ دیوایس · وضعیت نظارتی</small></div><em>پیش‌نویس</em>${icons.chevronLeft}</div></div></article>`;
}

function renderInputOutputGroupSettingLegacy() {
  const english = state.language === "en";
  const disabled = !state.connectedPanelId;
  const disabledAttr = disabled ? " disabled" : "";
  const actions = (kind, includePrint = false) => `<div class="group-actions"><button type="button" class="btn-danger compact" data-group-delete="${kind}"${disabledAttr}>${english ? "Delete" : "حذف"}</button><button type="button" class="btn-danger compact" data-group-delete-all="${kind}"${disabledAttr}>${english ? "Delete All" : "حذف همه"}</button><span></span>${includePrint ? `<button type="button" class="btn-secondary compact" data-group-print${disabledAttr}>${icons.report}${english ? "Print" : "چاپ"}</button>` : ""}<button type="button" class="btn-secondary compact" data-group-save="${kind}"${disabledAttr}>${icons.check}${english ? "Save" : "ذخیره"}</button><button type="button" class="btn-primary compact" data-group-update="${kind}"${disabledAttr}>${icons.refresh}${english ? "Update All" : "به‌روزرسانی همه"}</button></div>`;
  const inputRefs = state.ioInputGroups[state.ioInputGroupNumber] || [];
  const outputRefs = state.ioOutputGroups[state.ioOutputGroupNumber] || [];
  const relation = getIoGroup();
  const selectedLoop = state.loopCards.find((card) => card.id === state.ioLoopCardId) || state.loopCards[0];
  const inputKeys = new Set(inputRefs.map((ref) => groupDeviceKey(ref.loopId, ref.deviceId)));
  const outputKeys = new Set(outputRefs.map((ref) => groupDeviceKey(ref.loopId, ref.deviceId)));
  const availableInputs = (selectedLoop?.devices || []).filter((device) => !isOutputGroupDevice(device) && !inputKeys.has(groupDeviceKey(selectedLoop.id, device.id)));
  const availableOutputs = (selectedLoop?.devices || []).filter((device) => isOutputGroupDevice(device) && !outputKeys.has(groupDeviceKey(selectedLoop.id, device.id)));
  const grouped = [...inputRefs.map((ref) => ({ ref, kind: "input" })), ...outputRefs.map((ref) => ({ ref, kind: "output" }))];
  const tabs = `<div class="group-tabs" role="tablist"><button type="button" class="group-tab" data-group-tab="zone" role="tab">${english ? "Zone Group" : "گروهبندی زون"}</button><button type="button" class="group-tab active" data-group-tab="io" role="tab" aria-selected="true">${english ? "Input & Output Group" : "گروهبندی ورودی و خروجی"}</button></div>`;
  const optionList = (items) => items.length ? items.map((device) => `<button type="button" class="group-device-entry" data-io-add-device="${device.id}" data-io-kind="${isOutputGroupDevice(device) ? "output" : "input"}"${disabledAttr}><span class="group-device-address">${faDigits(device.number)}</span><span><b>${groupDeviceLabel({ loopId: selectedLoop.id, deviceId: device.id }, english)}</b><small>${device.location || "—"}</small></span>${icons.chevronLeft}</button>`).join("") : `<div class="group-device-empty">${english ? "No devices available on this loop." : "دیوایسی برای این گروه قابل انتخاب نیست."}</div>`;
  const groupedList = grouped.length ? grouped.map(({ ref, kind }) => `<div class="group-member-row"><span class="group-member-type">${kind === "input" ? (english ? "IN" : "ورودی") : (english ? "OUT" : "خروجی")}</span>${renderGroupListItem(ref, english, state.groupSelectedDeviceKey === groupDeviceKey(ref.loopId, ref.deviceId))}</div>`).join("") : `<div class="group-device-empty">${english ? "Add devices from the input and output lists." : "دیوایس‌ها را از دو لیست ورودی و خروجی اضافه کنید."}</div>`;
  const outputOptions = [["fire", english ? "Fire" : "حریق"], ["supervisory", english ? "Supervisory" : "نظارتی"], ["fault", english ? "Fault" : "خطا"], ["reset", english ? "Reset" : "ریست"], ["pre-alarm", english ? "Pre Alarm" : "پیش هشدار"]];
  const selectField = (label, attr, options) => `<label class="group-field"><span>${label}</span><select ${attr}${disabledAttr}>${options}</select></label>`;
  const relationSummary = english ? `Input Group ${state.ioInputGroupNumber} activates Output Group ${state.ioOutputGroupNumber} when ${outputOptions.find(([value]) => value === relation.outputActiveFor)?.[1] || "Fire"} occurs.` : `گروه ورودی ${faDigits(state.ioInputGroupNumber)} هنگام ${outputOptions.find(([value]) => value === relation.outputActiveFor)?.[1] || "حریق"}، گروه خروجی ${faDigits(state.ioOutputGroupNumber)} را فعال می‌کند.`;
  return `<article class="sub-card group-setting io-group-setting"><div class="sub-card-head"><div><h3>${english ? "Input & Output Group" : "گروهبندی ورودی و خروجی"}</h3><p>${english ? "Build input and output groups independently, then link them with a clear activation rule." : "گروه‌های ورودی و خروجی را جداگانه بسازید و سپس با یک شرط مشخص به هم مرتبط کنید."}</p></div><span class="status-chip ${disabled ? "amber" : "green"}">${disabled ? (english ? "Not connected" : "متصل نیست") : (english ? "Ready" : "آماده")}</span></div>${tabs}<div class="group-toolbar"><button type="button" class="btn-secondary compact" data-group-read-all="io"${disabledAttr}>${icons.refresh}${english ? "Read All Groups" : "خواندن همه گروه‌ها"}</button><span class="group-connection-note ${disabled ? "offline" : "online"}">${disabled ? (english ? "Connect a panel to manage groups" : "برای مدیریت گروه‌ها پنل را متصل کنید") : (english ? "Panel connection active" : "اتصال پنل فعال است")}</span></div><section class="group-relation-card"><div class="group-relation-head"><div><h4>${english ? "Input / Output Group Relation" : "ارتباط گروه ورودی و خروجی"}</h4><small>${english ? "Choose the group numbers first, then configure the rule that connects them." : "ابتدا شماره گروه‌ها را انتخاب کنید، سپس شرط ارتباط آن‌ها را تعیین کنید."}</small></div><span class="group-relation-badge">${icons.chevronLeft}</span></div><div class="group-form-grid io-group-selects">${selectField(english ? "Input Group Number (1–96)" : "شماره گروه ورودی (۱ تا ۹۶)", "data-io-input-group", groupNumberOptions(state.ioInputGroupNumber, 96))}${selectField(english ? "Output Group Number (1–96)" : "شماره گروه خروجی (۱ تا ۹۶)", "data-io-output-group", groupNumberOptions(state.ioOutputGroupNumber, 96))}${selectField(english ? "Loop Number" : "شماره لوپ کارت", "data-io-loop", groupLoopOptions(state.ioLoopCardId))}</div><div class="group-relation-summary">${icons.check}<span>${relationSummary}</span></div></section><div class="group-device-columns io-columns"><section class="group-device-panel"><div class="group-panel-head"><div><h4>${english ? "Input Devices" : "دیوایس‌های ورودی"}</h4><small>${english ? `Devices assigned to input group ${state.ioInputGroupNumber}` : `دیوایس‌های گروه ورودی ${faDigits(state.ioInputGroupNumber)}`}</small></div><b>${faDigits(availableInputs.length)}</b></div><div class="group-device-list">${optionList(availableInputs)}</div><button type="button" class="group-transfer-button" data-io-add-all="input"${disabledAttr}>&lt;&lt; ${english ? "Add all to input group" : "افزودن همه به گروه ورودی"}</button></section><section class="group-device-panel"><div class="group-panel-head"><div><h4>${english ? "Output Devices" : "دیوایس‌های خروجی"}</h4><small>${english ? `Devices assigned to output group ${state.ioOutputGroupNumber}` : `دیوایس‌های گروه خروجی ${faDigits(state.ioOutputGroupNumber)}`}</small></div><b>${faDigits(availableOutputs.length)}</b></div><div class="group-device-list">${optionList(availableOutputs)}</div><button type="button" class="group-transfer-button" data-io-add-all="output"${disabledAttr}>&lt;&lt; ${english ? "Add all to output group" : "افزودن همه به گروه خروجی"}</button></section><section class="group-device-panel grouped-panel"><div class="group-panel-head"><div><h4>${english ? "Selected Group Members" : "اعضای انتخاب‌شده گروه‌ها"}</h4><small>${english ? `${inputRefs.length} inputs · ${outputRefs.length} outputs` : `${faDigits(inputRefs.length)} ورودی · ${faDigits(outputRefs.length)} خروجی`}</small></div><b>${faDigits(grouped.length)}</b></div><div class="group-device-list">${groupedList}</div></section></div><div class="group-form-grid group-parameters"><label class="group-field"><span>${english ? "Active Count" : "تعداد فعال"}</span><input type="number" min="${inputRefs.length ? 1 : 0}" max="${Math.max(inputRefs.length, 0)}" value="${Math.min(relation.activeCount || (inputRefs.length ? 1 : 0), inputRefs.length)}" data-io-active-count${disabledAttr}></label><label class="group-field"><span>${english ? "Output Active for" : "فعال‌سازی خروجی برای"}</span><select data-io-output-active${disabledAttr}>${outputOptions.map(([value, label]) => `<option value="${value}" ${relation.outputActiveFor === value ? "selected" : ""}>${label}</option>`).join("")}</select></label><label class="group-field"><span>${english ? "Delay (0–999 Sec)" : "تاخیر (۰ تا ۹۹۹ ثانیه)"}</span><input type="number" min="0" max="999" value="${relation.delay ?? 0}" data-io-delay${disabledAttr}></label><label class="group-switch-field"><span><b>${english ? "Status" : "وضعیت"}</b><small>${english ? "Enable or disable this relation." : "این ارتباط را فعال یا غیرفعال کنید."}</small></span><span class="group-switch-wrap"><em>${relation.status ? (english ? "Enable" : "فعال") : (english ? "Disable" : "غیرفعال")}</em><input type="checkbox" data-io-status ${relation.status ? "checked" : ""}${disabledAttr}><i class="network-toggle"></i></span></label></div><div class="group-preview-row"><button type="button" class="btn-secondary compact" data-io-preview${disabledAttr}>${icons.dashboard}${english ? "Pre View" : "پیش‌نمایش"}</button>${state.groupPreviewOpen ? `<div class="group-preview"><b>${english ? "Relation Preview" : "پیش‌نمایش ارتباط"}</b><span>${relationSummary}</span></div>` : ""}</div>${actions("io", true)}</article>`;
}

function renderInputOutputGroupSetting() {
  const english = state.language === "en";
  const disabled = !state.connectedPanelId;
  const disabledAttr = disabled ? " disabled" : "";
  const relation = getIoGroup();
  const inputRefs = state.ioInputGroups[state.ioInputGroupNumber] || [];
  const outputRefs = state.ioOutputGroups[state.ioOutputGroupNumber] || [];
  const selectedLoop = state.loopCards.find((card) => card.id === state.ioLoopCardId) || state.loopCards[0];
  const inputKeys = new Set(inputRefs.map((ref) => groupDeviceKey(ref.loopId, ref.deviceId)));
  const outputKeys = new Set(outputRefs.map((ref) => groupDeviceKey(ref.loopId, ref.deviceId)));
  const availableInputs = (selectedLoop?.devices || []).filter((device) => !isOutputGroupDevice(device) && !inputKeys.has(groupDeviceKey(selectedLoop.id, device.id)));
  const availableOutputs = (selectedLoop?.devices || []).filter((device) => isOutputGroupDevice(device) && !outputKeys.has(groupDeviceKey(selectedLoop.id, device.id)));
  const grouped = [...inputRefs.map((ref) => ({ ref, kind: "input" })), ...outputRefs.map((ref) => ({ ref, kind: "output" }))];
  const selectField = (label, attr, options) => `<label class="group-field"><span>${label}</span><select ${attr}${disabledAttr}>${options}</select></label>`;
  const outputOptions = [["fire", english ? "Fire" : "حریق"], ["supervisory", english ? "Supervisory" : "نظارتی"], ["fault", english ? "Fault" : "خطا"], ["reset", english ? "Reset" : "ریست"], ["pre-alarm", english ? "Pre Alarm" : "پیش هشدار"]];
  const conditionLabel = outputOptions.find(([value]) => value === relation.outputActiveFor)?.[1] || outputOptions[0][1];
  const delay = Number(relation.delay) || 0;
  const relationSummary = delay > 0
    ? (english ? `Input Group ${state.ioInputGroupNumber} activates Output Group ${state.ioOutputGroupNumber} for ${conditionLabel} after ${delay} seconds.` : `گروه ورودی ${faDigits(state.ioInputGroupNumber)} هنگام ${conditionLabel}، پس از ${faDigits(delay)} ثانیه گروه خروجی ${faDigits(state.ioOutputGroupNumber)} را فعال می‌کند.`)
    : (english ? `Input Group ${state.ioInputGroupNumber} activates Output Group ${state.ioOutputGroupNumber} for ${conditionLabel}.` : `گروه ورودی ${faDigits(state.ioInputGroupNumber)} هنگام ${conditionLabel} گروه خروجی ${faDigits(state.ioOutputGroupNumber)} را فعال می‌کند.`);
  const savedRelationEntries = Object.entries(state.ioSavedRelations || {});
  const savedRelationList = savedRelationEntries.length
    ? savedRelationEntries.map(([key, saved]) => {
      const inputGroup = Number(saved.inputGroupNumber || key.split("-")[0]);
      const outputGroup = Number(saved.outputGroupNumber || key.split("-")[1]);
      const savedCondition = outputOptions.find(([value]) => value === saved.outputActiveFor)?.[1] || outputOptions[0][1];
      const savedDelay = Number(saved.delay) || 0;
      const savedSummary = savedDelay > 0
        ? (english ? `Input Group ${inputGroup} activates Output Group ${outputGroup} for ${savedCondition} after ${savedDelay} seconds.` : `گروه ورودی ${faDigits(inputGroup)} هنگام ${savedCondition}، پس از ${faDigits(savedDelay)} ثانیه گروه خروجی ${faDigits(outputGroup)} را فعال می‌کند.`)
        : (english ? `Input Group ${inputGroup} activates Output Group ${outputGroup} for ${savedCondition}.` : `گروه ورودی ${faDigits(inputGroup)} هنگام ${savedCondition} گروه خروجی ${faDigits(outputGroup)} را فعال می‌کند.`);
      return `<button type="button" class="saved-io-relation${key === `${state.ioInputGroupNumber}-${state.ioOutputGroupNumber}` ? " active" : ""}${saved.status ? "" : " inactive"}" data-io-saved-relation="${key}"><span class="saved-io-relation-groups"><b>${english ? `Input ${inputGroup}` : `ورودی ${faDigits(inputGroup)}`}</b><i>&gt;</i><b>${english ? `Output ${outputGroup}` : `خروجی ${faDigits(outputGroup)}`}</b></span><span class="saved-io-relation-summary">${savedSummary}</span></button>`;
    }).join("")
    : `<div class="saved-io-relation-empty">${english ? "Saved input/output relations will remain visible here." : "ارتباط‌های ذخیره‌شده‌ی ورودی و خروجی در این بخش باقی می‌مانند."}</div>`;
  const list = (devices) => devices.length ? devices.map((device) => `<button type="button" class="group-device-entry" data-io-add-device="${device.id}" data-io-kind="${isOutputGroupDevice(device) ? "output" : "input"}"${disabledAttr}><span class="group-device-address">${faDigits(device.number)}</span><span><b>${groupDeviceLabel({ loopId: selectedLoop.id, deviceId: device.id }, english)}</b><small>${device.location || "—"}</small></span>${icons.chevronLeft}</button>`).join("") : `<div class="group-device-empty">${english ? "No devices available on this loop." : "دیوایسی برای این لوپ وجود ندارد."}</div>`;
  const groupedList = grouped.length ? grouped.map(({ ref, kind }) => `<div class="group-member-row"><span class="group-member-type">${kind === "input" ? (english ? "IN" : "ورودی") : (english ? "OUT" : "خروجی")}</span>${renderGroupListItem(ref, english, state.groupSelectedDeviceKey === groupDeviceKey(ref.loopId, ref.deviceId))}</div>`).join("") : `<div class="group-device-empty">${english ? "Add devices from the lists above." : "دیوایس‌ها را از لیست‌های بالا اضافه کنید."}</div>`;
  const activeCount = Math.max(1, Math.min(16, Number(relation.activeCount) || 1));
  const activeCountOptions = Array.from({ length: 16 }, (_, index) => index + 1).map((value) => `<option value="${value}" ${activeCount === value ? "selected" : ""}>${faDigits(value)}</option>`).join("");
  const bottomActions = `<div class="group-actions"><span></span><button type="button" class="btn-secondary compact" data-group-print${disabledAttr}>${icons.report}${english ? "Print" : "چاپ"}</button><button type="button" class="btn-secondary compact" data-group-save="io"${disabledAttr}>${icons.check}${english ? "Save" : "ذخیره"}</button><button type="button" class="btn-primary compact" data-group-update="io"${disabledAttr}>${icons.refresh}${english ? "Update All" : "به‌روزرسانی همه"}</button></div>`;
  const tabs = `<div class="group-tabs" role="tablist"><button type="button" class="group-tab" data-group-tab="zone" role="tab">${english ? "Zone Group" : "گروهبندی زون"}</button><button type="button" class="group-tab active" data-group-tab="io" role="tab" aria-selected="true">${english ? "Input & Output Group" : "گروهبندی ورودی و خروجی"}</button></div>`;
  return `<article class="sub-card group-setting io-group-setting"><div class="sub-card-head"><div><h3>${english ? "Input & Output Group" : "گروهبندی ورودی و خروجی"}</h3><p>${english ? "Create input and output groups independently, then connect them with an activation rule." : "گروه‌های ورودی و خروجی را جداگانه بسازید و سپس با یک شرط مشخص به هم مرتبط کنید."}</p></div><span class="status-chip ${disabled ? "amber" : "green"}">${disabled ? (english ? "Not connected" : "متصل نیست") : (english ? "Ready" : "آماده")}</span></div>${tabs}<div class="group-toolbar"><button type="button" class="btn-secondary compact" data-group-read-all="io"${disabledAttr}>${icons.refresh}${english ? "Read All Groups" : "خواندن همه گروه‌ها"}</button><span class="group-connection-note ${disabled ? "offline" : "online"}">${disabled ? (english ? "Connect a panel to manage groups" : "برای مدیریت گروه‌ها پنل را متصل کنید") : (english ? "Panel connection active" : "اتصال پنل فعال است")}</span></div><section class="group-relation-card"><div class="group-relation-head"><div><h4>${english ? "Group Relation" : "ارتباط گروه‌ها"}</h4><small>${english ? "Select the input and output group numbers for this rule." : "شماره گروه ورودی و خروجی این ارتباط را انتخاب کنید."}</small></div><span class="group-relation-badge">${icons.chevronLeft}</span></div><div class="group-form-grid io-group-selects">${selectField(english ? "Input Group Number (1–96)" : "شماره گروه ورودی (۱ تا ۹۶)", "data-io-input-group", groupNumberOptions(state.ioInputGroupNumber, 96))}${selectField(english ? "Output Group Number (1–96)" : "شماره گروه خروجی (۱ تا ۹۶)", "data-io-output-group", groupNumberOptions(state.ioOutputGroupNumber, 96))}</div><div class="group-relation-summary">${icons.check}<span>${relationSummary}</span></div></section><section class="group-loop-selector"><div><h4>${english ? "Loop Card Devices" : "دیوایس‌های کارت لوپ"}</h4><small>${english ? "Choose a loop card to show its input and output devices below." : "یک کارت لوپ را انتخاب کنید تا دیوایس‌های ورودی و خروجی آن در ادامه نمایش داده شوند."}</small></div>${selectField(english ? "Loop Number" : "شماره لوپ کارت", "data-io-loop", groupLoopOptions(state.ioLoopCardId))}</section><div class="group-device-columns io-source-columns"><section class="group-device-panel"><div class="group-panel-head"><div><h4>${english ? "Input Devices" : "دیوایس‌های ورودی"}</h4><small>${english ? `Available for Input Group ${state.ioInputGroupNumber}` : `قابل افزودن به گروه ورودی ${faDigits(state.ioInputGroupNumber)}`}</small></div><b>${faDigits(availableInputs.length)}</b></div><div class="group-device-list">${list(availableInputs)}</div><button type="button" class="group-transfer-button" data-io-add-all="input"${disabledAttr}>&lt;&lt; ${english ? "Add all to input group" : "افزودن همه به گروه ورودی"}</button></section><section class="group-device-panel"><div class="group-panel-head"><div><h4>${english ? "Output Devices" : "دیوایس‌های خروجی"}</h4><small>${english ? `Available for Output Group ${state.ioOutputGroupNumber}` : `قابل افزودن به گروه خروجی ${faDigits(state.ioOutputGroupNumber)}`}</small></div><b>${faDigits(availableOutputs.length)}</b></div><div class="group-device-list">${list(availableOutputs)}</div><button type="button" class="group-transfer-button" data-io-add-all="output"${disabledAttr}>&lt;&lt; ${english ? "Add all to output group" : "افزودن همه به گروه خروجی"}</button></section></div><div class="group-config-layout"><section class="group-device-panel grouped-panel"><div class="group-panel-head"><div><h4>${english ? "Input / Output Grouping" : "گروهبندی ورودی و خروجی"}</h4><small>${english ? `${inputRefs.length} inputs · ${outputRefs.length} outputs` : `${faDigits(inputRefs.length)} ورودی · ${faDigits(outputRefs.length)} خروجی`}</small></div><b>${faDigits(grouped.length)}</b></div><div class="group-device-list">${groupedList}</div><div class="group-member-actions"><button type="button" class="btn-danger compact" data-group-delete="io"${disabledAttr}>${english ? "Delete" : "حذف"}</button><button type="button" class="btn-danger compact" data-group-delete-all="io"${disabledAttr}>${english ? "Delete All" : "حذف همه"}</button></div></section><aside class="group-parameters-rail"><label class="group-switch-field"><span><b>${english ? "Status" : "وضعیت"}</b><small>${english ? "Enable or disable this relation." : "این ارتباط را فعال یا غیرفعال کنید."}</small></span><span class="group-switch-wrap"><em>${relation.status ? (english ? "Enable" : "فعال") : (english ? "Disable" : "غیرفعال")}</em><input type="checkbox" data-io-status ${relation.status ? "checked" : ""}${disabledAttr}><i class="network-toggle"></i></span></label><label class="group-field"><span>${english ? "Active Count" : "تعداد فعال"}</span><select data-io-active-count${disabledAttr}>${activeCountOptions}</select></label><label class="group-field"><span>${english ? "Output Active for" : "فعال‌سازی خروجی برای"}</span><select data-io-output-active${disabledAttr}>${outputOptions.map(([value, label]) => `<option value="${value}" ${relation.outputActiveFor === value ? "selected" : ""}>${label}</option>`).join("")}</select></label><label class="group-field"><span>${english ? "Delay (0–999 Sec)" : "تاخیر (۰ تا ۹۹۹ ثانیه)"}</span><input type="number" min="0" max="999" value="${delay}" data-io-delay${disabledAttr}></label></aside></div>${bottomActions}</article>`;
}

function renderGroupSetting() {
  return state.groupTab === "io" ? renderInputOutputGroupSetting() : renderGroupSettingZone();
}

function redrawGroupSetting() {
  const root = document.querySelector(".group-setting");
  if (!root) return;
  root.outerHTML = renderGroupSetting();
  bindGroupSettingEvents();
}

function groupConnectionGuard() {
  if (state.connectedPanelId) return true;
  showToast(state.language === "en" ? "Connect a panel before managing groups." : "برای مدیریت گروه‌ها ابتدا پنل را متصل کنید.", "info");
  return false;
}

function arrangeIoGroupLayout() {
  const root = document.querySelector(".io-group-setting");
  const sourceColumns = root?.querySelector(".io-source-columns");
  const inputPanel = sourceColumns?.querySelector(".group-device-panel:first-child");
  const outputPanel = sourceColumns?.querySelector(".group-device-panel:nth-child(2)");
  const relationCard = root?.querySelector(".group-relation-card");
  if (sourceColumns && inputPanel && outputPanel && relationCard && relationCard.parentElement !== sourceColumns) outputPanel.after(relationCard);
  splitIoGroupedPanels();
  mountSavedIoRelations(root);
}

function mountSavedIoRelations(root) {
  const rail = root?.querySelector(".group-parameters-rail");
  if (!rail) return;
  rail.querySelector(".saved-io-relations")?.remove();
  const english = state.language === "en";
  const entries = Object.entries(state.ioSavedRelations || {});
  const outputOptions = [["fire", english ? "Fire" : "حریق"], ["supervisory", english ? "Supervisory" : "نظارتی"], ["fault", english ? "Fault" : "خطا"], ["reset", english ? "Reset" : "ریست"], ["pre-alarm", english ? "Pre Alarm" : "پیش هشدار"]];
  const content = entries.length ? entries.map(([key, saved]) => {
    const inputGroup = Number(saved.inputGroupNumber || key.split("-")[0]);
    const outputGroup = Number(saved.outputGroupNumber || key.split("-")[1]);
    const condition = outputOptions.find(([value]) => value === saved.outputActiveFor)?.[1] || outputOptions[0][1];
    const delay = Number(saved.delay) || 0;
    const summary = delay > 0
      ? (english ? `Input Group ${inputGroup} activates Output Group ${outputGroup} for ${condition} after ${delay} seconds.` : `گروه ورودی ${faDigits(inputGroup)} هنگام ${condition}، پس از ${faDigits(delay)} ثانیه گروه خروجی ${faDigits(outputGroup)} را فعال می‌کند.`)
      : (english ? `Input Group ${inputGroup} activates Output Group ${outputGroup} for ${condition}.` : `گروه ورودی ${faDigits(inputGroup)} هنگام ${condition} گروه خروجی ${faDigits(outputGroup)} را فعال می‌کند.`);
    return `<button type="button" class="saved-io-relation${key === `${state.ioInputGroupNumber}-${state.ioOutputGroupNumber}` ? " active" : ""}${saved.status ? "" : " inactive"}" data-io-saved-relation="${key}"><span class="saved-io-relation-groups"><b>${english ? `Input ${inputGroup}` : `ورودی ${faDigits(inputGroup)}`}</b><i>&gt;</i><b>${english ? `Output ${outputGroup}` : `خروجی ${faDigits(outputGroup)}`}</b></span><span class="saved-io-relation-summary">${summary}</span></button>`;
  }).join("") : `<div class="saved-io-relation-empty">${english ? "Saved input/output relations will remain visible here." : "ارتباط‌های ذخیره‌شده‌ی ورودی و خروجی در این بخش باقی می‌مانند."}</div>`;
  const section = document.createElement("section");
  section.className = "saved-io-relations";
  section.innerHTML = `<div class="saved-io-relations-head"><div><h4>${english ? "Saved Group Relations" : "ارتباط‌های ذخیره‌شده گروه‌ها"}</h4><small>${english ? "Saved input/output links remain visible here." : "ارتباط‌های ذخیره‌شده ورودی و خروجی همیشه در این بخش قابل مشاهده هستند."}</small></div><b>${faDigits(entries.length)}</b></div><div class="saved-io-relations-list">${content}</div>`;
  rail.append(section);
}

function splitIoGroupedPanels() {
  const root = document.querySelector(".io-group-setting");
  const configLayout = root?.querySelector(".group-config-layout");
  const groupedPanel = configLayout?.querySelector(":scope > .grouped-panel");
  if (!configLayout || !groupedPanel) return;
  const english = state.language === "en";
  const inputRefs = state.ioInputGroups[state.ioInputGroupNumber] || [];
  const outputRefs = state.ioOutputGroups[state.ioOutputGroupNumber] || [];
  const renderBox = (kind, refs, groupNumber) => {
    const title = kind === "input" ? (english ? "Input Group Devices" : "دیوایس‌های گروه ورودی") : (english ? "Output Group Devices" : "دیوایس‌های گروه خروجی");
    const description = kind === "input" ? (english ? `Devices assigned to Input Group ${groupNumber}` : `دیوایس‌های اختصاص‌یافته به گروه ورودی ${faDigits(groupNumber)}`) : (english ? `Devices assigned to Output Group ${groupNumber}` : `دیوایس‌های اختصاص‌یافته به گروه خروجی ${faDigits(groupNumber)}`);
    const rows = refs.length ? refs.map((ref) => renderGroupListItem(ref, english, state.groupSelectedDeviceKey === groupDeviceKey(ref.loopId, ref.deviceId))).join("") : `<div class="group-device-empty">${english ? "No devices in this group." : "هنوز دیوایسی در این گروه قرار نگرفته است."}</div>`;
    return `<section class="group-device-panel grouped-panel grouped-${kind}-panel"><div class="group-panel-head"><div><h4>${title}</h4><small>${description}</small></div><b>${faDigits(refs.length)}</b></div><div class="group-device-list">${rows}</div><div class="group-member-actions"><button type="button" class="btn-danger compact" data-group-delete="io-${kind}"${!state.connectedPanelId ? " disabled" : ""}>${english ? "Delete" : "حذف"}</button><button type="button" class="btn-danger compact" data-group-delete-all="io-${kind}"${!state.connectedPanelId ? " disabled" : ""}>${english ? "Delete All" : "حذف همه"}</button></div></section>`;
  };
  const wrapper = document.createElement("div");
  wrapper.className = "grouped-panels-wrap";
  wrapper.innerHTML = `${renderBox("input", inputRefs, state.ioInputGroupNumber)}${renderBox("output", outputRefs, state.ioOutputGroupNumber)}`;
  groupedPanel.replaceWith(wrapper);
}

function bindGroupSettingEvents() {
  const root = document.querySelector(".group-setting");
  if (!root) return;
  arrangeIoGroupLayout();
  root.querySelectorAll("[data-group-tab]").forEach((button) => button.addEventListener("click", () => {
    state.groupTab = button.dataset.groupTab;
    state.groupSelectedDeviceKey = null;
    state.groupPreviewOpen = false;
    redrawGroupSetting();
  }));
  root.querySelector("[data-zone-group-number]")?.addEventListener("change", (event) => { if (groupConnectionGuard()) { state.zoneGroupNumber = Number(event.target.value); state.groupSelectedDeviceKey = null; redrawGroupSetting(); } });
  root.querySelector("[data-zone-loop]")?.addEventListener("change", (event) => { if (groupConnectionGuard()) { state.zoneLoopCardId = event.target.value; state.groupSelectedDeviceKey = null; redrawGroupSetting(); } });
  root.querySelector("[data-zone-prealarm]")?.addEventListener("change", (event) => {
    if (!groupConnectionGuard()) return;
    state.zonePreAlarm[state.zoneGroupNumber] = event.target.checked;
    const status = event.target.closest(".group-switch-wrap")?.querySelector("em");
    if (status) status.textContent = event.target.checked ? (state.language === "en" ? "Enable" : "فعال") : (state.language === "en" ? "Disable" : "غیرفعال");
  });
  root.querySelectorAll("[data-zone-input-device]").forEach((button) => button.addEventListener("click", () => {
    if (!groupConnectionGuard()) return;
    const group = state.zoneGroups[state.zoneGroupNumber] || (state.zoneGroups[state.zoneGroupNumber] = []);
    const ref = { loopId: state.zoneLoopCardId, deviceId: button.dataset.zoneInputDevice };
    if (!group.some((item) => groupDeviceKey(item.loopId, item.deviceId) === groupDeviceKey(ref.loopId, ref.deviceId))) {
      group.push(ref); state.groupSelectedDeviceKey = groupDeviceKey(ref.loopId, ref.deviceId);
    }
    redrawGroupSetting();
  }));
  root.querySelector("[data-io-input-group]")?.addEventListener("change", (event) => { if (groupConnectionGuard()) { state.ioInputGroupNumber = Number(event.target.value); state.groupSelectedDeviceKey = null; redrawGroupSetting(); } });
  root.querySelector("[data-io-output-group]")?.addEventListener("change", (event) => { if (groupConnectionGuard()) { state.ioOutputGroupNumber = Number(event.target.value); state.groupSelectedDeviceKey = null; redrawGroupSetting(); } });
  root.querySelector("[data-io-loop]")?.addEventListener("change", (event) => { if (groupConnectionGuard()) { state.ioLoopCardId = event.target.value; state.groupSelectedDeviceKey = null; redrawGroupSetting(); } });
  root.querySelectorAll("[data-io-add-device]").forEach((button) => button.addEventListener("click", () => {
    if (!groupConnectionGuard()) return;
    const kind = button.dataset.ioKind;
    const list = kind === "output" ? (state.ioOutputGroups[state.ioOutputGroupNumber] || (state.ioOutputGroups[state.ioOutputGroupNumber] = [])) : (state.ioInputGroups[state.ioInputGroupNumber] || (state.ioInputGroups[state.ioInputGroupNumber] = []));
    const ref = { loopId: state.ioLoopCardId, deviceId: button.dataset.ioAddDevice };
    if (!list.some((item) => groupDeviceKey(item.loopId, item.deviceId) === groupDeviceKey(ref.loopId, ref.deviceId))) list.push(ref);
    state.groupSelectedDeviceKey = groupDeviceKey(ref.loopId, ref.deviceId);
    redrawGroupSetting();
  }));
  root.querySelectorAll("[data-io-add-all]").forEach((button) => button.addEventListener("click", () => {
    if (!groupConnectionGuard()) return;
    const selectedLoop = state.loopCards.find((card) => card.id === state.ioLoopCardId);
    const kind = button.dataset.ioAddAll;
    const list = kind === "output" ? (state.ioOutputGroups[state.ioOutputGroupNumber] || (state.ioOutputGroups[state.ioOutputGroupNumber] = [])) : (state.ioInputGroups[state.ioInputGroupNumber] || (state.ioInputGroups[state.ioInputGroupNumber] = []));
    (selectedLoop?.devices || []).filter((device) => (kind === "output" ? isOutputGroupDevice(device) : !isOutputGroupDevice(device))).forEach((device) => {
      const ref = { loopId: selectedLoop.id, deviceId: device.id };
      if (!list.some((item) => groupDeviceKey(item.loopId, item.deviceId) === groupDeviceKey(ref.loopId, ref.deviceId))) list.push(ref);
    });
    state.groupSelectedDeviceKey = null;
    redrawGroupSetting();
  }));
  root.querySelector("[data-io-active-count]")?.addEventListener("change", (event) => { if (groupConnectionGuard()) { const group = getIoGroup(); group.activeCount = Math.max(1, Math.min(16, Number(event.target.value) || 1)); redrawGroupSetting(); } });
  root.querySelector("[data-io-output-active]")?.addEventListener("change", (event) => { if (groupConnectionGuard()) { getIoGroup().outputActiveFor = event.target.value; redrawGroupSetting(); } });
  root.querySelector("[data-io-delay]")?.addEventListener("change", (event) => { if (groupConnectionGuard()) { getIoGroup().delay = Math.max(0, Math.min(999, Number(event.target.value) || 0)); redrawGroupSetting(); } });
  root.querySelector("[data-io-status]")?.addEventListener("change", (event) => {
    if (!groupConnectionGuard()) return;
    getIoGroup().status = event.target.checked;
    const status = event.target.closest(".group-switch-wrap")?.querySelector("em");
    if (status) status.textContent = event.target.checked ? (state.language === "en" ? "Enable" : "فعال") : (state.language === "en" ? "Disable" : "غیرفعال");
  });
  root.querySelector("[data-io-preview]")?.addEventListener("click", () => { if (groupConnectionGuard()) { state.groupPreviewOpen = !state.groupPreviewOpen; redrawGroupSetting(); } });
  root.querySelectorAll("[data-group-selected-key]").forEach((button) => button.addEventListener("click", () => {
    state.groupSelectedDeviceKey = button.dataset.groupSelectedKey;
    root.querySelectorAll("[data-group-selected-key]").forEach((item) => item.classList.toggle("selected", item === button));
  }));
  root.querySelectorAll("[data-io-saved-relation]").forEach((button) => button.addEventListener("click", () => {
    if (!groupConnectionGuard()) return;
    const key = button.dataset.ioSavedRelation;
    const saved = state.ioSavedRelations?.[key];
    if (!saved) return;
    state.ioInputGroupNumber = Number(saved.inputGroupNumber || key.split("-")[0]);
    state.ioOutputGroupNumber = Number(saved.outputGroupNumber || key.split("-")[1]);
    state.ioRelations[key] = { ...saved };
    state.groupSelectedDeviceKey = null;
    redrawGroupSetting();
  }));
  root.querySelectorAll("[data-group-read-all]").forEach((button) => button.addEventListener("click", () => {
    if (!groupConnectionGuard()) return;
    if (button.dataset.groupReadAll === "zone") {
      state.zoneGroups = {};
      state.loopCards.slice(0, 2).forEach((card, index) => { state.zoneGroups[index + 1] = card.devices.slice(0, 2).map((device) => ({ loopId: card.id, deviceId: device.id })); });
      state.zonePreAlarm = { 1: true, 2: false };
    } else {
      const card = state.loopCards.find((item) => item.id === state.ioLoopCardId) || state.loopCards[0];
      state.ioInputGroups[state.ioInputGroupNumber] = (card?.devices || []).filter((device) => !isOutputGroupDevice(device)).map((device) => ({ loopId: card.id, deviceId: device.id }));
      state.ioOutputGroups[state.ioOutputGroupNumber] = (card?.devices || []).filter(isOutputGroupDevice).map((device) => ({ loopId: card.id, deviceId: device.id }));
      state.ioRelations[`${state.ioInputGroupNumber}-${state.ioOutputGroupNumber}`] = { activeCount: 1, outputActiveFor: "fire", delay: 0, status: true };
    }
    state.groupSelectedDeviceKey = null;
    redrawGroupSetting();
    showToast(state.language === "en" ? "Groups were read from the panel." : "گروه‌ها از پنل خوانده شدند.");
  }));
  root.querySelectorAll("[data-group-delete]").forEach((button) => button.addEventListener("click", () => {
    if (!groupConnectionGuard()) return;
    if (button.dataset.groupDelete === "zone") {
      const group = state.zoneGroups[state.zoneGroupNumber] || [];
      state.zoneGroups[state.zoneGroupNumber] = group.filter((ref) => groupDeviceKey(ref.loopId, ref.deviceId) !== state.groupSelectedDeviceKey);
    } else if (button.dataset.groupDelete === "io-input" || button.dataset.groupDelete === "io-output") {
      const targetKind = button.dataset.groupDelete === "io-output" ? "output" : "input";
      const groups = targetKind === "output" ? state.ioOutputGroups : state.ioInputGroups;
      const groupNumber = targetKind === "output" ? state.ioOutputGroupNumber : state.ioInputGroupNumber;
      const group = groups[groupNumber] || [];
      groups[groupNumber] = group.filter((ref) => groupDeviceKey(ref.loopId, ref.deviceId) !== state.groupSelectedDeviceKey);
    } else {
      const inputGroup = state.ioInputGroups[state.ioInputGroupNumber] || [];
      const outputGroup = state.ioOutputGroups[state.ioOutputGroupNumber] || [];
      state.ioInputGroups[state.ioInputGroupNumber] = inputGroup.filter((ref) => groupDeviceKey(ref.loopId, ref.deviceId) !== state.groupSelectedDeviceKey);
      state.ioOutputGroups[state.ioOutputGroupNumber] = outputGroup.filter((ref) => groupDeviceKey(ref.loopId, ref.deviceId) !== state.groupSelectedDeviceKey);
    }
    state.groupSelectedDeviceKey = null;
    redrawGroupSetting();
  }));
  root.querySelectorAll("[data-group-delete-all]").forEach((button) => button.addEventListener("click", () => {
    if (!groupConnectionGuard()) return;
    if (!window.confirm(state.language === "en" ? "Delete all group data?" : "تمام اطلاعات گروه‌بندی حذف شود؟")) return;
    if (button.dataset.groupDeleteAll === "zone") { state.zoneGroups = {}; state.zonePreAlarm = {}; }
    else if (button.dataset.groupDeleteAll === "io-input") { delete state.ioInputGroups[state.ioInputGroupNumber]; }
    else if (button.dataset.groupDeleteAll === "io-output") { delete state.ioOutputGroups[state.ioOutputGroupNumber]; }
    else { state.ioInputGroups = {}; state.ioOutputGroups = {}; state.ioRelations = {}; state.ioSavedRelations = {}; state.ioGroups = {}; }
    state.groupSelectedDeviceKey = null;
    redrawGroupSetting();
    showToast(state.language === "en" ? "All group data was deleted." : "تمام اطلاعات گروه‌بندی حذف شد.", "info");
  }));
  root.querySelectorAll("[data-group-save]").forEach((button) => button.addEventListener("click", () => {
    if (!groupConnectionGuard()) return;
    if (button.dataset.groupSave === "io") {
      const key = `${state.ioInputGroupNumber}-${state.ioOutputGroupNumber}`;
      state.ioSavedRelations[key] = {
        ...getIoGroup(),
        inputGroupNumber: state.ioInputGroupNumber,
        outputGroupNumber: state.ioOutputGroupNumber,
        loopCardId: state.ioLoopCardId,
      };
      redrawGroupSetting();
      showToast(state.language === "en" ? "The input/output relation was saved and added to the list." : "ارتباط ورودی و خروجی ذخیره شد و به فهرست اضافه شد.");
      return;
    }
    showToast(state.language === "en" ? "Group changes were saved locally." : "تغییرات گروه‌بندی در نرم‌افزار ذخیره شد.");
  }));
  root.querySelectorAll("[data-group-update]").forEach((button) => button.addEventListener("click", () => { if (groupConnectionGuard()) showToast(state.language === "en" ? "All group changes were applied to the panel." : "تمام تغییرات گروه‌بندی روی پنل اعمال شد."); }));
  root.querySelector("[data-group-print]")?.addEventListener("click", () => { if (groupConnectionGuard()) window.print(); });
}

function renderFeaturesSetting() {
  return `<article class="sub-card"><div class="sub-card-head"><div><h3>قابلیت‌های پنل</h3><p>رفتارهای پیشرفته‌ی سیستم اعلام حریق را کنترل کنید.</p></div><span class="status-chip green">۵ فعال</span></div><div class="feature-grid">${renderToggleRow("تأخیر پیش‌هشدار", "مدت تأخیر قبل از فعال شدن آژیر", true)}${renderToggleRow("یادآوری خطا", "نمایش یادآوری برای خطاهای باز", true)}${renderToggleRow("خاموش‌سازی خودکار", "خاموشی خودکار خروجی پس از رخداد", false)}${renderToggleRow("قفل خروجی صدا", "جلوگیری از قطع صدای آژیر", true)}${renderToggleRow("تأیید دو مرحله‌ای", "تأیید عملیات حساس روی پنل", true)}${renderToggleRow("ثبت تاریخچه عملیات", "ذخیره اقدامات کاربران", true)}</div>${renderSettingActions()}</article>`;
}

function renderEventsSetting() {
  const events = [["حریق", "دتکتور دود · طبقه ۲", "امروز، ۰۹:۴۲", "fire"], ["خطای ارتباط", "Loop Card 2", "امروز، ۰۸:۱۵", "fault"], ["بازگشت به حالت عادی", "زون ۰۳", "دیروز، ۱۸:۲۱", "normal"]];
  return `<article class="sub-card"><div class="sub-card-head"><div><h3>رویدادهای پنل</h3><p>آخرین رخدادهای ثبت‌شده برای ${findPanel().name}</p></div><div class="sub-actions"><button type="button" class="btn-secondary compact">${icons.refresh}خواندن رویدادها</button><button type="button" class="btn-secondary compact">${icons.report}خروجی گزارش</button></div></div><div class="events-list">${events.map(([title, desc, time, type]) => `<div class="event-row"><span class="event-icon ${type}">${type === "fire" ? icons.bell : type === "fault" ? icons.wifi : icons.check}</span><div><b>${title}</b><small>${desc}</small></div><time>${time}</time><span class="event-chevron">${icons.chevronLeft}</span></div>`).join("")}</div></article>`;
}

function renderRemoteSetting() {
  return `<div class="remote-layout"><article class="sub-card remote-status"><div class="remote-graphic">${icons.wifi}<span></span></div><span class="status-chip amber">اتصال برقرار نیست</span><h3>پنل از راه دور</h3><p>برای مشاهده و همگام‌سازی پنل‌های دور، ابتدا ارتباط اینترنتی یا شبکه را تنظیم کنید.</p><button type="button" class="btn-secondary">تنظیم ارتباط</button></article><article class="sub-card"><div class="sub-card-head"><div><h3>پنل‌های همکار</h3><p>پنل‌هایی که برای همگام‌سازی انتخاب شده‌اند</p></div></div><div class="remote-list"><div><span>${icons.panel}</span><b>FIRE-CTRL-05</b><em>در انتظار اتصال</em></div><div><span>${icons.panel}</span><b>FIRE-CTRL-06</b><em>آفلاین</em></div><div><span>${icons.panel}</span><b>FIRE-CTRL-07</b><em>غیرفعال</em></div></div></article></div>`;
}

function renderReportSetting() {
  return `<article class="sub-card"><div class="sub-card-head"><div><h3>گزارش تنظیمات پنل</h3><p>گزارش خلاصه از وضعیت پیکربندی و دیوایس‌ها</p></div><button type="button" class="btn-primary compact">${icons.report}تولید گزارش</button></div><div class="report-preview"><div><span>${icons.panel}</span><b>وضعیت پنل</b><strong>آماده</strong></div><div><span>${icons.grid}</span><b>تعداد دیوایس‌ها</b><strong>۲۴</strong></div><div><span>${icons.bell}</span><b>رویدادهای باز</b><strong>۲</strong></div><div><span>${icons.check}</span><b>گروه‌های تنظیم‌شده</b><strong>۳</strong></div></div><div class="report-file">${icons.report}<span><b>گزارش پیکربندی FIRE-CTRL-04</b><small>آخرین تولید: امروز، ۱۰:۳۰ · PDF</small></span><button type="button" class="btn-secondary compact">دانلود</button></div></article>`;
}

function renderGsmSetting() {
  return `<div class="setting-panel-grid"><article class="sub-card"><div class="sub-card-head"><div><h3>تلفن‌کننده GSM</h3><p>وضعیت ارسال پیامک و تماس صوتی</p></div><span class="status-chip amber">آماده‌سازی</span></div><div class="gsm-number"><span>${icons.bell}</span><div><b>۰۹۱۲ ۳۴۵ ۶۷۸۹</b><small>شماره اصلی دریافت هشدار</small></div><button type="button" class="btn-secondary compact">ویرایش</button></div>${renderToggleRow("تماس صوتی هنگام حریق", "ارسال تماس به شماره‌های ثبت‌شده", true)}${renderToggleRow("ارسال پیامک خطا", "گزارش خطاهای پنل از طریق پیامک", true)}${renderSettingActions()}</article><article class="sub-card"><div class="sub-card-head"><div><h3>رویدادهای قابل ارسال</h3><p>انتخاب رخدادهای مهم</p></div></div>${renderToggleRow("حریق", "Fire Alarm", true)}${renderToggleRow("خطا", "Fault", true)}${renderToggleRow("نظارت", "Supervisory", false)}${renderToggleRow("بازگشت به حالت عادی", "Restore", false)}</article></div>`;
}

function renderCustomizeSetting() { return `<article class="sub-card"><div class="sub-card-head"><div><h3>سفارشی‌سازی اعلان‌ها</h3><p>متن و قالب پیام‌های ارسالی تلفن‌کننده را تعیین کنید.</p></div></div><div class="form-area compact-form"><div class="field-block"><label>عنوان پروژه در پیامک</label><div class="fake-input"><span>مجتمع اداری آفتاب</span></div></div><div class="field-block"><label>زبان پیام</label><div class="fake-input"><span>فارسی</span>${icons.chevronDown}</div></div><div class="field-block full"><label>قالب پیام حریق</label><textarea class="sample-textarea">هشدار حریق در {PROJECT} - {PANEL} - {TIME}</textarea></div></div>${renderSettingActions()}</article>`; }
function renderLocationSetting() { return `<article class="sub-card"><div class="sub-card-head"><div><h3>موقعیت پنل</h3><p>محل نصب پنل را برای نمایش در نقشه ثبت کنید.</p></div><span class="status-chip green">ثبت شده</span></div><div class="location-map"><div class="map-grid"></div><span class="map-pin">${icons.panel}</span><div class="map-label"><b>مجتمع اداری آفتاب</b><small>تهران، خیابان ولیعصر</small></div></div><div class="form-area compact-form"><div class="field-block"><label>طبقه / بخش</label><div class="fake-input"><span>اتاق کنترل، طبقه همکف</span></div></div><div class="field-block"><label>مختصات پروژه</label><div class="fake-input" dir="ltr"><span>35.7219, 51.3347</span></div></div></div>${renderSettingActions()}</article>`; }
function renderMonitoringSetting() { return `<div class="monitoring-grid"><article class="sub-card monitoring-hero"><div class="monitoring-ring"><span>${icons.dashboard}</span></div><span class="status-chip green">مانیتورینگ آماده</span><h3>مرکز مانیتورینگ</h3><p>وضعیت پنل‌ها، اتصال‌ها و رخدادها را از یک نمای واحد دنبال کنید.</p><button type="button" class="btn-primary">ورود به مانیتورینگ</button></article><article class="sub-card"><div class="sub-card-head"><div><h3>وضعیت سرویس‌ها</h3><p>آخرین بررسی خودکار سیستم</p></div></div>${renderToggleRow("مانیتورینگ زنده", "دریافت وضعیت پنل‌ها در لحظه", true)}${renderToggleRow("اعلان رخداد جدید", "نمایش هشدار در داشبورد نصاب", true)}${renderToggleRow("ثبت لاگ ارتباطات", "ثبت زمان و کاربر هر اتصال", true)}</article></div>`; }

function renderWorkspace(project) {
  const panel = findPanel();
  const shellClasses = ["workspace-shell", state.panelMenuOpen ? "panel-menu-open" : "panel-menu-collapsed", state.panelMenuOpen || state.panelMenuFloating ? "panel-menu-floating" : "", state.settingsTreeCollapsed ? "settings-menu-collapsed" : "settings-menu-open", !state.panelMenuOpen && state.settingsTreeCollapsed ? "menus-docked" : ""].filter(Boolean).join(" ");
  const layoutClasses = ["workspace-layout", state.settingsTreeCollapsed ? "settings-tree-minimized" : ""].filter(Boolean).join(" ");
  return `<section class="workspace-breadcrumb"><button type="button" data-back-projects>${icons.chevronRight}پروژه‌ها</button>${icons.chevronLeft}<span>${project.name}</span>${icons.chevronLeft}<b>${panel.name}</b></section>${renderProjectStrip(project)}<section class="${shellClasses}">${renderPanelList(project, panel)}<section class="${layoutClasses}">${renderSettingsTree()}<main class="setting-detail-column">${renderSettingDetail(panel)}</main></section></section>`;
}

function renderApp() {
  const project = findProject();
  const content = document.querySelector("#content-root");
  if (!content) return;
  activeLanguage = state.language;
  const isWorkspace = state.view === "workspace";
  document.querySelector("#topbar-title").textContent = isWorkspace ? project.name : "پروژه‌ها";
  document.querySelector("#topbar-subtitle").textContent = isWorkspace ? `${project.panels.length} پنل · مدیریت تنظیمات و مانیتورینگ` : "پروژه‌ها و پنل‌های تحت مدیریت شما";
  const hasSettingShortcut = [...document.querySelectorAll("[data-nav-setting]")].some((item) => item.dataset.navSetting === state.selectedSettingId);
  document.querySelectorAll("[data-nav-view]").forEach((item) => {
    const active = item.dataset.navView === state.view && (item.dataset.navSetting ? item.dataset.navSetting === state.selectedSettingId : !hasSettingShortcut);
    item.classList.toggle("active", active);
  });
  content.innerHTML = isWorkspace ? renderWorkspace(project) : renderProjectsPage();
  updateConnectionControl();
  bindViewEvents();
  document.documentElement.lang = state.language === "en" ? "en" : "fa";
  document.documentElement.dir = state.language === "en" ? "ltr" : "rtl";
  updateConnectionStatus();
  updateSidebarState();
  translateUI(document.querySelector("#app"));
  updateThemeButton();
}

function daysInMonth(year, month) { return month <= 6 ? 31 : month <= 11 ? 30 : isLeapJalaaliYear(year) ? 30 : 29; }
function renderCalendar() {
  if (!state.calendarOpen) return `<div class="calendar-popover hidden" id="calendar-popover"></div>`;
  const english = state.language === "en";
  const months = english ? englishMonthNames : monthNames;
  const days = english ? englishWeekDays : weekDays;
  const header = `<div class="calendar-header"><button class="calendar-nav" type="button" data-calendar-nav="prev" aria-label="${english ? "Previous" : "قبلی"}">${icons.chevronRight}</button><div class="calendar-title"><button type="button" class="calendar-select-button" data-calendar-view="months">${months[state.draftMonth - 1]}</button><button type="button" class="calendar-select-button year" data-calendar-view="years">${faDigits(state.draftYear)}</button></div><button class="calendar-nav" type="button" data-calendar-nav="next" aria-label="${english ? "Next" : "بعدی"}">${icons.chevronLeft}</button></div>`;
  const calendarActions = `<div class="calendar-actions"><button type="button" class="btn-ghost" data-date-cancel>${english ? "Cancel" : "انصراف"}</button><button type="button" class="btn-primary" data-date-confirm>${icons.check}${english ? "Confirm date" : "تأیید تاریخ"}</button></div>`;

  if (state.calendarMode === "months") {
    return `<div class="calendar-popover" id="calendar-popover" role="dialog" aria-label="${english ? "Select month" : "انتخاب ماه"}">${header}<div class="picker-grid month-picker">${months.map((month, index) => `<button type="button" class="picker-option${state.draftMonth === index + 1 ? " selected" : ""}" data-month-select="${index + 1}">${month}</button>`).join("")}</div><button class="today-button" type="button" data-today="true">${english ? "Today" : "امروز"}، ${faDigits(today[0])}/${faDigits(pad(today[1]))}/${faDigits(pad(today[2]))}</button>${calendarActions}</div>`;
  }

  if (state.calendarMode === "years") {
    const years = Array.from({ length: 12 }, (_, index) => state.calendarYearPage + index);
    return `<div class="calendar-popover" id="calendar-popover" role="dialog" aria-label="${english ? "Select year" : "انتخاب سال"}">${header}<div class="picker-grid year-picker">${years.map((year) => `<button type="button" class="picker-option${state.draftYear === year ? " selected" : ""}" data-year-select="${year}">${faDigits(year)}</button>`).join("")}</div><button class="today-button" type="button" data-today="true">${english ? "Today" : "امروز"}، ${faDigits(today[0])}/${faDigits(pad(today[1]))}/${faDigits(pad(today[2]))}</button>${calendarActions}</div>`;
  }

  const firstDay = new Date(`${toGregorian(state.draftYear, state.draftMonth, 1)}T12:00:00`).getDay();
  const saturdayIndex = (firstDay + 1) % 7;
  const cells = [];
  for (let i = 0; i < saturdayIndex; i++) cells.push(`<span class="calendar-day empty"></span>`);
  for (let day = 1; day <= daysInMonth(state.draftYear, state.draftMonth); day++) {
    const selected = day === state.draftDay ? " selected" : "";
    cells.push(`<button class="calendar-day${selected}" data-day="${day}" type="button">${faDigits(day)}</button>`);
  }
  return `<div class="calendar-popover" id="calendar-popover" role="dialog" aria-label="${english ? "Select date" : "انتخاب تاریخ"}">${header}<div class="week-row">${days.map((day) => `<span>${english ? day : day.slice(0, 2)}</span>`).join("")}</div><div class="days-grid">${cells.join("")}</div><button class="today-button" type="button" data-today="true">${english ? "Today" : "امروز"}، ${faDigits(today[0])}/${faDigits(pad(today[1]))}/${faDigits(pad(today[2]))}</button>${calendarActions}</div>`;
}

function renderHolidayCalendar() {
  if (!state.holidayCalendarOpen) return `<div class="calendar-popover hidden" id="holiday-calendar-popover"></div>`;
  const english = state.language === "en";
  const months = english ? englishMonthNames : monthNames;
  const days = english ? englishWeekDays : weekDays;
  const header = `<div class="calendar-header"><button class="calendar-nav" type="button" data-holiday-calendar-nav="prev" aria-label="${english ? "Previous" : "قبلی"}">${icons.chevronRight}</button><div class="calendar-title"><button type="button" class="calendar-select-button" data-holiday-calendar-view="months">${months[state.draftHolidayMonth - 1]}</button><button type="button" class="calendar-select-button year" data-holiday-calendar-view="years">${faDigits(state.draftHolidayYear)}</button></div><button class="calendar-nav" type="button" data-holiday-calendar-nav="next" aria-label="${english ? "Next" : "بعدی"}">${icons.chevronLeft}</button></div>`;
  const actions = `<div class="calendar-actions"><button type="button" class="btn-ghost" data-holiday-date-cancel>${english ? "Cancel" : "انصراف"}</button><button type="button" class="btn-primary" data-holiday-date-confirm>${icons.check}${english ? "Confirm date" : "تأیید تاریخ"}</button></div>`;
  const todayButton = `<button class="today-button" type="button" data-holiday-today="true">${english ? "Today" : "امروز"}، ${faDigits(today[0])}/${faDigits(pad(today[1]))}/${faDigits(pad(today[2]))}</button>`;
  if (state.holidayCalendarMode === "months") return `<div class="calendar-popover" id="holiday-calendar-popover" role="dialog" aria-label="${english ? "Select month" : "انتخاب ماه"}">${header}<div class="picker-grid month-picker">${months.map((month, index) => `<button type="button" class="picker-option${state.draftHolidayMonth === index + 1 ? " selected" : ""}" data-holiday-month-select="${index + 1}">${month}</button>`).join("")}</div>${todayButton}${actions}</div>`;
  if (state.holidayCalendarMode === "years") {
    const years = Array.from({ length: 12 }, (_, index) => state.holidayCalendarYearPage + index);
    return `<div class="calendar-popover" id="holiday-calendar-popover" role="dialog" aria-label="${english ? "Select year" : "انتخاب سال"}">${header}<div class="picker-grid year-picker">${years.map((year) => `<button type="button" class="picker-option${state.draftHolidayYear === year ? " selected" : ""}" data-holiday-year-select="${year}">${faDigits(year)}</button>`).join("")}</div>${todayButton}${actions}</div>`;
  }
  const firstDay = new Date(`${toGregorian(state.draftHolidayYear, state.draftHolidayMonth, 1)}T12:00:00`).getDay();
  const saturdayIndex = (firstDay + 1) % 7;
  const cells = [];
  for (let i = 0; i < saturdayIndex; i++) cells.push(`<span class="calendar-day empty"></span>`);
  for (let day = 1; day <= daysInMonth(state.draftHolidayYear, state.draftHolidayMonth); day++) {
    const selected = day === state.draftHolidayDay ? " selected" : "";
    cells.push(`<button class="calendar-day${selected}" data-holiday-day="${day}" type="button">${faDigits(day)}</button>`);
  }
  return `<div class="calendar-popover" id="holiday-calendar-popover" role="dialog" aria-label="${english ? "Select date" : "انتخاب تاریخ"}">${header}<div class="week-row">${days.map((day) => `<span>${english ? day : day.slice(0, 2)}</span>`).join("")}</div><div class="days-grid">${cells.join("")}</div>${todayButton}${actions}</div>`;
}

function renderNightTimePicker(kind, english) {
  if (state.nightTimeOpen !== kind) return `<div class="time-popover hidden" data-night-time-popover="${kind}"></div>`;
  const isStart = kind === "start";
  const hour = isStart ? state.draftNightStartHour : state.draftNightEndHour;
  const minute = isStart ? state.draftNightStartMinute : state.draftNightEndMinute;
  const wheel = (items, selected, field) => `<div class="wheel-viewport"><div class="wheel-options night-wheel ${field}-wheel" data-night-wheel="${field}"><span class="wheel-spacer" aria-hidden="true"></span>${items.map((value) => `<button type="button" class="time-option${selected === value ? " selected" : ""}" data-night-wheel-value="${value}">${faDigits(pad(value))}</button>`).join("")}<span class="wheel-spacer" aria-hidden="true"></span></div><div class="wheel-selection-band" aria-hidden="true"></div></div>`;
  return `<div class="time-popover night-time-popover" data-night-time-popover="${kind}" role="dialog" aria-label="${english ? "Select time" : "انتخاب ساعت"}"><div class="time-popover-head"><div><b>${english ? "Set time" : "تنظیم ساعت"}</b><small>${english ? "Scroll to the desired row" : "ردیف موردنظر را اسکرول کنید"}</small></div><strong data-night-draft-time="${kind}">${faDigits(pad(hour))}:${faDigits(pad(minute))}</strong></div><div class="time-picker-columns"><div class="time-picker-column"><label>${english ? "Hour" : "ساعت"}</label>${wheel(Array.from({ length: 24 }, (_, value) => value), hour, `${kind}-hour`)}</div><div class="time-picker-column"><label>${english ? "Minute" : "دقیقه"}</label>${wheel(Array.from({ length: 60 }, (_, value) => value), minute, `${kind}-minute`)}</div></div><div class="time-popover-actions"><button type="button" class="btn-ghost" data-night-time-cancel>${english ? "Cancel" : "انصراف"}</button><button type="button" class="btn-primary" data-night-time-confirm>${icons.check}${english ? "Confirm time" : "تأیید ساعت"}</button></div></div>`;
}

function renderTimePicker() {
  if (!state.timeOpen) return `<div class="time-popover hidden" id="time-popover"></div>`;
  const english = state.language === "en";
  const minuteOptions = Array.from({ length: 60 }, (_, minute) => minute);
  const wheel = (items, selected, attribute, type) => `<div class="wheel-viewport"><div class="wheel-options ${type}-wheel" data-wheel-type="${type}" data-selected="${selected}"><span class="wheel-spacer" aria-hidden="true"></span>${items.map((value) => `<button type="button" class="time-option${selected === value ? " selected" : ""}" data-${attribute}="${value}">${faDigits(pad(value))}</button>`).join("")}<span class="wheel-spacer" aria-hidden="true"></span></div><div class="wheel-selection-band" aria-hidden="true"></div></div>`;
  return `<div class="time-popover" id="time-popover" role="dialog" aria-label="${english ? "Select time" : "انتخاب ساعت"}"><div class="time-popover-head"><div><b>${english ? "Set panel time" : "انتخاب ساعت پنل"}</b><small>${english ? "Scroll to the desired row" : "ردیف موردنظر را اسکرول کنید"}</small></div><strong id="draft-time">${faDigits(pad(state.draftHour))}:${faDigits(pad(state.draftMinute))}</strong></div><div class="time-picker-columns"><div class="time-picker-column"><label>${english ? "Hour" : "ساعت"}</label>${wheel(Array.from({ length: 24 }, (_, hour) => hour), state.draftHour, "hour", "hour")}</div><div class="time-picker-column"><label>${english ? "Minute" : "دقیقه"}</label>${wheel(minuteOptions, state.draftMinute, "minute", "minute")}</div></div><div class="time-popover-actions"><button type="button" class="btn-ghost" data-time-cancel>${english ? "Cancel" : "انصراف"}</button><button type="button" class="btn-primary" data-time-confirm>${icons.check}${english ? "Confirm time" : "تأیید ساعت"}</button></div></div>`;
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
  if (timeInput) timeInput.value = `${faDigits(pad(state.hour))}:${faDigits(pad(state.minute))}`;
  if (summary) summary.textContent = `${faDigits(state.year)}/${faDigits(pad(state.month))}/${faDigits(pad(state.day))}${state.language === "en" ? ", time " : "، ساعت "}${faDigits(pad(state.hour))}:${faDigits(pad(state.minute))}`;
  const gregorian = document.querySelector("#gregorian-summary");
  if (gregorian) gregorian.textContent = `${state.language === "en" ? "Gregorian equivalent: " : "معادل میلادی: "}${toGregorian(state.year, state.month, state.day)}`;
}
function redrawCalendar() {
  const wrapper = document.querySelector(".date-field-wrap");
  if (!wrapper) return;
  const old = wrapper.querySelector("#calendar-popover");
  old?.remove();
  wrapper.insertAdjacentHTML("beforeend", renderCalendar());
  document.querySelector("#date-input")?.setAttribute("aria-expanded", String(state.calendarOpen));
}
function redrawTimePicker() {
  const wrapper = document.querySelector(".time-field-wrap");
  if (!wrapper) return;
  const old = wrapper.querySelector("#time-popover");
  old?.remove();
  wrapper.insertAdjacentHTML("beforeend", renderTimePicker());
  document.querySelector("#time-input")?.setAttribute("aria-expanded", String(state.timeOpen));
  if (state.timeOpen) requestAnimationFrame(() => {
    const hourWheel = document.querySelector(".hour-wheel");
    const minuteWheel = document.querySelector(".minute-wheel");
    setWheelPosition(hourWheel, state.draftHour);
    setWheelPosition(minuteWheel, state.draftMinute);
    bindWheel(hourWheel, "hour");
    bindWheel(minuteWheel, "minute");
  });
}

function setWheelPosition(wheel, value) {
  if (!wheel) return;
  const option = wheel.querySelector(`[data-${wheel.dataset.wheelType}="${value}"]`);
  if (option) wheel.scrollTop = option.offsetTop - (wheel.clientHeight - option.offsetHeight) / 2;
}

function updateWheelDraft(type, value) {
  if (type === "hour") state.draftHour = value;
  if (type === "minute") state.draftMinute = value;
  const wheel = document.querySelector(`.${type}-wheel`);
  wheel?.querySelectorAll(".time-option").forEach((option) => option.classList.toggle("selected", Number(option.dataset[type]) === value));
  const draftTime = document.querySelector("#draft-time");
  if (draftTime) draftTime.textContent = `${faDigits(pad(state.draftHour))}:${faDigits(pad(state.draftMinute))}`;
}

function getCenteredWheelValue(wheel) {
  if (!wheel) return null;
  const center = wheel.scrollTop + wheel.clientHeight / 2;
  let closest = null;
  let distance = Infinity;
  wheel.querySelectorAll(".time-option").forEach((option) => {
    const optionCenter = option.offsetTop + option.offsetHeight / 2;
    const currentDistance = Math.abs(optionCenter - center);
    if (currentDistance < distance) { closest = option; distance = currentDistance; }
  });
  return closest ? Number(closest.dataset[wheel.dataset.wheelType]) : null;
}

function bindWheel(wheel, type) {
  if (!wheel) return;
  let scrollTimer;
  wheel.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const value = getCenteredWheelValue(wheel);
      if (value !== null) updateWheelDraft(type, value);
    }, 70);
  }, { passive: true });
}
function changeMonth(delta) {
  state.calendarOpen = true;
  state.calendarMode = "days";
  state.draftMonth += delta;
  if (state.draftMonth === 13) { state.draftMonth = 1; state.draftYear += 1; }
  if (state.draftMonth === 0) { state.draftMonth = 12; state.draftYear -= 1; }
  state.draftDay = Math.min(state.draftDay, daysInMonth(state.draftYear, state.draftMonth));
  state.calendarYearPage = Math.floor(state.draftYear / 12) * 12;
  redrawCalendar();
}

function openDatePicker() {
  state.draftYear = state.year;
  state.draftMonth = state.month;
  state.draftDay = state.day;
  state.calendarYearPage = Math.floor(state.draftYear / 12) * 12;
  state.calendarMode = "days";
  state.calendarOpen = true;
}

function confirmDate() {
  state.year = state.draftYear;
  state.month = state.draftMonth;
  state.day = state.draftDay;
  state.calendarOpen = false;
  state.calendarMode = "days";
  redrawCalendar();
  updateSummary();
  showToast("تاریخ جدید انتخاب شد.");
}

function cancelDate() {
  state.draftYear = state.year;
  state.draftMonth = state.month;
  state.draftDay = state.day;
  state.calendarOpen = false;
  state.calendarMode = "days";
  redrawCalendar();
}
function updateThemeButton() {
  const button = document.querySelector("#theme-toggle");
  if (!button) return;
  const dark = document.documentElement.classList.contains("dark");
  button.innerHTML = dark ? icons.sun : icons.moon;
  button.setAttribute("aria-label", dark ? "فعال‌سازی حالت روشن" : "فعال‌سازی حالت تاریک");
  button.title = dark ? "حالت روشن" : "حالت تاریک";
}
function bindDateTimeEvents() {
  const $ = (selector) => document.querySelector(selector);
  const dateInput = $("#date-input");
  const dateField = $(".date-field-wrap");
  const timeField = $(".time-field-wrap");
  if (!dateInput || !dateField || !timeField) return;

  dateInput.addEventListener("click", () => {
    if (state.timeOpen) { showToast("ابتدا ساعت را تأیید یا لغو کنید.", "info"); return; }
    if (!state.calendarOpen) openDatePicker();
    redrawCalendar();
  });
  dateField.addEventListener("click", (event) => {
    const dayButton = event.target.closest("[data-day]");
    const calendarView = event.target.closest("[data-calendar-view]");
    const calendarNav = event.target.closest("[data-calendar-nav]");
    const monthSelect = event.target.closest("[data-month-select]");
    const yearSelect = event.target.closest("[data-year-select]");
    const todayButton = event.target.closest("[data-today]");
    const dateConfirm = event.target.closest("[data-date-confirm]");
    const dateCancel = event.target.closest("[data-date-cancel]");
    if (dayButton) { state.draftDay = Number(dayButton.dataset.day); redrawCalendar(); }
    if (calendarView) {
      state.calendarMode = calendarView.dataset.calendarView;
      if (state.calendarMode === "years") state.calendarYearPage = Math.floor(state.draftYear / 12) * 12;
      redrawCalendar();
    }
    if (calendarNav) {
      if (state.calendarMode === "years") {
        state.calendarYearPage += calendarNav.dataset.calendarNav === "next" ? 12 : -12;
        redrawCalendar();
      } else if (state.calendarMode === "months") {
        state.draftYear += calendarNav.dataset.calendarNav === "next" ? 1 : -1;
        state.draftDay = Math.min(state.draftDay, daysInMonth(state.draftYear, state.draftMonth));
        state.calendarYearPage = Math.floor(state.draftYear / 12) * 12;
        redrawCalendar();
      } else changeMonth(calendarNav.dataset.calendarNav === "next" ? 1 : -1);
    }
    if (monthSelect) { state.draftMonth = Number(monthSelect.dataset.monthSelect); state.draftDay = Math.min(state.draftDay, daysInMonth(state.draftYear, state.draftMonth)); state.calendarMode = "days"; redrawCalendar(); }
    if (yearSelect) { state.draftYear = Number(yearSelect.dataset.yearSelect); state.draftDay = Math.min(state.draftDay, daysInMonth(state.draftYear, state.draftMonth)); state.calendarYearPage = Math.floor(state.draftYear / 12) * 12; state.calendarMode = "days"; redrawCalendar(); }
    if (todayButton) { [state.draftYear, state.draftMonth, state.draftDay] = today; state.calendarMode = "days"; redrawCalendar(); }
    if (dateConfirm) confirmDate();
    if (dateCancel) cancelDate();
  });
  timeField.addEventListener("click", (event) => {
    const hourOption = event.target.closest("[data-hour]");
    const minuteOption = event.target.closest("[data-minute]");
    const confirmButton = event.target.closest("[data-time-confirm]");
    const cancelButton = event.target.closest("[data-time-cancel]");
    if (event.target.closest("#time-input")) {
      if (state.calendarOpen) { showToast("ابتدا تاریخ را تأیید یا لغو کنید.", "info"); return; }
      if (!state.timeOpen) { state.draftHour = state.hour; state.draftMinute = state.minute; state.timeOpen = true; }
      redrawTimePicker();
    }
    if (hourOption) { hourOption.scrollIntoView({ block: "center", behavior: "smooth" }); updateWheelDraft("hour", Number(hourOption.dataset.hour)); }
    if (minuteOption) { minuteOption.scrollIntoView({ block: "center", behavior: "smooth" }); updateWheelDraft("minute", Number(minuteOption.dataset.minute)); }
    if (confirmButton) { state.hour = state.draftHour; state.minute = state.draftMinute; state.timeOpen = false; redrawTimePicker(); updateSummary(); showToast("ساعت جدید انتخاب شد."); }
    if (cancelButton) { state.draftHour = state.hour; state.draftMinute = state.minute; state.timeOpen = false; redrawTimePicker(); }
  });
}

function updateNightDraftValue(field, value) {
  const [kind, unit] = field.split("-");
  if (kind === "start" && unit === "hour") state.draftNightStartHour = value;
  if (kind === "start" && unit === "minute") state.draftNightStartMinute = value;
  if (kind === "end" && unit === "hour") state.draftNightEndHour = value;
  if (kind === "end" && unit === "minute") state.draftNightEndMinute = value;
  const hour = kind === "start" ? state.draftNightStartHour : state.draftNightEndHour;
  const minute = kind === "start" ? state.draftNightStartMinute : state.draftNightEndMinute;
  const root = document.querySelector(".night-settings-root");
  root?.querySelector(`[data-night-draft-time="${kind}"]`)?.replaceChildren(document.createTextNode(`${faDigits(pad(hour))}:${faDigits(pad(minute))}`));
  root?.querySelectorAll(`[data-night-wheel="${field}"] .time-option`).forEach((option) => option.classList.toggle("selected", Number(option.dataset.nightWheelValue) === value));
}

function setNightWheelPosition(wheel, value) {
  if (!wheel) return;
  const option = wheel.querySelector(`[data-night-wheel-value="${value}"]`);
  if (option) wheel.scrollTop = option.offsetTop - (wheel.clientHeight - option.offsetHeight) / 2;
}

function getCenteredNightWheelValue(wheel) {
  if (!wheel) return null;
  const center = wheel.scrollTop + wheel.clientHeight / 2;
  let closest = null;
  let distance = Infinity;
  wheel.querySelectorAll(".time-option").forEach((option) => {
    const optionCenter = option.offsetTop + option.offsetHeight / 2;
    const currentDistance = Math.abs(optionCenter - center);
    if (currentDistance < distance) { closest = option; distance = currentDistance; }
  });
  return closest ? Number(closest.dataset.nightWheelValue) : null;
}

function bindNightWheel(wheel) {
  if (!wheel) return;
  let scrollTimer;
  wheel.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const value = getCenteredNightWheelValue(wheel);
      if (value !== null) updateNightDraftValue(wheel.dataset.nightWheel, value);
    }, 70);
  }, { passive: true });
}

function redrawNightSetting() {
  const root = document.querySelector(".night-settings-root");
  if (!root) return;
  root.outerHTML = renderNightSetting();
  bindNightSettingEvents();
}

function resetNightSettings() {
  state.dailyDayNightEnabled = false;
  state.nightStartHour = 22;
  state.nightStartMinute = 0;
  state.nightEndHour = 7;
  state.nightEndMinute = 0;
  state.weekendEnabled = false;
  state.weekendDay1 = "friday";
  state.weekendDay2 = "thursday";
  state.holidayEnabled = false;
  state.nightTimeOpen = null;
  state.holidayCalendarOpen = false;
  state.holidayCalendarMode = "days";
  state.holidayYear = today[0];
  state.holidayMonth = 1;
  state.holidayDay = 1;
  state.draftHolidayYear = today[0];
  state.draftHolidayMonth = 1;
  state.draftHolidayDay = 1;
  state.selectedHolidayIndex = 0;
  state.holidayDates = [];
}

function bindNightSettingEvents() {
  const root = document.querySelector(".night-settings-root");
  if (!root) return;
  const connected = Boolean(state.connectedPanelId);
  root.querySelectorAll("[data-night-toggle]").forEach((input) => input.addEventListener("change", () => {
    if (!connected) return;
    if (input.dataset.nightToggle === "daily") state.dailyDayNightEnabled = input.checked;
    if (input.dataset.nightToggle === "weekend") state.weekendEnabled = input.checked;
    if (input.dataset.nightToggle === "holiday") state.holidayEnabled = input.checked;
    redrawNightSetting();
  }));
  root.querySelectorAll("[data-weekend-day]").forEach((select) => select.addEventListener("change", () => {
    if (select.dataset.weekendDay === "1") state.weekendDay1 = select.value;
    if (select.dataset.weekendDay === "2") state.weekendDay2 = select.value;
  }));
  root.querySelectorAll("[data-night-time-input]").forEach((input) => input.addEventListener("click", () => {
    if (!connected) return;
    const kind = input.dataset.nightTimeInput;
    state.nightTimeOpen = kind;
    state.holidayCalendarOpen = false;
    if (kind === "start") { state.draftNightStartHour = state.nightStartHour; state.draftNightStartMinute = state.nightStartMinute; }
    if (kind === "end") { state.draftNightEndHour = state.nightEndHour; state.draftNightEndMinute = state.nightEndMinute; }
    redrawNightSetting();
  }));
  root.querySelectorAll(".night-wheel").forEach((wheel) => {
    bindNightWheel(wheel);
    const fieldParts = wheel.dataset.nightWheel.split("-");
    const kind = fieldParts[0];
    const unit = fieldParts[1];
    const value = kind === "start" ? (unit === "hour" ? state.draftNightStartHour : state.draftNightStartMinute) : (unit === "hour" ? state.draftNightEndHour : state.draftNightEndMinute);
    setNightWheelPosition(wheel, value);
  });
  root.addEventListener("click", (event) => {
    const wheelOption = event.target.closest("[data-night-wheel-value]");
    const wheel = event.target.closest(".night-wheel");
    const confirmTime = event.target.closest("[data-night-time-confirm]");
    const cancelTime = event.target.closest("[data-night-time-cancel]");
    const holidayInput = event.target.closest("[data-holiday-date-input]");
    const holidayDay = event.target.closest("[data-holiday-day]");
    const holidayView = event.target.closest("[data-holiday-calendar-view]");
    const holidayNav = event.target.closest("[data-holiday-calendar-nav]");
    const holidayMonth = event.target.closest("[data-holiday-month-select]");
    const holidayYear = event.target.closest("[data-holiday-year-select]");
    const holidayToday = event.target.closest("[data-holiday-today]");
    const holidayConfirm = event.target.closest("[data-holiday-date-confirm]");
    const holidayCancel = event.target.closest("[data-holiday-date-cancel]");
    const holidaySelect = event.target.closest("[data-holiday-select]");
    const holidayAdd = event.target.closest("[data-holiday-add]");
    const holidayDelete = event.target.closest("[data-holiday-delete]");
    const deleteAll = event.target.closest("[data-night-delete-all]");
    if (wheelOption && wheel) { updateNightDraftValue(wheel.dataset.nightWheel, Number(wheelOption.dataset.nightWheelValue)); wheelOption.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    if (confirmTime && connected) {
      if (state.nightTimeOpen === "start") { state.nightStartHour = state.draftNightStartHour; state.nightStartMinute = state.draftNightStartMinute; }
      if (state.nightTimeOpen === "end") { state.nightEndHour = state.draftNightEndHour; state.nightEndMinute = state.draftNightEndMinute; }
      state.nightTimeOpen = null; redrawNightSetting(); return;
    }
    if (cancelTime) { state.nightTimeOpen = null; redrawNightSetting(); return; }
    if (deleteAll && connected) {
      const message = state.language === "en" ? "Delete all day/night settings and holiday dates?" : "همه تنظیمات شب و روز و تاریخ‌های تعطیلات حذف شود؟";
      if (!window.confirm(message)) return;
      resetNightSettings();
      redrawNightSetting();
      showToast(state.language === "en" ? "All day/night settings were deleted." : "تمام تنظیمات شب و روز حذف شد.", "info");
      return;
    }
    if (holidayInput && connected) {
      state.nightTimeOpen = null; state.holidayCalendarOpen = true; state.holidayCalendarMode = "days"; state.draftHolidayYear = state.holidayYear; state.draftHolidayMonth = state.holidayMonth; state.draftHolidayDay = state.holidayDay; state.holidayCalendarYearPage = Math.floor(state.draftHolidayYear / 12) * 12; redrawNightSetting(); return;
    }
    if (holidayDay) { state.draftHolidayDay = Number(holidayDay.dataset.holidayDay); redrawNightSetting(); return; }
    if (holidayView) { state.holidayCalendarMode = holidayView.dataset.holidayCalendarView; if (state.holidayCalendarMode === "years") state.holidayCalendarYearPage = Math.floor(state.draftHolidayYear / 12) * 12; redrawNightSetting(); return; }
    if (holidayNav) {
      const direction = holidayNav.dataset.holidayCalendarNav === "next" ? 1 : -1;
      if (state.holidayCalendarMode === "years") state.holidayCalendarYearPage += direction * 12;
      else if (state.holidayCalendarMode === "months") state.draftHolidayYear += direction;
      else { state.draftHolidayMonth += direction; if (state.draftHolidayMonth === 13) { state.draftHolidayMonth = 1; state.draftHolidayYear += 1; } if (state.draftHolidayMonth === 0) { state.draftHolidayMonth = 12; state.draftHolidayYear -= 1; } state.draftHolidayDay = Math.min(state.draftHolidayDay, daysInMonth(state.draftHolidayYear, state.draftHolidayMonth)); }
      redrawNightSetting(); return;
    }
    if (holidayMonth) { state.draftHolidayMonth = Number(holidayMonth.dataset.holidayMonthSelect); state.draftHolidayDay = Math.min(state.draftHolidayDay, daysInMonth(state.draftHolidayYear, state.draftHolidayMonth)); state.holidayCalendarMode = "days"; redrawNightSetting(); return; }
    if (holidayYear) { state.draftHolidayYear = Number(holidayYear.dataset.holidayYearSelect); state.draftHolidayDay = Math.min(state.draftHolidayDay, daysInMonth(state.draftHolidayYear, state.draftHolidayMonth)); state.holidayCalendarMode = "days"; state.holidayCalendarYearPage = Math.floor(state.draftHolidayYear / 12) * 12; redrawNightSetting(); return; }
    if (holidayToday) { [state.draftHolidayYear, state.draftHolidayMonth, state.draftHolidayDay] = today; state.holidayCalendarMode = "days"; redrawNightSetting(); return; }
    if (holidayConfirm) { state.holidayYear = state.draftHolidayYear; state.holidayMonth = state.draftHolidayMonth; state.holidayDay = state.draftHolidayDay; state.holidayCalendarOpen = false; state.holidayCalendarMode = "days"; redrawNightSetting(); return; }
    if (holidayCancel) { state.draftHolidayYear = state.holidayYear; state.draftHolidayMonth = state.holidayMonth; state.draftHolidayDay = state.holidayDay; state.holidayCalendarOpen = false; state.holidayCalendarMode = "days"; redrawNightSetting(); return; }
    if (holidaySelect && connected) { const index = Number(holidaySelect.dataset.holidaySelect); const selected = state.holidayDates[index]; if (selected) { state.selectedHolidayIndex = index; state.holidayYear = selected.year; state.holidayMonth = selected.month; state.holidayDay = selected.day; } redrawNightSetting(); return; }
    if (holidayAdd && connected) {
      const exists = state.holidayDates.some((holiday) => holiday.year === state.holidayYear && holiday.month === state.holidayMonth && holiday.day === state.holidayDay);
      if (exists) { showToast(state.language === "en" ? "This holiday date is already in the list." : "این تاریخ قبلاً در فهرست تعطیلات وجود دارد.", "info"); return; }
      state.holidayDates.push({ year: state.holidayYear, month: state.holidayMonth, day: state.holidayDay }); state.selectedHolidayIndex = state.holidayDates.length - 1; redrawNightSetting(); return;
    }
    if (holidayDelete && connected) {
      if (!state.holidayDates.length) return;
      state.holidayDates.splice(state.selectedHolidayIndex, 1); state.selectedHolidayIndex = Math.max(0, Math.min(state.selectedHolidayIndex, state.holidayDates.length - 1));
      const selected = state.holidayDates[state.selectedHolidayIndex]; if (selected) { state.holidayYear = selected.year; state.holidayMonth = selected.month; state.holidayDay = selected.day; }
      redrawNightSetting();
    }
  });
}

function bindViewEvents() {
  const content = document.querySelector("#content-root");
  if (!content) return;
  content.querySelectorAll("[data-project-id]").forEach((button) => button.addEventListener("click", () => {
    state.selectedProjectId = button.dataset.projectId;
    const selectedProject = projects.find((project) => project.id === state.selectedProjectId);
    state.selectedPanelId = selectedProject?.panels[0]?.id || null;
    if (!selectedProject?.panels.some((panel) => panel.id === state.connectedPanelId)) state.connectedPanelId = null;
    state.selectedSettingId = "date-time";
    // Start every newly opened project with both popup menus minimized.
    state.panelMenuOpen = false;
    state.panelMenuFloating = false;
    state.settingsTreeCollapsed = true;
    state.view = "workspace";
    renderApp();
  }));
  content.querySelectorAll("[data-back-projects]").forEach((button) => button.addEventListener("click", () => {
    state.view = "projects";
    state.selectedProjectId = null;
    state.selectedPanelId = null;
    renderApp();
  }));
  content.querySelectorAll("[data-panel-menu-toggle]").forEach((button) => button.addEventListener("click", () => {
    const wasClosed = !state.panelMenuOpen;
    state.panelMenuOpen = !state.panelMenuOpen;
    state.panelMenuFloating = state.panelMenuOpen;
    const popup = button.closest(".panel-popup-wrap");
    const workspace = popup?.closest(".workspace-shell");
    popup?.classList.toggle("open", state.panelMenuOpen);
    popup?.classList.toggle("collapsed", !state.panelMenuOpen);
    popup?.classList.toggle("floating-open", state.panelMenuFloating);
    workspace?.classList.toggle("panel-menu-floating", state.panelMenuFloating);
    workspace?.classList.toggle("panel-menu-open", state.panelMenuOpen);
    workspace?.classList.toggle("menus-docked", !state.panelMenuOpen && state.settingsTreeCollapsed);
    workspace?.classList.toggle("panel-menu-collapsed", !state.panelMenuOpen);
    button.setAttribute("aria-expanded", String(state.panelMenuOpen));
    button.setAttribute("aria-label", state.panelMenuOpen ? (state.language === "en" ? "Minimize panels" : "مینیمایز کردن پنل‌ها") : (state.language === "en" ? "Expand panels" : "باز کردن پنل‌ها"));
    button.innerHTML = state.panelMenuOpen ? icons.chevronRight : icons.chevronLeft;
  }));
  content.querySelectorAll("[data-settings-collapse]").forEach((button) => button.addEventListener("click", () => {
    state.settingsTreeCollapsed = !state.settingsTreeCollapsed;
    const tree = button.closest(".settings-tree-column");
    const layout = tree?.closest(".workspace-layout");
    const workspace = tree?.closest(".workspace-shell");
    tree?.classList.toggle("minimized", state.settingsTreeCollapsed);
    layout?.classList.toggle("settings-tree-minimized", state.settingsTreeCollapsed);
    workspace?.classList.toggle("settings-menu-collapsed", state.settingsTreeCollapsed);
    workspace?.classList.toggle("settings-menu-open", !state.settingsTreeCollapsed);
    workspace?.classList.toggle("menus-docked", !state.panelMenuOpen && state.settingsTreeCollapsed);
    workspace?.classList.toggle("panel-menu-floating", state.panelMenuFloating);
    button.setAttribute("aria-expanded", String(!state.settingsTreeCollapsed));
    button.setAttribute("aria-label", state.settingsTreeCollapsed ? (state.language === "en" ? "Expand panel configuration" : "باز کردن پیکربندی پنل") : (state.language === "en" ? "Minimize panel configuration" : "مینیمایز کردن پیکربندی پنل"));
    button.innerHTML = state.settingsTreeCollapsed ? icons.chevronLeft : icons.chevronRight;
  }));
  content.querySelectorAll("[data-panel-id]").forEach((button) => button.addEventListener("click", () => {
    state.selectedPanelId = button.dataset.panelId;
    state.calendarOpen = false;
    state.timeOpen = false;
    renderApp();
  }));
  content.querySelectorAll("[data-connect-panel]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    const panelId = button.dataset.connectPanel;
    if (state.connectedPanelId === panelId) {
      state.connectedPanelId = null;
      renderApp();
      showToast(state.language === "en" ? "Panel disconnected." : "اتصال پنل قطع شد.", "info");
    } else {
      state.connectedPanelId = panelId;
      state.selectedPanelId = panelId;
      renderApp();
      showToast(state.language === "en" ? "Panel connected successfully." : "پنل با موفقیت متصل شد.");
    }
  }));
  content.querySelectorAll("[data-tree-parent]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.treeParent;
    const treeColumn = button.closest(".settings-tree-column:not(.minimized)");
    const startHeight = treeColumn?.getBoundingClientRect().height || 0;
    state.openSettingsSections[id] = state.openSettingsSections[id] === false;
    const open = state.openSettingsSections[id];
    const children = button.parentElement?.querySelector(":scope > .tree-children");
    button.classList.toggle("open", open);
    button.classList.toggle("not", !open);
    children?.classList.toggle("open", open);
    children?.classList.toggle("collapsed", !open);

    // Animate the settings card itself as branches open and close. The final
    // inline height is removed after the transition so later content changes
    // remain naturally sized.
    if (treeColumn && startHeight) {
      treeColumn.classList.add("is-resizing");
      treeColumn.style.setProperty("height", `${startHeight}px`, "important");
      requestAnimationFrame(() => {
        treeColumn.style.setProperty("height", `${treeColumn.scrollHeight}px`, "important");
      });
      const finishResize = (event) => {
        if (event.propertyName !== "height") return;
        treeColumn.style.removeProperty("height");
        treeColumn.classList.remove("is-resizing");
        treeColumn.removeEventListener("transitionend", finishResize);
      };
      treeColumn.addEventListener("transitionend", finishResize);
    }
  }));
  content.querySelectorAll("[data-setting-id]").forEach((button) => button.addEventListener("click", () => {
    state.selectedSettingId = button.dataset.settingId;
    state.calendarOpen = false;
    state.timeOpen = false;
    state.nightTimeOpen = null;
    state.holidayCalendarOpen = false;
    renderApp();
  }));
  content.querySelectorAll("[data-language-select]").forEach((select) => select.addEventListener("change", () => {
    state.language = select.value;
    activeLanguage = state.language;
    localStorage.setItem("fire-panel-language", state.language);
    const sidebarCollapsed = state.sidebarCollapsed;
    renderShell();
    state.sidebarCollapsed = sidebarCollapsed;
    bindEvents();
    showToast(state.language === "en" ? "Language changed to English." : "زبان نرم‌افزار به فارسی تغییر کرد.");
  }));
  content.querySelectorAll("[data-panel-refresh]").forEach((button) => button.addEventListener("click", () => showToast("وضعیت پنل‌ها به‌روزرسانی شد.")));
  content.querySelectorAll("[data-save-setting]").forEach((button) => button.addEventListener("click", () => {
    if (!state.connectedPanelId) { showToast(state.language === "en" ? "Connect a panel before saving changes." : "برای ذخیره تغییرات ابتدا پنل را متصل کنید.", "info"); return; }
    showToast(state.language === "en" ? "Sample changes saved to the panel." : "تغییرات نمونه روی پنل ذخیره شد.");
  }));
  content.querySelectorAll("[data-read-setting]").forEach((button) => button.addEventListener("click", () => {
    if (!state.connectedPanelId) { showToast(state.language === "en" ? "Connect a panel before reading settings." : "برای خواندن تنظیمات ابتدا پنل را متصل کنید.", "info"); return; }
    showToast(state.language === "en" ? "Sample panel values were read." : "مقادیر نمونه‌ی پنل خوانده شد.", "info");
  }));
  content.querySelectorAll("[data-english-only]").forEach((input) => input.addEventListener("input", () => {
    input.value = input.value.replace(/[^A-Za-z0-9 _-]/g, "");
  }));
  bindGroupSettingEvents();
  bindLoopCardEvents();
  bindNightSettingEvents();
  bindDateTimeEvents();
}

function bindEvents() {
  const $ = (selector) => document.querySelector(selector);
  $("#menu-button").addEventListener("click", () => { state.sidebarOpen = true; $("#sidebar").classList.add("open"); $("#mobile-overlay").classList.add("show"); });
  const closeMenu = () => { state.sidebarOpen = false; $("#sidebar").classList.remove("open"); $("#mobile-overlay").classList.remove("show"); };
  $("#sidebar-close").addEventListener("click", closeMenu); $("#mobile-overlay").addEventListener("click", closeMenu);
  $("#sidebar-collapse").addEventListener("click", () => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    localStorage.setItem("fire-panel-sidebar-collapsed", state.sidebarCollapsed ? "1" : "0");
    updateSidebarState();
  });
  updateThemeButton();
  $("#theme-toggle").addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("fire-panel-theme", dark ? "dark" : "light");
    updateThemeButton();
  });
  document.querySelectorAll("[data-nav-view]").forEach((button) => button.addEventListener("click", () => {
    state.view = button.dataset.navView;
    if (button.dataset.navSetting) state.selectedSettingId = button.dataset.navSetting;
    if (state.view === "workspace" && !state.selectedProjectId) {
      state.selectedProjectId = projects[0].id;
      state.selectedPanelId = projects[0].panels[0].id;
    }
    closeMenu();
    renderApp();
  }));
  renderApp();
}

renderShell();
state.sidebarCollapsed = localStorage.getItem("fire-panel-sidebar-collapsed") === "1";
bindEvents();
