@echo off
echo ========================================
echo WHOIS PARA DOMINIOS .PT
echo ========================================
echo.
echo Abrindo WHOIS oficial DNS.PT...
echo.
start https://www.dns.pt/whois_en.php?domain=quest4couple.pt
echo.
echo ========================================
echo INFORMACOES A PROCURAR NO WHOIS:
echo ========================================
echo.
echo 1. REGISTRAR / ENTIDADE GESTORA
echo    - Nome da empresa que registou o dominio
echo    - Ex: OVH, GoDaddy, Namecheap, etc.
echo.
echo 2. NAME SERVERS (NS)
echo    - Confirmar que aparecem:
echo      ns1.dnscpanel.com
echo      ns2.dnscpanel.com
echo      ns3.dnscpanel.com
echo.
echo 3. CONTACTO ADMINISTRATIVO
echo    - Email ou telefone do titular
echo    - Pode ser usado para solicitar alteracoes
echo.
echo 4. DATA DE EXPIRACAO
echo    - Confirmar que dominio nao esta expirado
echo.
echo ========================================
echo PROXIMOS PASSOS:
echo ========================================
echo.
echo Depois de identificar o REGISTRAR:
echo.
echo 1. Aceder ao site do registrar
echo 2. Login com credenciais do dominio
echo 3. Procurar "Nameservers" ou "DNS Management"
echo 4. Alterar de:
echo    ns1.dnscpanel.com
echo    ns2.dnscpanel.com
echo    ns3.dnscpanel.com
echo.
echo    Para:
echo    dns1.host-redirect.com
echo    dns2.host-redirect.com
echo    dns3.host-redirect.com
echo    dns4.host-redirect.com
echo.
echo 5. Guardar e aguardar 24-48h
echo.
pause
