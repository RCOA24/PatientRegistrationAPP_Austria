import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';
import { PatientFormComponent } from '../../components/patient-form/patient-form.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, PatientFormComponent],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Patient Registry</h1>
        <button *ngIf="!showForm()" (click)="startCreate()" class="btn-primary">
          + New Patient
        </button>
      </div>

      <!-- Form Section -->
      <div *ngIf="showForm()" class="mb-8">
        <app-patient-form 
          [patientData]="selectedPatient()"
          (formSubmit)="handleFormSubmit($event)"
          (formCancel)="cancelForm()">
        </app-patient-form>
      </div>

      <!-- List Section -->
      <div class="bg-white rounded-lg shadow overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient No</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let p of patients()" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ p.patientNo || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ p.lastName }}, {{ p.firstName }} {{ p.suffixName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ p.gender }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ p.birthDate | date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button (click)="selectForEdit(p)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                <button (click)="deletePatient(p.id!)" class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
            <tr *ngIf="patients().length === 0">
                 <td colspan="5" class="px-6 py-4 text-center text-gray-500">No patients found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PatientsComponent {
  private patientService = inject(PatientService);
  
  // Using Signals for reactivity (Angular 16+)
  patients = signal<Patient[]>([]);
  selectedPatient = signal<Patient | null>(null);
  showForm = signal<boolean>(false);

  constructor() {
    this.refreshList();
  }

  refreshList() {
    this.patientService.getAll().subscribe({
      next: (data) => this.patients.set(data),
      error: (err) => console.error('Error fetching patients', err)
    });
  }

  startCreate() {
    this.selectedPatient.set(null);
    this.showForm.set(true);
  }

  selectForEdit(patient: Patient) {
    this.selectedPatient.set(patient);
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
    this.selectedPatient.set(null);
  }

  handleFormSubmit(patient: Patient) {
    if (patient.id) {
      // Update
      this.patientService.update(patient.id, patient).subscribe(() => {
        this.refreshList();
        this.cancelForm();
      });
    } else {
      // Create
      this.patientService.create(patient).subscribe(() => {
        this.refreshList();
        this.cancelForm();
      });
    }
  }

  deletePatient(id: number) {
    if(confirm('Are you sure you want to delete this patient record?')) {
      this.patientService.delete(id).subscribe(() => {
        this.refreshList();
      });
    }
  }
}
