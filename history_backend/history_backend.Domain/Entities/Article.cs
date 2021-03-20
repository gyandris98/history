using history_backend.Domain.DTO;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

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
    }
    public class ArticleUser
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
    public class File
    {
        public string Url { get; set; }
    }
    [BsonIgnoreExtraElements]
    public class Data
    {
        public string? Text { get; set; }
        public int? Level { get; set; }
        public string? Style { get; set; }
        public List<string>? Items { get; set; }
        public File? File { get; set; }
        public string? Caption { get; set; }
        public bool? WithBorder { get; set; }
        public bool? Stretched { get; set; }
        public bool? WithBackground { get; set; }
    }

    public class Block
    {
        public string Type { get; set; }
        public Data Data { get; set; }
    }

    public class Body
    {
        public long Time { get; set; }
        public List<Block> Blocks { get; set; }
        public string Version { get; set; }
    }
}
