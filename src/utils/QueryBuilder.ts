const ORDER_DIRECTIONS = ["ASC", "DESC"] as const;
const MAX_LIMIT = 100;

export type WhereInput<T> = { [K in keyof T]?: T[K] | T[K][] };

function buildWhereClause<T>(
    table: string,
    allowedColumns: readonly (keyof T & string)[],
    where: WhereInput<T> | undefined,
): { clause: string; values: unknown[] } {
    const values: unknown[] = [];

    const entries = Object.entries(where ?? {}).filter(
        ([, value]) => value !== undefined,
    );

    if (entries.length === 0) {
        return { clause: "", values };
    }

    const clauses = entries.map(([column, value]) => {
        if (!allowedColumns.includes(column as keyof T & string)) {
            throw new Error(`Unknown column "${column}" for table "${table}"`);
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                throw new Error(
                    `Empty array for column "${column}" would match no rows`,
                );
            }
            const placeholders = value.map((item) => {
                values.push(item);
                return `$${values.length}`;
            });
            return `${column} IN (${placeholders.join(", ")})`;
        }

        values.push(value);
        return `${column} = $${values.length}`;
    });

    return { clause: ` WHERE ${clauses.join(" AND ")}`, values };
}

interface BuildSelectOptions<T> {
    where?: WhereInput<T>;
    orderBy?: { column: keyof T & string; direction?: "ASC" | "DESC" };
    limit?: number;
    offset?: number;
}

export function buildSelectQuery<T>(
    table: string,
    allowedColumns: readonly (keyof T & string)[],
    options: BuildSelectOptions<T> = {},
): { text: string; values: unknown[] } {
    const { where, orderBy, limit, offset } = options;
    const { clause, values } = buildWhereClause(table, allowedColumns, where);
    let text = `SELECT * FROM ${table}${clause}`;

    if (orderBy) {
        if (!allowedColumns.includes(orderBy.column)) {
            throw new Error(
                `Unknown column "${orderBy.column}" for table "${table}"`,
            );
        }
        const direction = orderBy.direction ?? "ASC";
        if (!ORDER_DIRECTIONS.includes(direction)) {
            throw new Error(`Invalid order direction "${direction}"`);
        }
        text += ` ORDER BY ${orderBy.column} ${direction}`;
    }

    if (limit !== undefined) {
        if (limit > MAX_LIMIT) {
            throw new Error(
                `Limit ${limit} exceeds maximum allowed (${MAX_LIMIT})`,
            );
        }
        values.push(limit);
        text += ` LIMIT $${values.length}`;
    }

    if (offset !== undefined) {
        values.push(offset);
        text += ` OFFSET $${values.length}`;
    }

    return { text, values };
}

export function buildInsertQuery<T>(
    table: string,
    allowedColumns: readonly (keyof T & string)[],
    data: Partial<T>,
): { text: string; values: unknown[] } {
    const entries = Object.entries(data).filter(
        ([, value]) => value !== undefined,
    );

    if (entries.length === 0) {
        throw new Error(`Refusing to INSERT into "${table}" with no columns`);
    }

    const columns: string[] = [];
    const values: unknown[] = [];

    entries.forEach(([column, value]) => {
        if (!allowedColumns.includes(column as keyof T & string)) {
            throw new Error(`Unknown column "${column}" for table "${table}"`);
        }
        columns.push(column);
        values.push(value);
    });

    const placeholders = values.map((_, index) => `$${index + 1}`);

    return {
        text: `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`,
        values,
    };
}

export function buildDeleteQuery<T>(
    table: string,
    allowedColumns: readonly (keyof T & string)[],
    where: WhereInput<T>,
): { text: string; values: unknown[] } {
    const { clause, values } = buildWhereClause(table, allowedColumns, where);

    if (!clause) {
        throw new Error(
            `Refusing to DELETE from "${table}" without a WHERE condition`,
        );
    }

    return { text: `DELETE FROM ${table}${clause} RETURNING *`, values };
}
