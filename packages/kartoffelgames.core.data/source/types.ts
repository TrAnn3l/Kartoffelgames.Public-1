// Object path.
export type ObjectFieldPath = Array<ObjectFieldPathPart>;
export type ObjectFieldPathPart = string | number | symbol;

// Writeable types.
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type Readonly<T> = { +readonly [P in keyof T]: T[P] };