using System.Collections.Generic;

namespace history_backend.Domain.DTO
{
    public static class Role
    {
        public const string Admin = "Admin";
        public const string Editor = "Editor";
        public const string Reader = "Reader";
        public const string AdminOrEditor = "Admin, Editor";

        public static List<string> AcceptedRoles
        {
            get
            {
                return new List<string> { Admin, Editor, Reader };
            }
        }

        public static ClientRole GetClientRole(string role)
        {
            var result = new ClientRole
            {
                Name = role,
            };
            result.Title = role switch
            {
                Admin => "Admin",
                Editor => "Szerkesztő",
                Reader => "Olvasó",
                _ => "Ismeretlen",
            };

            return result;
        }
    }
}
