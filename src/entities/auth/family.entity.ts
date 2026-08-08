export interface FamilyData {
    id: number | null;
    name: string | null;
}

// Force par le typage a rester synchronise avec FamilyData: si un champ est
// ajoute/retire de l'interface, ceci ne compile plus tant que la liste n'est pas mise a jour.
const FAMILY_COLUMNS_MAP: Record<keyof FamilyData, true> = {
    id: true,
    name: true,
};
export const FAMILY_COLUMNS = Object.keys(FAMILY_COLUMNS_MAP) as (keyof FamilyData)[];

type OptionalFields = "id";
type FamilyInput = Omit<FamilyData, OptionalFields> &
    Partial<Pick<FamilyData, OptionalFields>>;

// Champs jamais fournis a l'INSERT car generes par Postgres (SERIAL).
const DB_GENERATED_COLUMNS = ["id"] as const satisfies readonly (keyof FamilyData)[];

export const INSERTABLE_FAMILY_COLUMNS = FAMILY_COLUMNS.filter(
    (column) => !(DB_GENERATED_COLUMNS as readonly string[]).includes(column),
) as (keyof Omit<FamilyData, (typeof DB_GENERATED_COLUMNS)[number]>)[];

export class FamilyEntity implements FamilyData {
    id: FamilyData["id"];
    name: FamilyData["name"];

    constructor(data: FamilyInput) {
        this.id = data.id ?? null;
        this.name = data.name ?? null;
    }
}
