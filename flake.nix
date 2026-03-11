{
  description = "MCP server for WezTerm terminal interaction";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    crane.url = "github:ipetkov/crane";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    fenix,
    crane,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      fenixPkgs = fenix.packages.${system};
      toolchain = fenixPkgs.stable.toolchain;
      craneLib = (crane.mkLib pkgs).overrideToolchain toolchain;

      src = craneLib.cleanCargoSource ./.;

      commonArgs = {
        inherit src;
        strictDeps = true;
      };

      cargoArtifacts = craneLib.buildDepsOnly commonArgs;

      wezterm-mcp = craneLib.buildPackage (commonArgs
        // {
          inherit cargoArtifacts;
          nativeBuildInputs = [pkgs.makeWrapper];
          postInstall = ''
            wrapProgram $out/bin/wezterm-mcp \
              --prefix PATH : ${pkgs.lib.makeBinPath [pkgs.wezterm]}
          '';
        });
    in {
      packages.default = wezterm-mcp;

      devShells.default = craneLib.devShell {
        packages = [
          pkgs.wezterm
          pkgs.cargo-nextest
        ];
      };
    });
}
