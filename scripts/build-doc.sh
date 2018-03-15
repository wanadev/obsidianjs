#!/bin/bash

SPHINXOPTS=
SPHINXBUILD=sphinx-build
SPHINXPROJ=ObsidianFramework
SOURCEDIR=doc
BUILDDIR=build

if [ -d __env__ ] ; then
    source __env__/bin/activate
else
    virtualenv __env__
    source __env__/bin/activate
    pip install -r requirements.txt
fi

$SPHINXBUILD -M html "$SOURCEDIR" "$BUILDDIR" $SPHINXOPTS
rcode=$?
deactivate

exit $rcode
