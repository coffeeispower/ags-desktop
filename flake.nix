{
  description = "My Awesome Desktop Shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    ags,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    extraAgsPackages = with ags.packages.${system}; [
      hyprland
      battery
      apps
      pkgs.libgtop
    ];
  in {
    packages.${system} = {
      default = ags.lib.bundle {
        inherit pkgs;
        src = ./.;
        name = "ags-desktop";
        entry = "app.ts";

        # additional libraries and executables to add to gjs' runtime
        extraPackages = extraAgsPackages;
      };
    };

    devShells.${system} = {
      default = pkgs.mkShell {
        nativeBuildInputs = [
          pkgs.biome
          pkgs.nodePackages.nodemon
          pkgs.just
          (ags.packages.${system}.default.override {
            extraPackages = extraAgsPackages;
          })
        ];
      };
    };
  };
}
