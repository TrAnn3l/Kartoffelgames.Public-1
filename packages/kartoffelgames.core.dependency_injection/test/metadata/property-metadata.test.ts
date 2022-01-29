import { expect } from 'chai';
import { InjectionConstructor } from '../../source';
import { PropertyMetadata } from '../../source/metadata/property-metadata';

describe('ConstructorMetadata', () => {
    describe('Property: parameterTypes', () => {
        it('-- Read', () => {
            // Setup. Specify values.
            const lParameterTypeList: Array<InjectionConstructor> = [String, Number];
            const lMetadata: PropertyMetadata = new PropertyMetadata();
            lMetadata.parameterTypeList = lParameterTypeList;

            // Process.
            const lResultParameterList: Array<InjectionConstructor> = lMetadata.parameterTypeList;

            // Evaluation.
            expect(lResultParameterList).to.have.ordered.members(lParameterTypeList);
        });

        it('-- Read: No Data', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            const lResultParameterList: Array<InjectionConstructor> = lMetadata.parameterTypeList;

            // Evaluation.
            expect(lResultParameterList).to.be.null;
        });

        it('-- Write', () => {
            // Setup. Specify values.
            const lParameterTypeList: Array<InjectionConstructor> = [String, Number];
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            lMetadata.parameterTypeList = lParameterTypeList;
            const lResultParameterList: Array<InjectionConstructor> = lMetadata.parameterTypeList;

            // Evaluation.
            expect(lResultParameterList).to.have.ordered.members(lParameterTypeList);
        });
    });

    describe('Property: returnType', () => {
        it('-- Read', () => {
            // Setup. Specify values.
            const lReturnType: InjectionConstructor = Number;
            const lMetadata: PropertyMetadata = new PropertyMetadata();
            lMetadata.returnType = lReturnType;

            // Process.
            const lResultReturnType: InjectionConstructor = lMetadata.returnType;

            // Evaluation.
            expect(lResultReturnType).to.equal(lReturnType);
        });

        it('-- Read: No Data', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            const lResultReturnType: InjectionConstructor = lMetadata.returnType;

            // Evaluation.
            expect(lResultReturnType).to.be.null;
        });

        it('-- Write', () => {
            // Setup. Specify values.
            const lReturnType: InjectionConstructor = Number;
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            lMetadata.returnType = lReturnType;
            const lResultReturnType: InjectionConstructor = lMetadata.returnType;

            // Evaluation.
            expect(lResultReturnType).to.equal(lReturnType);
        });
    });

    describe('Property: type', () => {
        it('-- Read', () => {
            // Setup. Specify values.
            const lType: InjectionConstructor = Number;
            const lMetadata: PropertyMetadata = new PropertyMetadata();
            lMetadata.type = lType;

            // Process.
            const lResultType: InjectionConstructor = lMetadata.type;

            // Evaluation.
            expect(lResultType).to.equal(lType);
        });

        it('-- Read: No Data', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            const lResultType: InjectionConstructor = lMetadata.type;

            // Evaluation.
            expect(lResultType).to.be.null;
        });

        it('-- Write', () => {
            // Setup. Specify values.
            const lType: InjectionConstructor = Number;
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            lMetadata.type = lType;
            const lResultType: InjectionConstructor = lMetadata.type;

            // Evaluation.
            expect(lResultType).to.equal(lType);
        });
    });

    describe('Method: getMetadata', () => {
        it('-- Available Metadata', () => {
            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'MetadataValue';
            const lMetadata: PropertyMetadata = new PropertyMetadata();
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);

            // Process.
            const lResultMetadatavalue: string = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.equal(lMetadataValue);
        });

        it('-- Missing Metadata', () => {
            // Setup. Specify values.
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            const lResultMetadatavalue: string = lMetadata.getMetadata('AnyKey');

            // Evaluation.
            expect(lResultMetadatavalue).to.be.null;
        });
    });

    describe('Method: getMetadata', () => {
        it('-- Default', () => {
            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'MetadataValue';
            const lMetadata: PropertyMetadata = new PropertyMetadata();
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);

            // Process.
            const lResultMetadatavalue: string = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.equal(lMetadataValue);
        });

        it('-- Overwrite value', () => {
            // Setup. Specify values.
            const lMetadataKey: string = 'MetadataKey';
            const lMetadataValue: string = 'NewMetadataValue';
            const lMetadata: PropertyMetadata = new PropertyMetadata();

            // Process.
            lMetadata.setMetadata(lMetadataKey, 'OldMetadataValue');
            lMetadata.setMetadata(lMetadataKey, lMetadataValue);
            const lResultMetadatavalue: string = lMetadata.getMetadata(lMetadataKey);

            // Evaluation.
            expect(lResultMetadatavalue).to.equal(lMetadataValue);
        });
    });
});