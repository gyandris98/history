using history_backend.Domain.DTO;
using history_backend.Domain.Entities.ArticleEntities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace history_backend.Domain.Entities
{
    public class Article
    {
        [BsonId]
        public ObjectId ID { get; set; }

        public string Title { get; set; }

        public string Lead { get; set; }

        public Body Body { get; set; }

        public ArticleUser User { get; set; }

        public string Author { get; set; }

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime CreatedAt { get; set; }

        public Image Cover { get; set; }

        public string Slug { get; set; }

        [BsonRepresentation(BsonType.DateTime)]
        public DateTime Schedule { get; set; }

        public List<string> Tags { get; set; } = new List<string>();
    }
}
