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

---

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
| `URL`        | Endpoint público fornecido pelo Render         |

#### ✅ Exemplo de uso no código:

```js
const bot = new TelegramBot(token);
bot.setWebHook(`${process.env.URL || "https://furiabot-w84e.onrender.com"}/bot${token}`);
```

### ✅ Bot em Produção

O bot está online e pronto para uso!

📲 **Acesse agora:** **[@furiabrunobot](http://t.me/furiabrunobot)**

Caso o bot não responder, mande novamente a mensagem e aguarde alguns segundos.
Você pode enviar placares, usar botões, interagir com mensagens temáticas e testar os diferentes modos disponíveis.

---

## 📚 Comandos Disponíveis

| Comando       | Ação                                                                 |
|---------------|----------------------------------------------------------------------|
| `/start`      | Abre o menu principal com botões interativos                         |
| `/ajuda`      | Lista os comandos disponíveis                                         |
| `/info`       | Ativa o modo informativo sobre a FURIA                               |
| `/torcida`    | Ativa o modo torcida (reage a placares e aos sentimentos "nervoso", "animado", "desanimado" ou "medo")                |
| `/calendario` | Abre o modo calendário com partidas próximas                         |
| `/voltar`     | Volta ao menu principal de qualquer ponto do bot                     |

---

## 🧱 Organização do Projeto

| Arquivo       | Função                                                              |
|---------------|---------------------------------------------------------------------|
| index.js	      | Arquivo principal com lógica e modos do bot                       |

---

## 🔧 Funções utilitárias:
- **extrairPlacar():** identifica e interpreta placares nas mensagens
- **extrairDataPadrao():** reconhece datas em diferentes formatos
- **buscarResposta():** retorna frases temáticas com base em termos e emoções
- **deveInverterPlacar():** detecta expressões como "pra eles" e inverte o placar

---

## 🔐 Segurança
- O token do bot NUNCA deve ser colocado diretamente no código público, pois facilita invadir e alterar o funcionamento do bot.
- Use process.env para esconder credenciais.
- No Render, isso é feito na aba "Environment".

---

## ✅ Observações
- O bot utiliza Webhook com a porta **10000**, conforme exigido pelo Render.
- Toda a configuração já está funcional e pública no link acima.
- Caso deseje adaptar o bot para outro time ou contexto, basta editar os conteúdos em **respostasModoInfo.js**.

---

## 🧑‍💻 Como Contribuir
### 1. Faça um fork do projeto

### 2. Crie uma nova branch:

```bash
Copiar
Editar
git checkout -b minha-feature
```

### 3. Faça commit das suas alterações:

```bash
Copiar
Editar
git commit -m "Minha nova funcionalidade"
```

### 4. Envie para o GitHub:

```bash
Copiar
Editar
git push origin minha-feature
```

### 5. Abra um Pull Request

---



