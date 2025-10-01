import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { prisma } from "../Client/database";
import Console from "../Utilities/Console";
import { SlashCommand } from "../types";

export default {
    command: new SlashCommandBuilder()
        .setName("create")
        .setDescription("Create your profile."),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const user = await prisma.player.findUnique({
            where: {
                userId: interaction.user.id
            }
        });
        
        if(!user){
            await prisma.player.create({
                data: {
                    userId: interaction.user.id,
                    backpack: {
                        create: {
                            maxItems: 100
                        }
                    }
                }
            });
            Console.success(`Created new user: ${interaction.user.username}`);
        } else {
            Console.info(`User ${interaction.user.username} already exists`);
        }

        await interaction.reply(`Ping: ${interaction.client.ws.ping}ms\nAPI Latency: ${Date.now() - interaction.createdTimestamp}ms`);
    }
} as SlashCommand;