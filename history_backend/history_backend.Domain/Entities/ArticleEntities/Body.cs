using System.Collections.Generic;

namespace history_backend.Domain.Entities.ArticleEntities
{
    public class Body
    {
        public long Time { get; set; }

        public List<Block> Blocks { get; set; }

        public string Version { get; set; }
    }
}
