const ORDER_DIRECTIONS = ["ASC", "DESC"] as const;
const MAX_LIMIT = 100;

function buildWhereClause<T>(
    table: string,
    allowedColumns: readonly (keyof T & string)[],
    where: Partial<T> | undefined,
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
        values.push(value);
        return `${column} = $${values.length}`;
    });

    return { clause: ` WHERE ${clauses.join(" AND ")}`, values };
}

interface BuildSelectOptions<T> {
    where?: Partial<T>;
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

export function buildDeleteQuery<T>(
    table: string,
    allowedColumns: readonly (keyof T & string)[],
    where: Partial<T>,
): { text: string; values: unknown[] } {
    const { clause, values } = buildWhereClause(table, allowedColumns, where);

    if (!clause) {
        throw new Error(
            `Refusing to DELETE from "${table}" without a WHERE condition`,
        );
    }

    return { text: `DELETE FROM ${table}${clause} RETURNING *`, values };
}
