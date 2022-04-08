import { InjectMode } from '../enum/inject-mode';
import { ReflectInitializer } from '../reflect/reflect-initializer';
import { InjectionConstructor } from '../type';
import { Injection } from '../injection/injection';

ReflectInitializer.initialize();

/**
 * AtScript.
 * Mark class to be injectable as an instanced object.
 * @param pConstructor - Constructor.
 */
export function Injectable(pConstructor: InjectionConstructor): void {
    Injection.registerInjectable(pConstructor, InjectMode.Instanced);
}