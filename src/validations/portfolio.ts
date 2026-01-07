import { z } from 'zod';

export const portfolioSchema = z.object({
    coinId: z.string().min(1, 'Select a coin'),
    amount: z.coerce.number().positive('Amount must be greater than 0'),
    purchasePrice: z.coerce.number().positive('Price must be greater than 0'),
    purchaseDate: z.string().min(1, 'Please select a date'),
});

export type PortfolioFormData = z.infer<typeof portfolioSchema>;
