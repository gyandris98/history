using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
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
        private readonly Database db;

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

        public async Task<Article> GetBySlug(SlugQuery query)
        {
            var from = new DateTime(query.Year, query.Month, query.Day);
            var to = from.AddDays(1);

            return await db.Articles
                .Find(item => item.CreatedAt >= from && item.CreatedAt < to && item.Slug == query.Slug)
                .SortByDescending(a => a.CreatedAt)
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

        public async Task<(long Count, List<Article> Articles)> Search(int pageNumber, int pageSize, string query = null, DateTime? from = null, DateTime? to = null)
        {
            var dateQuery = new BsonDocument();
            if (from != default(DateTime) && to != default(DateTime))
            {
                dateQuery.Add("CreatedAt", new BsonDocument
                {
                    { "$gte", from },
                    { "$lt", to },
                });
            }
            else if (from != default(DateTime))
            {
                dateQuery.Add("CreatedAt", new BsonDocument
                {
                    { "$gte", from },
                });
            }
            else if (to != default(DateTime))
            {
                dateQuery.Add("CreatedAt", new BsonDocument
                {
                    { "$lt", to },
                });
            }

            if (!string.IsNullOrWhiteSpace(query))
            {
                var criteria = new BsonRegularExpression(query, "i");
                dateQuery.Add("Title", new BsonDocument
                {
                    { "$regex", criteria },
                });
                dateQuery.Add("Lead", new BsonDocument
                {
                    { "$regex", criteria },
                });
                dateQuery.Add("Body.Blocks.Data.Text", new BsonDocument
                {
                    { "$regex", criteria },
                });
            }

            var count = await db.Articles.CountDocumentsAsync(dateQuery);
            var articles = await db.Articles.Find(dateQuery).SortByDescending(a => a.CreatedAt).Skip(pageSize * (pageNumber - 1)).Limit(pageSize).ToListAsync();
            return (count, articles);
        }

        public async Task<(long Count, List<Article> Articles)> SearchByTag(int pageNumber, int pageSize, string tag)
        {
            var count = await db.Articles.CountDocumentsAsync(article => article.Tags.Contains(tag));
            var articles = await db.Articles
                .Find(article => article.Tags.Contains(tag))
                .SortByDescending(a => a.CreatedAt).Skip(pageSize * (pageNumber - 1))
                .Limit(pageSize)
                .ToListAsync();

            return (count, articles);
        }

        public async Task<(long Count, List<string> Tags)> SearchPartialTag(string query)
        {
            FieldDefinition<Article, string> field = "Tags";
            var regex = new Regex(query, RegexOptions.IgnoreCase);

            var allTags = await db.Articles.Distinct(field, _ => true).ToListAsync();
            var regexedTags = allTags.Where(item => regex.IsMatch(item)).Take(5).ToList();
            var titleCount = await db.Articles.CountDocumentsAsync(Builders<Article>.Filter.Regex(x => x.Title, new BsonRegularExpression(query, "i")));

            return (titleCount, regexedTags);
        }

        public async Task<(long Count, List<Article> Articles)> SearchByTitle(int pageNumber, int pageSize, string title)
        {
            var filter = Builders<Article>.Filter.Regex(x => x.Title, new BsonRegularExpression(title, "i"));
            var count = await db.Articles.CountDocumentsAsync(filter);
            var articles = await db.Articles.Find(filter).SortByDescending(a => a.CreatedAt).Skip(pageSize * (pageNumber - 1)).Limit(pageSize).ToListAsync();
            return (count, articles);
        }
    }
}
