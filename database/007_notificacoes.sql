-- Frete de Retorno - 007. Executar SOMENTE no Neon teste-pagamentos.
-- Nenhuma cobranca, retencao ou transferencia real de dinheiro.
BEGIN;
CREATE TABLE IF NOT EXISTS public.notificacoes_frete (
 id_notificacao BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 id_usuario INTEGER NOT NULL REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
 chave_evento TEXT NOT NULL,
 titulo VARCHAR(120) NOT NULL,
 mensagem VARCHAR(350) NOT NULL,
 destino VARCHAR(120) NOT NULL,
 lida_em TIMESTAMPTZ,
 criada_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 CONSTRAINT uq_notificacao_usuario_evento UNIQUE (id_usuario, chave_evento),
 CONSTRAINT ck_destino_notificacao CHECK (destino IN ('/cliente/contratos','/transportadora/contratos','/admin/disputas'))
);
CREATE INDEX IF NOT EXISTS idx_notificacao_usuario_data ON public.notificacoes_frete(id_usuario,criada_em DESC);
CREATE INDEX IF NOT EXISTS idx_notificacao_pendente ON public.notificacoes_frete(id_usuario,criada_em DESC) WHERE lida_em IS NULL;

CREATE OR REPLACE FUNCTION public.notificar_contrato_frete() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
DECLARE status_atual TEXT; identificador TEXT;
BEGIN
  IF TG_OP='UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status THEN RETURN NEW; END IF;
  status_atual := NEW.status;
  identificador := 'contrato:' || NEW.id_contrato || ':status:' || status_atual;
  -- A cada mudanca, cada parte recebe uma notificacao distinta e idempotente.
  INSERT INTO public.notificacoes_frete(id_usuario,chave_evento,titulo,mensagem,destino)
  SELECT r.id_usuario, identificador, 
    CASE status_atual
      WHEN 'PROPOSTO' THEN 'Proposta de frete recebida'
      WHEN 'ACEITO' THEN 'Contrato aceito'
      WHEN 'GARANTIDO_SIMULADO' THEN 'Pagamento de teste confirmado'
      WHEN 'ENTREGA_INFORMADA' THEN 'Entrega informada'
      WHEN 'EM_DISPUTA' THEN 'Contrato em disputa'
      WHEN 'LIBERADO_SIMULADO' THEN 'Contrato concluido (teste)'
      WHEN 'REEMBOLSADO_SIMULADO' THEN 'Reembolso registrado (teste)'
      WHEN 'CANCELADO' THEN 'Contrato cancelado'
      ELSE 'Atualizacao do contrato'
    END,
    CASE status_atual
      WHEN 'PROPOSTO' THEN 'Uma proposta do contrato #' || NEW.id_contrato || ' aguarda seu aceite.'
      WHEN 'ACEITO' THEN 'O contrato #' || NEW.id_contrato || ' foi aceito pelo cliente.'
      WHEN 'GARANTIDO_SIMULADO' THEN 'Contrato #' || NEW.id_contrato || ': valor em garantia somente na simulacao.'
      WHEN 'ENTREGA_INFORMADA' THEN 'Contrato #' || NEW.id_contrato || ': entrega informada. Confira os detalhes.'
      WHEN 'EM_DISPUTA' THEN 'Contrato #' || NEW.id_contrato || ': disputa aberta; liberacao simulada suspensa.'
      WHEN 'LIBERADO_SIMULADO' THEN 'Contrato #' || NEW.id_contrato || ': liberacao ficticia registrada, sem dinheiro real.'
      WHEN 'REEMBOLSADO_SIMULADO' THEN 'Contrato #' || NEW.id_contrato || ': reembolso ficticio registrado.'
      WHEN 'CANCELADO' THEN 'Contrato #' || NEW.id_contrato || ': cancelamento registrado.'
      ELSE 'Houve uma atualizacao no contrato #' || NEW.id_contrato || '.'
    END,
    r.destino
  FROM (VALUES
    (NEW.id_cliente, '/cliente/contratos'),
    (NEW.id_transportador, '/transportadora/contratos')
  ) AS r(id_usuario,destino)
  WHERE r.id_usuario IS NOT NULL
  ON CONFLICT (id_usuario,chave_evento) DO NOTHING;
  IF status_atual='EM_DISPUTA' THEN
    INSERT INTO public.notificacoes_frete(id_usuario,chave_evento,titulo,mensagem,destino)
    SELECT id_usuario, identificador, 'Nova disputa para analise',
       'O contrato #' || NEW.id_contrato || ' entrou em disputa.','/admin/disputas'
    FROM public.usuarios WHERE tipo_usuario='ADMIN'
    ON CONFLICT (id_usuario,chave_evento) DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS tg_notificar_contrato_frete ON public.contratos_frete_demo;
CREATE TRIGGER tg_notificar_contrato_frete
AFTER INSERT OR UPDATE OF status ON public.contratos_frete_demo
FOR EACH ROW EXECUTE FUNCTION public.notificar_contrato_frete();

CREATE OR REPLACE FUNCTION public.notificar_acao_admin_disputa() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
DECLARE c RECORD; key_evento TEXT; assunto TEXT;
BEGIN
 SELECT cf.id_contrato, cf.id_cliente, cf.id_transportador INTO c
 FROM public.disputas_frete_demo d JOIN public.contratos_frete_demo cf ON cf.id_contrato=d.id_contrato
 WHERE d.id_disputa=NEW.id_disputa;
 IF NOT FOUND THEN RETURN NEW; END IF;
 key_evento := 'acao-admin:' || NEW.id_acao;
 assunto := CASE NEW.acao WHEN 'SOLICITAR_INFORMACOES' THEN 'Administrador solicitou informacoes'
       WHEN 'LIBERAR_SIMULADO' THEN 'Disputa encerrada: liberacao de teste'
       WHEN 'REEMBOLSAR_SIMULADO' THEN 'Disputa encerrada: reembolso de teste'
       ELSE 'Atualizacao da disputa' END;
 INSERT INTO public.notificacoes_frete(id_usuario,chave_evento,titulo,mensagem,destino)
 SELECT u.id_usuario,key_evento,assunto,
  'Confira a decisao registrada para o contrato #' || c.id_contrato || '. Nenhuma movimentacao real.',u.destino
 FROM (VALUES (c.id_cliente,'/cliente/contratos'),(c.id_transportador,'/transportadora/contratos')) u(id_usuario,destino)
 ON CONFLICT (id_usuario,chave_evento) DO NOTHING;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS tg_notificar_acao_admin ON public.acoes_admin_disputa_demo;
CREATE TRIGGER tg_notificar_acao_admin AFTER INSERT ON public.acoes_admin_disputa_demo
FOR EACH ROW EXECUTE FUNCTION public.notificar_acao_admin_disputa();

CREATE OR REPLACE FUNCTION public.notificar_manifestacao_disputa() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
DECLARE c RECORD; key_evento TEXT;
BEGIN
 SELECT cf.id_contrato,cf.id_cliente,cf.id_transportador INTO c
 FROM public.disputas_frete_demo d JOIN public.contratos_frete_demo cf ON cf.id_contrato=d.id_contrato
 WHERE d.id_disputa=NEW.id_disputa;
 IF NOT FOUND THEN RETURN NEW; END IF;
 key_evento := 'manifestacao:' || NEW.id_manifestacao;
 INSERT INTO public.notificacoes_frete(id_usuario,chave_evento,titulo,mensagem,destino)
 SELECT x.id_usuario,key_evento,'Nova manifestacao na disputa',
 'Ha novas informacoes na disputa do contrato #' || c.id_contrato || '.',x.destino
 FROM (VALUES (c.id_cliente,'/cliente/contratos'),(c.id_transportador,'/transportadora/contratos')) x(id_usuario,destino)
 WHERE x.id_usuario <> NEW.id_autor
 ON CONFLICT (id_usuario,chave_evento) DO NOTHING;
 INSERT INTO public.notificacoes_frete(id_usuario,chave_evento,titulo,mensagem,destino)
 SELECT id_usuario,key_evento,'Novo relato para analisar',
 'Uma parte apresentou novas informacoes na disputa do contrato #' || c.id_contrato || '.', '/admin/disputas'
 FROM public.usuarios WHERE tipo_usuario='ADMIN' AND id_usuario<>NEW.id_autor
 ON CONFLICT (id_usuario,chave_evento) DO NOTHING;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS tg_notificar_manifestacao ON public.manifestacoes_disputa_demo;
CREATE TRIGGER tg_notificar_manifestacao AFTER INSERT ON public.manifestacoes_disputa_demo
FOR EACH ROW EXECUTE FUNCTION public.notificar_manifestacao_disputa();
COMMIT;
