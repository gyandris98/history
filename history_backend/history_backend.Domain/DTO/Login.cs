using System.ComponentModel.DataAnnotations;

namespace history_backend.Domain.DTO
{
    public class Login
    {
        [EmailAddress]
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
