using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using history_backend.Domain.Services;
using history_backend.Domain.DTO;
using Microsoft.AspNetCore.Authorization;

namespace history_backend.API.Controllers
{
    [Route("api/article")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly ArticleService service;

        public ArticleController(ArticleService service)
        {
            this.service = service;
        }

        [HttpPost]
        [Authorize(Roles = Role.AdminOrEditor)]
        public async Task<ActionResult<ClientArticle>> Create([FromBody] ArticleChange change)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                return await service.CreateArticle(change, User);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Authorize(Roles = Role.AdminOrEditor)]
        public async Task<ActionResult<ArticlePreview>> List()
        {
            return Ok(await service.GetArticlePreviews());
        }

        [HttpPost("{pageNumber}/{pageSize}")]
        [Authorize(Roles = Role.AdminOrEditor)]
        public async Task<ActionResult<ArticlePreviewPaginationResponse>> ListPaginated(int pageNumber, int pageSize, [FromBody] SearchQuery query)
        {
            return Ok(await service.ArticlePreviewSearch(pageNumber, pageSize, query));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ClientArticle>> GetById(string id)
        {
            try
            {
                return Ok(await service.GetById(id));
            }
            catch (Exception)
            {
                return NotFound("Article not found");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = Role.AdminOrEditor)]
        public async Task<ActionResult> Update(string id, [FromBody] ArticleChange article)
        {
            try
            {
                await service.Replace(id, article);
                return Ok();
            }
            catch (Exception)
            {
                return NotFound("Article not found");
            }
        }
    }
}
