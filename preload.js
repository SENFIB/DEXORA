const { contextBridge, ipcRenderer: r, webUtils } = require('electron');
const i = n => (...a) => r.invoke(n, ...a);
contextBridge.exposeInMainWorld('api', {
  load: i('data:load'), save: i('data:save'), icon: i('icon'), info: i('path:info'),
  launch: i('launch'), pick: i('pick'), boot: i('boot'), jsonOpen: i('json:open'),
  jsonSave: i('json:save'), prefs: i('prefs'), openDate: i('opendate'), setTitle: i('app:title'),
  monCfg: i('mon:cfg'), monStatic: i('mon:static'),
  onMon: f => r.on('mon', (_, d) => f(d)),
  subs: i('media:subs'), subFile: i('media:subfile'), scan: i('media:scan'),
  apps: i('apps:list'), iconApp: i('icon:app'), geo: i('geo:get'), json: i('net:json'), adblock: i('br:adblock'),
  onBrOpen: f => r.on('br:open', (_, u) => f(u)), onBrDl: f => r.on('br:dl', (_, d) => f(d)), onBlocked: f => r.on('br:blocked', (_, n) => f(n)),
  dmList: i('dm:list'), dmAdd: i('dm:add'), dmAct: i('dm:act'), dmCfg: i('dm:cfg'),
  onDm: f => { r.on('dm:all', (_, d) => f('all', d)); r.on('dm:upd', (_, d) => f('upd', d)); }, onDmClip: f => r.on('dm:clip', (_, u) => f(u)), onDmDone: f => r.on('dm:done', (_, d) => f(d)), onDmCap: f => r.on('dm:captured', (_, n) => f(n)), onMedia: f => r.on('br:media', (_, d) => f(d)),
  gStatus: i('g:status'), gSignin: i('g:signin'), gPull: i('g:pull'), gPush: i('g:push'), gOut: i('g:out'),
  fsList: i('fs:list'), fsDrives: i('fs:drives'), fsKnown: i('fs:known'), brPart: i('br:part'), shot: i('br:shot'),
  mkCandles: i('mk:candles'), mkText: i('mk:text'), mkJson: i('mk:json'),
  mkSub: i('mk:sub'), mkUnsub: i('mk:unsub'), onMkTick: f => r.on('mk:tick', (_, d) => f(d)),
  appReady: i('app:ready'), openDefaults: i('app:defaults'),
  onOpen: f => r.on('app:open', (_, d) => f(d)),
  pathOf: f => webUtils.getPathForFile(f)
});
