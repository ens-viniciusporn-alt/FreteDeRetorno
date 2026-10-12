export default function StatCard({ icon, titulo, valor, detalhe, tom = 'azul' }) {
  return (
    <article className="stat-card">
      <div className={`stat-card-icon ${tom}`} aria-hidden="true">{icon}</div>
      <div className="stat-card-info">
        <span>{titulo}</span>
        <strong>{valor}</strong>
        {detalhe && <small>{detalhe}</small>}
      </div>
    </article>
  );
}
