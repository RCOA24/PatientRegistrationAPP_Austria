using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using PatientDB.Data;
using PatientDB.Models;

namespace PatientDB.Services
{
    public class PatientService : IPatientService
    {
        private readonly AppDbContext _context;

        public PatientService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()  
        {
            return await _context.Patient
                .FromSqlRaw("EXEC sp_GetAllPatients")
                .ToListAsync();
        }

        public async Task<Patient?> GetPatientByIdAsync(int id)
        {
            var result = await _context.Patient
                .FromSqlRaw("EXEC sp_GetPatientById @Id", new SqlParameter("@Id", id))
                .ToListAsync();
            
            return result.FirstOrDefault();
        }

        public async Task<Patient?> CreatePatientAsync(Patient patient)
        {
            var parameters = new[]
            {
                new SqlParameter("@FirstName", (object?)patient.FirstName ?? DBNull.Value),
                new SqlParameter("@MiddleName", (object?)patient.MiddleName ?? DBNull.Value),
                new SqlParameter("@LastName", patient.LastName),
                new SqlParameter("@SuffixName", (object?)patient.SuffixName ?? DBNull.Value),
                new SqlParameter("@BirthDate", (object?)patient.BirthDate ?? DBNull.Value),
                new SqlParameter("@Gender", (object?)patient.Gender ?? DBNull.Value),
                new SqlParameter("@InitialDiagnosis", patient.InitialDiagnosis)
            };

            var result = await _context.Patient
                .FromSqlRaw("EXEC sp_CreatePatient @FirstName, @MiddleName, @LastName, @SuffixName, @BirthDate, @Gender, @InitialDiagnosis", parameters)
                .ToListAsync();

            return result.FirstOrDefault();
        }

        public async Task<int> UpdatePatientAsync(Patient patient)
        {
            var parameters = new[]
            {
                new SqlParameter("@Id", patient.Id),
                new SqlParameter("@FirstName", (object?)patient.FirstName ?? DBNull.Value),
                new SqlParameter("@MiddleName", (object?)patient.MiddleName ?? DBNull.Value),
                new SqlParameter("@LastName", patient.LastName),
                new SqlParameter("@SuffixName", (object?)patient.SuffixName ?? DBNull.Value),
                new SqlParameter("@BirthDate", (object?)patient.BirthDate ?? DBNull.Value),
                new SqlParameter("@Gender", (object?)patient.Gender ?? DBNull.Value),
                new SqlParameter("@InitialDiagnosis", patient.InitialDiagnosis)
            };

            return await _context.Database.ExecuteSqlRawAsync(
                "EXEC sp_UpdatePatient @Id, @FirstName, @MiddleName, @LastName, @SuffixName, @BirthDate, @Gender, @InitialDiagnosis", 
                parameters);
        }

        public async Task<int> DeletePatientAsync(int id)
        {
            return await _context.Database.ExecuteSqlRawAsync(
                "EXEC sp_DeletePatient @Id", 
                new SqlParameter("@Id", id));
        }
    }
}
