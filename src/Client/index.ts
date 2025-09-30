import { Collection, Client, GatewayIntentBits } from "discord.js";
import { SlashCommand, Event } from "../types";
import Events from "../Handlers/Events";
import Console from "../Utilities/Console";
import SlashCommands from "../Handlers/SlashCommands";

const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits


export class Bot extends Client {

    public slashCommands: Collection<string, SlashCommand>;
    public events: Collection<string, Event>;

    constructor() {
        super({
            intents: [
                Guilds,
                MessageContent,
                GuildMessages,
                GuildMembers
            ]
        })
        this.slashCommands = new Collection<string, SlashCommand>();
        this.events = new Collection<string, Event>();;
    }

    public async init() {
        await this.registerHandlers();
        await this.start();
    }

    async registerHandlers() {
        await new Events().registerEvents(this);
        await new SlashCommands().registerCommands(this);
    }

    async start() {
        if(!process.env.TOKEN){
            throw new Error("TOKEN is not set");
        }
        if(!process.env.PRISMA_URL){
            Console.warn("PRISMA_URL is not set in .env! You will not be able to use the database!");
        }
        Console.success("Successfully connected to the database");
        await this.login(process.env.TOKEN);
    }

}