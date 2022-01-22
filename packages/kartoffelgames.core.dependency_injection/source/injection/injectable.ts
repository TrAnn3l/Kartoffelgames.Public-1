import { InjectMode } from '../enum/inject-mode';
import { ReflectInitialiser } from '../reflect/reflect-initialiser';
import { InjectionConstructor } from '../type';
import { InjectionRegister } from './injection-register';

ReflectInitialiser.initialize();

/**
 * AtScript.
 * Mark class to be injectable as an instanced object.
 * @param pConstructor - Constructor.
 */
export function Injectable(pConstructor: InjectionConstructor): void {
    InjectionRegister.registerInjectableObject(pConstructor, InjectMode.Instanced);
}