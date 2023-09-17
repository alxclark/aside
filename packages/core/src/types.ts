export type SetStateAction<T> = T | ((prevState: T) => T);
