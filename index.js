// Load the values from the .env file so we can use them in this bot.
require('dotenv').config();

// Import the Discord.js pieces we need to create the bot, listen for slash commands,
// and register the /verify command in your server.
const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
} = require('discord.js');

// Import axios so the bot can make a web request to the OSRS hiscores page.
const axios = require('axios');

// Pull your bot token from the .env file.
const TOKEN = process.env.TOKEN;

// Pull your Discord application ID from the .env file.
const CLIENT_ID = process.env.CLIENT_ID;

// Pull your Discord server ID from the .env file.
const GUILD_ID = process.env.GUILD_ID;

// Pull your Verified role ID from the .env file.
const VERIFIED_ROLE_ID = process.env.VERIFIED_ROLE_ID;

// Pull your log channel ID from the .env file.
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;

// Create the Discord bot client.
// Guilds lets the bot work in servers.
// GuildMembers lets it fetch members, change nicknames, and assign roles.
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Build the slash command users will run in your server.
// This creates: /verify rsn:<username>
const commands = [
  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your OSRS username and unlock the server.')
    .addStringOption((option) =>
      option
        .setName('rsn')
        .setDescription('Your Old School RuneScape username')
        .setRequired(true)
    )
    .toJSON(),
];

// Create a function that registers the /verify slash command in your server.
async function registerCommands() {
  // Create a REST client that uses your bot token to talk to Discord's API.
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    // Let you know command registration has started.
    console.log('Registering slash commands...');

    // Register the /verify command in your specific server.
    // Guild commands appear faster than global commands while testing.
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    // Let you know command registration finished.
    console.log('Slash commands registered successfully.');
  } catch (error) {
    // Print any error if command registration fails.
    console.error('Error registering slash commands:', error);
  }
}

// Register the slash commands before the bot fully starts.
registerCommands();

// Run this once when the bot connects successfully.
client.once('clientReady', () => {
  // Print the bot's username in the terminal so you know it is online.
  console.log(`Logged in as ${client.user.tag}`);
});

// Listen for all interactions, including slash commands.
client.on('interactionCreate', async (interaction) => {
  // Ignore anything that is not a slash command.
  if (!interaction.isChatInputCommand()) return;

  // Ignore anything that is not the /verify command.
  if (interaction.commandName !== 'verify') return;

  // Get the username the user typed after /verify.
  const rawRsn = interaction.options.getString('rsn');

  // Remove extra spaces from the start and end of the username.
  const rsn = rawRsn.trim();

  // Stop the command if the username is blank or too long for OSRS.
  if (rsn.length < 1 || rsn.length > 12) {
    await interaction.reply({
      content: '❌ OSRS usernames must be between 1 and 12 characters.',
      flags: 64,
});
    return;
  }

  try {
    // Tell Discord the bot is working so the interaction does not time out.
    await interaction.deferReply({ flags: 64 });

    // Build the OSRS hiscores URL using the username the user entered.
    // encodeURIComponent makes sure spaces and special characters are handled safely.
    const hiscoreUrl = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(rsn)}`;

    // Send the request to the OSRS hiscores page.
    const response = await axios.get(hiscoreUrl, {
      // Let us handle non-200 responses ourselves instead of crashing automatically.
      validateStatus: () => true,
    });

    // If the hiscores page does not return usable data, treat that as not found.
    if (response.status !== 200 || !response.data) {
      await interaction.editReply(
        '❌ I could not find that OSRS username. Check the spelling and try again.'
      );
      return;
    }

    // Fetch the member object for the user who ran the command.
    const member = await interaction.guild.members.fetch(interaction.user.id);

    // Look up the Verified role in your server using the role ID from .env.
    const verifiedRole = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID);

    // Stop if the role was not found.
    if (!verifiedRole) {
      await interaction.editReply(
        '❌ Verified role not found. Check your VERIFIED_ROLE_ID in the .env file.'
      );
      return;
    }

    let nicknameUpdated = false;

    // Try to change the nickname, but do not fail the whole verification if it cannot.
    try {
      await member.setNickname(rsn);
      nicknameUpdated = true;
    } catch (error) {
      console.log(`Could not change nickname for ${interaction.user.tag}: ${error.message}`);
    }

    // Try to give the Verified role, and handle errors cleanly.
    try {
      await member.roles.add(verifiedRole);
    } catch (error) {
      await interaction.editReply(`❌ Failed to assign role: ${error.message}`);
      return;
    }

    // Look up the log channel in your server.
    const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);

    // If the log channel exists, send a verification log message there.
    if (logChannel) {
      await logChannel.send(
        `✅ **Verification Successful**\n` +
        `User: ${interaction.user.tag}\n` +
        `RSN: **${rsn}**\n` +
        `Nickname Updated: ${nicknameUpdated ? 'Yes' : 'No'}\n` +
        `Current Display Name: ${member.displayName}\n` +
        `Verified Role Assigned: Yes`
      );
    }
    // Send a success message back to the user privately.
    await interaction.editReply(
      `✅ Verified successfully as **${rsn}**. If your nickname did not update automatically, please reach out to a moderator to change it manually. You now have access to the server.`
    );
  } catch (error) {
    // Print the full error in your terminal for debugging.
    console.error('Verification error:', error);

    // Send a user-friendly error message in Discord.
    await interaction.editReply(
      '❌ Verification failed. Check the bot permissions, role order, and .env values.'
    );
  }
});

// Log the bot into Discord using your bot token.
client.login(TOKEN);