using history_backend.Domain.Entities.ArticleEntities;
using System;

namespace history_backend.Domain.DTO
{
    public class ArticlePreview
    {
        public string Id { get; set; }

        public string Title { get; set; }

        public string Lead { get; set; }

        public DateTime CreatedAt { get; set; }

        public ArticleUser User { get; set; }

        public Image Cover { get; set; }

        public string Slug { get; set; }
    }
}
