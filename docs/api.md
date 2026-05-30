# 野造 · API 文档

## API 总览

- **Base URL**: `https://yezao.art/api`
- **Auth**: Supabase Session Cookie（自动附带）
- **Admin**: 需要 `admin` 或 `super_admin` 角色
- **格式**: JSON

---

## 教程 API

### GET /api/tutorials
获取教程列表

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| category | string | all | 品类筛选 |
| difficulty | string | all | 难度筛选 |
| sort | string | latest | latest / popular / favorites |
| search | string | — | 标题搜索 |
| page | number | 1 | 页码 |
| limit | number | 12 | 每页数量 |

### GET /api/tutorials/[slug]
获取教程详情（含步骤、材料、笔记）

### POST /api/progress
更新学习进度

```json
{
  "tutorial_id": "uuid",
  "completed_step_ids": ["id1", "id2"],
  "total_steps": 10
}
```

---

## 材料 API

### GET /api/materials
材料列表（参数同上）

### GET /api/materials/[slug]
材料详情（含对比、替代、FAQ、购买链接）

### GET /api/materials/search?q=xxx
材料搜索

### GET /api/materials/category
获取所有材料品类

---

## 社区 API

### GET /api/community
帖子列表

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| topic | string | all | 话题筛选 |
| sort | string | latest | latest / popular / commented |
| page | number | 1 | 页码 |
| limit | number | 12 | 每页数量 |

### GET /api/community/post/[slug]
帖子详情（含评论、点赞/收藏状态）

### POST /api/community
创建帖子（需登录）

```json
{
  "title": "帖子标题",
  "content": "帖子内容",
  "topic": "showcase",
  "tags": ["编织", "挂毯"]
}
```

### POST /api/community/like
点赞/取消点赞

```json
{
  "target_type": "post",
  "target_id": "uuid"
}
```

### POST /api/community/favorite
收藏/取消收藏

```json
{
  "item_type": "tutorial",
  "item_id": "uuid"
}
```

### POST /api/community/comment
发表评论

```json
{
  "post_id": "uuid",
  "content": "评论内容",
  "parent_id": null
}
```

---

## 用户中心 API

### GET /api/me
获取当前用户资料

### GET /api/me/profile
获取个人主页数据

### PATCh /api/me/settings
更新个人设置

### GET /api/me/favorites
我的收藏

### GET /api/me/learning
学习进度列表

### GET /api/me/works
我的作品

### GET /api/me/challenges
打卡挑战数据

### POST /api/me/challenges
加入挑战

```json
{
  "challenge_id": "uuid"
}
```

---

## 搜索 API

### GET /api/search?q=xxx&type=all
全局搜索（type: all / tutorials / materials / posts）

---

## 后台 API（需 Admin 权限）

### GET /api/admin/dashboard
数据看板（stats + charts）

### GET /api/admin/tutorials
教程管理列表

### POST/PATCH/DELETE /api/admin/tutorials
教程 CRUD

### GET /api/admin/materials
材料管理列表

### POST/PATCH/DELETE /api/admin/materials
材料 CRUD

### GET /api/admin/users?q=&status=
用户管理列表

### PATCH /api/admin/users/[id]/ban
封禁用户

### PATCH /api/admin/users/[id]/unban
解封用户

### GET /api/admin/community?tab=reviews|posts|comments
社区管理

### POST /api/admin/reviews
审核操作

```json
{
  "id": "uuid",
  "action": "approve|reject"
}
```

### GET/PATCH /api/admin/settings
系统配置

---

## 通用响应格式

```json
// 成功
{
  "items": [...],
  "total": 100
}

// 错误
{
  "error": "Error message"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
