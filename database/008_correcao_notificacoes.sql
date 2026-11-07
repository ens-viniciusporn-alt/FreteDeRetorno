-- Frete de Retorno - 008_correcao_notificacoes.sql
-- Depende de 004_chat_negociacao_demo.sql e 007_notificacoes.sql.
-- Atualiza os destinatarios das notificacoes de contratos e adiciona notificacoes
-- de mensagens com links internos para a conversa especifica.
-- Executar primeiro em teste-pagamentos. Nao transfere dados nem pagamentos reais.

BEGIN;

-- Permite SOMENTE os caminhos internos esperados, com ID numerico positivo.
-- DROP + ADD dentro de uma transacao: se a nova regra rejeitar algum dado
-- existente, toda a transacao sera desfeita automaticamente.
ALTER TABLE public.notificacoes_frete
    DROP CONSTRAINT IF EXISTS ck_destino_notificacao;

ALTER TABLE public.notificacoes_frete
    ADD CONSTRAINT ck_destino_notificacao
    CHECK (
        destino IN (
            '/cliente/contratos',
            '/transportadora/contratos',
            '/admin/disputas',
            '/cliente/chats',
            '/transportadora/chats'
        )
        OR destino ~ '^/(cliente|transportadora)/chats\?conversa=[1-9][0-9]*$'
    );

-- O contrato e avisado apenas aos destinatarios relevantes em cada etapa.
CREATE OR REPLACE FUNCTION public.notificar_contrato_frete()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
    status_atual TEXT;
    identificador TEXT;
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status THEN
        RETURN NEW;
    END IF;

    status_atual := NEW.status;
    identificador := 'contrato:' || NEW.id_contrato || ':status:' || status_atual;

    INSERT INTO public.notificacoes_frete
        (id_usuario, chave_evento, titulo, mensagem, destino)
    SELECT
        r.id_usuario,
        identificador,
        CASE status_atual
            WHEN 'PROPOSTO' THEN 'Proposta de frete recebida'
            WHEN 'ACEITO' THEN 'Contrato aceito'
            WHEN 'GARANTIDO_SIMULADO' THEN 'Pagamento de teste confirmado'
            WHEN 'ENTREGA_INFORMADA' THEN 'Entrega informada'
            WHEN 'EM_DISPUTA' THEN 'Contrato em disputa'
            WHEN 'LIBERADO_SIMULADO' THEN 'Contrato concluído (teste)'
            WHEN 'REEMBOLSADO_SIMULADO' THEN 'Reembolso registrado (teste)'
            WHEN 'CANCELADO' THEN 'Contrato cancelado'
            ELSE 'Atualização do contrato'
        END,
        CASE status_atual
            WHEN 'PROPOSTO' THEN 'Uma proposta do contrato #' || NEW.id_contrato || ' aguarda seu aceite.'
            WHEN 'ACEITO' THEN 'O contrato #' || NEW.id_contrato || ' foi aceito pelo cliente.'
            WHEN 'GARANTIDO_SIMULADO' THEN 'Contrato #' || NEW.id_contrato || ': pagamento de teste confirmado.'
            WHEN 'ENTREGA_INFORMADA' THEN 'Contrato #' || NEW.id_contrato || ': a transportadora informou a entrega. Confira os detalhes.'
            WHEN 'EM_DISPUTA' THEN 'Contrato #' || NEW.id_contrato || ': disputa aberta; liberação simulada suspensa.'
            WHEN 'LIBERADO_SIMULADO' THEN 'Contrato #' || NEW.id_contrato || ': liberação simulada registrada, sem dinheiro real.'
            WHEN 'REEMBOLSADO_SIMULADO' THEN 'Contrato #' || NEW.id_contrato || ': reembolso simulado registrado.'
            WHEN 'CANCELADO' THEN 'Contrato #' || NEW.id_contrato || ': cancelamento registrado.'
            ELSE 'Houve uma atualização no contrato #' || NEW.id_contrato || '.'
        END,
        r.destino
    FROM (VALUES
        (NEW.id_cliente, '/cliente/contratos', 'CLIENTE'),
        (NEW.id_transportador, '/transportadora/contratos', 'TRANSPORTADORA')
    ) AS r(id_usuario, destino, perfil)
    WHERE r.id_usuario IS NOT NULL
      AND (
          (status_atual = 'PROPOSTO' AND r.perfil = 'CLIENTE')
          OR (status_atual = 'ACEITO' AND r.perfil = 'TRANSPORTADORA')
          OR (status_atual = 'ENTREGA_INFORMADA' AND r.perfil = 'CLIENTE')
          OR (status_atual NOT IN ('PROPOSTO', 'ACEITO', 'ENTREGA_INFORMADA'))
      )
    ON CONFLICT (id_usuario, chave_evento) DO NOTHING;

    IF status_atual = 'EM_DISPUTA' THEN
        INSERT INTO public.notificacoes_frete
            (id_usuario, chave_evento, titulo, mensagem, destino)
        SELECT
            u.id_usuario,
            identificador,
            'Nova disputa para análise',
            'O contrato #' || NEW.id_contrato || ' entrou em disputa.',
            '/admin/disputas'
        FROM public.usuarios u
        WHERE u.tipo_usuario = 'ADMIN'
        ON CONFLICT (id_usuario, chave_evento) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$function$;

-- Uma notificacao para cada nova mensagem, somente para a outra parte da conversa.
CREATE OR REPLACE FUNCTION public.notificar_nova_mensagem_frete()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
    v_cliente INTEGER;
    v_transportador INTEGER;
    v_destinatario INTEGER;
    v_nome_remetente TEXT;
    v_destino TEXT;
BEGIN
    SELECT c.id_cliente, c.id_transportador
      INTO v_cliente, v_transportador
      FROM public.conversas_frete_demo c
     WHERE c.id_conversa = NEW.id_conversa;

    IF NOT FOUND OR NEW.id_autor IS NULL THEN
        RETURN NEW;
    END IF;

    IF NEW.id_autor = v_cliente THEN
        v_destinatario := v_transportador;
        v_destino := '/transportadora/chats?conversa=' || NEW.id_conversa;
    ELSIF NEW.id_autor = v_transportador THEN
        v_destinatario := v_cliente;
        v_destino := '/cliente/chats?conversa=' || NEW.id_conversa;
    ELSE
        RETURN NEW;
    END IF;

    IF v_destinatario IS NULL OR v_destinatario = NEW.id_autor THEN
        RETURN NEW;
    END IF;

    SELECT COALESCE(NULLIF(TRIM(u.nome), ''), 'Usuário')
      INTO v_nome_remetente
      FROM public.usuarios u
     WHERE u.id_usuario = NEW.id_autor;

    INSERT INTO public.notificacoes_frete
        (id_usuario, chave_evento, titulo, mensagem, destino)
    VALUES (
        v_destinatario,
        'mensagem:' || NEW.id_mensagem,
        'Nova mensagem de ' || COALESCE(v_nome_remetente, 'Usuário'),
        'Você recebeu uma nova mensagem sobre um frete. Acesse a conversa para responder.',
        v_destino
    )
    ON CONFLICT (id_usuario, chave_evento) DO NOTHING;

    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS tg_notificar_mensagem_frete
ON public.mensagens_frete_demo;

CREATE TRIGGER tg_notificar_mensagem_frete
AFTER INSERT ON public.mensagens_frete_demo
FOR EACH ROW
EXECUTE FUNCTION public.notificar_nova_mensagem_frete();

COMMIT;
