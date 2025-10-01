import { Events, Interaction } from "discord.js";
import { PrismaClient } from "../Client/database";

export default{
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: Interaction, prisma?: PrismaClient) => {
        if(!interaction.isChatInputCommand()) return;
        const command = interaction.client.slashCommands.get(interaction.commandName);
        if(!command) return;
        try {
            await command.execute(interaction, prisma);
        } catch (e) {
            try {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: "There was an error executing this command.", ephemeral: true });
                }
            } catch {}
        }
    }
}