#!/usr/bin/env node

const ghpages = require("gh-pages");

ghpages.publish("./build/html", { dotfiles: true, }, function(error) {
    if (error) {
        console.error("\033[1;37;41m ERROR \033[0m", error);
    } else {
        console.log("\033[1;37;42m DONE \033[0m");
    }
});
