import z from "zod";

export const createTaskSchema = z.object({
    board_id: z.number().int().positive(),
    title: z.string().min(1).max(300),
    description: z.string().max(2000).optional(),
    status: z.enum(["todo", "in_progress", "done"]).default("todo"),
    due_date: z.iso.datetime().optional()
})

export const updateTaskSchema = z.object({
    title: z.string().min(1).max(300).optional(),
    description: z.string().max(2000).optional(),
    status: z.enum(["todo", "in_progress", "done"]).optional(),
    due_date: z.iso.datetime().optional()
}).refine(
    (data) => Object.keys(data).length > 0, 
    {message: "At least one field must be provided"}
)