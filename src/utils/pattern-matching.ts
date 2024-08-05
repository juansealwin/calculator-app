export const enumMatch = <T extends string>(value: T) => <R>(cases: Record<T, R>): R => cases[value]

export const letIn = <E, R>(value: E, lambda: (value: E) => R): R => lambda(value)
