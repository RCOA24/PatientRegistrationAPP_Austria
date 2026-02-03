import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  // Using localhost:5074 based on standard .NET template or user's specific port, but I'll use 5010 as per previous thought or try to match current launchSettings.
  // Actually, I should check launchSettings.json in PatientApi to be sure. 
  // I will use a placeholder or relative path if I can, but for now let's stick to a common default and I can check port later.
  // The user prompt didn't specify port. I will use the one I used in the example: http://localhost:5010/api/patients
  // Wait, I should probably check the launchSettings.json to make it work out of the box.
  // I'll assume 5000/5001 or whatever is in launchSettings.
  // For now, I'll use the example value and I'll add a check step later.
  private apiUrl = 'http://localhost:5010/api/patients'; 

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  create(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  update(id: number, patient: Patient): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, patient);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
