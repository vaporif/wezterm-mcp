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

    #[tool(description = "Split a pane. Returns the new pane ID.")]
    async fn split_pane(
        &self,
        params: Parameters<tools::pane::SplitPaneParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::pane::split_pane(params.0).await?)
    }

    #[tool(description = "Spawn a command in a new window or tab. Returns the new pane ID.")]
    async fn spawn(
        &self,
        params: Parameters<tools::pane::SpawnParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::pane::spawn(params.0).await?)
    }

    #[tool(description = "Send text to a pane as though it were pasted (bracketed paste).")]
    async fn send_text(
        &self,
        params: Parameters<tools::pane::SendTextParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::pane::send_text(params.0).await?)
    }

    #[tool(description = "Activate (focus) a specific pane.")]
    async fn activate_pane(
        &self,
        params: Parameters<tools::pane::ActivatePaneParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::pane::activate_pane(params.0).await?)
    }

    #[tool(description = "Activate the adjacent pane in the given direction.")]
    async fn activate_pane_direction(
        &self,
        params: Parameters<tools::pane::ActivatePaneDirectionParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::pane::activate_pane_direction(params.0).await?)
    }

    #[tool(description = "Kill a pane.")]
    async fn kill_pane(
        &self,
        params: Parameters<tools::pane::KillPaneParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::pane::kill_pane(params.0).await?)
    }

    #[tool(description = "Resize a pane in the given direction.")]
    async fn adjust_pane_size(
        &self,
        params: Parameters<tools::pane::AdjustPaneSizeParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::pane::adjust_pane_size(params.0).await?)
    }

    #[tool(description = "Zoom, unzoom, or toggle zoom on a pane.")]
    async fn zoom_pane(
        &self,
        params: Parameters<tools::pane::ZoomPaneParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::pane::zoom_pane(params.0).await?)
    }

    #[tool(description = "Move a pane into a new tab.")]
    async fn move_pane_to_new_tab(
        &self,
        params: Parameters<tools::pane::MovePaneToNewTabParams>,
    ) -> Result<CallToolResult, rmcp::ErrorData> {
        Ok(tools::pane::move_pane_to_new_tab(params.0).await?)
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
