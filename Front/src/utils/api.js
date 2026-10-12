// Em desenvolvimento, Vite encaminha /api ao Node na porta 3000.
// Em produção, mantenha /api no mesmo domínio do site por meio de proxy reverso.
export async function api(path, {method='GET', body, signal} = {}) {
  const response=await fetch(`/api${path}`, {
    method, credentials:'same-origin', signal,
    headers:body===undefined?{}:{'Content-Type':'application/json'},
    body:body===undefined?undefined:JSON.stringify(body)
  });
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.erro || `Erro na API (${response.status})`);
  return result;
}
