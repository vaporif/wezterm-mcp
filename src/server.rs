use rmcp::handler::server::tool::ToolRouter;
use rmcp::handler::server::wrapper::Parameters;
use rmcp::model::{CallToolResult, Implementation, ServerCapabilities, ServerInfo};
use rmcp::{tool, tool_handler, tool_router};

use crate::tools;

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

    #[tool(description = "List all WezTerm windows, tabs and panes (JSON).")]
    async fn list_panes(&self) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::query::list_panes().await?)
    }

    #[tool(description = "List connected WezTerm clients (JSON).")]
    async fn list_clients(&self) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::query::list_clients().await?)
    }

    #[tool(description = "Retrieve textual content of a pane's terminal screen/scrollback.")]
    async fn get_text(
        &self,
        params: Parameters<tools::query::GetTextParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::query::get_text(params.0).await?)
    }

    #[tool(description = "Get the pane ID of the adjacent pane in the given direction.")]
    async fn get_pane_direction(
        &self,
        params: Parameters<tools::query::GetPaneDirectionParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::query::get_pane_direction(params.0).await?)
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
