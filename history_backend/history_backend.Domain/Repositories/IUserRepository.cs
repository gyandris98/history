using history_backend.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace history_backend.Domain.Repositories
{
    public interface IUserRepository
    {
        Task Create(User user);

        Task<bool> Exists(string email);

        Task<User> FindByEmail(string email);

        Task<User> FindById(string id);

        Task<List<User>> GetUsers(int pageSize, int pageNumber);

        Task<List<string>> DeleteUsers(List<string> ids);

        Task<long> GetCount();

        Task<User> ChangeRole(string id, string role);

        Task<User> UpdateInfo(string id, string name, string email);

        Task UpdatePassword(string id, byte[] passwordHash, byte[] passwordSalt);

        Task Replace(User user);
    }
}
