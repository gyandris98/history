using System;
using System.Collections.Generic;
using System.Text;

namespace history_backend.Domain.Helpers
{
    public static class Security
    {
        public static (byte[], byte[]) CreatePasswordHash(string password)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                return (hmac.ComputeHash(Encoding.UTF8.GetBytes(password)), hmac.Key);
            }
        }
    }
}
