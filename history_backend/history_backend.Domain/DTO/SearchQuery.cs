using System;
using System.Collections.Generic;
using System.Text;

namespace history_backend.Domain.DTO
{
    public class SearchQuery
    {
        public string Query { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public SearchQuery()
        {
            Query = "";
        }
    }
}
