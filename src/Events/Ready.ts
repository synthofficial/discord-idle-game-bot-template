import { Events } from "discord.js";
import { Bot } from "../Client";
import Console from "../Utilities/Console";
import SlashCommands from "../Handlers/SlashCommands";

export default {
    name: Events.ClientReady,
    once: true,
    execute: async (client : Bot) => {
        Console.startup(`Successfully logged in as ${client.user?.tag}`);
        await new SlashCommands().registerCommands(client);
    }
}