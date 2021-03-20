using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace history_backend.Domain.DTO
{
    public class FileUpload
    {
        public IFormFile image { get; set; }
    }
}
