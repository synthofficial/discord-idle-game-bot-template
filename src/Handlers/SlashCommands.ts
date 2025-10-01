import { readdirSync } from "fs";
import { Bot } from "../Client";
import { join } from "path";
import Console from "../Utilities/Console";
import { REST, Routes } from "discord.js";
import { SlashCommand } from "../types";

export default class SlashCommands {
    constructor(){}

    public async registerCommands(client : Bot) {
        const slashCommandsPath = join(__dirname, "../Slash Commands");

        let cmdArray : any[] = [];
        let devCmdArray : any[] = [];

        await Promise.all(
            readdirSync(slashCommandsPath).map(async (file) => {
                const cmd : SlashCommand = (await import(`${slashCommandsPath}/${file}`)).default;
                const jsonCmd = cmd.command.toJSON();
                if(file.toLowerCase().includes("dev")) devCmdArray.push(jsonCmd);
                else cmdArray.push(jsonCmd);

                // store command in client map for runtime execution
                client.slashCommands.set(cmd.command.name, cmd);

                Console.register(`${file.toLowerCase().includes("dev") ? "Development" : "Production"} Slash Command: /${cmd.command.name}`);
            })
        )

        await client.application?.commands.set(cmdArray);
        
        if(readdirSync(slashCommandsPath).length === 0 || !readdirSync(slashCommandsPath)) throw new Error("No slash commands found");
        
        const appId = client.application?.id;
        if (!appId) {
            Console.warn("Client application id not available yet. Register after Ready.");
            return;
        }
    
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);
    
        try {
            await rest.put(Routes.applicationCommands(appId), { body: cmdArray });
            Console.debug("Successfully registered production slash commands");
    
            const devGuildId = process.env.DEVELOPMENT_GUILD_ID;
            if (devGuildId) {
                await rest.put(Routes.applicationGuildCommands(appId, devGuildId), { body: devCmdArray });
                Console.debug("Successfully registered development slash commands");
            } else {
                Console.warn("DEVELOPMENT_GUILD_ID not set; skipped guild command registration");
            }
        } catch (err) {
            Console.error(`Slash command registration failed: ${err}`);
        }


    }

}