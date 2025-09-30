import { PrismaClient } from '@prisma/client';

// Export PrismaClient type for use in other files
export { PrismaClient };

// Create a singleton Prisma client instance
class PrismaSingleton {
  private static instance: PrismaClient;
  
  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' 
          ? ['query', 'error', 'warn'] 
          : ['error']
      });
    }
    
    return PrismaSingleton.instance;
  }

  public static async disconnect(): Promise<void> {
    if (PrismaSingleton.instance) {
      await PrismaSingleton.instance.$disconnect();
      PrismaSingleton.instance = null as any;
    }
  }
}

// Export the singleton instance
export const prisma = PrismaSingleton.getInstance();

// Export the class for advanced usage
export { PrismaSingleton };

// Graceful shutdown
process.on('beforeExit', async () => {
  await PrismaSingleton.disconnect();
});

process.on('SIGINT', async () => {
  await PrismaSingleton.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await PrismaSingleton.disconnect();
  process.exit(0);
});
