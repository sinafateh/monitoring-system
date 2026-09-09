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
  view: "projects", selectedProjectId: null, selectedPanelId: null, connectedPanelId: null, selectedSettingId: "date-time",
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
  return `<aside class="panel-list-column"><div class="column-heading"><div><span class="eyebrow">پنل‌ها</span><h3>پنل‌های پروژه</h3><p>${faDigits(project.panels.length)} پنل در این پروژه</p></div><button type="button" class="icon-button small-icon" data-panel-refresh>${icons.refresh}</button></div><div class="panel-list">${project.panels.map((item) => { const itemConnected = state.connectedPanelId === item.id; return `<div class="panel-list-item${item.id === panel.id ? " active" : ""}" data-panel-row="${item.id}"><button type="button" class="panel-select" data-panel-id="${item.id}"><span class="panel-list-icon">${icons.panel}</span><span class="panel-list-copy"><b>${item.name}</b><small>${item.code}</small><em class="panel-connection ${itemConnected ? "connected" : "offline"}"><i></i>${itemConnected ? "متصل" : item.status}</em></span>${item.alarms ? `<span class="panel-alarm">${faDigits(item.alarms)}</span>` : ""}${item.id === panel.id ? `<span class="selected-line"></span>` : ""}</button><button type="button" class="panel-connect-button ${itemConnected ? "connected" : ""}" data-connect-panel="${item.id}">${itemConnected ? icons.check + "قطع اتصال" : icons.wifi + "اتصال"}</button></div>`; }).join("")}</div><div class="add-panel-hint">${icons.wifi}<span><b>پنل جدید اضافه کنید</b><small>اتصال پنل در نسخه بعدی</small></span></div></aside>`;
}

function renderSettingsTree() {
  const renderNode = (node, depth = 0) => {
    const label = state.language === "en" ? node.en : node.label;
    const isOpen = state.openSettingsSections[node.id] !== false;
    return `<div class="tree-node depth-${depth}">${node.children ? `<button type="button" class="tree-parent${isOpen ? " open" : ""}" data-tree-parent="${node.id}"><span class="tree-chevron">${icons.chevronDown}</span>${icons[node.icon] || icons.settings}<span>${label}</span></button><div class="tree-children${isOpen ? " open" : " collapsed"}">${node.children.map((child) => renderNode(child, depth + 1)).join("")}</div>` : `<button type="button" class="tree-item${node.id === state.selectedSettingId ? " active" : ""}" data-setting-id="${node.id}">${icons[node.icon] || icons.settings}<span>${label}</span></button>`}</div>`;
  };
  return `<aside class="settings-tree-column"><div class="column-heading"><div><span class="eyebrow">پیکربندی پنل</span><h3>تنظیمات پنل</h3><p>منوی تنظیمات بر اساس مستندات سیستم</p></div></div><div class="settings-tree">${settingsTree.map((node) => renderNode(node)).join("")}</div><div class="tree-note">${icons.check}<span><b>راهنمای تنظیمات</b><small>برای مشاهده هر بخش، گزینه‌ی آن را انتخاب کنید.</small></span></div></aside>`;
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
  return `<article class="sub-card"><div class="sub-card-head"><div><h3>تنظیمات شبکه پنل‌ها</h3><p>ارتباط چند پنل و فرمان‌های سراسری را مدیریت کنید.</p></div><span class="status-chip amber">پیش‌نویس</span></div><div class="network-grid">${renderToggleRow("وضعیت شبکه", "پشتیبانی از حداکثر ۸ پنل", true)}${renderToggleRow("Master Silence · ارسال", "ارسال فرمان سکوت به پنل‌ها", true)}${renderToggleRow("Master Silence · دریافت", "پذیرش فرمان سکوت", true)}${renderToggleRow("Master Evacuate · ارسال", "ارسال فرمان تخلیه", false)}${renderToggleRow("خروجی حریق", "اعلام حریق روی شبکه", true)}${renderToggleRow("خروجی خطا", "اعلام خطای پنل روی شبکه", true)}${renderToggleRow("NAC’s", "همگام‌سازی خروجی آژیر", false)}</div>${renderSettingActions()}</article>`;
}

function renderNightSetting() {
  return `<div class="setting-panel-grid"><article class="sub-card"><div class="sub-card-head"><div><h3>برنامه روز و شب</h3><p>بازه‌های زمانی حالت شب و روز پنل را تعیین کنید.</p></div><span class="status-chip green">فعال</span></div><div class="form-area compact-form"><div class="field-block"><label>شروع حالت شب</label><div class="fake-input">${icons.clock}<span>۲۲:۰۰</span></div></div><div class="field-block"><label>پایان حالت شب</label><div class="fake-input">${icons.clock}<span>۰۷:۰۰</span></div></div></div><div class="night-options">${renderToggleRow("آخر هفته", "اعمال حالت شب در روزهای تعطیل", true)}${renderToggleRow("تعطیلات رسمی", "استفاده از تقویم تعطیلات پروژه", false)}</div>${renderSettingActions()}</article><article class="sub-card holiday-card"><div class="sub-card-head"><div><h3>تعطیلات ثبت‌شده</h3><p>تاریخ‌های خاص پروژه</p></div><button type="button" class="btn-secondary compact">+ افزودن</button></div><div class="holiday-list"><div><span>۱۴۰۵/۰۱/۰۱</span><b>نوروز</b><button type="button">×</button></div><div><span>۱۴۰۵/۰۱/۱۳</span><b>روز طبیعت</b><button type="button">×</button></div></div></article></div>`;
}

function renderLoopCardSetting() {
  const devices = [["۰۱", "دتکتور دود", "Smoke Detector", "فعال"], ["۰۲", "شستی اعلام حریق", "Manual Call Point", "فعال"], ["۰۳", "آژیر / خروجی", "Sounder / Output", "غیرفعال"], ["۰۴", "ماژول ورودی", "Input Module", "فعال"]];
  return `<article class="sub-card"><div class="sub-card-head"><div><h3>دیوایس‌های کارت لوپ</h3><p>دیوایس‌های شناسایی‌شده در Loop Card 1</p></div><div class="sub-actions"><button type="button" class="btn-secondary compact">${icons.refresh}شناسایی</button><button type="button" class="btn-primary compact">+ افزودن دیوایس</button></div></div><div class="device-filters"><span class="filter-active">همه</span><span>دتکتور</span><span>ماژول</span><span>خروجی</span></div><div class="device-table"><div class="device-table-head"><span>شماره</span><span>نوع دیوایس</span><span>وضعیت</span><span>عملیات</span></div>${devices.map(([number, name, en, status]) => `<div class="device-table-row"><b>${number}</b><span><strong>${name}</strong><small>${en}</small></span><em class="device-status ${status === "فعال" ? "on" : "off"}"><i></i>${status}</em><button type="button" class="row-more">•••</button></div>`).join("")}</div>${renderSettingActions()}</article>`;
}

function renderGroupSetting() {
  return `<article class="sub-card"><div class="sub-card-head"><div><h3>گروه‌بندی ورودی و خروجی</h3><p>دیوایس‌ها را برای اجرای سناریوهای مشترک گروه‌بندی کنید.</p></div><button type="button" class="btn-primary compact">+ گروه جدید</button></div><div class="group-list"><div><span class="group-color teal">۱</span><div><b>گروه حریق طبقات</b><small>۱۲ دیوایس · خروجی آژیر · تأخیر ۰ ثانیه</small></div><em>فعال</em>${icons.chevronLeft}</div><div><span class="group-color amber">۲</span><div><b>گروه ورودی‌های اضطراری</b><small>۴ دیوایس · خروجی رله ۲ · تأخیر ۵ ثانیه</small></div><em>فعال</em>${icons.chevronLeft}</div><div><span class="group-color sky">۳</span><div><b>گروه تجهیزات موتورخانه</b><small>۸ دیوایس · وضعیت نظارتی</small></div><em>پیش‌نویس</em>${icons.chevronLeft}</div></div></article>`;
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
  return `<section class="workspace-breadcrumb"><button type="button" data-back-projects>${icons.chevronRight}پروژه‌ها</button>${icons.chevronLeft}<span>${project.name}</span>${icons.chevronLeft}<b>${panel.name}</b></section>${renderProjectStrip(project)}<section class="workspace-layout">${renderPanelList(project, panel)}${renderSettingsTree()}<main class="setting-detail-column">${renderSettingDetail(panel)}</main></section>`;
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

function bindViewEvents() {
  const content = document.querySelector("#content-root");
  if (!content) return;
  content.querySelectorAll("[data-project-id]").forEach((button) => button.addEventListener("click", () => {
    state.selectedProjectId = button.dataset.projectId;
    const selectedProject = projects.find((project) => project.id === state.selectedProjectId);
    state.selectedPanelId = selectedProject?.panels[0]?.id || null;
    if (!selectedProject?.panels.some((panel) => panel.id === state.connectedPanelId)) state.connectedPanelId = null;
    state.selectedSettingId = "date-time";
    state.view = "workspace";
    renderApp();
  }));
  content.querySelectorAll("[data-back-projects]").forEach((button) => button.addEventListener("click", () => {
    state.view = "projects";
    state.selectedProjectId = null;
    state.selectedPanelId = null;
    renderApp();
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
    state.openSettingsSections[id] = state.openSettingsSections[id] === false;
    const open = state.openSettingsSections[id];
    const children = button.parentElement?.querySelector(":scope > .tree-children");
    button.classList.toggle("open", open);
    button.classList.toggle("not", !open);
    children?.classList.toggle("open", open);
    children?.classList.toggle("collapsed", !open);
  }));
  content.querySelectorAll("[data-setting-id]").forEach((button) => button.addEventListener("click", () => {
    state.selectedSettingId = button.dataset.settingId;
    state.calendarOpen = false;
    state.timeOpen = false;
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
