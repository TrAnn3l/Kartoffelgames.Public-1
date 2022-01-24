import { InjectMode } from '../enum/inject-mode';
import { ReflectInitializer } from '../reflect/reflect-initializer';
import { InjectionConstructor } from '../type';
import { InjectionRegister } from './injection-register';

ReflectInitializer.initialize();

/**
 * AtScript.
 * Mark class to be injectable as an instanced object.
 * @param pConstructor - Constructor.
 */
export function Injectable(pConstructor: InjectionConstructor): void {
    InjectionRegister.registerInjectable(pConstructor, InjectMode.Instanced);
}