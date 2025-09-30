import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { prisma } from "../Client/database";
import Console from "../Utilities/Console";
import { SlashCommand } from "../types";

export default {
    command: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping the bot"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    discord_id: interaction.user.id
                }
            });
            
            if(!user) {
                await prisma.user.create({
                    data: {
                        discord_id: interaction.user.id
                    }
                });
                Console.success(`Created new user: ${interaction.user.username}`);
            } else {
                Console.info(`User ${interaction.user.username} already exists`);
            }
            
            await interaction.reply(`Ping: ${interaction.client.ws.ping}ms\nAPI Latency: ${Date.now() - interaction.createdTimestamp}ms`);
        } catch (error) {
            Console.error(`Database error: ${error}`);
            await interaction.reply(`Ping: ${interaction.client.ws.ping}ms\nAPI Latency: ${Date.now() - interaction.createdTimestamp}ms`);
        }
    }
} as SlashCommand;