import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

interface UserData {
    id: number | null;
    email: string;
    name: string;
    password_hash: string;
    created_at: Date | null;
}

type GeneratedFields = "id" | "created_at";
type UserInput = Omit<UserData, GeneratedFields> &
    Partial<Pick<UserData, GeneratedFields>>;

export class UserEntity implements UserData {
    id: number | null;
    email: string;
    name: string;
    password_hash: string;
    created_at: Date | null;

    constructor(data: UserInput) {
        this.id = data.id ?? null;
        this.email = data.email;
        this.name = data.name;
        this.password_hash = data.password_hash;
        this.created_at = data.created_at ?? null;
    }

    static async create(data: {
        email: string;
        name: string;
        password: string;
    }): Promise<UserEntity> {
        const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);
        return new UserEntity({ email: data.email, name: data.name, password_hash });
    }

    verifyPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password_hash);
    }
}
