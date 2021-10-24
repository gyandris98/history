using history_backend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace history_backend.Domain.Repositories
{
    public interface IArticleRepository
    {
        Task Create(Entities.Article article);

        Task<List<Article>> List(int pageSize, int pageNumber, bool publicOnly = false);

        Task<Article> GetById(string id);

        Task<Article> GetBySlug(DTO.SlugQuery query);

        Task Replace(Article update);

        Task<long> GetCount();

        Task<(long Count, List<Article> Articles)> Search(int pageNumber, int pageSize, string query = null, DateTime? from = null, DateTime? to = null);

        Task<(long Count, List<Article> Articles)> SearchByTag(int pageNumber, int pageSize, string tag);

        Task<(long Count, List<string> Tags)> SearchPartialTag(string query);

        Task<(long Count, List<Article> Articles)> SearchByTitle(int pageNumber, int pageSize, string title);
    }
}
