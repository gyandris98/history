using System;
using System.Collections.Generic;
using System.Text;

namespace history_backend.Domain.DTO
{
    public static class Role
    {
        public const string Admin = "Admin";
        public const string Editor = "Editor";
        public const string Reader = "Reader";
        public const string AdminOrEditor = "Admin, Editor";
        public static ClientRole GetClientRole(string role)
        {
            var result = new ClientRole
            {
                Name = role
            };
            switch (role)
            {
                case Admin:
                    result.Title = "Admin";
                    break;
                case Editor:
                    result.Title = "Szerkesztő";
                    break;
                case Reader:
                    result.Title = "Olvasó";
                    break;
                default:
                    result.Title = "Ismeretlen";
                    break;
            }
            return result;
        }
        public static List<string> AcceptedRoles
        {
            get
            {
                return new List<string> { Role.Admin, Role.Editor, Role.Reader };
            }
        }
    }
}
