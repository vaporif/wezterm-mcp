use tokio::process::Command;

use crate::errors::Error;

pub async fn exec(args: &[&str]) -> Result<String, Error> {
    let output = Command::new("wezterm")
        .arg("cli")
        .args(args)
        .output()
        .await?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(Error::Cli(stderr.trim().to_string()));
    }

    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}
