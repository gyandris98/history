using System;
using System.Collections.Generic;
using System.Text;

namespace history_backend.Domain.DTO
{
    public class TagResponse
    {
        public List<string> Tags { get; set; }
        public long TitleCount { get; set; }
    }
}
