import { ChatInputCommandInteraction, Events, SlashCommandBuilder, SlashCommandOption } from "discord.js";
import { PrismaClient } from "./Client/database";

export interface SlashCommand {
    command: SlashCommandBuilder;
    execute: (interaction : ChatInputCommandInteraction, prisma?: PrismaClient) => Promise<void>;
    options?: SlashCommandOption[];
}

export interface Event {
    name: Events;
    once?: boolean;
    execute: (...args: any[]) => Promise<void>;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            CLIENT_ID: string;
            DEVELOPMENT_GUILD_ID: string;
            PRISMA_URL: string;
        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>;
        events: Collection<string, Event>;
    }
}