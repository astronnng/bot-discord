Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   INICIANDO AMBIENTE DISCORD MUSIC BOT   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Parar containers antigos para garantir limpeza
Write-Host "[1/4] Parando containers antigos..." -ForegroundColor Yellow
# Remove container legado 'lavalink' criado via docker run se existir
docker rm -f lavalink 2>$null
docker compose down

# 2. Iniciar containers
Write-Host "[2/4] Iniciando Docker Compose (Build & Up)..." -ForegroundColor Yellow
docker compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao iniciar Docker Compose. Verifique o problema acima." -ForegroundColor Red
    exit
}

# 3. Monitorar logs do Lavalink
Write-Host "[3/4] Agurando inicialização do Lavalink..." -ForegroundColor Yellow
$foundCode = $false
$maxRetries = 30
$counter = 0

while ($counter -lt $maxRetries) {
    # Ler logs do container 'lavalink' diretamente (evita prefixos do compose)
    $logs = (docker logs lavalink --tail 200) 2>&1 | Out-String

    # Procura pelo padrão do código
    if ($logs -match "enter code ([A-Z0-9-]+)") {
        $code = $matches[1]
        
        Write-Host ""
        Write-Host "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" -ForegroundColor Green
        Write-Host "CODIGO DE AUTENTICACAO ENCONTRADO: $code" -ForegroundColor Green
        Write-Host "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" -ForegroundColor Green
        
        try {
            Set-Clipboard $code
            Write-Host "-> Codigo copiado para a area de transferencia!" -ForegroundColor Gray
        } catch {
            Write-Host "-> Nao foi possivel copiar automaticamente para o clipboard." -ForegroundColor Gray
        }

        Write-Host "-> Abrindo https://www.google.com/device ..." -ForegroundColor Gray
        Start-Process "https://www.google.com/device"
        
        $foundCode = $true
        Write-Host "Pressione ENTER aqui apos autorizar no navegador para continuar..." -ForegroundColor Yellow
        Read-Host
        break
    }

    # Verifica se o Lavalink já subiu (Token já salvo ou pronto)
    if ($logs -match "Lavalink is ready to accept connections" -or $logs -match "JVM running for") {
        Write-Host ""
        Write-Host "Lavalink iniciado e pronto para conexões." -ForegroundColor Green
        break
    }

    Start-Sleep -Seconds 1
    $counter++
    Write-Host -NoNewline "."
}

if ($counter -eq $maxRetries) {
    Write-Host ""
    Write-Host "Tempo limite de verificação atingido, mas seguindo para logs gerais..." -ForegroundColor Yellow
}

# 4. Aguardar Bot ficar online
Write-Host ""
Write-Host "[4/5] Aguardando o Bot iniciar e conectar..." -ForegroundColor Yellow
$botStarted = $false
$botMaxRetries = 60 # Aguarda até 60s (inclui o sleep de 15s)
$botCounter = 0

while ($botCounter -lt $botMaxRetries) {
    $botLogs = (docker compose logs bot --tail 50) 2>&1 | Out-String
    
    if ($botLogs -match "Ready! Logged in as") {
        Write-Host ""
        Write-Host ">>> SUCESSO: Bot online e pronto! <<<" -ForegroundColor Green
        $botStarted = $true
        break
    }
    
    Start-Sleep -Seconds 1
    $botCounter++
    Write-Host -NoNewline "."
}

if (-not $botStarted) {
    Write-Host ""
    Write-Host "O bot ainda não reportou 'Ready', mas vamos abrir os logs..." -ForegroundColor Yellow
}

# 5. Acompanhar logs gerais
Write-Host ""
Write-Host "[5/5] Acompanhando logs de todos os serviços (CTRL+C para sair)..." -ForegroundColor Cyan
docker compose logs -f