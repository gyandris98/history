using history_backend.Domain.DTO;
using history_backend.Domain.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace history_backend.API.Controllers
{
    [Route("api/public/tag")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ArticleService service;

        public TagController(ArticleService service)
        {
            this.service = service;
        }

        [HttpGet("{pageNumber}/{pageSize}/{tag}")]
        public async Task<ActionResult<ArticlePreviewPaginationResponse>> SearchByTag(int pageNumber, int pageSize, string tag)
        {
            return Ok(await service.TagSearch(pageNumber, pageSize, tag));
        }

        [HttpGet("{query}")]
        public async Task<ActionResult<TagResponse>> SearchPartialTag(string query)
        {
            return Ok(await service.PartialTagSearch(query));
        }
    }
}
