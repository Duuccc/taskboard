export interface WelcomeEmailJob {
    userId: number
    name: string
    email: string
}

export interface TaskAssignedJob {
    taskId: number
    taskTitle: string
    assigneeName: string
    assigneeEmail: string
}

export type EmailJobData = WelcomeEmailJob | TaskAssignedJob