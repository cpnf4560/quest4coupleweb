# ?? Quest4Couple v2.0

## ?? INÍCIO RÁPIDO

### Windows
1. **Duplo-clique** em `START_SERVER.bat`
2. Aguarda o servidor iniciar
3. Abre o browser em: **http://localhost:8000/app.html**

### Manual (qualquer SO)
```bash
python -m http.server 8000
```
Depois acede: **http://localhost:8000/app.html**

## ?? IMPORTANTE
**NÃO abras `app.html` diretamente!**  
Usa sempre um servidor HTTP local (porta 8000)

## ?? Documentação Completa
- `GUIA_RAPIDO.md` - Manual de utilização
- `REESTRUTURACAO_COMPLETA.md` - Documentação técnica
- `DEBUG_CORRECOES.md` - Resolução de problemas

## ?? Estrutura
```
Quest4Couple_v2_free/
+-- app.html              ? Aplicação principal
+-- index.html            ? Página inicial
+-- START_SERVER.bat      ? Inicia servidor (Windows)
+-- css/                  ? Estilos
+-- js/                   ? JavaScript modular
+-- data/                 ? Questionários JSON
+-- pages/                ? Páginas secundárias
+-- assets/               ? Imagens e recursos
```

## ?? Ajuda
Se as perguntas não aparecerem:
1. Verifica que estás a usar **http://localhost:8000**
2. Abre o Console do browser (F12)
3. Consulta `DEBUG_CORRECOES.md`

