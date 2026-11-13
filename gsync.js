// Google sign-in (OAuth loopback + PKCE) and sync of the launcher profile to the user's private Drive appDataFolder.
// Needs an OAuth "Desktop app" client created by the user in Google Cloud Console (see README).
const fs = require('fs'), path = require('path'), http = require('http'), crypto = require('crypto');
module.exports = function ({ app, ipcMain, shell, safeStorage, log }) {
  const F = () => path.join(app.getPath('userData'), 'gsync.json');
  let st = {}; try { st = JSON.parse(fs.readFileSync(F(), 'utf8')); } catch {}
  const save = () => { try { fs.writeFileSync(F(), JSON.stringify(st)); } catch (e) { log('gsync ' + e.message); } };
  const enc = s => safeStorage.isEncryptionAvailable() ? safeStorage.encryptString(s).toString('base64') : 'plain:' + Buffer.from(s).toString('base64');
  const dec = s => { try { return String(s).startsWith('plain:') ? Buffer.from(s.slice(6), 'base64').toString() : safeStorage.decryptString(Buffer.from(s, 'base64')); } catch { return ''; } };
  const form = o => Object.entries(o).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
  async function token() {
    if (st.at && st.exp > Date.now() + 60000) return st.at;
    if (!st.rt) throw new Error('not signed in');
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form({ client_id: st.cid, client_secret: dec(st.cs || ''), refresh_token: dec(st.rt), grant_type: 'refresh_token' }) });
    const j = await r.json(); if (!j.access_token) throw new Error(j.error_description || j.error || 'token error');
    st.at = j.access_token; st.exp = Date.now() + j.expires_in * 1000; save(); return st.at;
  }
  ipcMain.handle('g:status', () => ({ email: st.email || '', cid: st.cid || '', has: !!st.rt }));
  ipcMain.handle('g:signin', async (_, cid, cs) => {
    try {
      if (!cid) throw new Error('client id');
      const verifier = crypto.randomBytes(32).toString('base64url'), challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
      const got = await new Promise((res, rej) => {
        let port = 0;
        const srv = http.createServer((rq, rs) => {
          const u = new URL(rq.url, 'http://127.0.0.1'), c = u.searchParams.get('code'), e = u.searchParams.get('error');
          rs.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); rs.end('<meta charset="utf-8"><h2 style="font-family:sans-serif">SEN Launcher ✓ — you can close this tab.</h2>');
          if (c || e) { srv.close(); c ? res({ code: c, port }) : rej(new Error(e)); }
        });
        srv.listen(0, '127.0.0.1', () => {
          port = srv.address().port;
          shell.openExternal('https://accounts.google.com/o/oauth2/v2/auth?' + form({ client_id: cid, redirect_uri: `http://127.0.0.1:${port}`, response_type: 'code', scope: 'openid email https://www.googleapis.com/auth/drive.appdata', code_challenge: challenge, code_challenge_method: 'S256', access_type: 'offline', prompt: 'consent' }));
          setTimeout(() => { try { srv.close(); } catch {} rej(new Error('timeout')); }, 180000);
        });
      });
      const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form({ client_id: cid, client_secret: cs || '', code: got.code, code_verifier: verifier, redirect_uri: `http://127.0.0.1:${got.port}`, grant_type: 'authorization_code' }) });
      const j = await r.json(); if (!j.refresh_token) throw new Error(j.error_description || j.error || 'no refresh token');
      let email = ''; try { email = JSON.parse(Buffer.from(j.id_token.split('.')[1], 'base64url').toString()).email || ''; } catch {}
      st = { cid, cs: enc(cs || ''), rt: enc(j.refresh_token), at: j.access_token, exp: Date.now() + j.expires_in * 1000, email }; save();
      return { email };
    } catch (e) { return { error: e.message }; }
  });
  const findId = async tk => { const r = await fetch('https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id)&q=' + encodeURIComponent("name='sen-sync.json'"), { headers: { Authorization: 'Bearer ' + tk } }); const j = await r.json(); return j.files && j.files[0]; };
  ipcMain.handle('g:pull', async () => { try { const tk = await token(), f = await findId(tk); if (!f) return { data: null }; const r = await fetch('https://www.googleapis.com/drive/v3/files/' + f.id + '?alt=media', { headers: { Authorization: 'Bearer ' + tk } }); return { data: await r.json() }; } catch (e) { return { error: e.message }; } });
  ipcMain.handle('g:push', async (_, obj) => {
    try {
      const tk = await token(), f = await findId(tk), body = JSON.stringify(obj);
      if (f) { const r = await fetch('https://www.googleapis.com/upload/drive/v3/files/' + f.id + '?uploadType=media', { method: 'PATCH', headers: { Authorization: 'Bearer ' + tk, 'Content-Type': 'application/json' }, body }); return r.ok ? { ok: true } : { error: 'HTTP ' + r.status }; }
      const bd = 'sen' + Date.now(), mp = `--${bd}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name: 'sen-sync.json', parents: ['appDataFolder'] })}\r\n--${bd}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${bd}--`;
      const r = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', { method: 'POST', headers: { Authorization: 'Bearer ' + tk, 'Content-Type': 'multipart/related; boundary=' + bd }, body: mp });
      return r.ok ? { ok: true } : { error: 'HTTP ' + r.status };
    } catch (e) { return { error: e.message }; }
  });
  ipcMain.handle('g:out', () => { st = {}; save(); return true; });
};
