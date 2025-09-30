import { Client, GatewayIntentBits, Collection } from "discord.js";
import { config } from "dotenv";
import { SlashCommand, Event } from "./types";

import { join } from "path";
import { readdirSync } from "fs";
import { Bot } from "./Client";

//Initialise dotenv
config();

const client = new Bot();

client.init();