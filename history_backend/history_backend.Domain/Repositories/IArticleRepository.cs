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
    }
}
