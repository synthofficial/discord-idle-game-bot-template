import { Player as PlayerData } from "../types";
import { prisma } from "../Client/database";
import Console from "../Utilities/Console";

export class Player {

    private player : PlayerData;

    constructor(player : PlayerData){
        this.player = player;
    }

    public async sell(){
        const user = await prisma.player.findUnique({
            where: {
                userId: this.player.user.id
            },
            include: {
                backpack: true
            }
        });

        if(!user) return; // If the user is not found, return.
        const date = new Date();
        const lastSale = new Date(user.lastSale);

        const diffTimeInSeconds = Math.abs(date.getTime() - lastSale.getTime()) / 1000; // Difference in seconds between now and last sale, this is used to calculate how much the user will make.
                                                                                        // Example: If the user last sold 10 minutes ago, they will make 10 * 100 = 1000 money.
        
        // If the user has no backpack, set the maxItems to 0.
        const finalAmount = Math.min(diffTimeInSeconds * 1, user.backpack?.maxItems ?? 0); // The base amount per second is 1. You can make a multiplier for this. 
                                                   // Example: You can make a prisma model for upgrades, and link it with the player. And when the user buys an upgrade, you can add the multiplier to the base amount.
        await prisma.player.update({
            where: {
                userId: this.player.user.id
            },
            data: {
                money: {
                    increment: finalAmount,
                },
                lastSale: new Date() // Update the last sale date to now, to allow the user to sell from 0 again.
            }
        })

        return Console.success(`${this.player.user.username} sold for ${finalAmount} money`); //This is for debugging purposes. You can remove this if you want.

    }

}