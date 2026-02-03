using PatientDB.Models;

namespace PatientDB.Services
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> GetAllPatientsAsync();
        Task<Patient?> GetPatientByIdAsync(int id);
        Task<Patient?> CreatePatientAsync(Patient patient);
        Task<int> UpdatePatientAsync(Patient patient);
        Task<int> DeletePatientAsync(int id);
    }
}
