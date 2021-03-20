using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using history_backend.Domain;
using history_backend.Domain.Entities;
using history_backend.Domain.Repositories;
using MongoDB.Bson;
using MongoDB.Driver;

namespace history_backend.Infrastructure.Repositories
{
    public class ArticleRepository : IArticleRepository
    {
        private Database db;
        public ArticleRepository(Database db)
        {
            this.db = db;
        }
        public async Task Create(Domain.Entities.Article article)
        {
            try
            {
                await db.Articles.InsertOneAsync(article);
            }
            catch (Exception)
            {
                throw new Exception("Database insert failed");
            }
        }

        public async Task<List<Article>> List(int pageSize, int pageNumber, bool publicOnly = false)
        {
           return await db.Articles.Find(item => !publicOnly || item.Schedule < DateTime.Now).SortByDescending(a => a.CreatedAt).Skip(pageSize * (pageNumber - 1)).Limit(pageSize).ToListAsync();
        }

        public async Task<Article> GetById(string id)
        {
            var objectid = ObjectId.Parse(id);
            return await db.Articles.Find(item => item.ID == objectid).FirstOrDefaultAsync();
        }

        public async Task<Article> GetBySlug(Domain.DTO.SlugQuery query)
        {
            return await db.Articles
                .Find(item => item.Slug == query.Slug /*&& item.CreatedAt.Year == query.Year && item.CreatedAt.Month == query.Month && item.CreatedAt.Day == query.Day*/)
                .FirstOrDefaultAsync();
        }

        public async Task Replace(Article article)
        {
            await db.Articles.ReplaceOneAsync(item => item.ID == article.ID, article);
        }
    }
}
