using System;
using System.Collections.Generic;
using System.Text;

namespace history_backend.Domain.DTO
{
    public class AuthenticateResponse
    {
        public string AccessToken { get; set; }
        public RefreshToken RefreshToken { get; set; }
    }
}
