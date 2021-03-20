using history_backend.Domain.DTO;
using history_backend.Domain.Helpers;
using history_backend.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace history_backend.Domain.Services
{
    public class UserService
    {
        private readonly IUserRepository userRepository;
        private readonly AuthService authService;
        public UserService(IUserRepository userRepository, AuthService authService)
        {
            this.userRepository = userRepository;
            this.authService = authService;
        }

        public async Task<UserPaginationResponse> GetUsers(int pageSize, int pageNumber)
        {
            var users = await userRepository.GetUsers(pageSize, pageNumber);
            var result = new List<ClientUser>();
            foreach (var user in users)
            {
                result.Add(new ClientUser
                {
                    Id = user.ID.ToString(),
                    Email = user.Email,
                    Name = user.Name,
                    Role = Role.GetClientRole(user.Role)
                });
            }
            return new UserPaginationResponse
            {
                Users = result,
                TotalCount = await userRepository.GetCount(),
                PageNumber = pageNumber
            };
        }
        public async Task<List<string>> DeleteUsers(List<string> ids)
        {
            return await userRepository.DeleteUsers(ids);
        }
        public async Task<ClientUser> ChangeRole(string id, string role)
        {
            if (!Role.AcceptedRoles.Contains(role))
                throw new Exception("Unknown role name");
            var user = await userRepository.ChangeRole(id, role);
            return new ClientUser
            {
                Id = user.ID.ToString(),
                Email = user.Email,
                Name = user.Name,
                Role = Role.GetClientRole(user.Role)
            };
        }

        public async Task<string> ChangeInfo(string id, string name, string email)
        {
            var user = await userRepository.UpdateInfo(id, name, email);
            return authService.GenerateJwtToken(user);
        }
        public async Task ChangePassword(string id, string newPassword)
        {
            (var hash, var salt) = Security.CreatePasswordHash(newPassword);
            await userRepository.UpdatePassword(id, hash, salt);
            
        }
    }
}
