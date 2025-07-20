# 🤖 WhatsApp Bot com Gemini AI

Um bot inteligente para WhatsApp que utiliza a API do Google Gemini para responder mensagens automaticamente.

## ⚠️ Aviso Importante

Este bot é destinado apenas para **uso pessoal**. O uso de bots no WhatsApp pode violar os Termos de Serviço da plataforma. Use com responsabilidade. É apenas um meio que facilita a vida, nao precisar baixar um app do gemini no celular, ou ir ao navegador sempre pesquisar por ele etc...

## 🚀 Funcionalidades

- ✅ Integração com WhatsApp Web via Baileys
- ✅ Respostas inteligentes usando Google Gemini AI
- ✅ Reconexão automática em caso de desconexão
- ✅ Logs detalhados para debugging
- ✅ Restrição de acesso por número de telefone
- ✅ Tratamento robusto de erros

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- NPM ou Yarn
- Conta Google (para API do Gemini)
- Número de WhatsApp

## 🛠️ Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-seu-repositorio>
   cd whatsapp-bot
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione sua chave da API do Gemini:
   ```
   GEMINI_API_KEY=sua-chave-do-gemini-aqui
   ```

## 🔑 Como obter a chave da API do Gemini

1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada
5. Cole no arquivo `.env`

## ⚙️ Configuração

### Alterar número autorizado

No arquivo `bot.js`, altere a linha:
```javascript
const AUTHORIZED_NUMBER = 'XXXXXXXXXXX'; // Seu número aqui
```

**Formato:** Código do país + DDD + número (sem espaços ou caracteres especiais)

### Permitir múltiplos números

Para permitir que outros números usem o bot, adicione-os ao array:
```javascript
const AUTHORIZED_NUMBERS = ['5511XXXXXX81', '5511XXXXXXX999'];
```

## 🚀 Como usar

1. **Inicie o bot:**
   ```bash
   node bot.js
   ```

2. **Escaneie o QR code** que aparecerá no terminal:
   - Abra o WhatsApp no seu celular
   - Vá em **Menu > Aparelhos conectados > Conectar um aparelho**
   - Escaneie o QR code

3. **Envie uma mensagem** para o número configurado
4. **O bot responderá** usando a inteligência do Gemini

## 📁 Estrutura do Projeto

```
whatsapp-bot/
├── bot.js              # Arquivo principal do bot
├── package.json        # Dependências do projeto
├── .env               # Variáveis de ambiente (não commitado)
├── .gitignore         # Arquivos ignorados pelo Git
├── README.md          # Documentação
└── auth_info_baileys/ # Autenticação do WhatsApp (gerado automaticamente)
```

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Executar o bot
node bot.js

# Parar o bot
Ctrl + C

# Limpar autenticação (força novo login)
Remove-Item -Recurse -Force auth_info_baileys
```

## 🐛 Troubleshooting

### Erro de conexão
- Verifique se não há outras sessões do WhatsApp Web ativas
- Apague a pasta `auth_info_baileys` e reconecte

### Erro da API do Gemini
- Verifique se a chave está correta no arquivo `.env`
- Confirme se a chave tem permissões adequadas

### Bot não responde
- Verifique se o número está configurado corretamente
- Confirme se o bot está conectado (deve aparecer "Bot conectado!")

## 📝 Logs

O bot gera logs detalhados para facilitar o debugging:

- `[Conexão]` - Status da conexão com WhatsApp
- `[Mensagem recebida]` - Mensagens recebidas
- `[Gemini]` - Interações com a API do Gemini
- `[Erro]` - Erros e exceções

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## ⚠️ Disclaimer

Este bot é fornecido "como está", sem garantias. O autor não se responsabiliza pelo uso inadequado ou violação dos termos de serviço do WhatsApp.

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs no terminal
2. Confirme se todas as dependências estão instaladas
3. Verifique se as chaves de API estão corretas
4. Abra uma issue no GitHub com detalhes do erro

---

**Apesar da existência do BOT da Meta, essa ideia veio antes dele existir, porém só foi executada agora...** 
