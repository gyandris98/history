using System;
using System.Collections.Generic;
using System.Text;

namespace history_backend.Domain.DTO
{
    public class ClientUser
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public ClientRole Role { get; set; }
    }
}
