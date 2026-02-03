using Microsoft.AspNetCore.Mvc;
using PatientDB.Models;
using PatientDB.Services;

namespace PatientDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientsController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetAll()
        {
            var patients = await _patientService.GetAllPatientsAsync();
            return Ok(patients);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetById(int id)
        {
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null)
            {
                return NotFound();
            }
            return Ok(patient);
        }

        [HttpPost]
        public async Task<ActionResult<Patient>> Create(Patient patient)
        {
            var createdPatient = await _patientService.CreatePatientAsync(patient);
            
            // Assuming CreatePatientAsync returns the created patient with populated ID
            if (createdPatient == null)
            {
                return BadRequest("Could not create patient.");
            }

            return CreatedAtAction(nameof(GetById), new { id = createdPatient.Id }, createdPatient);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Patient patient)
        {
            if (id != patient.Id)
            {
                return BadRequest("ID mismatch");
            }

            var existing = await _patientService.GetPatientByIdAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            await _patientService.UpdatePatientAsync(patient);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _patientService.GetPatientByIdAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            await _patientService.DeletePatientAsync(id);

            return NoContent();
        }
    }
}
