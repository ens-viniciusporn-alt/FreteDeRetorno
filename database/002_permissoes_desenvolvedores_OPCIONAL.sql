-- OPCIONAL: executar no SQL Editor Neon como role SiteTransportadora_owner,
-- somente se os usuários dev_vinicius e dev_natan existirem e forem autorizados.
-- NÃO faz deles proprietários de tabelas de outros usuários.
-- NÃO concede permissão para DROP/ALTER em objetos de outro dono.
-- Concede acesso aos dados e criação de novos objetos no schema public.
BEGIN;
GRANT CONNECT ON DATABASE "SiteTransportadora" TO dev_vinicius,dev_natan;
GRANT USAGE,CREATE ON SCHEMA public TO dev_vinicius,dev_natan;
GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO dev_vinicius,dev_natan;
GRANT USAGE,SELECT,UPDATE ON ALL SEQUENCES IN SCHEMA public TO dev_vinicius,dev_natan;
-- Aplicam-se apenas a NOVOS objetos criados por SiteTransportadora_owner.
ALTER DEFAULT PRIVILEGES FOR ROLE "SiteTransportadora_owner" IN SCHEMA public
  GRANT SELECT,INSERT,UPDATE,DELETE ON TABLES TO dev_vinicius,dev_natan;
ALTER DEFAULT PRIVILEGES FOR ROLE "SiteTransportadora_owner" IN SCHEMA public
  GRANT USAGE,SELECT,UPDATE ON SEQUENCES TO dev_vinicius,dev_natan;
COMMIT;
