# 📧 SISTEMA DE NOTIFICAÇÕES POR E-MAIL - Quest4Couple

## ✅ STATUS
- **Sistema de notificações in-app**: ✅ IMPLEMENTADO
- **Sistema de e-mail**: ⚙️ CONFIGURAÇÃO NECESSÁRIA

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### 1. Notificações In-App (Já funcionando)
✅ Badge vermelho com contagem de notificações  
✅ Notificações visuais na página de relatórios  
✅ Sistema de verificação automática  
✅ Marcação de relatórios como visualizados  

### 2. Sistema de E-mail (Pronto para configurar)
📄 Arquivo criado: `js/email-notifications.js`  
📋 Template de e-mail HTML incluído  
🔧 Duas opções de implementação disponíveis  

---

## 🚀 OPÇÃO 1: EmailJS (Recomendado para Início - GRATUITO)

### Vantagens:
- ✅ **100% Gratuito** até 200 e-mails/mês
- ✅ Sem servidor necessário
- ✅ Configuração em 10 minutos
- ✅ Interface visual para criar templates
- ✅ E-mails profissionais com info@quest4couple.com

### Passos de Configuração:

#### 1️⃣ Criar conta EmailJS
```
1. Aceder a https://www.emailjs.com/
2. Clicar em "Sign Up" (Gratuito)
3. Confirmar e-mail
```

#### 2️⃣ Configurar Serviço de E-mail
```
1. No Dashboard, clicar em "Add New Service"
2. Escolher "Gmail" ou outro serviço
3. Conectar conta info@quest4couple.com
4. Copiar o "Service ID" (ex: service_quest4couple)
```

#### 3️⃣ Criar Template de E-mail
```
1. Ir para "Email Templates"
2. Clicar em "Create New Template"
3. Copiar o HTML do template (ver abaixo)
4. Configurar variáveis:
   - {{to_email}} - E-mail destinatário
   - {{partner_name}} - Nome do parceiro
   - {{report_count}} - Número de relatórios
   - {{link}} - Link para o relatório
5. Copiar o "Template ID" (ex: template_new_report)
```

#### 4️⃣ Obter Public Key
```
1. Ir para "Account" > "General"
2. Copiar a "Public Key"
```

#### 5️⃣ Atualizar Configuração
Editar `js/email-notifications.js`:
```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_XXXXX',      // Cole seu Service ID
  TEMPLATE_ID: 'template_XXXXX',    // Cole seu Template ID
  PUBLIC_KEY: 'XXXXXXXXXXXXX'       // Cole sua Public Key
};

const EMAIL_ENABLED = true; // Ativar e-mails
```

#### 6️⃣ Adicionar Script no HTML
Adicionar antes do `</body>` nas páginas relevantes:
```html
<script src="js/email-notifications.js"></script>
```

### Template de E-mail para EmailJS:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0;
      padding: 0;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      padding: 30px; 
      text-align: center; 
      border-radius: 10px 10px 0 0; 
    }
    .header h1 {
      margin: 0;
      font-size: 2em;
    }
    .content { 
      background: #f9f9f9; 
      padding: 30px; 
      border-radius: 0 0 10px 10px; 
    }
    .button { 
      display: inline-block; 
      background: #667eea; 
      color: white !important; 
      padding: 12px 30px; 
      text-decoration: none; 
      border-radius: 6px; 
      margin-top: 20px;
      font-weight: bold;
    }
    .footer { 
      text-align: center; 
      margin-top: 30px; 
      color: #666; 
      font-size: 0.9em; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💕 Quest4Couple</h1>
      <p>Novo Relatório Disponível!</p>
    </div>
    <div class="content">
      <p>Olá!</p>
      <p><strong>{{partner_name}}</strong> acabou de partilhar um novo relatório de compatibilidade contigo!</p>
      <p>Descobre agora as vossas respostas e o nível de compatibilidade:</p>
      <a href="{{link}}" class="button">Ver Relatório Agora</a>
      <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
        Este e-mail foi enviado automaticamente pelo Quest4Couple. 
        Para desativar notificações por e-mail, acede às tuas configurações no Dashboard.
      </p>
    </div>
    <div class="footer">
      <p>© 2024 Quest4Couple - Descobre a vossa compatibilidade</p>
      <p>
        <a href="https://quest4couple.com" style="color: #667eea;">Website</a> | 
        <a href="mailto:info@quest4couple.com" style="color: #667eea;">Contacto</a>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 🏢 OPÇÃO 2: Servidor Backend Próprio (Recomendado para Produção)

### Vantagens:
- ✅ Controlo total sobre e-mails
- ✅ Sem limites de envio
- ✅ Maior personalização
- ✅ Melhor para escalar

### Requisitos:
- Servidor Node.js
- Conta de e-mail SMTP (info@quest4couple.com)
- Conhecimentos básicos de backend

### Código Backend (Node.js + Express + Nodemailer):

```javascript
// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configurar transporter com conta info@quest4couple.com
const transporter = nodemailer.createTransport({
  host: 'smtp.seu-provedor.com',
  port: 587,
  secure: false,
  auth: {
    user: 'info@quest4couple.com',
    pass: 'SUA_SENHA_SEGURA'
  }
});

// Endpoint para enviar notificação
app.post('/api/send-notification', async (req, res) => {
  const { to, partnerName, reportCount } = req.body;

  const mailOptions = {
    from: '"Quest4Couple" <info@quest4couple.com>',
    to: to,
    subject: '💕 Novo Relatório Disponível - Quest4Couple',
    html: `
      <!-- COLAR TEMPLATE HTML AQUI -->
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'E-mail enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor de e-mail rodando na porta 3000');
});
```

### Instalação:
```bash
npm init -y
npm install express nodemailer cors
node server.js
```

---

## 🔧 INTEGRAÇÃO COM O SISTEMA ATUAL

### Quando enviar e-mail?

O e-mail será enviado automaticamente quando:
1. Um utilizador **partilha um relatório** com o parceiro
2. O parceiro ainda **não visualizou** o relatório

### Onde adicionar a chamada?

No arquivo onde o relatório é partilhado (ex: `js/firestore-sync.js` ou onde fizer a partilha):

```javascript
// Após partilhar relatório com sucesso
await db.collection('connections').doc(connectionId).update({
  sharedReports: firebase.firestore.FieldValue.arrayUnion(reportId)
});

// Enviar notificação por e-mail
if (typeof notifyPartnerByEmail === 'function') {
  await notifyPartnerByEmail(connectionId);
  console.log('✅ Notificação por e-mail enviada ao parceiro');
}
```

---

## 📊 COMPARAÇÃO DAS OPÇÕES

| Característica | EmailJS | Backend Próprio |
|----------------|---------|-----------------|
| **Custo Inicial** | Gratuito | Servidor necessário |
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Tempo Setup** | 10 minutos | 1-2 horas |
| **Limite E-mails** | 200/mês grátis | Ilimitado |
| **Controlo** | Médio | Total |
| **Escalabilidade** | Pago após 200/mês | Ilimitada |
| **Recomendado para** | Início/MVP | Produção |

---

## ✅ RECOMENDAÇÃO

### Para começar AGORA (próximos 5 minutos):
**Use EmailJS** - É gratuito, rápido de configurar e perfeito para validar a funcionalidade.

### Para longo prazo (quando tiver >200 utilizadores):
**Migrar para Backend Próprio** - Oferece maior controlo e é mais profissional.

---

## 🧪 TESTAR SISTEMA DE E-MAIL

### 1. Com EmailJS configurado:
```javascript
// Na consola do browser (F12):
sendEmailNotification('seu-email@example.com', 'João', 1);
```

### 2. Verificar logs:
```javascript
// Ativar modo debug
localStorage.setItem('debug_email', 'true');
```

### 3. Teste completo:
1. Autenticar dois utilizadores
2. Criar conexão entre eles
3. Parceiro 1 partilha relatório
4. Parceiro 2 deve receber e-mail + notificação in-app

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Escolher opção (EmailJS ou Backend)
2. ✅ Seguir passos de configuração
3. ✅ Testar com e-mail próprio
4. ✅ Ativar em produção

---

## 🆘 SUPORTE

Se encontrares dificuldades:
1. Verificar logs no browser (F12 > Console)
2. Verificar configuração EmailJS (Service ID, Template ID, Public Key)
3. Testar com e-mail pessoal primeiro
4. Verificar spam/lixo no e-mail de destino

**Está tudo pronto para funcionar!** Só precisas configurar o EmailJS (10 minutos) ou o backend próprio. 🚀
