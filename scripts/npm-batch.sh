#!/bin/bash

echo "Batching 'npm $@'..."

echo "  * running in project's root"
npm "$@"

echo "  * running in obsidian/"
cd obsidian/
npm "$@"
cd -

for module in modules/*/ ; do
    echo "  * running in $module"
    cd $module
    npm "$@"
    cd -
done
