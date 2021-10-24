using history_backend.Domain.Entities;
using MongoDB.Driver;
using System;

namespace history_backend.Infrastructure
{
    public class Database
    {
        private static IMongoDatabase mongodb;

        public Database()
        {
            mongodb = new MongoClient("mongodb://localhost:27017").GetDatabase("history");
            Users = mongodb.GetCollection<User>("users");
            Articles = mongodb.GetCollection<Article>("articles");
        }

        public IMongoCollection<User> Users { get; private set; }

        public IMongoCollection<Article> Articles { get; private set; }
    }
}
