#!/bin/sh
# Creates ~/.config/husky/init.sh so Git GUIs (Fork, SourceTree, etc.) can find node/pnpm.
# Run once: pnpm run prepare:gui
# https://typicode.github.io/husky/how-to.html#node-version-managers-and-guis

mkdir -p "$HOME/.config/husky"
cat > "$HOME/.config/husky/init.sh" << 'INIT'
# Load nvm (Node Version Manager) so node/pnpm are in PATH
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
INIT
echo "Created ~/.config/husky/init.sh"
