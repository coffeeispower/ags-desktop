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
  in {
    packages.${system} = {
      default = ags.lib.bundle {
        inherit pkgs;
        src = ./.;
        name = "ags-desktop";
        entry = "app.ts";

        # additional libraries and executables to add to gjs' runtime
        extraPackages = with ags.packages.${system}; [
          hyprland
          battery
          apps
        ];
      };
    };

    devShells.${system} = {
      default = pkgs.mkShell {
        buildInputs = [
          pkgs.biome
          pkgs.nodePackages.nodemon
          pkgs.just
          ags.packages.${system}.agsFull
        ];
      };
    };
  };
}
