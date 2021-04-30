import {Provider} from './Container';

export interface IScopedService<T, P extends Provider> {
    readonly instance: T;

    override(input: (container: P) => T): IScopedService<T, P>;
}