using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PatientDB.Models
{
    public class Patient
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [MaxLength(50)]
        public string? FirstName { get; set; }

        [MaxLength(50)]
        public string? MiddleName { get; set; }

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [MaxLength(10)]
        public string? SuffixName { get; set; }

        public DateTime? BirthDate { get; set; }

        [MaxLength(10)]
        public string? Gender { get; set; }

        [Required]
        [MaxLength(500)]
        public string InitialDiagnosis { get; set; } = string.Empty;

        [MaxLength(8)]
        public string? PatientNo { get; set; }
    }
}