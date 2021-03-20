using System;
using System.Collections.Generic;
using System.Text;

namespace history_backend.Domain.DTO
{
    public class UserPaginationResponse
    {
        public List<ClientUser> Users { get; set; }
        public long TotalCount { get; set; }
        public int PageNumber { get; set; }
    }
}
