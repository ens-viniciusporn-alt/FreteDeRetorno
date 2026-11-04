
import { useState } from 'react';

const notificacoesIniciais = [
  {
    id: 1,
    tipo: 'pagamento',
    titulo: 'Pagamento concluído',
    mensagem: 'O pagamento do frete foi confirmado.',
    horario: 'Há 5 minutos',
    lida: false,
  },
  {
    id: 2,
    tipo: 'frete',
    titulo: 'Frete aguardando confirmação',
    mensagem: 'Existe uma solicitação de frete aguardando sua confirmação.',
    horario: 'Há 20 minutos',
    lida: false,
  },
  {
    id: 3,
    tipo: 'viagem',
    titulo: 'Viagem atualizada',
    mensagem: 'Uma viagem cadastrada teve suas informações atualizadas.',
    horario: 'Há 1 hora',
    lida: false,
  },
  {
    id: 4,
    tipo: 'mensagem',
    titulo: 'Nova mensagem',
    mensagem: 'Você tem uma nova mensagem na conversa de um frete.',
    horario: 'Há 2 horas',
    lida: true,
  },
  {
    id: 5,
    tipo: 'seguranca',
    titulo: 'Aviso da plataforma',
    mensagem: 'Confira se seus dados de contato estão atualizados.',
    horario: 'Ontem',
    lida: true,
  },
];

const iconesPorTipo = {
  pagamento: '$',
  frete: '📦',
  viagem: '🚚',
  mensagem: '💬',
  seguranca: '🔒',
};

export default function NotificationPanel() {
  const [aberto, setAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState(
    notificacoesIniciais
  );

  const naoLidas = notificacoes.filter(
    (notificacao) => !notificacao.lida
  ).length;

  function marcarComoLida(id) {
    setNotificacoes((atuais) =>
      atuais.map((notificacao) =>
        notificacao.id === id
          ? { ...notificacao, lida: true }
          : notificacao
      )
    );
  }

  function marcarTodasComoLidas() {
    setNotificacoes((atuais) =>
      atuais.map((notificacao) => ({
        ...notificacao,
        lida: true,
      }))
    );
  }

  return (
    <div className="notification-container">
      <button
        type="button"
        className="notification-bell"
        aria-label={
          naoLidas > 0
            ? `Notificações: ${naoLidas} não lidas`
            : 'Notificações'
        }
        aria-expanded={aberto}
        onClick={() => setAberto((estado) => !estado)}
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>

        {naoLidas > 0 && (
          <span className="notification-count">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <>
          <button
            type="button"
            className="notification-backdrop"
            aria-label="Fechar notificações"
            onClick={() => setAberto(false)}
          />

          <section
            className="notification-panel"
            aria-label="Painel de notificações"
          >
            <header className="notification-header">
              <div>
                <h2>Notificações</h2>
                <p>
                  {naoLidas === 0
                    ? 'Você está em dia!'
                    : `Você tem ${naoLidas} não lida${
                        naoLidas > 1 ? 's' : ''
                      }`}
                </p>
              </div>

              <button
                type="button"
                className="notification-close"
                aria-label="Fechar painel"
                onClick={() => setAberto(false)}
              >
                ×
              </button>
            </header>

            {naoLidas > 0 && (
              <div className="notification-actions">
                <button
                  type="button"
                  onClick={marcarTodasComoLidas}
                >
                  Marcar todas como lidas
                </button>
              </div>
            )}

            <div className="notification-list">
              {notificacoes.length === 0 ? (
                <div className="notification-empty">
                  <span aria-hidden="true">🔔</span>
                  <strong>Nenhuma notificação</strong>
                  <p>Quando houver novidades, elas aparecerão aqui.</p>
                </div>
              ) : (
                notificacoes.map((notificacao) => (
                  <article
                    key={notificacao.id}
                    className={`notification-item ${
                      notificacao.lida ? 'is-read' : 'is-unread'
                    }`}
                  >
                    <div
                      className={`notification-icon type-${notificacao.tipo}`}
                      aria-hidden="true"
                    >
                      {iconesPorTipo[notificacao.tipo]}
                    </div>

                    <div className="notification-body">
                      <div className="notification-title-row">
                        <h3>{notificacao.titulo}</h3>
                        {!notificacao.lida && (
                          <span
                            className="notification-unread-dot"
                            aria-label="Não lida"
                          />
                        )}
                      </div>

                      <p>{notificacao.mensagem}</p>

                      <div className="notification-footer">
                        <time>{notificacao.horario}</time>

                        {!notificacao.lida && (
                          <button
                            type="button"
                            onClick={() =>
                              marcarComoLida(notificacao.id)
                            }
                          >
                            Marcar como lida
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <footer className="notification-bottom">
              <span>Frete de Retorno</span>
              <span>Central de avisos</span>
            </footer>
          </section>
        </>
      )}
    </div>
  );
}
