using Microsoft.AspNetCore.Http;

namespace history_backend.Domain.DTO
{
    public class FileUpload
    {
        public IFormFile image { get; set; }
    }
}
