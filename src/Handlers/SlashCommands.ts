import { readdirSync } from "fs";
import { Bot } from "../Client";
import { join } from "path";
import Console from "../Utilities/Console";
import { REST, Routes } from "discord.js";
import { SlashCommand } from "../types";

export default class SlashCommands {
    constructor(){}

    public async registerCommands(client : Bot) {
        const slashCommandsPath = join(__dirname, "../slash commands");

        let cmdArray : any[] = [];
        let devCmdArray : any[] = [];

        await Promise.all(
            readdirSync(slashCommandsPath).map(async (file) => {
                const cmd : SlashCommand = (await import(`${slashCommandsPath}/${file}`)).default;
                if(file.includes("dev")) devCmdArray.push(cmd);
                else cmdArray.push(cmd);

                Console.register(`${file.includes("dev") ? "Development" : "Production"} Slash Command: /${cmd.command.name}`);

            })
        )

        await client.application?.commands.set(cmdArray);
        
        if(readdirSync(slashCommandsPath).length === 0 || !readdirSync(slashCommandsPath)) throw new Error("No slash commands found");
        
        const rest = new REST({ version: "14" }).setToken(process.env.TOKEN);
        await(async() => {
            await rest.put(Routes.applicationCommands(client.user?.id!), {
                body: cmdArray
            });
            await rest.put(Routes.applicationGuildCommands(client.user?.id!, process.env.DEVELOPMENT_GUILD_ID!), {
                body: devCmdArray
            });
        })


    }

}