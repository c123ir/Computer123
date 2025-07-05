import { Form, FormField } from '../types';

export class PreviewService {
  /**
   * تولید پیش‌نمایش فرم
   */
  static generateFormPreview(form: Form): string {
    // تولید HTML پیش‌نمایش ساده
    let html = `<div class="form-preview">`;
    html += `<h2>${form.name}</h2>`;
    
    if (form.description) {
      html += `<p>${form.description}</p>`;
    }

    form.fields.forEach(field => {
      html += this.generateFieldPreview(field);
    });

    html += `<button type="submit">${form.settings.submitButtonText || 'ارسال'}</button>`;
    html += `</div>`;

    return html;
  }

  /**
   * تولید پیش‌نمایش فیلد
   */
  private static generateFieldPreview(field: FormField): string {
    let html = `<div class="field-preview">`;
    html += `<label>${field.label}${field.required ? ' *' : ''}</label>`;
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        html += `<input type="${field.type}" placeholder="${field.placeholder || ''}" />`;
        break;
        
      case 'textarea':
        html += `<textarea placeholder="${field.placeholder || ''}"></textarea>`;
        break;
        
      case 'number':
        html += `<input type="number" />`;
        break;
        
      case 'select':
        html += `<select>`;
        field.options?.forEach(option => {
          html += `<option value="${option.value}">${option.label}</option>`;
        });
        html += `</select>`;
        break;

      case 'radio':
        field.options?.forEach(option => {
          html += `<label><input type="radio" name="${field.id}" value="${option.value}" /> ${option.label}</label>`;
        });
        break;
        
      case 'checkbox':
        field.options?.forEach(option => {
          html += `<label><input type="checkbox" value="${option.value}" /> ${option.label}</label>`;
        });
        break;
        
      case 'date':
        html += `<input type="date" />`;
        break;
        
      case 'time':
        html += `<input type="time" />`;
        break;
        
      case 'datetime':
        html += `<input type="datetime-local" />`;
        break;
        
      case 'file':
        html += `<input type="file" accept="${field.validation.fileTypes?.join(',') || '*'}" />`;
        break;
        
      case 'signature':
        html += `<div class="signature-pad"></div>`;
        break;
        
      case 'rating':
        html += `<div class="rating-stars">`;
        for (let i = 1; i <= (field.fieldSettings?.maxRating || 5); i++) {
          html += `<span class="star">★</span>`;
        }
        html += `</div>`;
        break;
        
      case 'slider':
        html += `<input type="range" min="${field.fieldSettings?.min || 0}" max="${field.fieldSettings?.max || 100}" step="${field.fieldSettings?.step || 1}" />`;
        break;
        
      default:
        html += `<div>[${field.type} field]</div>`;
    }
    
    if (field.description) {
      html += `<small>${field.description}</small>`;
    }
    
    html += `</div>`;
    return html;
  }
} 