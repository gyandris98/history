using System.Collections.Generic;

namespace history_backend.Domain.DTO
{
    public class ArticlePreviewPaginationResponse
    {
        public List<ArticlePreview> Articles { get; set; }

        public long TotalCount { get; set; }

        public int PageNumber { get; set; }
    }
}
