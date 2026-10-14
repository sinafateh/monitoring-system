import { Canvas, Circle, Rect, Line, Text, Group, FabricImage } from "fabric";
import * as pdfjs from "pdfjs-dist/build/pdf.mjs";
import "./floor-plan.css";

// PDF.js worker is bundled by Vite so page rendering remains local to the browser.
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).href;
const kinds = [
  { type: "SD", en: "Smoke Detector", fa: "دتکتور دودی" }, { type: "HD", en: "Heat Detector", fa: "دتکتور حرارتی" },
  { type: "MS", en: "Multi-Sensor", fa: "دتکتور چندحسگره" }, { type: "MCP", en: "Manual Call Point", fa: "شستی اعلام حریق" },
  { type: "SND/FL", en: "Sounder / Flasher", fa: "آژیر / فلاشر" }, { type: "MOD", en: "Control / Monitor Module", fa: "ماژول کنترل / مانیتور" },
  { type: "FACP", en: "Fire Alarm Control Panel", fa: "پنل کنترل اعلام حریق" },
];
const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try { message = (await response.json()).error || message; } catch { /* Keep HTTP fallback. */ }
    throw new Error(message);
  }
  return response;
};

export async function mountFloorPlanModule(root, options = {}) {
  if (!root) return;
  if (root._floorPlanCleanup) root._floorPlanCleanup();
  const { projects = [], panelDevices = {}, initialProjectId = "", initialPanelId = "", language = "fa" } = options;
  const initialProject = projects.find((project) => project.id === initialProjectId);
  const isEnglish = language === "en";
  const direction = isEnglish ? "ltr" : "rtl";
  const words = isEnglish ? {
    deviceSettings: "DEVICE SETTINGS", title: "Floor Plan Layout", intro: "Choose a project and panel, map its registered devices, and export the stamped original.",
    upload: "Upload floor plan", save: "Save Layout", export: "Export PDF", deletePlan: "Delete plan", confirmDeletePlan: "Delete this floor plan and all its device layouts? This cannot be undone.", deletedPlan: "Floor plan and layouts deleted.", floorPlan: "Floor plan", choosePlan: "Select a floor plan…", page: "Page",
    choosePdf: "Choose a project and panel, then upload a PDF floor plan.", choosePlanBeforePlace: "Select or upload this project's floor plan first.", project: "Project", panel: "Panel", chooseProject: "Select a project…", choosePanel: "Select a panel…", devicesAvailable: "registered devices available", noDevices: "No saved device registry is available for this panel. Save this panel's device settings first.", lockedProject: "Project is fixed for this floor plan.", toolbox: "Devices for selected panel", dragTip: "Click a device or drag it onto the plan.", snap: "Snap to grid",
    snapHint: "Shows alignment guides and snaps markers to a 10 pt grid. The guides are not exported.",
    selected: "Selected device", deviceType: "Device type", registered: "Registered device", manual: "Enter metadata manually", deviceId: "Device ID (optional)", enterId: "Enter ID",
    loop: "Loop No", address: "Device address", addressHint: "D024", zone: "Zone", label: "Label", labelHint: "e.g. L1-D024",
    apply: "Apply details", rotate: "Rotate 15°", remove: "Delete", fit: "Fit page", canvasHelp: "Wheel: zoom · Space or right-drag: pan · Select a device to move it",
    loading: "Loading PDF page…", uploading: "Uploading PDF…", pageStatus: (n) => `Page ${n}`,
    planStatus: (name, count) => `${name} · ${count} page${count === 1 ? "" : "s"}`,
    saved: (count, page) => `Saved ${count} device${count === 1 ? "" : "s"} on page ${page}.`,
    preparing: "Preparing vector PDF export…", downloaded: "Export downloaded.",
    error: "Floor plan service temporarily unavailable", apiOutdated: "The API server on port 3001 is outdated. Stop that process and restart it with npm run api.", badPdf: "Could not read or save this PDF", invalidPdf: "The uploaded file is not a valid PDF", requiredPdf: "A PDF file is required",
    unreadablePdf: "The PDF file could not be parsed. It may be damaged or password-protected.",
    projectRequired: "Select a project before uploading a floor plan", projectImmutable: "The project assigned to a floor plan cannot be changed",
  } : {
    deviceSettings: "تنظیمات دیوایس‌ها", title: "نقشه و چیدمان دیوایس‌ها", intro: "پروژه و پنل را انتخاب کنید، دیوایس‌های ثبت‌شدهٔ آن را جانمایی و نسخهٔ اصلی را خروجی بگیرید.",
    upload: "بارگذاری نقشه", save: "ذخیرهٔ چیدمان", export: "خروجی PDF", deletePlan: "حذف نقشه", confirmDeletePlan: "این نقشه و همهٔ چیدمان‌های دیوایس آن حذف شود؟ این کار بازگشت‌پذیر نیست.", deletedPlan: "نقشه و چیدمان‌های آن حذف شدند.", floorPlan: "نقشهٔ طبقه", choosePlan: "انتخاب نقشه…", page: "صفحه",
    choosePdf: "ابتدا پروژه و پنل را انتخاب و سپس نقشهٔ PDF را بارگذاری کنید.", choosePlanBeforePlace: "ابتدا نقشهٔ این پروژه را انتخاب یا بارگذاری کنید.", project: "پروژه", panel: "پنل", chooseProject: "انتخاب پروژه…", choosePanel: "انتخاب پنل…", devicesAvailable: "دیوایس ثبت‌شده در دسترس", noDevices: "برای این پنل فهرست دیوایس ثبت‌شده‌ای پیدا نشد؛ ابتدا تنظیمات دیوایس‌های پنل را ذخیره کنید.", lockedProject: "پروژهٔ این پلان ثابت است.", toolbox: "دیوایس‌های پنل انتخاب‌شده", dragTip: "دیوایس را انتخاب کنید یا آن را روی نقشه بکشید.", snap: "چسباندن به شبکه",
    snapHint: "خطوط راهنما را نشان می‌دهد و نمادها را روی شبکهٔ ۱۰ پوینتی می‌چسباند؛ خطوط در PDF خروجی چاپ نمی‌شوند.",
    selected: "دیوایس انتخاب‌شده", deviceType: "نوع دیوایس", registered: "دیوایس ثبت‌شده", manual: "ورود دستی مشخصات", deviceId: "شناسهٔ دیوایس (اختیاری)", enterId: "شناسه را وارد کنید",
    loop: "شمارهٔ لوپ", address: "آدرس دیوایس", addressHint: "D024", zone: "زون", label: "برچسب", labelHint: "مثلاً L1-D024",
    apply: "اعمال مشخصات", rotate: "چرخش ۱۵°", remove: "حذف", fit: "نمایش کامل صفحه", canvasHelp: "چرخ ماوس: بزرگ‌نمایی · Space یا کشیدن با راست‌کلیک: جابه‌جایی نقشه · برای حرکت دیوایس آن را انتخاب کنید",
    loading: "در حال بارگذاری صفحهٔ PDF…", uploading: "در حال بارگذاری فایل PDF…", pageStatus: (n) => `صفحهٔ ${n}`,
    planStatus: (name, count) => `${name} · ${count} صفحه`,
    saved: (count, page) => `${count} دیوایس در صفحهٔ ${page} ذخیره شد.`,
    preparing: "در حال آماده‌سازی خروجی PDF برداری…", downloaded: "فایل خروجی دانلود شد.",
    error: "سرویس نقشه موقتاً در دسترس نیست", apiOutdated: "نسخهٔ API فعال روی پورت ۳۰۰۱ قدیمی است و مسیر نقشه را نمی‌شناسد؛ پردازش آن را متوقف و دوباره با npm run api اجرا کنید.", badPdf: "خواندن یا ذخیرهٔ این PDF ممکن نشد", invalidPdf: "فایل انتخاب‌شده PDF معتبر نیست", requiredPdf: "لطفاً یک فایل PDF انتخاب کنید.",
    unreadablePdf: "خواندن فایل PDF ممکن نشد؛ ممکن است فایل آسیب‌دیده یا رمزدار باشد.",
    projectRequired: "برای بارگذاری نقشه ابتدا پروژه را انتخاب کنید.", projectImmutable: "پروژهٔ اختصاص‌یافته به پلان قابل تغییر نیست.",
  };
  const t = (key) => words[key];
  const translateError = (message) => ({
    "Floor plan service temporarily unavailable": words.error,
    "Could not read or save this PDF": words.badPdf,
    "The uploaded file is not a valid PDF": words.invalidPdf,
    "A PDF file is required": words.requiredPdf,
    "The uploaded file is not a readable PDF": words.unreadablePdf,
    "Select a project before uploading a floor plan": words.projectRequired,
    "A project is required": words.projectRequired,
    "The project assigned to a floor plan cannot be changed": words.projectImmutable,
  }[message] || (isEnglish ? message : `خطا: ${message}`));
  let plans = [], selectedPlan = null, selectedPlanId = "", selectedProjectId = initialProject?.id || "", selectedPanelId = initialProject?.panels.some((panel) => panel.id === initialPanelId) ? initialPanelId : "", pageNumber = 1, pdfDocument = null, canvas = null, isBusy = false;
  let currentBackground = null, snap = false, snapGridLines = [];
  const canvasCleanups = [];
  const escapeText = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const deviceKind = (device) => ({ smoke: "SD", heat: "HD", multi: "MS", manual: "MCP", sounder: "SND/FL", zone: "MOD", input: "MOD", io: "MOD" }[device.type] || "MOD");
  const kindDetails = (type) => kinds.find((kind) => kind.type === type) || kinds[5];
  const html = `
    <div class="floor-plan-shell" lang="${isEnglish ? "en" : "fa"}" dir="${direction}">
      <header class="floor-plan-header">
        <div><span class="eyebrow">${t("deviceSettings")}</span><h2>${t("title")}</h2><p>${t("intro")}</p></div>
        <div class="floor-plan-header-actions"><button id="fp-upload-trigger" class="fp-button fp-button-primary" type="button" disabled>${t("upload")}</button><input id="fp-upload" type="file" accept="application/pdf" hidden><button id="fp-save" class="fp-button fp-button-primary" disabled>${t("save")}</button><button id="fp-export" class="fp-button" disabled>${t("export")}</button></div>
      </header>
      <div class="fp-plan-bar"><label class="fp-project-field">${t("project")}<select id="fp-project" aria-describedby="fp-project-lock"><option value="">${t("chooseProject")}</option>${projects.map((p) => `<option value="${escapeText(p.id)}">${escapeText(p.name)}</option>`).join("")}</select><small id="fp-project-lock" hidden>${t("lockedProject")}</small></label><label>${t("panel")}<select id="fp-panel" disabled><option value="">${t("choosePanel")}</option></select></label><label>${t("floorPlan")}<select id="fp-plan-select" disabled><option value="">${t("choosePlan")}</option></select></label><button id="fp-delete-plan" class="fp-button fp-danger" type="button" hidden>${t("deletePlan")}</button><label>${t("page")}<select id="fp-page" disabled></select></label><span id="fp-status" role="status">${t("choosePdf")}</span></div>
      <div class="fp-workspace">
        <aside class="fp-toolbox"><h3>${t("toolbox")}</h3><p>${t("dragTip")}</p><small id="fp-device-count"></small><div id="fp-device-list" class="fp-device-list"></div>
          <div class="fp-snap-control"><label class="fp-check"><input id="fp-snap" type="checkbox"> ${t("snap")}</label><small>${t("snapHint")}</small></div>
          <div class="fp-inspector"><h3>${t("selected")}</h3><label>${t("deviceType")}<select id="fp-type">${kinds.map((k) => `<option value="${k.type}">${k.type} · ${isEnglish ? k.en : k.fa}</option>`).join("")}</select></label><label>${t("deviceId")}<input id="fp-device-id" maxlength="120" placeholder="${t("enterId")}"></label><label>${t("loop")}<input id="fp-loop" maxlength="40"></label><label>${t("address")}<input id="fp-address" maxlength="40" placeholder="${t("addressHint")}"></label><label>${t("zone")}<input id="fp-zone" maxlength="80"></label><label>${t("label")}<input id="fp-label" maxlength="120" placeholder="${t("labelHint")}"></label><div class="fp-inspector-actions"><button id="fp-apply" class="fp-button" disabled>${t("apply")}</button><button id="fp-rotate" class="fp-button" disabled>${t("rotate")}</button><button id="fp-delete" class="fp-button fp-danger" disabled>${t("remove")}</button></div></div>
        </aside>
        <section class="fp-canvas-panel"><div class="fp-canvas-tools"><button id="fp-fit" class="fp-button" disabled>${t("fit")}</button><span>${t("canvasHelp")}</span></div><div class="fp-canvas-scroll"><div class="fp-canvas-holder"><canvas id="fp-canvas"></canvas></div></div></section>
      </div>
    </div>`;
  root.innerHTML = html;
  const $ = (selector) => root.querySelector(selector);
  const status = (message, error = false) => { const el = $("#fp-status"); el.textContent = message; el.classList.toggle("error", error); };
  const allDevicesForPanel = () => (panelDevices[selectedPanelId] || []).flatMap((card) => (card.devices || []).map((device) => ({ card, device })));
  const updatePanelChoices = () => {
    const project = projects.find((item) => item.id === selectedProjectId);
    const panel = $("#fp-panel");
    panel.disabled = !project;
    panel.innerHTML = `<option value="">${t("choosePanel")}</option>${(project?.panels || []).map((item) => `<option value="${escapeText(item.id)}">${escapeText(item.name)} · ${escapeText(item.code || "")}</option>`).join("")}`;
    if (project?.panels.some((item) => item.id === selectedPanelId)) panel.value = selectedPanelId;
    updateDeviceChoices();
    setUiState();
  };
  const updateDeviceChoices = () => {
    const devices = allDevicesForPanel();
    const panelSelected = Boolean(selectedPanelId);
    $("#fp-device-count").textContent = devices.length ? `${devices.length} ${t("devicesAvailable")}` : (panelSelected ? t("noDevices") : t("choosePanel"));
    $("#fp-device-list").innerHTML = devices.map(({ card, device }) => {
      const type = deviceKind(device), kind = kindDetails(type), address = device.ip || device.number || device.id;
      return `<button class="fp-device-tool" type="button" draggable="true" data-device-id="${escapeText(device.id)}"><span class="fp-symbol">${type === "SND/FL" ? "S/F" : type}</span><span>${escapeText(card.label || card.id)} · ${escapeText(address)}<small>${isEnglish ? kind.en : kind.fa}</small></span></button>`;
    }).join("");
  };
  const setUiState = () => {
    $("#fp-project").disabled = Boolean(selectedPlan || selectedPlanId) || isBusy;
    $("#fp-project-lock").hidden = !selectedPlan && !selectedPlanId;
    $("#fp-panel").disabled = !selectedProjectId || isBusy;
    $("#fp-plan-select").disabled = !selectedProjectId || isBusy;
    $("#fp-delete-plan").hidden = !$("#fp-plan-select").value;
    $("#fp-delete-plan").disabled = !$("#fp-plan-select").value || isBusy;
    $("#fp-upload-trigger").disabled = !selectedProjectId || !selectedPanelId || Boolean(selectedPlan || selectedPlanId) || isBusy;
    $("#fp-save").disabled = !canvas || isBusy;
    $("#fp-export").disabled = !canvas || isBusy;
    $("#fp-page").disabled = !canvas || isBusy;
    $("#fp-fit").disabled = !canvas || isBusy;
  };
  const updatePlanChoices = () => {
    const projectPlans = selectedProjectId ? plans.filter((plan) => plan.projectId === selectedProjectId || !plan.projectId) : [];
    $("#fp-plan-select").innerHTML = `<option value="">${t("choosePlan")}</option>${projectPlans.map((plan) => `<option value="${escapeText(plan.id)}">${escapeText(plan.name)}${plan.projectId ? "" : isEnglish ? " · unassigned" : " · بدون پروژه"}</option>`).join("")}`;
    $("#fp-plan-select").value = selectedPlanId || selectedPlan?.id || "";
    setUiState();
  };
  const clearCanvas = () => {
    while (canvasCleanups.length) canvasCleanups.pop()();
    canvas?.dispose(); canvas = null;
    currentBackground = null;
    snapGridLines = [];
  };
  const cleanup = () => { clearCanvas(); pdfDocument = null; };
  root._floorPlanCleanup = cleanup;
  const syncSnapGrid = () => {
    if (!canvas) return;
    if (snapGridLines.length) canvas.remove(...snapGridLines);
    snapGridLines = [];
    if (snap) {
      // At PDF.js scale 2, a 20 px interval is a 10 pt PDF-space grid.
      const step = 20;
      const guideOptions = { stroke: "rgba(32, 116, 174, 0.24)", strokeWidth: 0.6, selectable: false, evented: false, excludeFromExport: true };
      for (let x = step; x < canvas.getWidth(); x += step) snapGridLines.push(new Line([x, 0, x, canvas.getHeight()], guideOptions));
      for (let y = step; y < canvas.getHeight(); y += step) snapGridLines.push(new Line([0, y, canvas.getWidth(), y], guideOptions));
      canvas.add(...snapGridLines);
      canvas.getObjects().filter((object) => object.fpDevice).forEach((object) => canvas.bringObjectToFront(object));
    }
    canvas.requestRenderAll();
  };

  const setSelected = (object) => {
    const disabled = !object || !object.fpDevice;
    ["#fp-device-id", "#fp-loop", "#fp-address", "#fp-zone", "#fp-label", "#fp-type", "#fp-apply", "#fp-rotate", "#fp-delete"].forEach((selector) => { $(selector).disabled = disabled; });
    if (disabled) return;
    $("#fp-device-id").disabled = Boolean(object.fpDevice.deviceId);
    $("#fp-type").disabled = Boolean(object.fpDevice.deviceId);
    $("#fp-type").value = object.fpDevice.type;
    $("#fp-device-id").value = object.fpDevice.deviceId || "";
    $("#fp-loop").value = object.fpDevice.loop || "";
    $("#fp-address").value = object.fpDevice.address || "";
    $("#fp-zone").value = object.fpDevice.zone || "";
    $("#fp-label").value = object.fpDevice.label || "";
  };
  const buildDevice = (data, x, y) => {
    const type = data.type || "SD";
    const glyphType = type === "SND/FL" ? "S/F" : type;
    const shape = ["SD", "HD", "MS"].includes(type)
      ? new Circle({ radius: 15, fill: "#fff", stroke: "#123456", strokeWidth: 2, originX: "center", originY: "center" })
      : new Rect({ width: 40, height: 30, rx: 3, ry: 3, fill: "#fff", stroke: "#123456", strokeWidth: 2, originX: "center", originY: "center" });
    const glyph = new Text(glyphType, { fontFamily: "Arial", fontSize: 8, fontWeight: "bold", fill: "#123456", originX: "center", originY: "center", top: 0, width: 36, textAlign: "center", splitByGrapheme: false });
    const tagText = data.address || data.label || "";
    const tag = new Text(tagText, { fontFamily: "Arial", fontSize: 9, fill: "#102a43", originX: "center", originY: "top", top: 19 });
    const group = new Group([shape, glyph, tag], { left: x, top: y, originX: "center", originY: "center", angle: Number(data.rotation) || 0, hasControls: true, lockScalingX: true, lockScalingY: true, fpDevice: { ...data, type } });
    return group;
  };
  const renderPage = async () => {
    if (!selectedPlan) return;
    clearCanvas();
    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2 });
    const pdfCanvas = document.createElement("canvas");
    pdfCanvas.width = Math.ceil(viewport.width); pdfCanvas.height = Math.ceil(viewport.height);
    // PDF.js v4 expects the 2D context; passing the canvas element itself leaves
    // its internal canvasContext undefined and fails while reading `.canvas`.
    const pdfContext = pdfCanvas.getContext("2d", { alpha: false });
    await page.render({ canvasContext: pdfContext, viewport }).promise;
    canvas = new Canvas($("#fp-canvas"), { width: pdfCanvas.width, height: pdfCanvas.height, preserveObjectStacking: true, selection: true, backgroundColor: "#fff" });
    $(".fp-canvas-holder").style.width = `${pdfCanvas.width}px`;
    $(".fp-canvas-holder").style.height = `${pdfCanvas.height}px`;
    currentBackground = await FabricImage.fromURL(pdfCanvas.toDataURL("image/png"));
    currentBackground.set({ left: 0, top: 0, selectable: false, evented: false });
    canvas.backgroundImage = currentBackground;
    const response = await request(`/api/floor-plans/${selectedPlan.id}/layout?page=${pageNumber}`);
    const payload = await response.json();
    for (const item of payload.devices) {
      const marker = buildDevice({ ...item, projectId: selectedPlan.projectId, type: item.deviceType, loop: item.loop || "" }, item.normX * canvas.getWidth(), item.normY * canvas.getHeight());
      marker.fpDevice.deviceId = item.deviceId || "";
      canvas.add(marker);
    }
    syncSnapGrid();
    canvas.on("selection:created", (event) => setSelected(event.selected?.[0]));
    canvas.on("selection:updated", (event) => setSelected(event.selected?.[0]));
    canvas.on("selection:cleared", () => setSelected(null));
    canvas.on("object:moving", (event) => {
      if (!snap || !event.target?.fpDevice) return;
      // At PDF.js scale 2, 20 canvas pixels correspond to a 10 pt PDF grid.
      event.target.set({ left: Math.round(event.target.left / 20) * 20, top: Math.round(event.target.top / 20) * 20 });
    });
    // Holding Space temporarily enables drag-to-pan without interfering with symbol selection.
    let spaceDown = false;
    const keyDown = (event) => { if (event.code === "Space") { spaceDown = true; canvas.defaultCursor = "grab"; } };
    const keyUp = (event) => { if (event.code === "Space") { spaceDown = false; canvas.defaultCursor = "default"; } };
    const mouseDown = (event) => { if (spaceDown || event.e.button === 2) { canvas.isDragging = true; canvas.selection = false; canvas.lastPosX = event.e.clientX; canvas.lastPosY = event.e.clientY; canvas.defaultCursor = "grabbing"; } };
    const mouseMove = (event) => { if (!canvas.isDragging) return; const vpt = canvas.viewportTransform; vpt[4] += event.e.clientX - canvas.lastPosX; vpt[5] += event.e.clientY - canvas.lastPosY; canvas.lastPosX = event.e.clientX; canvas.lastPosY = event.e.clientY; canvas.requestRenderAll(); };
    const mouseUp = () => { canvas.isDragging = false; canvas.selection = true; canvas.defaultCursor = "default"; };
    const wheel = (event) => { const delta = event.e.deltaY; let zoom = canvas.getZoom() * (0.999 ** delta); zoom = Math.max(0.12, Math.min(5, zoom)); canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom); event.e.preventDefault(); event.e.stopPropagation(); };
    canvas.on("mouse:down", mouseDown); canvas.on("mouse:move", mouseMove); canvas.on("mouse:up", mouseUp); canvas.on("mouse:wheel", wheel);
    window.addEventListener("keydown", keyDown); window.addEventListener("keyup", keyUp);
    canvasCleanups.push(() => { window.removeEventListener("keydown", keyDown); window.removeEventListener("keyup", keyUp); });
    canvas.requestRenderAll();
    const fit = Math.min($(".fp-canvas-scroll").clientWidth / canvas.getWidth(), $(".fp-canvas-scroll").clientHeight / canvas.getHeight(), 1);
    canvas.setZoom(Math.max(0.12, fit));
    updateDeviceChoices(); setSelected(null); setUiState();
  };
  const loadPlan = async (id) => {
    if (!id) {
      selectedPlan = null; selectedPlanId = ""; cleanup(); pdfDocument = null;
      $("#fp-page").replaceChildren(); updateDeviceChoices(); setUiState();
      return;
    }
    const nextPlan = plans.find((item) => item.id === id);
    if (!nextPlan || !selectedProjectId || (nextPlan.projectId && nextPlan.projectId !== selectedProjectId)) {
      selectedPlanId = selectedPlan?.id || "";
      $("#fp-plan-select").value = selectedPlanId;
      status(t("choosePdf"), true);
      return;
    }
    selectedPlanId = id;
    selectedPlan = nextPlan;
    cleanup(); pdfDocument = null; canvas = null;
    isBusy = true; setUiState(); updateDeviceChoices();
    try {
      status(t("loading"));
      // Assign old unbound plans before opening them. The project selector is already locked,
      // and a failed migration clears the attempted selection instead of freezing the page.
      if (!selectedPlan.projectId) {
        const response = await request(`/api/floor-plans/${selectedPlan.id}/project`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId: selectedProjectId }) });
        const assignment = await response.json();
        selectedPlan.projectId = assignment.projectId;
        const planRecord = plans.find((item) => item.id === selectedPlan.id);
        if (planRecord) planRecord.projectId = assignment.projectId;
        updatePlanChoices();
      }
      if (selectedPlan.projectId !== selectedProjectId) throw new Error("The project assigned to a floor plan cannot be changed");
      const activePlan = selectedPlan;
      pdfDocument = await pdfjs.getDocument(`/api/floor-plans/${selectedPlan.id}/file`).promise;
      $("#fp-page").innerHTML = Array.from({ length: activePlan.pageCount }, (_, i) => `<option value="${i + 1}">${t("pageStatus")(i + 1)}</option>`).join("");
      $("#fp-page").value = "1"; pageNumber = 1;
      await renderPage(); status(t("planStatus")(activePlan.name, activePlan.pageCount));
    } catch (error) {
      cleanup(); pdfDocument = null; canvas = null; selectedPlan = null;
      $("#fp-page").replaceChildren();
      updatePlanChoices(); updateDeviceChoices();
      const message = error.message === "Request failed (404)" && !nextPlan.projectId ? t("apiOutdated") : translateError(error.message);
      status(message, true);
    } finally { isBusy = false; setUiState(); }
  };
  const refreshPlans = async () => {
    const response = await request("/api/floor-plans");
    plans = (await response.json()).plans;
    updatePlanChoices();
  };
  const deleteSelectedPlan = async () => {
    const id = $("#fp-plan-select").value;
    if (!id || !window.confirm(t("confirmDeletePlan"))) return;
    isBusy = true; setUiState();
    try {
      const response = await request(`/api/floor-plans/${encodeURIComponent(id)}`, { method: "DELETE" });
      await response.json();
      plans = plans.filter((plan) => plan.id !== id);
      selectedPlan = null; selectedPlanId = ""; pageNumber = 1;
      cleanup(); pdfDocument = null; $("#fp-page").replaceChildren();
      updatePlanChoices(); updateDeviceChoices(); status(t("deletedPlan"));
    } catch (error) { status(translateError(error.message), true); }
    finally { isBusy = false; setUiState(); }
  };
  $("#fp-project").addEventListener("change", (event) => {
    if (selectedPlan || selectedPlanId || isBusy) { event.currentTarget.value = selectedProjectId; return; }
    selectedProjectId = event.currentTarget.value;
    selectedPlan = null; selectedPlanId = "";
    selectedPanelId = ""; $("#fp-panel").value = "";
    cleanup(); pdfDocument = null; canvas = null;
    updatePanelChoices(); updatePlanChoices(); updateDeviceChoices(); setUiState();
    status(t("choosePdf"));
  });
  $("#fp-panel").addEventListener("change", (event) => { selectedPanelId = event.currentTarget.value; updateDeviceChoices(); setUiState(); });
  $("#fp-plan-select").addEventListener("change", async (event) => { selectedPlanId = event.target.value; setUiState(); try { await loadPlan(event.target.value); } catch (error) { status(translateError(error.message), true); } });
  $("#fp-delete-plan").addEventListener("click", deleteSelectedPlan);
  $("#fp-page").addEventListener("change", async (event) => {
    pageNumber = Number(event.currentTarget.value); isBusy = true; setUiState();
    try { await renderPage(); status(t("pageStatus")(pageNumber)); }
    catch (error) { cleanup(); status(translateError(error.message), true); }
    finally { isBusy = false; updateDeviceChoices(); setUiState(); }
  });
  $("#fp-upload-trigger").addEventListener("click", () => { if (!$("#fp-upload-trigger").disabled) $("#fp-upload").click(); });
  $("#fp-upload").addEventListener("change", async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    isBusy = true; setUiState();
    try {
      status(t("uploading"));
      if (!selectedProjectId || !selectedPanelId) throw new Error(t("choosePdf"));
      const form = new FormData(); form.append("pdf", file); form.append("name", file.name.replace(/\.pdf$/i, "")); form.append("projectId", selectedProjectId);
      const response = await request("/api/floor-plans", { method: "POST", body: form });
      const { plan } = await response.json();
      await refreshPlans();
      isBusy = false;
      selectedPlanId = plan.id;
      $("#fp-plan-select").value = plan.id;
      await loadPlan(plan.id);
    } catch (error) { status(translateError(error.message), true); }
    finally { isBusy = false; setUiState(); }
    event.target.value = "";
  });
  const addDevice = (type, x = canvas.getWidth() / 2, y = canvas.getHeight() / 2, registered = null) => {
    if (!selectedPlan || !selectedPanelId || !registered) return;
    const { card, device } = registered;
    const address = device.ip || String(device.number || "");
    const data = { type, projectId: selectedPlan.projectId, panelId: selectedPanelId, deviceId: device.id, address, zone: device.zone || "", label: `${card.label || ""}-${address}`.replace(/^-|-$/g, ""), loop: card.label || card.id || "", rotation: 0 };
    const marker = buildDevice(data, x, y); canvas.add(marker); canvas.setActiveObject(marker); canvas.requestRenderAll(); setSelected(marker);
  };
  $("#fp-device-list").addEventListener("click", (event) => {
    const tool = event.target.closest("[data-device-id]"); if (!tool) return;
    if (!canvas) { status(t("choosePlanBeforePlace")); return; }
    const found = allDevicesForPanel().find(({ device }) => device.id === tool.dataset.deviceId);
    if (found) addDevice(deviceKind(found.device), undefined, undefined, found);
  });
  $("#fp-device-list").addEventListener("dragstart", (event) => {
    const tool = event.target.closest("[data-device-id]");
    if (!tool) { event.preventDefault(); return; }
    if (!canvas) { event.preventDefault(); status(t("choosePlanBeforePlace")); return; }
    event.dataTransfer.setData("text/plain", JSON.stringify({ deviceId: tool.dataset.deviceId }));
  });
  const canvasHolder = $(".fp-canvas-holder");
  canvasHolder.addEventListener("dragover", (event) => event.preventDefault());
  canvasHolder.addEventListener("drop", (event) => { event.preventDefault(); if (!canvas) return; let item; try { item = JSON.parse(event.dataTransfer.getData("text/plain")); } catch { return; } const found = allDevicesForPanel().find(({ device }) => device.id === item.deviceId); if (!found) return; const point = canvas.getScenePoint(event); addDevice(deviceKind(found.device), point.x, point.y, found); });
  $("#fp-snap").addEventListener("change", (event) => { snap = event.target.checked; syncSnapGrid(); });
  $("#fp-apply").addEventListener("click", () => {
    const marker = canvas?.getActiveObject(); if (!marker?.fpDevice) return;
    const loop = $("#fp-loop").value.trim(), address = $("#fp-address").value.trim();
    marker.fpDevice = { ...marker.fpDevice, type: $("#fp-type").value, deviceType: $("#fp-type").value, deviceId: $("#fp-device-id").value.trim(), loop, address, zone: $("#fp-zone").value.trim(), label: $("#fp-label").value.trim() };
    const items = marker.getObjects();
    const glyphType = marker.fpDevice.type === "SND/FL" ? "S/F" : marker.fpDevice.type;
    items[1].set("text", glyphType); items[2].set("text", marker.fpDevice.address || marker.fpDevice.label || "");
    canvas.requestRenderAll();
  });
  $("#fp-rotate").addEventListener("click", () => { const marker = canvas?.getActiveObject(); if (!marker?.fpDevice) return; marker.rotate((marker.angle + 15) % 360); marker.fpDevice.rotation = marker.angle; canvas.requestRenderAll(); });
  $("#fp-delete").addEventListener("click", () => { const marker = canvas?.getActiveObject(); if (marker?.fpDevice) { canvas.remove(marker); canvas.discardActiveObject(); setSelected(null); } });
  $("#fp-fit").addEventListener("click", () => { if (!canvas) return; const zoom = Math.min($(".fp-canvas-scroll").clientWidth / canvas.getWidth(), $(".fp-canvas-scroll").clientHeight / canvas.getHeight(), 1); canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]); canvas.requestRenderAll(); });
  $("#fp-save").addEventListener("click", async () => {
    if (!canvas || !selectedPlan) return;
    try {
      const devices = canvas.getObjects().filter((object) => object.fpDevice).map((object) => ({ ...object.fpDevice, projectId: selectedPlan.projectId, deviceType: object.fpDevice.type, normX: Math.max(0, Math.min(1, object.left / canvas.getWidth())), normY: Math.max(0, Math.min(1, object.top / canvas.getHeight())), rotation: Math.round(object.angle) }));
      const response = await request(`/api/floor-plans/${selectedPlan.id}/layout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: pageNumber, devices }) });
      await response.json(); status(t("saved")(devices.length, pageNumber));
    } catch (error) { status(translateError(error.message), true); }
  });
  $("#fp-export").addEventListener("click", async () => {
    if (!selectedPlan) return;
    try {
      status(t("preparing"));
      const response = await request(`/api/floor-plans/${selectedPlan.id}/export?page=${pageNumber}`);
      const blob = await response.blob(), url = URL.createObjectURL(blob), link = document.createElement("a");
      link.href = url; link.download = `${selectedPlan.name.replace(/[^a-z0-9_-]+/gi, "-")}-mapped.pdf`; link.click(); URL.revokeObjectURL(url); status(t("downloaded"));
    } catch (error) { status(translateError(error.message), true); }
  });
  $("#fp-project").value = selectedProjectId;
  updatePanelChoices();
  try { await refreshPlans(); } catch (error) { status(translateError(error.message), true); }
}
