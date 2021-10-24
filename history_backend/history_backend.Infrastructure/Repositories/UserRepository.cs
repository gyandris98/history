using history_backend.Domain.Entities;
using history_backend.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;

namespace history_backend.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private Database db;

        public UserRepository(Database db)
        {
            this.db = db;
        }

        public async Task Create(User user)
        {
            try
            {
                await db.Users.InsertOneAsync(user);
            }
            catch (Exception)
            {
                throw new Exception("Database insert failed");
            }
        }

        public async Task<List<string>> DeleteUsers(List<string> ids)
        {
            var objectIds = ids.Select(id => ObjectId.Parse(id));
            await db.Users.DeleteManyAsync(Builders<User>.Filter.In("_id", objectIds));
            return ids;
        }

        public async Task<bool> Exists(string email)
        {
            var user = await db.Users.Find(item => item.Email == email).FirstOrDefaultAsync();
            return user != null;
        }

        public async Task<User> FindByEmail(string email)
        {
            return await db.Users.Find(item => item.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User> FindById(string id)
        {
            var objectid = ObjectId.Parse(id);
            return await db.Users.Find(item => item.ID == objectid).FirstOrDefaultAsync();
        }

        public async Task<List<User>> GetUsers(int pageSize, int pageNumber)
        {
            return await db.Users.Find(_ => true).Skip(pageSize * (pageNumber-1)).Limit(pageSize).ToListAsync();
        }

        public async Task<long> GetCount()
        {
            return await db.Users.CountDocumentsAsync(_ => true);
        }

        public async Task<User> ChangeRole(string id, string role)
        {
            var user = await db.Users.FindOneAndUpdateAsync(item => item.ID == ObjectId.Parse(id), Builders<User>.Update.Set(x => x.Role, role));
            user.Role = role;
            return user;
        }

        public async Task<User> UpdateInfo(string id, string name, string email)
        {
            var user = await db.Users.FindOneAndUpdateAsync(item => item.ID == ObjectId.Parse(id), Builders<User>.Update.Set(x => x.Email, email).Set(x => x.Name, name));
            user.Name = name;
            user.Email = email;
            return user;
        }

        public async Task UpdatePassword(string id, byte[] passwordHash, byte[] passwordSalt)
        {
            var user = await db.Users.FindOneAndUpdateAsync(item => item.ID == ObjectId.Parse(id), Builders<User>.Update.Set(x => x.PasswordHash, passwordHash).Set(x => x.PasswordSalt, passwordSalt));
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
        }

        public async Task Replace(User user)
        {
            await db.Users.ReplaceOneAsync(item => item.ID == user.ID, user);
        }
    }
}
