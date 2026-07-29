import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

interface UserData {
    id: number | null;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: Date | null;
}

type GeneratedFields = "id" | "createdAt";
type UserInput = Omit<UserData, GeneratedFields> &
    Partial<Pick<UserData, GeneratedFields>>;

export class User implements UserData {
    id: number | null;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: Date | null;

    constructor(data: UserInput) {
        this.id = data.id ?? null;
        this.email = data.email;
        this.name = data.name;
        this.passwordHash = data.passwordHash;
        this.createdAt = data.createdAt ?? null;
    }

    static async create(data: {
        email: string;
        name: string;
        password: string;
    }): Promise<User> {
        const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
        return new User({ email: data.email, name: data.name, passwordHash });
    }

    verifyPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.passwordHash);
    }
}
