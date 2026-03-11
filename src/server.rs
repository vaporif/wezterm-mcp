use rmcp::handler::server::tool::ToolRouter;
use rmcp::model::{Implementation, ServerCapabilities, ServerInfo};
use rmcp::{tool_handler, tool_router};

#[derive(Clone)]
pub struct WezTermMcpServer {
    tool_router: ToolRouter<Self>,
}

#[tool_router]
impl WezTermMcpServer {
    pub fn new() -> Self {
        Self {
            tool_router: Self::tool_router(),
        }
    }
}

#[tool_handler]
impl rmcp::handler::server::ServerHandler for WezTermMcpServer {
    fn get_info(&self) -> ServerInfo {
        ServerInfo::new(ServerCapabilities::default()).with_server_info(Implementation::new(
            "wezterm-mcp",
            env!("CARGO_PKG_VERSION"),
        ))
    }
}
