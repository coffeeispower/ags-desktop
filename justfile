alias default := dev

dev:
    nodemon -e js,jsx,ts,tsx,scss,css -i @girs -x "ags run -d \"$PWD\""
types: 
    ags types --tsconfig -d .