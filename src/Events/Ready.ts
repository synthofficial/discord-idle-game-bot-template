import { Events } from "discord.js";
import { Bot } from "../Client";
import Console from "../Utilities/Console";

export default {
    name: Events.ClientReady,
    once: true,
    execute: (client : Bot) => {
        Console.startup(`Successfully logged in as ${client.user?.tag}`);
    }
}