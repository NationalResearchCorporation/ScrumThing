using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Scrum.Web.Startup))]
namespace Scrum.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
