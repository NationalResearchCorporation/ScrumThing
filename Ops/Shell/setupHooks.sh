#!/bin/sh
# Install git hooks by copying the contents of the Ops/Shell/hooks directory to .git/hooks

# determine the root of our git repo (e.g. 'D:/Code/Reveal')
GITROOT=`git rev-parse --show-toplevel`

cp -v $GITROOT/Ops/Shell/hooks/* $GITROOT/.git/hooks
