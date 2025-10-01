import { config } from "dotenv";
import { Bot } from "./Client";

//Initialise dotenv
config();

const client = new Bot();

client.init();