#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn generate

# navigate into the build output directory
cd dist
touch .nojekyll

# if you are deploying to a custom domain
echo 'earth2biomes.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
git push -f git@github.com:Waspische/Earth2Biomes.git master:gh-pages


cd -
