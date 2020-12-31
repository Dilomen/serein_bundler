#!/bin/bash

gitClonePath=''
checkoutProjectPath=''
branch=''
cloneUrl=''
while [ $# -gt 0 ];
do
   case $1 in
   -gp) gitClonePath="$2"
       shift
       ;;
   -cpp) checkoutProjectPath="$2"
       shift
       ;;
    -branch) branch="$2"
       shift
       ;;
    -clone_url) cloneUrl="$2"
       shift
       ;;
   esac
   shift
done

if [ ! -d $gitClonePath ]; then
  echo "[1] 创建目录 $gitClonePath"
  mkdir "$gitClonePath"
  echo "[2] 进入目录 $gitClonePath"
  cd "$gitClonePath"
  echo "[3] 拉取git项目 $cloneUrl"
  git clone "$cloneUrl"
  echo "[4] 进入目录 $checkoutProjectPath"
  cd "$checkoutProjectPath"
  echo "[5] 切换分支 $branch"
  git checkout "$branch"
  echo "[6] 开始拉取依赖"
  npm install
  echo "[7] 开始打包"
  npm run build
  echo "[8] 打包完成"
else
  echo "[1] use cache"
  echo "[2] 进入目录 $checkoutProjectPath"
  cd "$checkoutProjectPath"
  echo "[3] 切换分支 $branch"
  git checkout "$branch"
  echo "[4] 开始拉取依赖"
  npm install
  echo "[5] 开始打包"
  npm run build
  echo "[6] 打包完成"
fi