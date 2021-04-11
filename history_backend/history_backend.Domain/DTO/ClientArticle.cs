using history_backend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace history_backend.Domain.DTO
{
    public class ClientArticle
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Lead { get; set; }
        public Body Body { get; set; }
        public ArticleUser user { get; set; }
        public DateTime CreatedAt { get; set; }
        public Image Cover { get; set; }
        public string Slug { get; set; }
        public string Author { get; set; }
        public DateTime Schedule { get; set; }
        public List<string> Tags { get; set; }
        public ClientArticle()
        {
            Tags = new List<string>();
        }
    }
}
