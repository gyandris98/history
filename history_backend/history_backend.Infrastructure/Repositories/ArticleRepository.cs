using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using history_backend.Domain;
using history_backend.Domain.DTO;
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

        public async Task<long> GetCount()
        {
            return await db.Articles.CountDocumentsAsync(_ => true);
        }
        public async Task<(long, List<Article>)> Search(int pageNumber, int pageSize, string query = null, DateTime? from = null, DateTime? to = null)
        {
            var dateQuery = new BsonDocument();
            if (from != default(DateTime) && to != default(DateTime))
            {
                dateQuery.Add("CreatedAt", new BsonDocument
                {
                    {"$gte", from },
                    {"$lt", to }
                });
            } else if (from != default(DateTime))
            {
                dateQuery.Add("CreatedAt", new BsonDocument
                {
                    {"$gte", from }
                });
            } else if (to != default(DateTime))
            {
                dateQuery.Add("CreatedAt", new BsonDocument
                {
                    {"$lt", to }
                });
            }
                
            if (query.Length > 0)
            {
                var criteria = new BsonRegularExpression(query, "i");
                dateQuery.Add("Title", new BsonDocument
                {
                    {"$regex", criteria }
                });
                dateQuery.Add("Lead", new BsonDocument
                {
                    {"$regex", criteria }
                });
                dateQuery.Add("Body.Blocks.Data.Text", new BsonDocument
                {
                    {"$regex", criteria }
                });
            }
            var count = await db.Articles.CountDocumentsAsync(dateQuery);
            var articles = await db.Articles.Find(dateQuery).SortByDescending(a => a.CreatedAt).Skip(pageSize * (pageNumber - 1)).Limit(pageSize).ToListAsync();
            return (count, articles);
            
        }

        public async Task<(long, List<Article>)> SearchByTag(int pageNumber, int pageSize, string tag)
        {
            var tagQuery = new BsonDocument();
            tagQuery.Add("Tags", tag);
            /*if (partial == true)
            {
                tagQuery.Add("Tags", new BsonDocument
                {
                    {"$in", new BsonRegularExpression(tag, "i") }
                });
            } else
            {
            }*/

            var count = await db.Articles.CountDocumentsAsync(tagQuery);
            var articles = await db.Articles.Find(tagQuery).SortByDescending(a => a.CreatedAt).Skip(pageSize * (pageNumber - 1)).Limit(pageSize).ToListAsync();
            return (count, articles);
        }

    }
}
