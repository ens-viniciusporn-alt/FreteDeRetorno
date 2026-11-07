-- Frete de Retorno
-- Permite o perfil ADMIN sem alterar usuários existentes.

BEGIN;

ALTER TABLE public.usuarios
DROP CONSTRAINT IF EXISTS chk_tipo_usuario;

ALTER TABLE public.usuarios
ADD CONSTRAINT chk_tipo_usuario
CHECK (
    tipo_usuario IN (
        'CLIENTE',
        'TRANSPORTADORA',
        'ADMIN'
    )
);

COMMIT;