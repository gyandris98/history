using System.Collections.Generic;

namespace history_backend.Domain.DTO
{
    public class UserPaginationResponse
    {
        public List<ClientUser> Users { get; set; }

        public long TotalCount { get; set; }

        public int PageNumber { get; set; }
    }
}
