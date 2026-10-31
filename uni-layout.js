// Tile order and sizes for the UNI → PRESENT DAY mosaic.
// Edit visually in "Uni Layout Editor.html" (Save applies it to the live page,
// Copy code gives you the array to paste into UNI_LAYOUT below to make it permanent).
// Entry shape: { id, w, h, brk, col?, row? }  ·  w/h in grid cells (1 or 2)  ·  brk = group divider after this tile
// col/row (0-based) pin a tile to an exact cell; entries without them are auto-packed.
(function () {
  var COLS = 8;
  var KEY = "uni-layout-v2";
  // Sizes the auto packer used before this file existed, so the editor opens on
  // the layout the site already shows.
  var HERO = ["wukong", "gta-vc", "bloodborne", "sekiro", "cyberpunk", "it-takes-two"];
  var WIDE = ["diablo-2-dlc"];

  var UNI_LAYOUT = [
    {"id":"wukong","w":2,"h":2,"brk":true,"col":0,"row":0},
    {"id":"diablo-2","w":2,"h":1,"brk":false,"col":2,"row":0},
    {"id":"gta-4","w":2,"h":1,"brk":false,"col":4,"row":0},
    {"id":"gta-vc","w":2,"h":2,"brk":false,"col":6,"row":0},
    {"id":"diablo-2-dlc","w":1,"h":1,"brk":true,"col":2,"row":1},
    {"id":"gta-3","w":1,"h":1,"brk":false,"col":3,"row":1},
    {"id":"gta-4-dlc","w":2,"h":1,"brk":false,"col":4,"row":1},
    {"id":"dark-souls-1","w":2,"h":1,"brk":false,"col":0,"row":2},
    {"id":"dark-souls-1-dlc","w":1,"h":1,"brk":false,"col":2,"row":2},
    {"id":"dark-souls-2","w":1,"h":1,"brk":false,"col":3,"row":2},
    {"id":"dark-souls-2-dlc-crowns","w":2,"h":1,"brk":false,"col":4,"row":2},
    {"id":"gta-5","w":2,"h":1,"brk":true,"col":6,"row":2},
    {"id":"dark-souls-3","w":2,"h":1,"brk":false,"col":0,"row":3},
    {"id":"dark-souls-3-dlc","w":2,"h":1,"brk":true,"col":2,"row":3},
    {"id":"bloodborne","w":2,"h":2,"brk":false,"col":4,"row":3},
    {"id":"bloodborne-dlc","w":2,"h":1,"brk":true,"col":6,"row":3},
    {"id":"sekiro","w":2,"h":2,"brk":true,"col":0,"row":4},
    {"id":"elden-ring","w":2,"h":1,"brk":false,"col":2,"row":4},
    {"id":"fist","w":2,"h":1,"brk":true,"col":6,"row":4},
    {"id":"elden-ring-dlc","w":2,"h":1,"brk":true,"col":2,"row":5},
    {"id":"inside","w":2,"h":1,"brk":true,"col":4,"row":5},
    {"id":"cyberpunk","w":2,"h":2,"brk":false,"col":6,"row":5},
    {"id":"titan-fall-2","w":1,"h":1,"brk":true,"col":0,"row":6},
    {"id":"nfs-heat","w":1,"h":1,"brk":false,"col":1,"row":6},
    {"id":"it-takes-two","w":2,"h":2,"brk":false,"col":2,"row":6},
    {"id":"split-fiction","w":2,"h":1,"brk":true,"col":4,"row":6},
    {"id":"slay-the-spire","w":2,"h":1,"brk":true,"col":0,"row":7},
    {"id":"a-way-out","w":2,"h":1,"brk":false,"col":4,"row":7},
    {"id":"cyberpunk-dlc","w":2,"h":1,"brk":true,"col":6,"row":7},
    {"id":"zelda-breath","w":2,"h":1,"brk":false,"col":0,"row":8},
    {"id":"zelda-echo","w":2,"h":1,"brk":true,"col":2,"row":8},
    {"id":"nioh","w":2,"h":1,"brk":false,"col":4,"row":8},
    {"id":"nioh-dlc","w":2,"h":1,"brk":true,"col":6,"row":8},
    {"id":"zelda-tears","w":2,"h":2,"brk":false,"col":0,"row":9},
    {"id":"hades","w":2,"h":1,"brk":false,"col":2,"row":9},
    {"id":"ori-will","w":2,"h":1,"brk":true,"col":4,"row":9},
    {"id":"brotato","w":2,"h":2,"brk":false,"col":6,"row":9},
    {"id":"nba2k21","w":1,"h":1,"brk":false,"col":2,"row":10},
    {"id":"storm","w":1,"h":1,"brk":false,"col":3,"row":10},
    {"id":"dead-cells","w":2,"h":2,"brk":false,"col":4,"row":10},
    {"id":"balatro","w":2,"h":1,"brk":false,"col":0,"row":11},
    {"id":"reanimal","w":2,"h":1,"brk":false,"col":2,"row":11},
    {"id":"brotato-dlc","w":2,"h":1,"brk":false,"col":6,"row":11},
    {"id":"overcooked","w":2,"h":1,"brk":false,"col":0,"row":12},
    {"id":"overcooked2","w":2,"h":1,"brk":true,"col":2,"row":12},
    {"id":"dead-cells-dlc","w":2,"h":1,"brk":true,"col":4,"row":12}
  ]; // baked from the visual editor

  function defaultLayout() {
    var ids = (window.SECTIONS && window.SECTIONS.uni) || [];
    var byId = window.GAMES_BY_ID || {};
    var out = [];
    var i = 0;
    ids.forEach(function (id) {
      if (id === null) {
        if (out.length) out[out.length - 1].brk = true;
        return;
      }
      var g = byId[id];
      if (!g) return;
      var hero = HERO.indexOf(id) >= 0;
      var w = hero ? 2 : WIDE.indexOf(id) >= 0 || (!g.dlc && i % 4 === 1) ? 2 : 1;
      out.push({ id: id, w: w, h: hero ? 2 : 1, brk: false });
      i++;
    });
    if (out.length) out[out.length - 1].brk = false;
    return out;
  }

  // Tiles with an explicit col/row (saved from the editor) sit exactly there;
  // tiles without one are first-fit packed after them. Cells nothing covers
  // come back as holes (empty rows are kept as deliberate spacing).
  function pack(list, cols) {
    cols = cols || COLS;
    var occ = [];
    var out = new Array(list.length);
    function free(y0, x0, w, h) {
      for (var y = y0; y < y0 + h; y++) for (var x = x0; x < x0 + w; x++) if ((occ[y] || [])[x]) return false;
      return true;
    }
    function fill(y0, x0, w, h) {
      for (var y = y0; y < y0 + h; y++) {
        occ[y] = occ[y] || [];
        for (var x = x0; x < x0 + w; x++) occ[y][x] = 1;
      }
    }
    function dims(t) {
      return { w: Math.max(1, Math.min(t.w || 1, cols)), h: Math.max(1, t.h || 1) };
    }
    list.forEach(function (t, i) {
      if (t.col == null || t.row == null) return;
      var d = dims(t);
      var c = Math.max(0, Math.min(t.col, cols - d.w));
      var r = Math.max(0, t.row);
      fill(r, c, d.w, d.h);
      out[i] = { id: t.id, w: d.w, h: d.h, brk: !!t.brk, col: c, row: r };
    });
    var r = occ.length;
    var c = 0;
    list.forEach(function (t, i) {
      if (out[i]) return;
      var d = dims(t);
      for (var guard = 0; guard < 10000; guard++) {
        if (c + d.w > cols) { c = 0; r++; continue; }
        if (!free(r, c, d.w, d.h)) { c++; continue; }
        break;
      }
      fill(r, c, d.w, d.h);
      out[i] = { id: t.id, w: d.w, h: d.h, brk: !!t.brk, col: c, row: r };
      c += d.w;
    });
    var rows = occ.length;
    var holes = [];
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) if (!(occ[y] || [])[x]) holes.push({ r: y, c: x });
    return { tiles: out, rows: rows, holes: holes };
  }

  // Any uni game missing from a saved layout (added after it was saved) is
  // appended at the end as a 1×1 tile so new games always show up.
  function withMissing(list) {
    var have = {};
    list.forEach(function (t) { have[t.id] = 1; });
    var ids = (window.SECTIONS && window.SECTIONS.uni) || [];
    var byId = window.GAMES_BY_ID || {};
    var out = list.slice();
    ids.forEach(function (id) {
      if (id && !have[id] && byId[id]) { out.push({ id: id, w: 1, h: 1, brk: false }); have[id] = 1; }
    });
    return out;
  }

  function load() {
    try {
      var s = localStorage.getItem(KEY);
      if (s) {
        var v = JSON.parse(s);
        if (Array.isArray(v) && v.length) return withMissing(v);
      }
    } catch (e) {}
    return UNI_LAYOUT && UNI_LAYOUT.length ? withMissing(UNI_LAYOUT) : null;
  }

  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  window.UNI_COLS = COLS;
  window.UNI_LAYOUT = UNI_LAYOUT;
  window.uniDefaultLayout = defaultLayout;
  window.uniPack = pack;
  window.uniLoadLayout = load;
  window.uniSaveLayout = save;
  window.uniClearLayout = clear;
})();
