const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function text(value, max=100) { return typeof value === 'string' ? value.trim().slice(0,max+1) : ''; }
function email(value) { const v = text(value, 100).toLowerCase(); return v.length <= 100 && EMAIL.test(v) ? v : null; }
function strongPassword(value) { return typeof value === 'string' && value.length >= 8 && Buffer.byteLength(value, 'utf8') <= 72; }
function positiveNumber(value) { const n = Number(value); return Number.isFinite(n) && n > 0 ? n : null; }
function positiveId(value) { const n = Number(value); return Number.isSafeInteger(n) && n > 0 ? n : null; }
module.exports = { text, email, strongPassword, positiveNumber, positiveId };
