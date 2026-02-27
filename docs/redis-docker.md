# 拉取 Redis Docker 镜像

本文档说明如何在本地或 CI 环境中拉取 Redis 的 Docker 镜像。

## 前提条件

- 已安装 [Docker](https://docs.docker.com/get-docker/)（版本 20.10 及以上）
- 网络能访问 Docker Hub（或配置好镜像加速）

## 快速开始

### 拉取最新版本

```bash
docker pull redis:latest
```

### 拉取指定版本

```bash
# 拉取 Redis 7.2 alpine 版本（体积更小）
docker pull redis:7.2-alpine

# 拉取 Redis 7.0
docker pull redis:7.0
```

### 验证镜像

```bash
# 查看本地所有 Redis 镜像
docker images redis

# 查看镜像详细信息
docker inspect redis:latest
```

## 使用脚本拉取

仓库提供了一个便捷脚本 [`scripts/pull-redis.sh`](../scripts/pull-redis.sh)：

```bash
# 赋予执行权限
chmod +x scripts/pull-redis.sh

# 拉取默认版本（latest）
./scripts/pull-redis.sh

# 拉取指定版本
./scripts/pull-redis.sh 7.2-alpine
```

## 国内镜像加速（可选）

如果访问 Docker Hub 速度较慢，可配置国内镜像加速器。

编辑（或创建）Docker 配置文件 `/etc/docker/daemon.json`，添加以下内容：

```json
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://registry.docker-cn.com"
  ]
}
```

然后重启 Docker 服务：

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

配置完成后，再执行 `docker pull redis:latest` 即可通过加速器拉取。

## 在 GitHub Actions 中拉取

仓库提供了可选工作流 [`.github/workflows/pull-redis-image.yml`](../.github/workflows/pull-redis-image.yml)。

手动触发方式：

1. 进入仓库 **Actions** 页面。
2. 选择 **Pull Redis Docker Image** 工作流。
3. 点击 **Run workflow**，可填写版本标签（默认 `latest`）。

## 注意事项

- `redis:alpine` 版本体积更小，适合生产和 CI 环境。
- 如需持久化数据，请挂载 volume：`docker run -d -v /mydata:/data redis`。
- 确保本地 Docker daemon 已启动，否则 `docker pull` 会报错。
