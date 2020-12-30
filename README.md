# ci 打包

## 流程图

!['./public/static/project_flow.png'](./public/static/project_flow.png '流程图')

## 架构图

!['./public/static/project_struct.png'](./public/static/project_struct.png '架构图')

## 打包任务分配流程图

!['./public/static/project_distribute.png'](./public/static/project_distribute.png '打包任务分配流程')

## 主进程【8081 端口】：处理子进程的管理，以及打断打包

## 子进程【8082 端口】：处理对应的业务

## 开发

### 1、拉取项目代码

### 2、跟目录下新建 build 空文件夹

### 3、根据model下的sql文件，创建对应的数据库和表

### 4、yarn start 启动项目

- 主进程 8081 端口
- 子进程 8082 端口(页面打开 localhost:8082 页面)

### 5、用户验证：前后端分离开发注意点：由于前后端不同源，所以cookie不会存在，即必须先登录，之后打包成静态不会出现该问题

### 6、使用 mock 或者 postman 等工具，由于添加了用户权限，所以在使用工具时需要添加Authorization表头，需要值，在请求页面的接口详情中父子粘贴，再编写 post 请求模拟 webhook 请求，body 内容为以下 json

```json
{
  "ref": "refs/heads/master",
  "before": "a451ff28294fd918df3246317e8867f78b7e1ad3",
  "after": "b7382dcb7a7c900d5025bfe9c2b096c5a08a19c0",
  "repository": {
    "id": 296335883,
    "node_id": "MDEwOlJlcG9zaXRvcnkyOTYzMzU4ODM=",
    "name": "bundler_test",
    "full_name": "Dilomen/bundler",
    "private": true,
    "owner": {
      "name": "Dilomen",
      "email": "36905942+Dilomen@users.noreply.github.com",
      "login": "Dilomen",
      "id": 36905942,
      "node_id": "MDQ6VXNlcjM2OTA1OTQy",
      "avatar_url": "https://avatars0.githubusercontent.com/u/36905942?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/Dilomen",
      "html_url": "https://github.com/Dilomen",
      "followers_url": "https://api.github.com/users/Dilomen/followers",
      "following_url": "https://api.github.com/users/Dilomen/following{/other_user}",
      "gists_url": "https://api.github.com/users/Dilomen/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/Dilomen/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/Dilomen/subscriptions",
      "organizations_url": "https://api.github.com/users/Dilomen/orgs",
      "repos_url": "https://api.github.com/users/Dilomen/repos",
      "events_url": "https://api.github.com/users/Dilomen/events{/privacy}",
      "received_events_url": "https://api.github.com/users/Dilomen/received_events",
      "type": "User",
      "site_admin": false
    },
    "html_url": "https://github.com/Dilomen/bundler",
    "description": "测试webhook",
    "fork": false,
    "url": "https://github.com/Dilomen/bundler",
    "forks_url": "https://api.github.com/repos/Dilomen/bundler/forks",
    "keys_url": "https://api.github.com/repos/Dilomen/bundler/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/Dilomen/bundler/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/Dilomen/bundler/teams",
    "hooks_url": "https://api.github.com/repos/Dilomen/bundler/hooks",
    "issue_events_url": "https://api.github.com/repos/Dilomen/bundler/issues/events{/number}",
    "events_url": "https://api.github.com/repos/Dilomen/bundler/events",
    "assignees_url": "https://api.github.com/repos/Dilomen/bundler/assignees{/user}",
    "branches_url": "https://api.github.com/repos/Dilomen/bundler/branches{/branch}",
    "tags_url": "https://api.github.com/repos/Dilomen/bundler/tags",
    "blobs_url": "https://api.github.com/repos/Dilomen/bundler/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/Dilomen/bundler/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/Dilomen/bundler/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/Dilomen/bundler/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/Dilomen/bundler/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/Dilomen/bundler/languages",
    "stargazers_url": "https://api.github.com/repos/Dilomen/bundler/stargazers",
    "contributors_url": "https://api.github.com/repos/Dilomen/bundler/contributors",
    "subscribers_url": "https://api.github.com/repos/Dilomen/bundler/subscribers",
    "subscription_url": "https://api.github.com/repos/Dilomen/bundler/subscription",
    "commits_url": "https://api.github.com/repos/Dilomen/bundler/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/Dilomen/bundler/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/Dilomen/bundler/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/Dilomen/bundler/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/Dilomen/bundler/contents/{+path}",
    "compare_url": "https://api.github.com/repos/Dilomen/bundler/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/Dilomen/bundler/merges",
    "archive_url": "https://api.github.com/repos/Dilomen/bundler/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/Dilomen/bundler/downloads",
    "issues_url": "https://api.github.com/repos/Dilomen/bundler/issues{/number}",
    "pulls_url": "https://api.github.com/repos/Dilomen/bundler/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/Dilomen/bundler/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/Dilomen/bundler/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/Dilomen/bundler/labels{/name}",
    "releases_url": "https://api.github.com/repos/Dilomen/bundler/releases{/id}",
    "deployments_url": "https://api.github.com/repos/Dilomen/bundler/deployments",
    "created_at": 1600349552,
    "updated_at": "2020-09-17T14:34:35Z",
    "pushed_at": 1600480531,
    "git_url": "git://github.com/Dilomen/bundler.git",
    "ssh_url": "git@github.com:Dilomen/bundler.git",
    "clone_url": "http://gitlab.info.dbappsecurity.com.cn/jeff.zhao/bundler_test.git",
    "svn_url": "https://github.com/Dilomen/bundler",
    "homepage": null,
    "size": 32440,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "Vue",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 0,
    "license": null,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "stargazers": 0,
    "master_branch": "master"
  },
  "pusher": {
    "name": "Dilomen",
    "email": "36905942+Dilomen@users.noreply.github.com"
  },
  "sender": {
    "login": "Dilomen",
    "id": 36905942,
    "node_id": "MDQ6VXNlcjM2OTA1OTQy",
    "avatar_url": "https://avatars0.githubusercontent.com/u/36905942?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/Dilomen",
    "html_url": "https://github.com/Dilomen",
    "followers_url": "https://api.github.com/users/Dilomen/followers",
    "following_url": "https://api.github.com/users/Dilomen/following{/other_user}",
    "gists_url": "https://api.github.com/users/Dilomen/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/Dilomen/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/Dilomen/subscriptions",
    "organizations_url": "https://api.github.com/users/Dilomen/orgs",
    "repos_url": "https://api.github.com/users/Dilomen/repos",
    "events_url": "https://api.github.com/users/Dilomen/events{/privacy}",
    "received_events_url": "https://api.github.com/users/Dilomen/received_events",
    "type": "User",
    "site_admin": false
  },
  "created": false,
  "deleted": false,
  "forced": false,
  "base_ref": null,
  "compare": "https://github.com/Dilomen/bundler/compare/a451ff28294f...b7382dcb7a7c",
  "commits": [
    {
      "id": "b7382dcb7a7c900d5025bfe9c2b096c5a08a19c0",
      "tree_id": "7e5db4223e697a9c2d6c8383262ceed15e12220d",
      "distinct": true,
      "message": "test",
      "timestamp": "2020-09-19T09:55:22+08:00",
      "url": "https://github.com/Dilomen/bundler/commit/b7382dcb7a7c900d5025bfe9c2b096c5a08a19c0",
      "author": {
        "name": "dilomen",
        "email": "dilomen@outlook.com",
        "username": "Dilomen"
      },
      "committer": {
        "name": "dilomen",
        "email": "dilomen@outlook.com",
        "username": "Dilomen"
      },
      "added": [],
      "removed": [],
      "modified": ["README.md"]
    }
  ],
  "head_commit": {
    "id": "b7382dcb7a7c900d5025bfe9c2b096c5a08a19c0",
    "tree_id": "7e5db4223e697a9c2d6c8383262ceed15e12220d",
    "distinct": true,
    "message": "test",
    "timestamp": "2020-09-19T09:55:22+08:00",
    "url": "https://github.com/Dilomen/bundler/commit/b7382dcb7a7c900d5025bfe9c2b096c5a08a19c0",
    "author": {
      "name": "dilomen",
      "email": "dilomen@outlook.com",
      "username": "Dilomen"
    },
    "committer": {
      "name": "dilomen",
      "email": "dilomen@outlook.com",
      "username": "Dilomen"
    },
    "added": [],
    "removed": [],
    "modified": ["README.md"]
  }
}
```

### 7、请求之后程序就会根据该信息，进行打包处理，放到 build 文件夹
