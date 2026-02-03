import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Update' : 'Register' }} Patient</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Name Fields -->
        <div>
          <label class="block text-sm font-medium text-gray-700">First Name</label>
          <input type="text" formControlName="firstName" class="form-input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Middle Name</label>
          <input type="text" formControlName="middleName" class="form-input" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Last Name</label>
          <input type="text" formControlName="lastName" class="form-input" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Suffix -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Suffix</label>
          <input type="text" formControlName="suffixName" class="form-input" />
        </div>
         <!-- DOB -->
         <div>
          <label class="block text-sm font-medium text-gray-700">Birth Date</label>
          <input type="date" formControlName="birthDate" class="form-input" />
        </div>
        <!-- Gender -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Gender</label>
          <select formControlName="gender" class="form-input">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <!-- Diagnosis -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Initial Diagnosis</label>
        <textarea formControlName="initialDiagnosis" rows="3" class="form-input"></textarea>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <button type="button" (click)="onCancel()" class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" [disabled]="form.invalid" class="btn-primary">
          {{ isEditMode ? 'Save Changes' : 'Register Patient' }}
        </button>
      </div>
    </form>
  `
})
export class PatientFormComponent implements OnChanges {
  @Input() patientData: Patient | null = null;
  @Output() formSubmit = new EventEmitter<Patient>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  
  form: FormGroup = this.fb.group({
    id: [null],
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    middleName: ['', [Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    suffixName: ['', [Validators.maxLength(10)]],
    birthDate: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    initialDiagnosis: ['', [Validators.required, Validators.maxLength(500)]]
  });

  get isEditMode(): boolean {
    return !!this.patientData?.id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientData'] && this.patientData) {
      const formattedDate = this.patientData.birthDate 
        ? new Date(this.patientData.birthDate).toISOString().split('T')[0] 
        : '';
        
      this.form.patchValue({
        ...this.patientData,
        birthDate: formattedDate
      });
    } else {
        this.form.reset();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.getRawValue());
    }
  }

  onCancel() {
    this.form.reset();
    this.formCancel.emit();
  }
}
