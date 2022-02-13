import { ExpressionModule } from '../module/base/expression-module';
import { MultiplicatorModule } from '../module/base/multiplicator-module';
import { MultiplicatorResult } from '../module/base/result/multiplicator-result';
import { StaticModule } from '../module/base/static-module';

// Base.
export interface IPwbModuleObject<TResult> extends IPwbModuleOnUpdate<TResult>, IPwbModuleOnDeconstruct { }
export interface IPwbModuleClass<TResult> {
    new(): IPwbModuleObject<TResult>;
}

// Expression.
export interface IPwbExpressionModuleObject extends IPwbModuleObject<string> { }
export interface IPwbExpressionModuleClass extends IPwbModuleClass<string> { }
export interface IPwbExpressionModuleOnUpdate extends IPwbModuleOnUpdate<string> { }

// Static.
export interface IPwbStaticModuleObject extends IPwbModuleObject<boolean> { }
export interface IPwbStaticModuleClass extends IPwbModuleClass<boolean> { }
export interface IPwbStaticModuleOnUpdate extends IPwbModuleOnUpdate<boolean> { }

// Multiplicator.
export interface IPwbMultiplicatorModuleObject extends IPwbModuleObject<MultiplicatorResult> { }
export interface IPwbMultiplicatorModuleClass extends IPwbModuleClass<MultiplicatorResult> { }
export interface IPwbMultiplicatorModuleOnUpdate extends IPwbModuleOnUpdate<MultiplicatorResult> { }

export interface IPwbModuleOnUpdate<TResult> {
    /**
     * Called on update.
     */
    onUpdate(): TResult;
}

export interface IPwbModuleOnDeconstruct {
    /**
     * Cleanup events and other data that does not delete itself.
     */
    onDeconstruct(): void;
}

