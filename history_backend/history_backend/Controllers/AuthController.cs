using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using history_backend.Domain.Services;
using history_backend.Domain.DTO;

namespace history_backend.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly RegisterService registerService;
        private readonly AuthService authService;

        public AuthController(RegisterService registerService, AuthService authService)
        {
            this.registerService = registerService;
            this.authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] Register userData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var token = await registerService.Register(userData);
                return Created("/register", token);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /*[HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] Login loginData)
        {
            try
            {
                var response = await authService.Authenticate(loginData);
                return Ok(response);
            }
            catch (Exception)
            {
                return BadRequest("Incorrect username or password");
            }
        }*/

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] Login loginData)
        {
            try
            {
                var response = await authService.AuthenticateRefreshToken(loginData);
                HttpContext.Response.Cookies.Append("refresh_token", response.RefreshToken.Token, new Microsoft.AspNetCore.Http.CookieOptions
                {
                    HttpOnly = true,
                    Expires = response.RefreshToken.Expires,
                    IsEssential = true,
                    MaxAge = response.RefreshToken.Expires - DateTime.Now,
                    SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
                    Secure = true,
                });

                return Ok(response.AccessToken);
            }
            catch (Exception)
            {
                return BadRequest("Incorrect username or password");
            }
        }

        [HttpGet("refresh/{id}")]
        public async Task<ActionResult<string>> Refresh(string id)
        {
            try
            {
                var refreshToken = HttpContext.Request.Cookies.Where(item => item.Key == "refresh_token").FirstOrDefault();

                if (refreshToken.Equals(default(KeyValuePair<string, string>)))
                {
                    throw new ArgumentException("No refresh token included.");
                }

                var response = await authService.Refresh(id, refreshToken.Value);
                HttpContext.Response.Cookies.Append("refresh_token", response.RefreshToken.Token, new Microsoft.AspNetCore.Http.CookieOptions {
                    HttpOnly = true,
                    Expires = response.RefreshToken.Expires,
                    MaxAge = response.RefreshToken.Expires - DateTime.Now, 
                    IsEssential = true,
                    SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None,
                    Secure = true,
                });

                return Ok(response.AccessToken);
            }
            catch (Exception)
            {
                return Unauthorized("Token invalid or expired");
            }
        }

        [HttpGet("logout/{id}")]
        public async Task<ActionResult> Logout(string id)
        {
            try
            {
                var refreshToken = HttpContext.Request.Cookies.Where(item => item.Key == "refresh_token").FirstOrDefault();
                if (refreshToken.Equals(default(KeyValuePair<string, string>)))
                {
                    throw new Exception("Token not found");
                }

                await authService.Logout(id, refreshToken.Value);
                return Ok();
            }
            catch (Exception)
            {
                return Ok();
                //return BadRequest("Token expired");
            }
        }
    }
}
