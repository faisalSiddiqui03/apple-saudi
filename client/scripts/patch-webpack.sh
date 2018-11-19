#!/bin/sh

source="$(pwd)/scripts/browser.js"
dest="$(pwd)/node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js"

cp $source $dest

source="$(pwd)/scripts/ngsw-worker.js"
dest="$(pwd)/node_modules/@angular/service-worker/ngsw-worker.js"

cp $source $dest
