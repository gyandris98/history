using history_backend.Domain.Entities.ArticleEntities;
using System;
using System.Collections.Generic;

namespace history_backend.Domain.DTO
{
    public class ArticleUpdate
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Lead { get; set; }

        public Body Body { get; set; }

        public Image Cover { get; set; }

        public string Author { get; set; }

        public DateTime Schedule { get; set; }

        public List<string> Tags { get; set; } = new List<string>();
    }
}
