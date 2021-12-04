using history_backend.Domain.DTO;
using history_backend.Domain.Entities;
using history_backend.Domain.Repositories;
using System;
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

        public async Task<AuthenticateResponse> Register(Register userData)
        {
            bool exists = await userRepository.Exists(userData.Email);
            if (exists)
            {
                throw new ArgumentException("User already exists");
            }

            var user = CreateUser(userData);
            (var hash, var salt) = CreatePasswordHash(userData.Password);
            user.PasswordHash = hash;
            user.PasswordSalt = salt;
            await userRepository.Create(user);

            return await authService.AuthenticateRefreshToken(new Login
            {
                Email = userData.Email,
                Password = userData.Password,
            });
        }

        private static User CreateUser(Register userData)
        {
            return new User
            {
                Name = userData.Name,
                Email = userData.Email,
                Role = Role.Reader,
            };
        }

        private static (byte[] Hash, byte[] Salt) CreatePasswordHash(string password)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();

            return (hmac.ComputeHash(Encoding.UTF8.GetBytes(password)), hmac.Key);
        }
    }
}
