import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card bg-white p-8 animate-fade-in">
      <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">{{ isEditMode ? 'Update Patient Record' : 'New Patient Registration' }}</h2>
          <p class="text-slate-500 text-sm mt-1">
             {{ isEditMode ? 'Modify existing patient details below.' : 'Enter the details to register a new patient.' }}
          </p>
        </div>
        <div class="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
           </svg>
        </div>
      </div>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="space-y-8">
            <!-- PII Section -->
            <section>
                <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span class="w-8 h-[1px] bg-slate-200"></span> Personal Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <!-- First Name -->
                    <div class="form-group md:col-span-4">
                        <label class="form-label">First Name <span class="text-red-500">*</span></label>
                        <input type="text" formControlName="firstName" class="form-input" placeholder="e.g. John" />
                        <div class="h-4">
                            <span *ngIf="hasError('firstName', 'required')" class="form-error">Required</span>
                            <span *ngIf="hasError('firstName', 'maxlength')" class="form-error">Max 50 chars</span>
                        </div>
                    </div>

                    <!-- Middle Name -->
                    <div class="form-group md:col-span-3">
                        <label class="form-label">Middle Name</label>
                        <input type="text" formControlName="middleName" class="form-input" placeholder="e.g. Quincy" />
                           <div class="h-4">
                              <span *ngIf="hasError('middleName', 'maxlength')" class="form-error">Max 50 chars</span>
                           </div>
                    </div>

                    <!-- Last Name -->
                    <div class="form-group md:col-span-4">
                        <label class="form-label">Last Name <span class="text-red-500">*</span></label>
                        <input type="text" formControlName="lastName" class="form-input" placeholder="e.g. Doe" />
                        <div class="h-4">
                            <span *ngIf="hasError('lastName', 'required')" class="form-error">Required</span>
                            <span *ngIf="hasError('lastName', 'maxlength')" class="form-error">Max 50 chars</span>
                        </div>
                    </div>

                    <!-- Suffix -->
                    <div class="form-group md:col-span-1">
                        <label class="form-label">Suffix</label>
                        <input type="text" formControlName="suffixName" class="form-input" placeholder="Jr." />
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <!-- DOB -->
                    <div class="form-group">
                        <label class="form-label">Date of Birth <span class="text-red-500">*</span></label>
                        <input type="date" formControlName="birthDate" class="form-input" />
                        <div class="h-4">
                            <span *ngIf="hasError('birthDate', 'required')" class="form-error">Required</span>
                             <span *ngIf="form.get('birthDate')?.hasError('futureDate')" class="form-error">Cannot be in future</span>
                        </div>
                    </div>
                    
                    <!-- Gender -->
                    <div class="form-group">
                        <label class="form-label">Gender <span class="text-red-500">*</span></label>
                        <select formControlName="gender" class="form-input cursor-pointer">
                            <option value="" disabled>Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                         <div class="h-4">
                            <span *ngIf="hasError('gender', 'required')" class="form-error">Required</span>
                        </div>
                    </div>
                </div>
            </section>

             <!-- Medical Section -->
             <section>
                 <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span class="w-8 h-[1px] bg-slate-200"></span> Medical Information
                 </h3>
                 <div class="form-group">
                    <label class="form-label">Initial Diagnosis / Notes <span class="text-red-500">*</span></label>
                    <textarea formControlName="initialDiagnosis" rows="4" class="form-input resize-none" placeholder="Enter patient's primary complaint or medical notes..."></textarea>
                     <div class="h-4">
                          <span *ngIf="hasError('initialDiagnosis', 'required')" class="form-error">Required</span>
                           <span *ngIf="hasError('initialDiagnosis', 'maxlength')" class="form-error">Max 500 chars</span>
                     </div>
                 </div>
             </section>

             <!-- Actions -->
             <div class="pt-6 border-t border-slate-100 flex justify-end gap-3">
                 <button type="button" (click)="onCancel()" class="btn-secondary">
                    Cancel
                 </button>
                 <button type="submit" [disabled]="form.invalid || form.pristine" class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                     <svg *ngIf="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                     </svg>
                     <!-- Spinner when submitting could go here -->
                     {{ isEditMode ? 'Update Record' : 'Register Patient' }}
                 </button>
             </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PatientFormComponent implements OnChanges {
  @Input() patientData: Patient | null = null;
  @Output() formSubmit = new EventEmitter<Patient>();
  @Output() formCancel = new EventEmitter<void>();

  isSubmitting = false; // Mocking loading state for now if needed

  private fb = inject(FormBuilder);
  
  form: FormGroup = this.fb.group({
    id: [null],
    patientNo: [null], // Preserve patientNo if editing
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    middleName: ['', [Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    suffixName: ['', [Validators.maxLength(10)]],
    birthDate: ['', [Validators.required, this.futureDateValidator]],
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
        this.form.reset({
            gender: '' 
        });
    }
  }

  onSubmit() {
    if (this.form.valid) {
        this.isSubmitting = true;
        this.formSubmit.emit(this.form.value);
        // Reset submmitting in parent or after some time, but component usually gets destroyed or hidden.
        setTimeout(() => this.isSubmitting = false, 2000); 
    } else {
        this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control?.hasError(errorName) && (control?.touched || control?.dirty));
  }

  futureDateValidator(control: any) {
    if (control.value) {
        const date = new Date(control.value);
        const today = new Date();
        if (date > today) {
            return { futureDate: true };
        }
    }
    return null;
  }
}
