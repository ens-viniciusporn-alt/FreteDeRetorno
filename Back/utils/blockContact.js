// Filtro preventivo para o protótipo. Não garante bloqueio total de contatos disfarçados.
// Revise denúncias e aplique moderação adicional antes de qualquer uso público.
function blockContact(input){
 const t=String(input||'').normalize('NFKC').toLowerCase();
 const normalized=t.replace(/[\s._\-()]/g,'');
 return /(?:https?:\/\/|www\.|\b(?:gmail|hotmail|outlook|yahoo|protonmail)\b|\b(?:whats?app|wpp|zapzap|telegram|instagram|insta|facebook|discord|telefone|celular|contato|ligue|me chama|chama no|chave pix|meu pix|cpf|cnpj)\b|@[a-z\d_]{2,}|[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?55\s*)?\(?\d{2}\)?[\s.-]*9?\d{4}[\s.-]*\d{4}|\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[-.\s]?\d{2}\b)/iu.test(t)
  || /(whatsapp|telegram|instagram|gmail|hotmail|pix|telefone|celular|mechama|ligapra|contato)/u.test(normalized)
  || /(?:\+?\d[ .()\-]*){10,}/.test(t);
}
module.exports=blockContact;
