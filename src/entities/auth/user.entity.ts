import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export interface UserData {
    id: number | null;
    email: string;
    name: string;
    password_hash: string;
    created_at: Date | null;
}

// Force par le typage a rester synchronise avec UserData: si un champ est
// ajoute/retire de l'interface, ceci ne compile plus tant que la liste n'est pas mise a jour.
const USER_COLUMNS_MAP: Record<keyof UserData, true> = {
    id: true,
    email: true,
    name: true,
    password_hash: true,
    created_at: true,
};
export const USER_COLUMNS = Object.keys(USER_COLUMNS_MAP) as (keyof UserData)[];

type GeneratedFields = "id" | "created_at";
type UserInput = Omit<UserData, GeneratedFields> &
    Partial<Pick<UserData, GeneratedFields>>;

export class UserEntity implements UserData {
    id: UserData["id"];
    email: UserData["email"];
    name: UserData["name"];
    password_hash: UserData["password_hash"];
    created_at: UserData["created_at"];

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

    toJSON() {
        const { password_hash, ...safe } = this;
        return safe;
    }
}
