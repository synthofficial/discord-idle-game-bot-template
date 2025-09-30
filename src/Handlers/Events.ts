import { readdirSync } from "fs";
import { Bot } from "../Client";
import { join } from "path";
import Console from "../Utilities/Console";

export default class Events {
    constructor(){}

    public async registerEvents(client : Bot) {
        const eventsPath = join(__dirname, "../events");

        if(readdirSync(eventsPath).length === 0 || !readdirSync(eventsPath)) throw new Error("No events found");
        
        // Use Promise.all to ensure all events are loaded before continuing
        const eventFiles = readdirSync(eventsPath);
        const eventPromises = eventFiles.map(async (file) => {
            const event = (await import(`${eventsPath}/${file}`)).default;
            event.once ? client.once(event.name, event.execute) : client.on(event.name, event.execute);
            
            // Add event to the client.events collection
            client.events.set(event.name, event);
            
            Console.register(`Event: ${event.name} ${event.once ? '(once)' : '(on)'}`);
            return event;
        });
        
        await Promise.all(eventPromises);
        Console.success(`Successfully loaded ${eventFiles.length} events`);
    }

}