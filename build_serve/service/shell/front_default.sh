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
    -clone) cloneUrl="$2"
       shift
       ;;
   -pkg) pkgPath="$2"
       shift
       ;;
   esac
   shift
done

# 如果项目下的package.json不存在，说明项目不存在
if [ ! -f "${checkoutProjectPath}/package.json" ]; then
  # 查看项目文件夹是否存在，如果存在，就删除文件夹
  if [ -d $gitClonePath ]; then
    echo "[$((step++))] 删除项目文件夹"
    rm -rf "${gitClonePath}" || exit 1
  fi
  echo "[$((step++))] 创建项目文件夹"
  mkdir "$gitClonePath" || exit 1
  echo "[$((step++))] 进入项目文件夹"
  cd "$gitClonePath" || exit 1
  echo "[$((step++))] 拉取git项目"
  git clone "$cloneUrl" || exit 1
else
  echo "[$((step++))] use cache"
fi


echo "[$((step++))] 进入目录 $checkoutProjectPath"
cd "$checkoutProjectPath" || exit 1

if [ -f "${checkoutProjectPath}/.git/index.lock" ]; then
  rm -f "${checkoutProjectPath}/.git/index.lock" || exit 1
fi

echo "[$((step++))] 切换分支 $branch"
git checkout "$branch" || exit 1

echo "[$((step++))] 开始拉取依赖"
npm install || exit 1

echo "[$((step++))] 开始打包"

set NODE_ENV=production
set BASE_URL='/'

npm run build || exit 1
echo "[$((step++))] 打包完成"