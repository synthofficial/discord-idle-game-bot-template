import { Events, Interaction } from "discord.js";
import { PrismaClient } from "../Client/database";

export default{
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: Interaction, prisma?: PrismaClient) => {
        if(!interaction.isCommand()) return;
        const command = interaction.client.slashCommands.get(interaction.commandName);
        if(!command) return;
        await command.execute(interaction, prisma);
    }
}