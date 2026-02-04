import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { NotificationService } from '../../services/notification.service';
import { Patient } from '../../models/patient.model';
import { PatientFormComponent } from '../../components/patient-form/patient-form.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, PatientFormComponent],
  template: `
    <div class="page-container">

      <!-- Header Section -->
      <div class="page-header flex sm:flex-row flex-col sm:items-end justify-between gap-4">
        <div>
           <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Patient Registry</h1>
           <p class="text-sm text-slate-500 mt-1">Manage patient records and registrations.</p>
        </div>
        
        <!-- Quick Action Card (Replaces the raw button) -->
         <div *ngIf="!showForm()" class="bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
            <span class="text-xs font-medium text-slate-500 px-2 hidden sm:block">Quick Actions:</span>
            <button (click)="startCreate()" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Register Patient</span>
            </button>
            <button class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors" title="Export Data">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
               </svg>
            </button>
         </div>
      </div>

      <!-- Main Content Area -->
      <div class="animate-fade-in">
        
        <!-- FORM MODE -->
        <div *ngIf="showForm()">
            <app-patient-form 
              [patientData]="selectedPatient()"
              (formSubmit)="handleFormSubmit($event)"
              (formCancel)="cancelForm()">
            </app-patient-form>
        </div>

        <!-- LIST MODE -->
        <div *ngIf="!showForm()" class="card">
            <!-- Search & Filter Bar -->
            <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div class="relative w-full sm:w-96">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        [(ngModel)]="searchTerm"
                        class="pl-10 form-input bg-white" 
                        placeholder="Search by name or number..." 
                    />
                </div>
                <div class="text-sm text-slate-500">
                    Showing {{ filteredPatients().length }} patients
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
               <table class="min-w-full divide-y divide-slate-200">
                 <thead>
                   <tr>
                     <th class="table-header">Patient No</th>
                     <th class="table-header">Name</th>
                     <th class="table-header">Gender</th>
                     <th class="table-header">Age / DOB</th>
                     <th class="table-header text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody class="bg-white divide-y divide-slate-100">
                   <tr *ngFor="let p of filteredPatients()" class="hover:bg-slate-50 transition-colors cursor-default">
                     <td class="table-cell font-mono text-slate-500">{{ p.patientNo || '---' }}</td>
                     <td class="table-cell">
                        <div class="font-medium text-slate-900">{{ p.lastName }}, {{ p.firstName }} {{ p.middleName ? p.middleName[0] + '.' : '' }}</div>
                        <div class="text-xs text-slate-400">{{ p.initialDiagnosis | slice:0:30 }}{{ p.initialDiagnosis.length > 30 ? '...' : '' }}</div>
                     </td>
                     <td class="table-cell">
                        <span class="badge" 
                            [ngClass]="{
                                'bg-blue-100 text-blue-800': p.gender === 'Male',
                                'bg-pink-100 text-pink-800': p.gender === 'Female',
                                'bg-gray-100 text-gray-800': p.gender === 'Other'
                            }">
                            {{ p.gender }}
                        </span>
                     </td>
                     <td class="table-cell">
                        <div>{{ calculateAge(p.birthDate) }} yrs</div>
                        <div class="text-xs text-slate-400">{{ p.birthDate | date:'mediumDate' }}</div>
                     </td>
                     <td class="table-cell text-right space-x-2">
                        <button (click)="selectForEdit(p)" class="btn-icon text-blue-600 hover:text-blue-800 placeholder-opacity-100 cursor-pointer" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button (click)="initDelete(p)" class="btn-icon text-red-600 hover:text-red-800 cursor-pointer" title="Delete">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                        </button>
                     </td>
                   </tr>
                   <tr *ngIf="isLoading()" class="animate-pulse">
                      <td colspan="5" class="py-12 text-center text-slate-400">
                          Loading records...
                      </td>
                   </tr>
                   <tr *ngIf="!isLoading() && filteredPatients().length === 0">
                      <td colspan="5" class="py-12 text-center text-slate-500">
                         <div class="flex flex-col items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>No patients found matching your search.</p>
                         </div>
                      </td>
                   </tr>
                 </tbody>
               </table>
            </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="deleteTarget()" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
         <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4 transform transition-all">
            <h3 class="text-lg font-bold text-slate-800 mb-2">Confirm Deletion</h3>
            <p class="text-slate-600 mb-6">
                Are you sure you want to delete the record for 
                <span class="font-semibold">{{ deleteTarget()?.firstName }} {{ deleteTarget()?.lastName }}</span>? 
                This action cannot be undone.
            </p>
            <div class="flex justify-end gap-3">
                <button (click)="cancelDelete()" class="btn-secondary">Cancel</button>
                <button (click)="confirmDelete()" class="btn-danger">Delete Record</button>
            </div>
         </div>
      </div>

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class PatientsComponent {
  private patientService = inject(PatientService);
  private notificationService = inject(NotificationService);
  
  patients = signal<Patient[]>([]);
  selectedPatient = signal<Patient | null>(null);
  showForm = signal<boolean>(false);
  deleteTarget = signal<Patient | null>(null);
  isLoading = signal<boolean>(false);
  searchTerm = signal<string>('');

  filteredPatients = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.patients().filter(p => 
        p.firstName.toLowerCase().includes(term) || 
        p.lastName.toLowerCase().includes(term) ||
        (p.patientNo && p.patientNo.toLowerCase().includes(term))
    );
  });

  constructor() {
    this.refreshList();
  }

  refreshList() {
    this.isLoading.set(true);
    // Simulate slight network delay for better UI feel or real net
    this.patientService.getAll().subscribe({
      next: (data) => {
          this.patients.set(data);
          this.isLoading.set(false);
      },
      error: (err) => {
          console.error('Error fetching patients', err);
          this.showNotification('Error loading data');
          this.isLoading.set(false);
      }
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

  handleFormSubmit(patient: any) {
    this.isLoading.set(true);

    // Prepare payload
    const payload = { ...patient };
    
    // Remove ID if it's null (for create operations) to avoid backend validation error on int Id
    if (!payload.id) {
        delete payload.id;
    }

    if (patient.id) {
      // Update
      this.patientService.update(payload.id, payload).subscribe({
        next: () => {
            this.refreshList();
            this.showForm.set(false);
            this.showNotification('Patient record updated successfully', 'success');
        },
        error: (err) => {
            console.error('Update Error:', err);
            this.isLoading.set(false);
            this.showNotification('Failed to update record. Please try again.', 'error');
        }
      });
    } else {
      // Create
      this.patientService.create(payload).subscribe({
        next: () => {
            this.refreshList();
            this.showForm.set(false);
            this.showNotification('New patient registered successfully', 'success');
        },
        error: (err) => {
            console.error('Create Error:', err);
             this.isLoading.set(false);
             this.showNotification('Failed to create record. Please ensure all fields are valid.', 'error');
        }
      });
    }
  }

  initDelete(patient: Patient) {
      this.deleteTarget.set(patient);
  }

  cancelDelete() {
      this.deleteTarget.set(null);
  }

  confirmDelete() {
      const p = this.deleteTarget();
      if (p && p.id) {
          this.patientService.delete(p.id).subscribe({
              next: () => {
                  this.showNotification('Patient record deleted');
                  this.deleteTarget.set(null);
                  this.refreshList();
              },
              error: () => {
                  this.showNotification('Failed to delete record');
                   this.deleteTarget.set(null);
              }
          });
      }
  }

  showNotification(msg: string, type: 'success' | 'error' | 'info' = 'success') {
      this.notificationService.show(msg, type);
  }

  calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    const diff = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(diff); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
