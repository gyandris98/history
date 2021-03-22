﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using history_backend.Domain.Services;
using history_backend.Domain.DTO;
using System.Security.Claims;

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
                return BadRequest(ModelState);
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
        [HttpPost("login")]
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
        }
        [HttpPost("refreshlogin")]
        public async Task<ActionResult<string>> RefreshLogin([FromBody] Login loginData)
        {
            try
            {
                var response = await authService.Login(loginData);
                return Ok(response);
            }
            catch (Exception)
            {
                return BadRequest("Incorrect username or password");
            }
        }
        [HttpPost("refresh/{id}")]
        public async Task<ActionResult<AuthenticateResponse>> Refresh([FromBody] RefreshToken token, string id)
        {
            try
            {
                return Ok(await authService.Refresh(token, id));
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }
    }
}
