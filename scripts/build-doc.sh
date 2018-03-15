#!/bin/bash

SPHINXOPTS=
SPHINXBUILD=sphinx-build
SPHINXPROJ=ObsidianFramework
SOURCEDIR=build/doc.tmp
BUILDDIR=build

if [ -d __env__ ] ; then
    source __env__/bin/activate
else
    virtualenv __env__
    source __env__/bin/activate
    pip install -r requirements.txt
fi

if [ -d "$SOURCEDIR" ] ; then
    rm -rf "$SOURCEDIR"
fi

mkdir -p "$SOURCEDIR"
mkdir -p "$SOURCEDIR/modules"
cp -r doc/* "$SOURCEDIR"
cp -r obsidian/doc "$SOURCEDIR/obsidian"

for module_doc in modules/*/doc ; do
    cp -r "$module_doc" "$SOURCEDIR/${module_doc%%/doc}"
done

$SPHINXBUILD -M html "$SOURCEDIR" "$BUILDDIR" $SPHINXOPTS
rcode=$?

deactivate

exit $rcode
