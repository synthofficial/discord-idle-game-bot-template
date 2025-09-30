import chalk from "chalk";

export default class Console {
    private static readonly timestampFormat = "HH:mm:ss";
    
    constructor(){}

    private static getTimestamp(): string {
        return new Date().toLocaleTimeString("en-GB", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    private static formatLog(level: string, icon: string, message: string, color: typeof chalk): void {
        const timestamp = this.getTimestamp();
        const formattedLevel = color.bold(level.padEnd(8)); // Increased padding for better alignment
        const separator = chalk.gray("│");
        
        console.log(
            `${chalk.gray(`[${timestamp}]`)} ${separator} ${icon} ${formattedLevel} ${separator} ${message}`
        );
    }

    public static success(message: string): void {
        this.formatLog("SUCCESS", "✅", chalk.green(message), chalk.green);
    }

    public static error(message: string): void {
        this.formatLog("ERROR", "❌", chalk.red(message), chalk.red);
    }

    public static warn(message: string): void {
        this.formatLog("WARN", "⚠️ ", chalk.yellow(message), chalk.yellow);
    }

    public static info(message: string): void {
        this.formatLog("INFO", "ℹ️ ", chalk.blue(message), chalk.blue);
    }

    public static debug(message: string): void {
        this.formatLog("DEBUG", "🐛", chalk.magenta(message), chalk.magenta);
    }

    public static register(message: string): void {
        this.formatLog("REGISTER", "🔄", chalk.cyan(message), chalk.cyan);
    }

    public static startup(message: string): void {
        this.formatLog("STARTUP", "🚀", chalk.green.bold(message), chalk.green);
    }

    public static shutdown(message: string): void {
        this.formatLog("SHUTDOWN", "🛑", chalk.red.bold(message), chalk.red);
    }
}