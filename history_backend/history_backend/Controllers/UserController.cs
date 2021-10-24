using history_backend.Domain.DTO;
using history_backend.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace history_backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService userService;

        public UserController(UserService userService) => this.userService = userService;

        [HttpGet("{pageNumber}/{pageSize}")]
        [Authorize(Roles = Role.AdminOrEditor)]
        public async Task<ActionResult<UserPaginationResponse>> GetUser(int pageNumber, int pageSize)
        {
            return await userService.GetUsers(pageSize, pageNumber);
        }

        [HttpDelete]
        [Authorize(Roles = Role.AdminOrEditor)]
        public async Task<ActionResult<List<string>>> DeleteUsers([FromBody] List<string> ids)
        {
            return Ok(await userService.DeleteUsers(ids));
        }

        [HttpPatch("role/{id}/{role}")]
        [Authorize(Roles = Role.Admin)]
        public async Task<ActionResult<ClientUser>> ChangeRole(string id, string role)
        {
            try
            {
                var user = await userService.ChangeRole(id, role);
                return Ok(user);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPatch("password")]
        [Authorize]
        public async Task<ActionResult<ClientUser>> ChangePassword([FromBody] PasswordChange passwordChange)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var id = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            await userService.ChangePassword(id, passwordChange.NewPassword);
            return NoContent();
        }

        [HttpPatch("info")]
        [Authorize]
        public async Task<ActionResult<ClientUser>> ChangeInfo([FromBody] InfoChange infoChange)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var id = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var token = await userService.ChangeInfo(id, infoChange.Name, infoChange.Email);
            return Ok(token);
        }
    }
}
