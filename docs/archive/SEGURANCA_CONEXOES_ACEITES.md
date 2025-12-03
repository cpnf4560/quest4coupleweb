# Segurança: Conexões Precisam de Ser Aceites

## Resumo da Alteração

**Data:** 28 de Novembro de 2025

## Problema

Anteriormente, qualquer utilizador autenticado podia ler as respostas de qualquer outro utilizador. Isto significava que:
1. User A envia pedido de conexão para User B
2. **Mesmo sem User B aceitar**, User A já podia ver as respostas de User B

## Solução Implementada

### 1. Regras Firestore (`firestore.rules`)

```firerules
match /answers/{answerId} {
  // Utilizador pode escrever suas próprias respostas
  allow write: if request.auth != null && request.auth.uid == userId;
  
  // Leitura: próprias respostas OU parceiros com conexão ACEITE
  allow read: if request.auth != null && (
    // Próprias respostas
    request.auth.uid == userId ||
    // Parceiro com conexão aceite - verifica se existe documento de conexão
    (request.auth.uid < userId && 
     exists(/databases/$(database)/documents/connections/$(request.auth.uid + '_' + userId))) ||
    (userId < request.auth.uid && 
     exists(/databases/$(database)/documents/connections/$(userId + '_' + request.auth.uid)))
  );
}
```

### 2. IDs Previsíveis nas Conexões (`dashboard.js`)

As conexões agora são criadas com IDs previsíveis:
- Os dois UIDs são ordenados alfabeticamente
- São unidos com underscore
- Exemplo: se `userA` < `userB`, o ID será `userA_userB`

```javascript
const connectionId = [currentUserId, fromUserId].sort().join('_');
await db.collection('connections').doc(connectionId).set({...});
```

### 3. Tratamento de Erros (`comparison.js`)

Se um utilizador tentar ver respostas sem conexão aceite:
```javascript
if (error.code === 'permission-denied') {
  throw new Error('Não tens permissão para ver as respostas deste utilizador. A conexão precisa de ser aceite antes de poderes ver as respostas.');
}
```

## Fluxo Correto Agora

1. **User A** envia pedido de conexão para **User B**
2. **User B** recebe notificação e vê o pedido pendente
3. **User B aceita** o pedido → Cria-se documento em `connections`
4. **Só após aceitação** é que User A e User B podem ver as respostas um do outro

## Ficheiros Alterados

1. `firestore.rules` - Regras de segurança atualizadas
2. `js/dashboard.js` - Criação de conexões com ID previsível
3. `js/comparison.js` - Tratamento de erro de permissão

## Verificação

Para testar:
1. Criar 2 contas de teste
2. User A envia pedido para User B
3. User A tenta gerar relatório com User B → **Deve falhar** (sem conexão aceite)
4. User B aceita o pedido
5. Agora User A pode gerar relatório com User B → **Deve funcionar**

## Notas

- Conexões antigas (com ID automático) continuam a funcionar porque o `loadConnectedPartners` usa `array-contains`
- Novas conexões usam IDs previsíveis para as regras do Firestore verificarem
- O dropdown de parceiros só mostra conexões **aceites** (documentos em `connections`)
