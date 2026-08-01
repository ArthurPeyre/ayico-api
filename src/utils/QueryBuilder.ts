const ORDER_DIRECTIONS = ["ASC", "DESC"] as const;
const MAX_LIMIT = 100;

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
    const values: unknown[] = [];
    let text = `SELECT * FROM ${table}`;

    const assertKnownColumn = (column: string) => {
        if (!allowedColumns.includes(column as keyof T & string)) {
            throw new Error(`Unknown column "${column}" for table "${table}"`);
        }
    };

    const whereEntries = Object.entries(where ?? {}).filter(
        ([, value]) => value !== undefined,
    );

    if (whereEntries.length > 0) {
        const clauses = whereEntries.map(([column, value]) => {
            assertKnownColumn(column);
            values.push(value);
            return `${column} = $${values.length}`;
        });
        text += ` WHERE ${clauses.join(" AND ")}`;
    }

    if (orderBy) {
        assertKnownColumn(orderBy.column);
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
