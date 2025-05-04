# 🐆 FURIABot — Bot da Torcida FURIA no Telegram

Bot da FURIA desenvolvido em Node.js com integração ao Telegram via Webhook e hospedado no Render.

O **FURIABot** é um bot criado para aproximar torcedores da organização FURIA Esports, permitindo interações divertidas, informativas e temáticas diretamente no Telegram.

Com ele, é possível acompanhar placares de partidas, interagir com modos exclusivos, consultar o calendário de jogos e aprender mais sobre a história da organização e seus jogadores.

---

## ✨ Funcionalidades

- 🎉 **Modo Torcida**: o usuário envia placares (ex: `2x1`, `1-0`) e recebe reações automáticas. Também é possível interagir com termos como "medo", "nervoso", "desanimado" etc., e o bot responde com mensagens relacionadas ao sentimento.
- ℹ️ **Modo Informativo**: o bot fornece detalhes sobre:
  - História da FURIA (geral e por ano)
  - Jogadores e suas trajetórias
  - Patrocinadores
- 📅 **Modo Calendário**: o usuário pode consultar as partidas dos próximos 7 dias ou buscar por um período personalizado.
- 🛍️ Acesso à [loja oficial da FURIA](https://www.furia.gg/)
- 📲 Comandos rápidos acessíveis por botões interativos.

---

## 📦 Instalação Local

### 1. Clone o repositório

```bash
git clone https://github.com/brunocmnz/furiabot/
cd furiabot
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute localmente com polling

```bash
const bot = new TelegramBot(token, { polling: true });
```

e depois
```bash
node index.js
```




## 🌐 Publicação no Render (Produção)

### Etapas realizadas:

#### ✅ Criação do bot no Telegram via BotFather:

- Comando usado: `/newbot`
- Nome: **FURIA Bot**
- Username: **[@furiabrunobot](http://t.me/furiabrunobot)**
- O token gerado foi copiado para uso no código.

#### ✅ Criação de uma conta no Render:

- Acesse: [https://render.com](https://render.com)

#### ✅ Criação de um serviço Web no Render:

1. Clique em **"New Web Service"**
2. Suba o repositório do GitHub com o código do bot
3. Configure:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Porta usada internamente:** `10000`

#### ✅ Variáveis de ambiente configuradas no Render:

| Chave        | Valor                                        |
|--------------|----------------------------------------------|
| `BOT_TOKEN`  | Token fornecido pelo BotFather               |
| `URL`        | `https://furiabot-w84e.onrender.com`         |

#### ✅ Exemplo de uso no código:

```js
const bot = new TelegramBot(token);
bot.setWebHook(`${process.env.URL || "https://furiabot-w84e.onrender.com"}/bot${token}`);
```











