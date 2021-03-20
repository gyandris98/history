using history_backend.Domain.DTO;
using history_backend.Domain.Entities;
using history_backend.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace history_backend.Domain.Services
{
    public class RegisterService
    {
        private readonly IUserRepository userRepository;
        private readonly AuthService authService;
        public RegisterService(IUserRepository userRepository, AuthService authService)
        {
            this.userRepository = userRepository;
            this.authService = authService;
        }

        public async Task<string> Register(Register userData)
        {
            bool exists = await userRepository.Exists(userData.Email);
            if (exists)
            {
                throw new Exception("User already exists");
            }
            var user = CreateUser(userData);
            (var hash, var salt) = CreatePasswordHash(userData.Password);
            user.PasswordHash = hash;
            user.PasswordSalt = salt;
            await userRepository.Create(user);

            return await authService.Authenticate(new Login { Email = userData.Email, Password = userData.Password });
        }

        private User CreateUser(Register userData)
        {
            return new User
            {
                Name = userData.Name,
                Email = userData.Email,
                Role = Role.Reader
            };
        }
        private (byte[], byte[]) CreatePasswordHash(string password)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                return (hmac.ComputeHash(Encoding.UTF8.GetBytes(password)), hmac.Key);
            }
        }
    }
}
