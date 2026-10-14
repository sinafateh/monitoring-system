import { Canvas, Circle, Rect, Line, Text, Group, FabricImage } from "fabric";
import * as pdfjs from "pdfjs-dist/build/pdf.mjs";
import "./floor-plan.css";

// PDF.js worker is bundled by Vite so page rendering remains local to the browser.
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).href;
const kinds = [
  { type: "SD", name: "Smoke Detector" }, { type: "HD", name: "Heat Detector" },
  { type: "MS", name: "Multi-Sensor" }, { type: "MCP", name: "Manual Call Point" },
  { type: "SND/FL", name: "Sounder / Flasher" }, { type: "MOD", name: "Control / Monitor Module" },
  { type: "FACP", name: "Fire Alarm Control Panel" },
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

export async function mountFloorPlanModule(root, registeredLoopCards = []) {
  if (!root) return;
  if (root._floorPlanCleanup) root._floorPlanCleanup();
  let plans = [], selectedPlan = null, pageNumber = 1, pdfDocument = null, canvas = null;
  let currentBackground = null, snap = false;
  const escapeText = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const html = `
    <div class="floor-plan-shell">
      <header class="floor-plan-header">
        <div><span class="eyebrow">DEVICE SETTINGS</span><h2>Floor Plan Layout</h2><p>Upload a vector PDF, map alarm devices, and export the stamped original.</p></div>
        <div class="floor-plan-header-actions"><label class="fp-button fp-button-primary">Upload floor plan<input id="fp-upload" type="file" accept="application/pdf"></label><button id="fp-save" class="fp-button fp-button-primary" disabled>Save Layout</button><button id="fp-export" class="fp-button" disabled>Export PDF</button></div>
      </header>
      <div class="fp-plan-bar"><label>Floor plan<select id="fp-plan-select"><option value="">Select a floor plan…</option></select></label><label>Page<select id="fp-page" disabled></select></label><span id="fp-status" role="status">Choose a PDF floor plan to begin.</span></div>
      <div class="fp-workspace">
        <aside class="fp-toolbox"><h3>Device toolbox</h3><p>Click or drag a symbol onto the plan.</p><div class="fp-device-list">${kinds.map((k) => `<button class="fp-device-tool" type="button" draggable="true" data-add-type="${k.type}"><span class="fp-symbol">${k.type}</span><span>${k.name}</span></button>`).join("")}</div>
          <label class="fp-check"><input id="fp-snap" type="checkbox"> Snap to grid</label>
          <div class="fp-inspector"><h3>Selected device</h3><label>Device type<select id="fp-type">${kinds.map((k) => `<option value="${k.type}">${k.type} · ${k.name}</option>`).join("")}</select></label><label>Registered device<select id="fp-registered-device"><option value="">Enter metadata manually</option>${registeredLoopCards.flatMap((card) => (card.devices || []).map((device) => `<option value="${escapeText(device.id)}">${escapeText(card.label)} · ${escapeText(device.ip || device.number || device.id)} · ${escapeText(device.type)}</option>`)).join("")}</select></label><label>Device ID (optional)<input id="fp-device-id" maxlength="120" placeholder="Enter ID"></label><label>Loop No<input id="fp-loop" maxlength="40"></label><label>Device address<input id="fp-address" maxlength="40" placeholder="D024"></label><label>Zone<input id="fp-zone" maxlength="80"></label><label>Label<input id="fp-label" maxlength="120" placeholder="e.g. L1-D024"></label><div class="fp-inspector-actions"><button id="fp-apply" class="fp-button" disabled>Apply details</button><button id="fp-rotate" class="fp-button" disabled>Rotate 15°</button><button id="fp-delete" class="fp-button fp-danger" disabled>Delete</button></div></div>
        </aside>
        <section class="fp-canvas-panel"><div class="fp-canvas-tools"><button id="fp-fit" class="fp-button" disabled>Fit page</button><span>Wheel: zoom · Space + drag: pan · Select a device to move it</span></div><div class="fp-canvas-scroll"><div class="fp-canvas-holder"><canvas id="fp-canvas"></canvas></div></div></section>
      </div>
    </div>`;
  root.innerHTML = html;
  const $ = (selector) => root.querySelector(selector);
  const status = (message, error = false) => { const el = $("#fp-status"); el.textContent = message; el.classList.toggle("error", error); };
  const buttonStates = (enabled) => { ["#fp-save", "#fp-export", "#fp-page", "#fp-fit"].forEach((selector) => { $(selector).disabled = !enabled; }); };
  const cleanup = () => { canvas?.dispose(); canvas = null; pdfDocument = null; };
  root._floorPlanCleanup = cleanup;

  const setSelected = (object) => {
    const disabled = !object || !object.fpDevice;
    ["#fp-registered-device", "#fp-device-id", "#fp-loop", "#fp-address", "#fp-zone", "#fp-label", "#fp-type", "#fp-apply", "#fp-rotate", "#fp-delete"].forEach((selector) => { $(selector).disabled = disabled; });
    if (disabled) return;
    $("#fp-type").value = object.fpDevice.type;
    $("#fp-registered-device").value = object.fpDevice.deviceId || "";
    $("#fp-device-id").value = object.fpDevice.deviceId || "";
    $("#fp-loop").value = object.fpDevice.loop || "";
    $("#fp-address").value = object.fpDevice.address || "";
    $("#fp-zone").value = object.fpDevice.zone || "";
    $("#fp-label").value = object.fpDevice.label || "";
  };
  const buildDevice = (data, x, y) => {
    const type = data.type || "SD";
    const shape = ["SD", "HD", "MS"].includes(type)
      ? new Circle({ radius: 15, fill: "#fff", stroke: "#123456", strokeWidth: 2, originX: "center", originY: "center" })
      : new Rect({ width: 30, height: 24, rx: 3, ry: 3, fill: "#fff", stroke: "#123456", strokeWidth: 2, originX: "center", originY: "center" });
    const glyph = new Text(type, { fontFamily: "Arial", fontSize: 8, fontWeight: "bold", fill: "#123456", originX: "center", originY: "center", top: 0 });
    const tagText = data.address || data.label || "";
    const tag = new Text(tagText, { fontFamily: "Arial", fontSize: 9, fill: "#102a43", originX: "center", originY: "top", top: 19 });
    const group = new Group([shape, glyph, tag], { left: x, top: y, originX: "center", originY: "center", angle: Number(data.rotation) || 0, hasControls: true, lockScalingX: true, lockScalingY: true, fpDevice: { ...data, type } });
    return group;
  };
  const renderPage = async () => {
    if (!selectedPlan) return;
    cleanup();
    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2 });
    const pdfCanvas = document.createElement("canvas");
    pdfCanvas.width = Math.ceil(viewport.width); pdfCanvas.height = Math.ceil(viewport.height);
    await page.render({ canvas: pdfCanvas, viewport }).promise;
    canvas = new Canvas($("#fp-canvas"), { width: pdfCanvas.width, height: pdfCanvas.height, preserveObjectStacking: true, selection: true, backgroundColor: "#fff" });
    $(".fp-canvas-holder").style.width = `${pdfCanvas.width}px`;
    $(".fp-canvas-holder").style.height = `${pdfCanvas.height}px`;
    currentBackground = await FabricImage.fromURL(pdfCanvas.toDataURL("image/png"));
    currentBackground.set({ left: 0, top: 0, selectable: false, evented: false });
    canvas.backgroundImage = currentBackground;
    const response = await request(`/api/floor-plans/${selectedPlan.id}/layout?page=${pageNumber}`);
    const payload = await response.json();
    for (const item of payload.devices) {
      const marker = buildDevice({ ...item, type: item.deviceType, loop: item.loop || "" }, item.normX * canvas.getWidth(), item.normY * canvas.getHeight());
      marker.fpDevice.deviceId = item.deviceId || "";
      canvas.add(marker);
    }
    canvas.on("selection:created", (event) => setSelected(event.selected?.[0]));
    canvas.on("selection:updated", (event) => setSelected(event.selected?.[0]));
    canvas.on("selection:cleared", () => setSelected(null));
    canvas.on("object:moving", (event) => {
      if (!snap || !event.target?.fpDevice) return;
      event.target.set({ left: Math.round(event.target.left / 20) * 20, top: Math.round(event.target.top / 20) * 20 });
    });
    // Holding Space temporarily enables drag-to-pan without interfering with symbol selection.
    let spaceDown = false;
    const keyDown = (event) => { if (event.code === "Space") { spaceDown = true; canvas.defaultCursor = "grab"; } };
    const keyUp = (event) => { if (event.code === "Space") { spaceDown = false; canvas.defaultCursor = "default"; } };
    const mouseDown = (event) => { if (spaceDown) { canvas.isDragging = true; canvas.selection = false; canvas.lastPosX = event.e.clientX; canvas.lastPosY = event.e.clientY; canvas.defaultCursor = "grabbing"; } };
    const mouseMove = (event) => { if (!canvas.isDragging) return; const vpt = canvas.viewportTransform; vpt[4] += event.e.clientX - canvas.lastPosX; vpt[5] += event.e.clientY - canvas.lastPosY; canvas.lastPosX = event.e.clientX; canvas.lastPosY = event.e.clientY; canvas.requestRenderAll(); };
    const mouseUp = () => { canvas.isDragging = false; canvas.selection = true; canvas.defaultCursor = "default"; };
    const wheel = (event) => { const delta = event.e.deltaY; let zoom = canvas.getZoom() * (0.999 ** delta); zoom = Math.max(0.12, Math.min(5, zoom)); canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom); event.e.preventDefault(); event.e.stopPropagation(); };
    canvas.on("mouse:down", mouseDown); canvas.on("mouse:move", mouseMove); canvas.on("mouse:up", mouseUp); canvas.on("mouse:wheel", wheel);
    window.addEventListener("keydown", keyDown); window.addEventListener("keyup", keyUp);
    const previousCleanup = root._floorPlanCleanup;
    root._floorPlanCleanup = () => { window.removeEventListener("keydown", keyDown); window.removeEventListener("keyup", keyUp); previousCleanup(); };
    canvas.requestRenderAll();
    const fit = Math.min($(".fp-canvas-scroll").clientWidth / canvas.getWidth(), $(".fp-canvas-scroll").clientHeight / canvas.getHeight(), 1);
    canvas.setZoom(Math.max(0.12, fit));
    buttonStates(true); setSelected(null);
  };
  const loadPlan = async (id) => {
    selectedPlan = plans.find((item) => item.id === id) || null;
    if (!selectedPlan) { cleanup(); buttonStates(false); return; }
    try {
      status("Loading PDF page…");
      pdfDocument = await pdfjs.getDocument(`/api/floor-plans/${selectedPlan.id}/file`).promise;
      $("#fp-page").innerHTML = Array.from({ length: selectedPlan.pageCount }, (_, i) => `<option value="${i + 1}">Page ${i + 1}</option>`).join("");
      $("#fp-page").value = "1"; pageNumber = 1;
      await renderPage(); status(`${selectedPlan.name} · ${selectedPlan.pageCount} page${selectedPlan.pageCount === 1 ? "" : "s"}`);
    } catch (error) { status(error.message, true); }
  };
  const refreshPlans = async () => {
    const response = await request("/api/floor-plans");
    plans = (await response.json()).plans;
    $("#fp-plan-select").innerHTML = `<option value="">Select a floor plan…</option>${plans.map((plan) => `<option value="${plan.id}">${escapeText(plan.name)}</option>`).join("")}`;
  };
  $("#fp-plan-select").addEventListener("change", async (event) => { try { await loadPlan(event.target.value); } catch (error) { status(error.message, true); } });
  $("#fp-page").addEventListener("change", async (event) => { pageNumber = Number(event.target.value); try { await renderPage(); status(`Page ${pageNumber}`); } catch (error) { status(error.message, true); } });
  $("#fp-upload").addEventListener("change", async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      status("Uploading PDF…");
      const form = new FormData(); form.append("pdf", file); form.append("name", file.name.replace(/\.pdf$/i, ""));
      const response = await request("/api/floor-plans", { method: "POST", body: form });
      const { plan } = await response.json(); await refreshPlans(); $("#fp-plan-select").value = plan.id; await loadPlan(plan.id);
    } catch (error) { status(error.message, true); }
    event.target.value = "";
  });
  const addDevice = (type, x = canvas.getWidth() / 2, y = canvas.getHeight() / 2) => {
    const data = { type, deviceId: "", address: "", zone: "", label: "", loop: "", rotation: 0 };
    const marker = buildDevice(data, x, y); canvas.add(marker); canvas.setActiveObject(marker); canvas.requestRenderAll(); setSelected(marker);
  };
  root.querySelectorAll("[data-add-type]").forEach((tool) => {
    tool.addEventListener("click", () => { if (canvas) addDevice(tool.dataset.addType); });
    tool.addEventListener("dragstart", (event) => event.dataTransfer.setData("text/plain", tool.dataset.addType));
  });
  const canvasHolder = $(".fp-canvas-holder");
  canvasHolder.addEventListener("dragover", (event) => event.preventDefault());
  canvasHolder.addEventListener("drop", (event) => { event.preventDefault(); const type = event.dataTransfer.getData("text/plain"); if (!canvas || !kinds.some((kind) => kind.type === type)) return; const rect = $("#fp-canvas").getBoundingClientRect(); const zoom = canvas.getZoom(); addDevice(type, (event.clientX - rect.left) / zoom, (event.clientY - rect.top) / zoom); });
  $("#fp-snap").addEventListener("change", (event) => { snap = event.target.checked; });
  $("#fp-registered-device").addEventListener("change", (event) => {
    const selectedId = event.target.value;
    if (!selectedId) return;
    const match = registeredLoopCards.flatMap((card) => (card.devices || []).map((device) => ({ card, device }))).find(({ device }) => device.id === selectedId);
    if (!match) return;
    $("#fp-device-id").value = match.device.id;
    $("#fp-loop").value = match.card.label || match.card.id || "";
    $("#fp-address").value = match.device.ip || String(match.device.number || "");
    $("#fp-label").value = `${match.card.label || ""}-${match.device.ip || match.device.number || ""}`.replace(/^-|-$/g, "");
  });
  $("#fp-apply").addEventListener("click", () => {
    const marker = canvas?.getActiveObject(); if (!marker?.fpDevice) return;
    const loop = $("#fp-loop").value.trim(), address = $("#fp-address").value.trim();
    marker.fpDevice = { ...marker.fpDevice, type: $("#fp-type").value, deviceType: $("#fp-type").value, deviceId: $("#fp-device-id").value.trim(), loop, address, zone: $("#fp-zone").value.trim(), label: $("#fp-label").value.trim() };
    const items = marker.getObjects(); items[0].set({ fill: ["SD", "HD", "MS"].includes(marker.fpDevice.type) ? "#fff" : "#fff" }); items[1].set("text", marker.fpDevice.type); items[2].set("text", marker.fpDevice.address || marker.fpDevice.label || "");
    canvas.requestRenderAll();
  });
  $("#fp-rotate").addEventListener("click", () => { const marker = canvas?.getActiveObject(); if (!marker?.fpDevice) return; marker.rotate((marker.angle + 15) % 360); marker.fpDevice.rotation = marker.angle; canvas.requestRenderAll(); });
  $("#fp-delete").addEventListener("click", () => { const marker = canvas?.getActiveObject(); if (marker?.fpDevice) { canvas.remove(marker); canvas.discardActiveObject(); setSelected(null); } });
  $("#fp-fit").addEventListener("click", () => { if (!canvas) return; const zoom = Math.min($(".fp-canvas-scroll").clientWidth / canvas.getWidth(), $(".fp-canvas-scroll").clientHeight / canvas.getHeight(), 1); canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]); canvas.requestRenderAll(); });
  $("#fp-save").addEventListener("click", async () => {
    if (!canvas || !selectedPlan) return;
    try {
      const devices = canvas.getObjects().filter((object) => object.fpDevice).map((object) => ({ ...object.fpDevice, deviceType: object.fpDevice.type, normX: Math.max(0, Math.min(1, object.left / canvas.getWidth())), normY: Math.max(0, Math.min(1, object.top / canvas.getHeight())), rotation: Math.round(object.angle) }));
      const response = await request(`/api/floor-plans/${selectedPlan.id}/layout`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: pageNumber, devices }) });
      await response.json(); status(`Saved ${devices.length} device${devices.length === 1 ? "" : "s"} on page ${pageNumber}.`);
    } catch (error) { status(error.message, true); }
  });
  $("#fp-export").addEventListener("click", async () => {
    if (!selectedPlan) return;
    try {
      status("Preparing vector PDF export…");
      const response = await request(`/api/floor-plans/${selectedPlan.id}/export?page=${pageNumber}`);
      const blob = await response.blob(), url = URL.createObjectURL(blob), link = document.createElement("a");
      link.href = url; link.download = `${selectedPlan.name.replace(/[^a-z0-9_-]+/gi, "-")}-mapped.pdf`; link.click(); URL.revokeObjectURL(url); status("Export downloaded.");
    } catch (error) { status(error.message, true); }
  });
  try { await refreshPlans(); } catch (error) { status(error.message, true); }
}
