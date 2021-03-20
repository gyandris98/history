using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace history_backend.Domain.DTO
{
    public class InfoChange
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }
    }
}
