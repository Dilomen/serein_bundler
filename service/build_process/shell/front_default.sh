#!/bin/bash

gitClonePath=''
checkoutProjectPath=''
branch=''
cloneUrl=''
pkgPath=''
step=1
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
   -pkg) pkgPath="$2"
       shift
       ;;
   esac
   shift
done

if [ ! -d $gitClonePath ]; then
 echo "[$((step++))] 创建目录 $gitClonePath"
 mkdir "$gitClonePath" || exit 1
fi

if [ ! -f $pkgPath ]; then
  if [ "`ls -A $gitClonePath`" != "" ]; then
   rm -rf "${gitClonePath}/*"
  fi
  echo "[$((step++))] 进入目录 $gitClonePath"
  cd "$gitClonePath" || exit 1
  echo "[$((step++))] 拉取git项目 $cloneUrl"
  git clone "$cloneUrl" || exit 1
  echo "[$((step++))] 进入目录 $checkoutProjectPath"
  cd "$checkoutProjectPath" || exit 1
  echo "[$((step++))] 切换分支 $branch"
  git checkout "$branch" || exit 1
  echo "[$((step++))] 开始拉取依赖"
  npm install || exit 1
  echo "[$((step++))] 开始打包"
  npm run build || exit 1
  echo "[$((step++))] 打包完成"
else
  echo "[$((step++))] use cache"
  echo "[$((step++))] 进入目录 $checkoutProjectPath"
  cd "$checkoutProjectPath" || exit 1
  echo "[$((step++))] 切换分支 $branch"
  git checkout "$branch" || exit 1
  echo "[$((step++))] 开始拉取依赖"
  npm install || exit 1
  echo "[$((step++))] 开始打包"
  npm run build || exit 1
  echo "[$((step++))] 打包完成"
fi