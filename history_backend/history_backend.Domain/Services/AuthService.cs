using history_backend.Domain.DTO;
using history_backend.Domain.Entities;
using history_backend.Domain.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace history_backend.Domain.Services
{
    public class AuthService
    {
        private readonly IUserRepository userRepository;
        private readonly IConfiguration config;

        public AuthService(IUserRepository userRepository, IConfiguration config)
        {
            this.userRepository = userRepository;
            this.config = config;
        }

        public async Task<AuthenticateResponse> AuthenticateRefreshToken(Login loginData)
        {
            var user = await userRepository.FindByEmail(loginData.Email);
            if (user is null)
            {
                throw new ArgumentException("User not found with this email.");
            }

            if (!VerifyPassword(loginData.Password, user.PasswordHash, user.PasswordSalt))
            {
                throw new ArgumentException("Incorrect password.");
            }

            return new AuthenticateResponse
            {
                AccessToken = GenerateJwtToken(user),
                RefreshToken = GenerateRefreshToken(user),
            };
        }

        public async Task<AuthenticateResponse> Refresh(string id, string refreshToken)
        {
            var user = await userRepository.FindById(id);
            if (user is null)
            {
                throw new ArgumentException("User not found with this email.");
            }

            var token = user.RefreshTokens.Find(item => item.Token == refreshToken);
            if (token is null)
            {
                throw new ArgumentException("Invalid refresh token.");
            }

            if (token.IsExpired)
            {
                throw new ArgumentException("Refresh token has expired.");
            }

            user.RefreshTokens.Remove(token);
            await userRepository.Replace(user);

            return new AuthenticateResponse
            {
                AccessToken = GenerateJwtToken(user),
                RefreshToken = GenerateRefreshToken(user),
            };
        }

        public async Task Logout(string id, string refreshToken)
        {
            var user = await userRepository.FindById(id);
            if (user is null)
            {
                throw new ArgumentException("User not found with this email.");
            }

            var token = user.RefreshTokens.Find(item => item.Token == refreshToken);
            if (token is null)
            {
                throw new ArgumentException("Invalid refresh token.");
            }

            user.RefreshTokens.Remove(token);
            await userRepository.Replace(user);
        }

        private bool VerifyPassword(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
            }

            return true;
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(config.GetSection("AppSettings:Token").Value);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()), new Claim(ClaimTypes.Name, user.Name), new Claim(ClaimTypes.Email, user.Email), new Claim(ClaimTypes.Role, user.Role) }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public RefreshToken GenerateRefreshToken(User user)
        {
            var refreshToken = new RefreshToken
            {
                Token = GenerateRefreshToken(),
                Expires = DateTime.UtcNow.AddDays(7),
            };
            user.RefreshTokens.Add(refreshToken);
            userRepository.Replace(user);

            return refreshToken;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();

            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
