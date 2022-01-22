import { expect } from 'chai';
import { ChangeDetection } from '../../../source/change_detection/change-detection';
import { ExecutionZone } from '../../../source/change_detection/execution_zone/execution-zone';
import { Patcher } from '../../../source/change_detection/execution_zone/patcher/patcher';
import '../../mock/request-animation-frame-mock-session';

describe('ExecutionZone', () => {
   it('Static Mehod: ExecutionZone', () => {
      // Process.
      ExecutionZone.initialize();
      const lIsPatched: boolean = (<any>Patcher).mIsPatched;

      // Evaluation.
      expect(lIsPatched).to.be.true;
   });

   it('Static Property: current', () => {
      // Process.
      const lCurrentZone: ExecutionZone = ExecutionZone.current;

      // Evaluation.
      expect(lCurrentZone.name).to.equal('Default');
   });

   it('Property: name', () => {
      // Setup.
      const lZoneName: string = 'ZoneName';
      const lZone: ExecutionZone = new ExecutionZone(lZoneName);

      // Process.
      const lNameResult: string = lZone.name;

      // Evaluation.
      expect(lNameResult).to.equal(lZoneName);
   });

   describe('Property: onError', () => {
      it('-- Set value', () => {
         // Setup.
         const lOnError = (): void => { /* Empty */ };
         const lZone: ExecutionZone = new ExecutionZone('Name');

         // Process.
         lZone.onError = lOnError;
         const lOnErrorResult = lZone.onError;

         // Evaluation.
         expect(lOnErrorResult).to.equal(lOnError);
      });

      it('-- Empty value', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('Name');

         // Process.
         const lOnErrorResult = lZone.onError;

         // Evaluation.
         expect(lOnErrorResult).to.be.null;
      });
   });

   describe('Property: onInteraction', () => {
      it('-- Set value', () => {
         // Setup.
         const lOnInteraction = (): void => { /* Empty */ };
         const lZone: ExecutionZone = new ExecutionZone('Name');

         // Process.
         lZone.onInteraction = lOnInteraction;
         const lOnInteractionResult = lZone.onInteraction;

         // Evaluation.
         expect(lOnInteraction).to.equal(lOnInteractionResult);
      });

      it('-- Empty value', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('Name');

         // Process.
         const lOnInteractionResult = lZone.onInteraction;

         // Evaluation.
         expect(lOnInteractionResult).to.be.null;
      });
   });

   describe('Method: executeInZone', () => {
      it('-- Execute inside zone', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);

         // Process.
         let lZoneNameResult: string;
         lZone.executeInZone(() => {
            lZoneNameResult = ExecutionZone.current.name;
         });

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
      });

      it('-- Execute inside zone with parameter', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('Name');
         const lExecutionResult: string = 'ExecutionResult';

         // Process.
         const lResult: string = lZone.executeInZone((pParameter: string) => {
            return pParameter;
         }, lExecutionResult);

         // Evaluation.
         expect(lResult).to.equal(lExecutionResult);
      });

      it('-- Execute inside zone with error', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);
         const lError: string = 'ErrorName';

         // Process.
         let lZoneNameResult: string;
         let lErrorResult: string;
         try {
            lZone.executeInZone(() => {
               lZoneNameResult = ExecutionZone.current.name;
               throw lError;
            });
         } catch (pError) {
            lErrorResult = pError;
         }

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
         expect(lErrorResult).to.equal(lError);
      });

      it('-- Execute inside zone with error', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);

         // Process.
         let lZoneNameResultFunktion: string;
         let lZoneNameResultException: string;
         const lZoneNameResultBefore = ExecutionZone.current.name;
         try {
            lZone.executeInZone(() => {
               lZoneNameResultFunktion = ExecutionZone.current.name;
               throw '';
            });
         } catch (pError) {
            lZoneNameResultException = ExecutionZone.current.name;
         }
         const lZoneNameResultAfter = ExecutionZone.current.name;

         // Evaluation.
         expect(lZoneNameResultBefore).to.equal('Default');
         expect(lZoneNameResultFunktion).to.equal(lZoneName);
         expect(lZoneNameResultException).to.equal('Default');
         expect(lZoneNameResultAfter).to.equal('Default');
      });

      it('-- Check interaction callback', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);
         const lFunction = () => { /* Empty */ };

         // Process.
         let lZoneNameResult: string;
         let lExecutedFunction: any;
         lZone.onInteraction = (pZoneName: string, pFunction: (...pArgs: Array<any>) => any, pStacktrace: string) => {
            lZoneNameResult = pZoneName;
            lExecutedFunction = pFunction;
         };
         lZone.executeInZone(lFunction);

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
         expect(lExecutedFunction).to.equal(lFunction);
      });

      it('-- Check error callback', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('ZoneName');
         const lError: string = 'ErrorName';

         // Process.
         let lErrorResult: string;
         lZone.onError = (pError: string) => {
            lErrorResult = pError;
         };
         try {
            lZone.executeInZone(() => { throw lError; });
         } catch (_pError) {/* Empty */ }

         // Evaluation.
         expect(lErrorResult).to.equal(lError);
      });
   });

   describe('Method: executeInZoneSilent', () => {
      it('-- Execute inside zone', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);

         // Process.
         let lZoneNameResult: string;
         lZone.executeInZoneSilent(() => {
            lZoneNameResult = ExecutionZone.current.name;
         });

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
      });

      it('-- Execute inside zone with parameter', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('Name');
         const lExecutionResult: string = 'ExecutionResult';

         // Process.
         const lResult: string = lZone.executeInZoneSilent((pParameter: string) => {
            return pParameter;
         }, lExecutionResult);

         // Evaluation.
         expect(lResult).to.equal(lExecutionResult);
      });

      it('-- Execute inside zone with error', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);
         const lError: string = 'ErrorName';

         // Process.
         let lZoneNameResult: string;
         let lErrorResult: string;
         try {
            lZone.executeInZoneSilent(() => {
               lZoneNameResult = ExecutionZone.current.name;
               throw lError;
            });
         } catch (pError) {
            lErrorResult = pError;
         }

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
         expect(lErrorResult).to.equal(lError);
      });

      it('-- Execute inside zone with error', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);

         // Process.
         let lZoneNameResultFunktion: string;
         let lZoneNameResultException: string;
         const lZoneNameResultBefore = ExecutionZone.current.name;
         try {
            lZone.executeInZoneSilent(() => {
               lZoneNameResultFunktion = ExecutionZone.current.name;
               throw '';
            });
         } catch (pError) {
            lZoneNameResultException = ExecutionZone.current.name;
         }
         const lZoneNameResultAfter = ExecutionZone.current.name;

         // Evaluation.
         expect(lZoneNameResultBefore).to.equal('Default');
         expect(lZoneNameResultFunktion).to.equal(lZoneName);
         expect(lZoneNameResultException).to.equal('Default');
         expect(lZoneNameResultAfter).to.equal('Default');
      });

      it('-- Check interaction callback', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('ZoneName');

         // Process.
         let lInteractionCallbackCalled: boolean = false;
         lZone.onInteraction = () => {
            lInteractionCallbackCalled = true;
         };
         lZone.executeInZoneSilent(() => { /* Empty */ });

         // Evaluation.
         expect(lInteractionCallbackCalled).to.be.false;
      });

      it('-- Check error callback', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('ZoneName');
         const lError: string = 'ErrorName';

         // Process.
         let lErrorResult: string;
         lZone.onError = (pError: string) => {
            lErrorResult = pError;
         };
         try {
            lZone.executeInZoneSilent(() => { throw lError; });
         } catch (_pError) {/* Empty */ }

         // Evaluation.
         expect(lErrorResult).to.equal(lError);
      });
   });

   it('Method: getZoneData', () => {
      // Setup. Initialize values.     
      const lKey: string = 'DataKey';
      const lValue: string = 'DataValue';
      const lZone: ExecutionZone = new ExecutionZone('ZoneName');

      // Setup. Add zone data.
      lZone.setZoneData(lKey, lValue);

      // Process.
      const lValueResult: string = lZone.getZoneData(lKey);

      // Evaluation.
      expect(lValueResult).to.equal(lValue);
   });

   it('Method: setZoneData', () => {
      // Setup. Initialize values.     
      const lKey: string = 'DataKey';
      const lValue: string = 'DataValue';
      const lZone: ExecutionZone = new ExecutionZone('ZoneName');

      // Process.
      lZone.setZoneData(lKey, lValue);
      const lValueResult: string = lZone.getZoneData(lKey);

      // Evaluation.
      expect(lValueResult).to.equal(lValue);
   });

   it('Funcionality: ChangeDetection.Silent', () => {
      // Setup.
      const lChangeDetection = new ChangeDetection('Name', null, true);
      const lZone: ExecutionZone = (<any>lChangeDetection).mExecutionZone

      // Setup. Interaction callback
      let lInteractionCallbackCalled: boolean = false;
      lZone.onInteraction = () => {
         lInteractionCallbackCalled = true;
      };

      // Process
      lChangeDetection.execute(() => {
         lZone.executeInZone(() => { /* Empty */ });
      });

      // Evaluation.
      expect(lInteractionCallbackCalled).to.be.false;
   });
});