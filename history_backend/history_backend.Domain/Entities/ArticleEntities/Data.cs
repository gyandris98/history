using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace history_backend.Domain.Entities.ArticleEntities
{
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
}
