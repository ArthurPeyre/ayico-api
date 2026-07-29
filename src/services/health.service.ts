import { pingDatabase } from "../models/health.model";

export async function getApiHealth() {
    return { status: "ok" as const };
}

export async function getDatabaseHealth() {
    try {
        await pingDatabase();
        return { status: "ok" as const };
    } catch {
        return { status: "unreachable" as const };
    }
}
