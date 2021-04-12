using history_backend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
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
        Task<(long, List<Article>)> Search(int pageNumber, int pageSize, string query = null, DateTime? from = null, DateTime? to = null);
        Task<(long, List<Article>)> SearchByTag(int pageNumber, int pageSize, string tag);
    }
}
