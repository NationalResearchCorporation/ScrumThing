﻿using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ScrumThing.Web.Startup))]
namespace ScrumThing.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
