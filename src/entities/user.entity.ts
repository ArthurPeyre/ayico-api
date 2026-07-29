type GeneratedFields = "id" | "createdAt";
type UserInput = Omit<User, GeneratedFields> & Partial<Pick<User, GeneratedFields>>;

export class User {
    id: number | null;
    email: string;
    name: string;
    password: string;
    createdAt: Date | null;

    constructor(data: UserInput) {
        this.id = data.id ?? null;
        this.email = data.email;
        this.name = data.name;
        this.password = data.password
        this.createdAt = data.createdAt ?? null;
    }
}
