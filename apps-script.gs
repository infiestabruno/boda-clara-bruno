/**
 * Google Apps Script para respuestas de Clara y Bruno.
 * Pegarlo en Extensiones > Apps Script dentro del Google Sheet.
 * Implementa doPost y publica como aplicación web ejecutada como propietario,
 * acceso: Cualquier persona (no mostrar URLs de la hoja de cálculo en la web).
 */
const SHEET_ID = '15USKP8x3lUFsO0WjemDeUjWx8jsEFtkpP7vHOeKyO5k';
const TAB = 'Respuestas';
function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    const name = String(p.nombre || '').trim();
    const attending = p.asiste === 'si';
    if (name.length < 3 || name.length > 160 || !['si','no'].includes(p.asiste)) throw Error('Datos incompletos');
    const withGuest = attending && p.plus === 'si';
    const guestName = withGuest ? String(p.acompanante || '').trim() : '';
    if (withGuest && guestName.length < 3) throw Error('Falta el nombre del acompañante');
    const inbound = attending ? Math.max(0, Math.min(2, Number(p.plazasIda)||0)) : 0;
    const outbound = attending ? Math.max(0, Math.min(2, Number(p.plazasVuelta)||0)) : 0;
    if (!Number.isInteger(inbound)||!Number.isInteger(outbound)) throw Error('Número de plazas no válido');
    const nonce = String(p.nonce||'').slice(0,128);
    const lock = LockService.getScriptLock();lock.waitLock(30000);
    try {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB);
      if (!sheet) throw Error('No encuentro la pestaña Respuestas');
      if (nonce && sheet.getLastRow()>1) {
        const stored = sheet.getRange(2,11,sheet.getLastRow()-1,1).getValues().flat();
        if (stored.includes(nonce)) return reply('Esta confirmación ya estaba registrada. ¡Gracias!');
      }
      const clean = (v,max=500) => {
        const t=String(v||'').trim().slice(0,max);
        // Prevent spreadsheet formula injection from untrusted input.
        return /^[=+@\-]/.test(t) ? "'"+t : t;
      };
      sheet.appendRow([
        new Date(),clean(name,160),attending?'Sí':'No',withGuest?'Sí':'No',clean(guestName,160),
        attending?clean(p.alergias,500):'',withGuest?clean(p.alergiasPlus,500):'',
        inbound,outbound,'',nonce
      ]);
      return reply('¡Muchas gracias! Hemos recibido vuestra confirmación.');
    } finally {lock.releaseLock();}
  }catch(err){return reply('No hemos podido registrar la confirmación. Por favor, volved a intentarlo.');}
}
function reply(message){
  const safe=message.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  return HtmlService.createHtmlOutput('<meta name="viewport" content="width=device-width, initial-scale=1"><div style="font-family:Arial,sans-serif;max-width:460px;margin:80px auto;text-align:center;color:#1f2a44;padding:20px"><h1>Clara & Bruno</h1><p>'+safe+'</p><p>12 · 12 · 2026</p></div>');
}
