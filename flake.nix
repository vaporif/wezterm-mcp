{
  description = "MCP server for WezTerm terminal interaction";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      nodejs = pkgs.nodejs_22;
    in {
      packages.default = pkgs.buildNpmPackage {
        pname = "wezterm-mcp";
        version = "0.1.0";

        src = ./.;

        npmDepsHash = "sha256-dnBt1hK/E0H2fpEQNFXUS3GrsF5s0r3PS3JjIxSXe7g=";

        inherit nodejs;

        buildPhase = ''
          npm run build
        '';

        installPhase = ''
          mkdir -p $out/lib/wezterm-mcp $out/bin

          cp -r build package.json node_modules $out/lib/wezterm-mcp/

          makeWrapper ${nodejs}/bin/node $out/bin/wezterm-mcp \
            --add-flags "$out/lib/wezterm-mcp/build/index.js" \
            --prefix PATH : ${pkgs.lib.makeBinPath [pkgs.wezterm]}
        '';

        nativeBuildInputs = [pkgs.makeWrapper];
      };

      devShells.default = pkgs.mkShell {
        buildInputs = [
          nodejs
          pkgs.wezterm
        ];
      };
    });
}
