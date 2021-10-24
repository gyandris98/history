using System.Collections.Generic;

namespace history_backend.Domain.DTO
{
    public class TagResponse
    {
        public List<string> Tags { get; set; }

        public long TitleCount { get; set; }
    }
}
