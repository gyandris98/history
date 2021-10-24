using System;

namespace history_backend.Domain.DTO
{
    public class Image
    {
        public string Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Url { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        public long Bytes { get; set; }
    }
}
