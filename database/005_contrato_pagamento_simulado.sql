-- SOMENTE TESTE-PAGAMENTOS. SEM COBRANÇA OU CUSTÓDIA REAL.
-- Execute após 003_pagamentos_demo.sql e 004_chat_negociacao_demo.sql.
BEGIN;
ALTER TABLE public.contratos_frete_demo ADD COLUMN IF NOT EXISTS aceito_em TIMESTAMPTZ;
ALTER TABLE public.contratos_frete_demo ADD COLUMN IF NOT EXISTS metodo_pagamento_demo VARCHAR(12);
ALTER TABLE public.contratos_frete_demo DROP CONSTRAINT IF EXISTS contrato_demo_metodo_valido;
ALTER TABLE public.contratos_frete_demo ADD CONSTRAINT contrato_demo_metodo_valido
CHECK (metodo_pagamento_demo IS NULL OR metodo_pagamento_demo IN ('PIX','CARTAO','BOLETO'));
COMMIT;
