# 🧙‍♂️ OSRS Username Verification Bot

A Discord bot that verifies Old School RuneScape (OSRS) usernames using the official hiscores and automatically grants access to your server.

---

## 🚀 Features

- ✅ Slash command: `/verify`
- 🔍 Validates OSRS usernames via hiscores
- 🎭 Assigns a **Verified** role on success
- 🏷️ Attempts to update user nickname to RSN
- 📜 Logs all successful verifications to a mod channel
- 🔒 Perfect for gated Discord communities


---

## 🧠 How It Works

1. A new user joins your Discord server
2. They run:

   /verify rsn:TheirUsername

3. The bot:
- Checks if the username exists on OSRS hiscores
- Assigns the **Verified** role
- Attempts to change their nickname
- Logs the result in a staff-only channel
4. User gains access to the rest of the server


---

## 📦 Requirements

- Node.js (v18+ recommended)
- A Discord Bot Application
- A Discord Server


---

## ⚙️ Setup Instructions

### 1. Clone the Repository

git clone https://github.com/yourusername/osrs-username-verification.git

cd osrs-username-verification


---

### 2. Install Dependencies

run comand in terminal: 

npm install


---

### 3. Set Up Environment Variables

Create a `.env` file in the root directory.

run comand in terminal: 

ni .env

Then fill the .env out:

TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_server_id_here
VERIFIED_ROLE_ID=your_verified_role_id_here
LOG_CHANNEL_ID=your_log_channel_id_here


---

## 🔑 What is `.env`?

The `.env` file stores **private configuration values** such as your bot token and IDs.

### ⚠️ Important:
- Never share your `.env` file
- Never upload it to GitHub
- If your token is exposed → reset it immediately

---

## 🤖 Creating Your Discord Bot

1. Go to: https://discord.com/developers/applications  
2. Click **New Application**
3. Go to **Bot → Add Bot**
4. Copy your **Bot Token**
5. Enable:
   - ✅ Server Members Intent

---

## 🔗 Inviting the Bot

Go to **OAuth2 → URL Generator**

### Select:
- `bot`
- `applications.commands`

### Permissions:
- Manage Roles
- Manage Nicknames
- Send Messages
- View Channels
- Use Slash Commands

Then invite the bot to your server.

---

## 🔒 Server Setup

### Roles:
- Create a `Verified` role

### Permissions:
- `@everyone` → cannot access main channels
- `Verified` → full access

### Important:
- Bot role must be **above** `Verified` in role hierarchy

---

## 📜 Log Channel Setup

Create a channel like:

📜｜verification-logs


Copy its ID and add it to:

LOG_CHANNEL_ID=your_channel_id


Make sure the bot has permission to send messages there.

---

## ▶️ Running the Bot


run comand in terminal:  

node index.js


You should see:

Registering slash commands...
Slash commands registered successfully.
Logged in as YourBotName


---

## 🧪 Testing

In your Discord server:

/verify rsn:Zezima


Expected result:
- User gets Verified role
- Nickname updates (if allowed)
- Log message appears in mod channel

---

## ⚠️ Known Limitations

- Bot cannot change nickname of:
  - Server owner
  - Users with higher roles than the bot
- This is a Discord limitation, not a bug

---

## 🔮 Future Improvements

- Prevent duplicate RSNs
- Database storage for users
- Embed-style logs
- 24/7 cloud deployment
- Anti-abuse detection

---

## 🛡️ Security

- Keep your `.env` private
- Use `.env.example` for sharing configs
- Reset your token if exposed

---

## 💎 Author

Lillie McAlister
Built as a DevOps / Discord automation project.



