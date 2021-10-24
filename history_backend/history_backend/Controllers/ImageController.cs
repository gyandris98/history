using history_backend.Domain.DTO;
using history_backend.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace history_backend.API.Controllers
{
    [Route("api/image")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly ImageService service;
        private readonly IWebHostEnvironment webHostEnvironment;

        public ImageController(IWebHostEnvironment environment, ImageService service)
        {
            this.service = service;
            webHostEnvironment = environment;
        }

        [HttpPost]
        [Authorize(Roles = Role.AdminOrEditor)]
        public async Task<ActionResult<Image>> Upload([FromForm] FileUpload file)
        {
            try
            {
                return await service.UploadImage(webHostEnvironment, file);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("editor")]
        [Authorize(Roles = Role.AdminOrEditor)]
        public async Task<ActionResult<EditorImageUpload>> UploadEditorImage([FromForm] FileUpload file)
        {
            try
            {
                return await service.UploadEditorImage(webHostEnvironment, file);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("editorurl")]
        [Authorize(Roles = Role.AdminOrEditor)]
        public async Task<ActionResult<EditorImageUpload>> UploadEditorImage([FromBody] FileUploadByUrl file)
        {
            try
            {
                return await service.UploadEditorImageByUrl(webHostEnvironment, file);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = Role.AdminOrEditor)]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                await service.DeleteImage(id);
                return Ok(id);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
