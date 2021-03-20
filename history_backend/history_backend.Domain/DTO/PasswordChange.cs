using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace history_backend.Domain.DTO
{
    public class PasswordChange
    {
        [Required]
        public string NewPassword { get; set; }
    }
}
