
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import '../styles/central-notificacoes.css';

const destinosPermitidos = new Set([
  '/cliente/contratos',
  '/transportadora/contratos',
  '/admin/disputas',
  '/cliente/chats',
  '/transportadora/chats',
]);

const dataBR = (data) => {
  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return '';
  }

  return valor.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export default function CentralNotificacoes() {
  const [aberto, setAberto] = useState(false);
  const [lista, setLista] = useState([]);
  const [pendentes, setPendentes] = useState(0);
  const [erro, setErro] = useState('');
  const [processando, setProcessando] = useState(false);

  const caixa = useRef(null);
  const navigate = useNavigate();

  async function atualizar(silencioso = false) {
    try {
      const dados = await api('/notificacoes');

      setLista(dados.notificacoes || []);
      setPendentes(dados.nao_lidas || 0);
      setErro('');
    } catch (error) {
      if (!silencioso) {
        setErro(
          error.message ||
          'Não foi possível consultar as notificações.'
        );
      }
    }
  }

  useEffect(() => {
    atualizar(true);

    const timer = setInterval(() => {
      if (!document.hidden) {
        atualizar(true);
      }
    }, 30000);

    const aoFoco = () => atualizar(true);

    window.addEventListener('focus', aoFoco);

    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', aoFoco);
    };
  }, []);

  useEffect(() => {
    if (!aberto) return;

    const fecharAoClicarFora = (event) => {
      if (!caixa.current?.contains(event.target)) {
        setAberto(false);
      }
    };

    const fecharComEscape = (event) => {
      if (event.key === 'Escape') {
        setAberto(false);
      }
    };

    document.addEventListener(
      'pointerdown',
      fecharAoClicarFora
    );

    document.addEventListener(
      'keydown',
      fecharComEscape
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        fecharAoClicarFora
      );

      document.removeEventListener(
        'keydown',
        fecharComEscape
      );
    };
  }, [aberto]);

  async function abrirNotificacao(notificacao) {
    if (processando) return;

    const destinoOriginal = notificacao.destino || '';

    let destino = null;

    if (destinosPermitidos.has(destinoOriginal)) {
      destino = destinoOriginal;
    } else {
      const correspondencia = destinoOriginal.match(
        /^\/(cliente|transportadora)\/chats\?conversa=([1-9][0-9]*)$/
      );

      if (correspondencia) {
        destino = destinoOriginal;
      }
    }

    setProcessando(true);
    setErro('');

    try {
      if (!notificacao.lida_em) {
        await api(
          `/notificacoes/${notificacao.id_notificacao}/lida`,
          { method: 'PATCH' }
        );
      }

      await atualizar(true);

      if (destino) {
        setAberto(false);
        navigate(destino);
      } else {
        setErro(
          'Notificação lida, mas sem destino de navegação válido.'
        );
      }
    } catch (error) {
      setErro(
        error.message ||
        'Não foi possível abrir a notificação.'
      );
    } finally {
      setProcessando(false);
    }
  }

  async function marcarTodas() {
    if (processando) return;

    setProcessando(true);
    setErro('');

    try {
      await api('/notificacoes/marcar-todas/lidas', {
        method: 'PATCH',
      });

      await atualizar();
    } catch (error) {
      setErro(
        error.message ||
        'Não foi possível marcar as notificações como lidas.'
      );
    } finally {
      setProcessando(false);
    }
  }

  return (
    <div ref={caixa} className="nf-wrap">
      <button
        type="button"
        className="nf-bell"
        aria-label={`Notificações, ${pendentes} não lidas`}
        aria-expanded={aberto}
        aria-haspopup="dialog"
        onClick={() => {
          setAberto((atual) => !atual);
          atualizar();
        }}
      >
        <span
          className="nf-bell-emoji"
          aria-hidden="true"
        >
          🔔
        </span>

        {pendentes > 0 && (
          <span className="nf-count">
            {pendentes > 99 ? '99+' : pendentes}
          </span>
        )}
      </button>

      {aberto && (
        <section
          className="nf-panel"
          role="dialog"
          aria-label="Central de notificações"
        >
          <div className="nf-head">
            <strong>Notificações</strong>

            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar notificações"
            >
              ✕
            </button>
          </div>

          <div className="nf-tools">
            <span>
              {pendentes} não{' '}
              {pendentes === 1 ? 'lida' : 'lidas'}
            </span>

            <button
              type="button"
              disabled={!pendentes || processando}
              onClick={marcarTodas}
            >
              Marcar todas como lidas
            </button>
          </div>

          {erro && (
            <p className="nf-error" role="alert">
              {erro}
            </p>
          )}

          <div className="nf-scroll">
            {lista.length === 0 ? (
              <p className="nf-empty">
                Nenhuma notificação por enquanto.
              </p>
            ) : (
              lista.map((notificacao) => (
                <button
                  type="button"
                  key={notificacao.id_notificacao}
                  className={`nf-item ${!notificacao.lida_em
                      ? 'nf-unread'
                      : ''
                    }`}
                  onClick={() =>
                    abrirNotificacao(notificacao)
                  }
                  disabled={processando}
                >
                  <span className="nf-title">
                    {!notificacao.lida_em && (
                      <span
                        className="nf-dot"
                        aria-hidden="true"
                      />
                    )}

                    {notificacao.titulo}
                  </span>

                  <span className="nf-msg">
                    {notificacao.mensagem}
                  </span>

                  <small>
                    {dataBR(notificacao.criada_em)}
                  </small>
                </button>
              ))
            )}
          </div>

          <p className="nf-foot">
            Atualiza automaticamente a cada 30 segundos
            enquanto o site estiver aberto.
          </p>
        </section>
      )}
    </div>
  );
}
