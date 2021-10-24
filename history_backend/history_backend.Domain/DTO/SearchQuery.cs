using System;

namespace history_backend.Domain.DTO
{
    public class SearchQuery
    {
        public string Query { get; set; } = string.Empty;

        public DateTime From { get; set; }

        public DateTime To { get; set; }
    }
}
