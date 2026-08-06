import { Worker, Job } from "bullmq"
import redis from "../db/redis.js"
import type { EmailJobData, WelcomeEmailJob, TaskAssignedJob } from "./jobs.types.js"

const processJob = async (job: Job<EmailJobData>) => {
    console.log(`Processing job: ${job.name}`, job.data)

    if (job.name === "welcome-email") {
        const data = job.data as WelcomeEmailJob

        console.log(`Sending welcome email to ${data.email}`)
    }

    if(job.name === "task-assigned") {
        const data = job.data as TaskAssignedJob
        console.log(`Notifying ${data.assigneeEmail} about task: ${data.taskTitle}`)
    }
}

export const emailWorker = new Worker("email", processJob, {
    connection: redis
})

emailWorker.on("completed", (job) => console.log(`Job ${job.id} completed`))
emailWorker.on("failed", (job, err) => console.error(`Job ${job?.id} failed: ${err}`))