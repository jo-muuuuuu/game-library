// Tile order and sizes for the UNI → PRESENT DAY mosaic.
// Edit visually in "Uni Layout Editor.html" (Save applies it to the live page,
// Copy code gives you the array to paste into UNI_LAYOUT below to make it permanent).
// Entry shape: { id, w, h, brk }  ·  w/h in grid cells (1 or 2)  ·  brk = group divider after this tile.
(function () {
  var COLS = 8;
  var KEY = "uni-layout-v2";
  // Sizes the auto packer used before this file existed, so the editor opens on
  // the layout the site already shows.
  var HERO = ["wukong", "gta-vc", "bloodborne", "sekiro", "cyberpunk", "it-takes-two"];
  var WIDE = ["diablo-2-dlc"];

  var UNI_LAYOUT = [
    {"id":"wukong","w":2,"h":2,"brk":true},
    {"id":"diablo-2","w":2,"h":1,"brk":false},
    {"id":"gta-4","w":2,"h":1,"brk":false},
    {"id":"gta-vc","w":2,"h":2,"brk":false},
    {"id":"diablo-2-dlc","w":1,"h":1,"brk":true},
    {"id":"gta-3","w":1,"h":1,"brk":false},
    {"id":"gta-4-dlc","w":2,"h":1,"brk":false},
    {"id":"dark-souls-1","w":2,"h":1,"brk":false},
    {"id":"dark-souls-1-dlc","w":1,"h":1,"brk":false},
    {"id":"dark-souls-2","w":1,"h":1,"brk":false},
    {"id":"dark-souls-2-dlc-crowns","w":2,"h":1,"brk":false},
    {"id":"gta-5","w":2,"h":1,"brk":true},
    {"id":"dark-souls-3","w":2,"h":1,"brk":false},
    {"id":"dark-souls-3-dlc","w":2,"h":1,"brk":true},
    {"id":"bloodborne","w":2,"h":2,"brk":false},
    {"id":"bloodborne-dlc","w":2,"h":1,"brk":true},
    {"id":"sekiro","w":2,"h":2,"brk":true},
    {"id":"elden-ring","w":2,"h":1,"brk":false},
    {"id":"fist","w":2,"h":1,"brk":true},
    {"id":"elden-ring-dlc","w":2,"h":1,"brk":true},
    {"id":"inside","w":2,"h":1,"brk":true},
    {"id":"cyberpunk","w":2,"h":2,"brk":false},
    {"id":"titan-fall-2","w":1,"h":1,"brk":true},
    {"id":"a-way-out","w":1,"h":1,"brk":false},
    {"id":"it-takes-two","w":2,"h":2,"brk":false},
    {"id":"split-fiction","w":2,"h":1,"brk":true},
    {"id":"slay-the-spire","w":2,"h":1,"brk":true},
    {"id":"hades","w":2,"h":1,"brk":false},
    {"id":"cyberpunk-dlc","w":2,"h":1,"brk":true},
    {"id":"zelda-breath","w":2,"h":1,"brk":false},
    {"id":"nfs-heat","w":1,"h":1,"brk":false},
    {"id":"ori-will","w":1,"h":1,"brk":true},
    {"id":"nioh","w":2,"h":1,"brk":false},
    {"id":"nioh-dlc","w":2,"h":1,"brk":true},
    {"id":"zelda-tears","w":1,"h":1,"brk":false},
    {"id":"zelda-echo","w":1,"h":1,"brk":true},
    {"id":"balatro","w":2,"h":1,"brk":false},
    {"id":"brotato","w":2,"h":1,"brk":false},
    {"id":"brotato-dlc","w":2,"h":1,"brk":false},
    {"id":"dead-cells","w":2,"h":1,"brk":false},
    {"id":"dead-cells-dlc","w":2,"h":1,"brk":true},
    {"id":"storm","w":1,"h":1,"brk":false},
    {"id":"nba2k21","w":1,"h":1,"brk":false},
    {"id":"overcooked","w":1,"h":1,"brk":false},
    {"id":"overcooked2","w":1,"h":1,"brk":true}
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

  // Strict first-fit in list order: what you arrange is what you get. Cells no
  // tile could fill come back as holes so the editor can flag them.
  function pack(list, cols) {
    cols = cols || COLS;
    var occ = [];
    var out = [];
    var r = 0;
    var c = 0;
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
    list.forEach(function (t) {
      var w = Math.max(1, Math.min(t.w || 1, cols));
      var h = Math.max(1, t.h || 1);
      for (var guard = 0; guard < 10000; guard++) {
        if (c + w > cols) { c = 0; r++; continue; }
        if (!free(r, c, w, h)) { c++; continue; }
        break;
      }
      fill(r, c, w, h);
      out.push({ id: t.id, w: w, h: h, brk: !!t.brk, col: c, row: r });
      c += w;
    });
    var rows = occ.length;
    var holes = [];
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) if (!(occ[y] || [])[x]) holes.push({ r: y, c: x });
    return { tiles: out, rows: rows, holes: holes };
  }

  function load() {
    try {
      var s = localStorage.getItem(KEY);
      if (s) {
        var v = JSON.parse(s);
        if (Array.isArray(v) && v.length) return v;
      }
    } catch (e) {}
    return UNI_LAYOUT && UNI_LAYOUT.length ? UNI_LAYOUT : null;
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
