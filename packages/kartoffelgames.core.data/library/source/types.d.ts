export declare type ObjectFieldPath = Array<ObjectFieldPathPart>;
export declare type ObjectFieldPathPart = string | number | symbol;
export declare type Writeable<T> = {
    -readonly [P in keyof T]: T[P];
};
export declare type Readonly<T> = {
    +readonly [P in keyof T]: T[P];
};
//# sourceMappingURL=types.d.ts.map