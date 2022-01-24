import { InjectMode } from '../enum/inject-mode';
import { ReflectInitializer } from '../reflect/reflect-initializer';
import { InjectionConstructor } from '../type';
import { InjectionRegister } from './injection-register';

ReflectInitializer.initialize();

/**
 * AtScript.
 * Mark class to be injectable as an singleton object.
 * @param pConstructor - Constructor.
 */
export function InjectableSingleton(pConstructor: InjectionConstructor): void {
    InjectionRegister.registerInjectable(pConstructor, InjectMode.Singleton);
}