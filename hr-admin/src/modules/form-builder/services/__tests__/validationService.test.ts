import { ValidationService } from '../validationService';
import { FormField, ValidationResult } from '../../types';

describe('ValidationService', () => {
  describe('validateField', () => {
    it('should validate required fields', () => {
      const field: FormField = {
        id: 'test',
        type: 'text',
        label: 'Test Field',
        required: false,
        disabled: false,
        readonly: false,
        validation: {
          required: true
        },
        styling: {
          width: '100%'
        }
      };

      const result = ValidationService.validateField(field, '');
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe('required');
    });

    it('should validate email format', () => {
      const field: FormField = {
        id: 'email',
        type: 'email',
        label: 'Email',
        required: false,
        disabled: false,
        readonly: false,
        validation: {},
        styling: {
          width: '100%'
        }
      };

      const invalidResult = ValidationService.validateField(field, 'invalid-email');
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors[0].type).toBe('email');

      const validResult = ValidationService.validateField(field, 'test@example.com');
      expect(validResult.isValid).toBe(true);
    });
  });

  describe('validateBatch', () => {
    it('should validate multiple fields', () => {
      const fields: FormField[] = [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          required: false,
          disabled: false,
          readonly: false,
          validation: {
            required: true
          },
          styling: {
            width: '100%'
          }
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          required: false,
          disabled: false,
          readonly: false,
          validation: {
            required: true
          },
          styling: {
            width: '100%'
          }
        }
      ];

      const data = {
        name: '',
        email: 'invalid-email'
      };

      const result = ValidationService.validateBatch(fields, data);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(2);
    });

    it('should stop on first error when stopOnFirst is true', () => {
      const fields: FormField[] = [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          required: false,
          disabled: false,
          readonly: false,
          validation: {
            required: true
          },
          styling: {
            width: '100%'
          }
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          required: false,
          disabled: false,
          readonly: false,
          validation: {
            required: true
          },
          styling: {
            width: '100%'
          }
        }
      ];

      const data = {
        name: '',
        email: 'invalid-email'
      };

      const result = ValidationService.validateBatch(fields, data, { stopOnFirst: true });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(1);
    });
  });
}); 