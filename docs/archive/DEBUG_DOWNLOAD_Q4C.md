# 🔧 DEBUG: PROBLEMA DE DOWNLOAD DO .Q4C

## 📋 PROBLEMA REPORTADO
Ao responder todos os questionários e clicar em "Guardar":
- ✅ Pede código de segurança
- ✅ Utilizador digita código
- ✅ Clica em OK
- ❌ **NADA ACONTECE - Não faz download**

---

## ✅ CORREÇÕES APLICADAS

### 1. **Verificação de CryptoJS**
Adicionado verificação para garantir que a biblioteca de encriptação está carregada:
```javascript
if (typeof CryptoJS === 'undefined') {
  alert('⏳ A biblioteca de encriptação ainda está a carregar...');
  return;
}
```

### 2. **Validação de Código Vazio**
Adicionado verificação para código vazio:
```javascript
if (securityCode.trim() === '') {
  alert("O código não pode estar vazio!");
  return;
}
```

### 3. **Verificação de Respostas**
Adicionado verificação para garantir que há respostas:
```javascript
if (!data.answers || Object.keys(data.answers).length === 0) {
  alert('❌ Não há respostas para guardar!');
  return;
}
```

### 4. **Melhor Manipulação do DOM**
O elemento `<a>` agora é adicionado ao DOM antes do click:
```javascript
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
```

### 5. **Try-Catch para Erros**
Adicionado tratamento de erros completo:
```javascript
try {
  // ... código de encriptação e download
} catch (error) {
  alert('❌ Erro ao guardar o ficheiro: ' + error.message);
}
```

### 6. **Logs de Debug Completos**
Adicionados logs em cada etapa:
- 📋 Recolha de dados
- 👤 Nome do utilizador
- 📦 Contagem de perguntas por pack
- ✅ Respostas recolhidas por pack
- 📊 Total de respostas
- 🔐 Encriptação
- 💾 Download do arquivo

---

## 🧪 COMO TESTAR

### 1. Abrir Console do Navegador (F12)
Antes de clicar em "Guardar", abrir a consola para ver os logs.

### 2. Clicar em "Guardar"
Observar os logs que aparecem:

**Logs esperados (sucesso):**
```
✅ CryptoJS carregado com sucesso
📋 A recolher dados das respostas...
👤 Nome do utilizador: [SEU NOME]
📦 Pack Romântico: 10 perguntas encontradas
✅ Pack Romântico: 10 respostas recolhidas
📦 Pack Pimentinha: 15 perguntas encontradas
✅ Pack Pimentinha: 15 respostas recolhidas
📊 Total de respostas recolhidas: 25
📦 A preparar dados para download...
✅ Dados preparados: {userName: "...", answers: {...}}
🔐 A encriptar dados...
✅ Dados encriptados com sucesso
💾 A iniciar download do arquivo: Quest4Couple_Nome_2024-11-27.q4c
✅ Download iniciado com sucesso!
```

**Possíveis erros:**

#### ❌ CryptoJS não carregado
```
❌ CryptoJS não está carregado ainda!
```
**Solução:** Aguardar 2-3 segundos e tentar novamente.

#### ❌ Sem respostas
```
📊 Total de respostas recolhidas: 0
```
**Solução:** Verificar se as perguntas foram realmente respondidas.

#### ❌ Containers não encontrados
```
⚠️ Container do pack [NOME] não encontrado
```
**Solução:** Problema no HTML/JavaScript de renderização.

---

## 🔍 DIAGNÓSTICO PASSO-A-PASSO

### Passo 1: Verificar se CryptoJS está a carregar
Na consola, digitar:
```javascript
typeof CryptoJS
```
**Esperado:** `"object"`  
**Se retornar** `"undefined"` → Problema de conexão ou CDN bloqueado

### Passo 2: Verificar se há respostas
Na consola, digitar:
```javascript
getAnswersData()
```
**Esperado:** Objeto com propriedade `answers` preenchida  
**Se `answers` estiver vazio** → Problema na recolha de respostas

### Passo 3: Testar função de guardar manualmente
Na consola, digitar:
```javascript
saveAnswers()
```
Observar logs e mensagens de erro.

### Passo 4: Verificar se o botão está a chamar a função correta
Na consola, verificar se o botão tem onclick correto:
```javascript
document.querySelector('[onclick*="saveAnswers"]')
```
**Esperado:** Elemento do botão  
**Se retornar** `null` → Botão não tem onclick

---

## 🎯 POSSÍVEIS CAUSAS DO PROBLEMA

### Causa 1: CryptoJS não carregou
- **Sintoma:** Nada acontece ao clicar
- **Log:** Nenhum log aparece
- **Solução:** Aguardar carregamento ou verificar conexão

### Causa 2: Navegador bloqueando download
- **Sintoma:** Logs aparecem mas ficheiro não baixa
- **Log:** `✅ Download iniciado` mas nada acontece
- **Solução:** Verificar se browser bloqueou download automático

### Causa 3: Popup de prompt foi fechado
- **Sintoma:** Prompt desaparece sem fazer nada
- **Log:** "Código de segurança é obrigatório"
- **Solução:** Digitar código e clicar OK (não fechar)

### Causa 4: Sem respostas para guardar
- **Sintoma:** Alerta "Não há respostas para guardar"
- **Log:** `📊 Total de respostas recolhidas: 0`
- **Solução:** Responder pelo menos uma pergunta

### Causa 5: Erro de permissão do navegador
- **Sintoma:** Erro ao criar Blob ou URL
- **Log:** Exception no try-catch
- **Solução:** Usar outro navegador ou permitir downloads

---

## 💡 SOLUÇÕES RÁPIDAS

### Se nada acontece:
1. **Aguardar 3-5 segundos** após carregar a página
2. **Abrir F12** para ver se há erros JavaScript
3. **Tentar outro navegador** (Chrome, Firefox, Edge)
4. **Desativar extensões** (AdBlock, etc.) que podem bloquear

### Se pede código mas não baixa:
1. Verificar se **popup blocker** está ativo
2. Verificar se navegador **bloqueou download automático**
3. Olhar para a **barra de downloads** do navegador
4. Verificar pasta de **Downloads** do computador

### Se diz "sem respostas":
1. Verificar se **clicou nas opções** Sim/Talvez/Não
2. Verificar se as **perguntas estão visíveis** na página
3. Tentar **responder uma pergunta** de cada pack
4. **Recarregar página** e tentar novamente

---

## 🚀 ALTERAÇÕES NO CÓDIGO

**Arquivo modificado:** `js/storage.js`

### Alterações principais:
1. ✅ Carregamento robusto do CryptoJS com callbacks
2. ✅ Validação completa antes de guardar
3. ✅ Manipulação correta do DOM para download
4. ✅ Tratamento de erros com try-catch
5. ✅ Logs detalhados em cada etapa
6. ✅ Mensagens de erro mais descritivas

---

## 📞 PRÓXIMOS PASSOS PARA TESTAR

1. ✅ **Recarregar** a página `app.html`
2. ✅ **Abrir Console** (F12)
3. ✅ **Responder** algumas perguntas
4. ✅ **Clicar** em "💾 Guardar"
5. ✅ **Observar** os logs na consola
6. ✅ **Verificar** se ficheiro .q4c foi baixado

---

## 🆘 SE AINDA NÃO FUNCIONAR

### Enviar informações de debug:
1. Print do console (F12) com todos os logs
2. Mensagens de alerta que apareceram
3. Navegador e versão (Chrome 120, Firefox 119, etc.)
4. Sistema operativo (Windows 10, 11, etc.)

### Testes alternativos:
```javascript
// Na consola, executar cada linha separadamente:

// 1. Verificar CryptoJS
console.log('CryptoJS:', typeof CryptoJS);

// 2. Ver dados recolhidos
console.log('Dados:', getAnswersData());

// 3. Testar encriptação
const teste = CryptoJS.AES.encrypt('teste', '1234').toString();
console.log('Encriptação funciona:', teste.length > 0);

// 4. Testar download manual
const blob = new Blob(['teste'], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'teste.txt';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
```

---

## ✅ CONCLUSÃO

**Todas as correções foram aplicadas!**  
O sistema agora tem:
- ✅ Validações robustas
- ✅ Logs detalhados para debug
- ✅ Tratamento de erros
- ✅ Mensagens descritivas
- ✅ Download melhorado

**Por favor, testar e reportar qualquer erro que apareça na consola!** 🚀
