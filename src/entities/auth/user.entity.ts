import bcrypt from "bcrypt";
import { CreateUserData } from "../../dto/auth/user.dto";

const SALT_ROUNDS = 10;

export interface UserData {
    id: number | null;
    email: string;
    name: string;
    password_hash: string;
    created_at: Date | null;
    family_id: number | null;
}

// Force par le typage a rester synchronise avec UserData: si un champ est
// ajoute/retire de l'interface, ceci ne compile plus tant que la liste n'est pas mise a jour.
const USER_COLUMNS_MAP: Record<keyof UserData, true> = {
    id: true,
    email: true,
    name: true,
    password_hash: true,
    created_at: true,
    family_id: true,
};
export const USER_COLUMNS = Object.keys(USER_COLUMNS_MAP) as (keyof UserData)[];

// Champs sensibles, jamais filtrables/triables (ex: sonder l'existence d'un hash via where).
// Seule source de verite: le type FilterableUserData en est directement derive ci-dessous.
const SENSITIVE_COLUMNS = [
    "password_hash",
] as const satisfies readonly (keyof UserData)[];

export type FilterableUserData = Omit<
    UserData,
    (typeof SENSITIVE_COLUMNS)[number]
>;

export const FILTERABLE_USER_COLUMNS = USER_COLUMNS.filter(
    (column) => !(SENSITIVE_COLUMNS as readonly string[]).includes(column),
) as (keyof FilterableUserData)[];

// Champs facultatifs a la construction: soit generes par la DB (id, created_at),
// soit simplement optionnels (family_id, absent tant que l'utilisateur n'a pas de famille).
type OptionalFields = "id" | "created_at" | "family_id";
type UserInput = Omit<UserData, OptionalFields> &
    Partial<Pick<UserData, OptionalFields>>;

export class UserEntity implements UserData {
    id: UserData["id"];
    email: UserData["email"];
    name: UserData["name"];
    password_hash: UserData["password_hash"];
    created_at: UserData["created_at"];
    family_id: UserData["family_id"];

    constructor(data: UserInput) {
        this.id = data.id ?? null;
        this.email = data.email;
        this.name = data.name;
        this.password_hash = data.password_hash;
        this.created_at = data.created_at ?? null;
        this.family_id = data.family_id ?? null;
    }

    static async create(data: CreateUserData): Promise<UserEntity> {
        const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);
        return new UserEntity({
            email: data.email,
            name: data.name,
            password_hash,
            family_id: data.family_id,
        });
    }

    verifyPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password_hash);
    }

    toJSON() {
        const { password_hash, ...safe } = this;
        return safe;
    }
}
