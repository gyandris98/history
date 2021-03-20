using System.ComponentModel.DataAnnotations;

namespace history_backend.Domain.DTO
{
    public class Register
    {
        [Required]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
