
# 🎵 Bot Discord — Music Bot

> Um bot de música para Discord com suporte a Lavalink, empacotado para execução via Docker. Ideal para servidores que desejam reproduzir áudio confiável e escalável.

**Tags:**

- 🎶 Music  - `#music`
- 🐳 Docker - `#docker`
- ⚙️ Lavalink - `#lavalink`
- 🔐 Segurança - `#security`
- 🧩 Commands - `#commands`

## ✨ Visão geral

O projeto inicializa um bot Discord capaz de reproduzir áudio usando Lavalink. Inclui comandos essenciais: `play`, `skip`, `stop`, `queue`, `volume`, `pause`, `resume`.

## 🛠️ `start_bot.ps1`

O arquivo `start_bot.ps1` é um script para facilitar o desenvolvimento em Windows PowerShell:

- ⏹️ Para de containers antigos e limpa estados (`docker rm -f lavalink` / `docker compose down`).
- 🚀 Sobe os serviços com `docker compose up -d --build`.
- 🔍 Monitora os logs do container `lavalink` procurando por códigos de dispositivo (copia para a área de transferência e abre `https://www.google.com/device`).
- ✅ Aguarda até o bot reportar `Ready! Logged in as` e então segue acompanhando os logs com `docker compose logs -f`.

Use o script quando quiser iniciar todo o ambiente localmente e automatizar a etapa de autenticação do Lavalink/Google device.

## 🚀 Como usar (rápido)

1. Copie/renomeie `application.yml.example` para `application.yml` e preencha suas credenciais localmente.
2. Verifique se `application.yml` e arquivos que contenham segredos estão no `.gitignore` (já incluídos neste repositório).
3. Execute o script (PowerShell):

```powershell
.\start_bot.ps1
```

ou manualmente:

```bash
docker compose up -d --build
docker compose logs -f
```

## 🔒 Notas sobre segurança

- Não comite tokens ou refresh tokens. Use `application.yml` local, variáveis de ambiente ou um cofre de segredos.
- Se um segredo for comitado, remova-o do histórico git imediatamente.

## 📁 Estrutura

- `src/` — código do bot e handlers de comando/evento.
- `Dockerfile`, `docker-compose.yml` — para construção e execução em containers.
- `start_bot.ps1` — script de inicialização/monitoramento (Windows PowerShell).

## 📝 Licença

Adicione aqui a licença desejada.
