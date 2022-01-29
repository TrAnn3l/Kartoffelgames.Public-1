import { InjectMode } from '../enum/inject-mode';
import { Injection } from '../injection/injection';
import { ReflectInitializer } from '../reflect/reflect-initializer';
import { InjectionConstructor } from '../type';

ReflectInitializer.initialize();

/**
 * AtScript.
 * Mark class to be injectable as an singleton object.
 * @param pConstructor - Constructor.
 */
export function InjectableSingletonDecorator(pConstructor: InjectionConstructor): void {
    Injection.registerInjectable(pConstructor, InjectMode.Singleton);
}