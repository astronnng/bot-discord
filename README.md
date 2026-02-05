# Bot Discord (Music Bot)

> Repositório contendo um bot de música para Discord com suporte a Lavalink e execução via Docker.

## Visão geral

Este projeto inicia um bot Discord que reproduz áudio usando Lavalink. Contém comandos básicos de reprodução (`play`, `skip`, `stop`, `queue`, `volume`, `pause`, `resume`) e configuração para rodar em containers Docker.

## Arquivo `start_bot.ps1`

O script [start_bot.ps1](start_bot.ps1) é uma conveniência para desenvolvimento/local:

- Para Windows PowerShell.
- Para de containers antigos, sobe os serviços com `docker compose up -d --build`.
- Monitora os logs do container `lavalink` procurando por códigos de autenticação (copia para o clipboard e abre `https://www.google.com/device`).
- Aguarda até o bot reportar `Ready! Logged in as` nos logs e então acompanha os logs com `docker compose logs -f`.

Use `start_bot.ps1` quando quiser iniciar o ambiente localmente e facilitar o processo de autenticação do Lavalink/Google device.

## Como usar (rápido)

- Copie/renomeie `application.yml.example` para `application.yml` e preencha as credenciais e tokens localmente.
- Certifique-se de que `application.yml` e `SOLUCAO_YOUTUBE.md` (ou arquivos com segredos) estejam no `.gitignore` (já configurado neste repositório).
- Inicie com Docker Compose:

```powershell
.\start_bot.ps1
```

ou manualmente:

```bash
docker compose up -d --build
docker compose logs -f
```

## Notas sobre segurança

- Segredos (tokens, refresh tokens, etc.) não devem ser comitados. Use o `application.yml` local, variáveis de ambiente ou um cofre.
- Se algum segredo for acidentalmente comitado, remova-o do histórico (procedimento já aplicado neste repositório para alguns arquivos).

## Estrutura

- `src/` - código do bot e handlers de comando/evento.
- `Dockerfile`, `docker-compose.yml` - para construção e execução em containers.
- `start_bot.ps1` - script de inicialização/monitoramento (Windows PowerShell).

## Licença

Coloque aqui a licença desejada ou remova essa seção.
