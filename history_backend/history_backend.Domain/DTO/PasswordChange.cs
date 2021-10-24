using System.ComponentModel.DataAnnotations;

namespace history_backend.Domain.DTO
{
    public class PasswordChange
    {
        [Required]
        public string NewPassword { get; set; }
    }
}
