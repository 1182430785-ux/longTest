# Cocos Cyberpunk

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## English

A high-quality Cyberpunk-style demo showcasing advanced features of [Cocos Creator](https://www.cocos.com/en/creator).

### Version: v1.6 (3.8.0)

### Quick Start

#### Prerequisites

1. **Cocos Creator 3.8.4** (minimum 3.7.1)
   - Download from [Cocos Creator Official Site](https://www.cocos.com/en/creator-download)

2. **Supported Platforms**
   - Windows
   - macOS
   - iOS
   - Android

#### Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/anthropics/CocosCyberpunk.git
cd CocosCyberpunk

# 2. Open with Cocos Creator
#    - Launch Cocos Dashboard
#    - Click "Add" and select this project folder
#    - Open the project with Cocos Creator 3.8.4+
```

#### Running the Project

1. **In Editor (Development)**
   - Open Cocos Creator
   - Open scene: `assets/scene-game-start.scene`
   - Click the **Play** button in the toolbar

2. **Build for Target Platform**
   - Menu: `Project` → `Build`
   - Select target platform (Windows/macOS/iOS/Android)
   - Set `assets/scene-game-start.scene` as the start scene
   - Click `Build` then `Run`

### Controls

| Platform | Action | Control |
|----------|--------|---------|
| Desktop | Move | W/A/S/D |
| Desktop | Look | Mouse |
| Desktop | Shoot | Left Click |
| Desktop | Jump | Space |
| Mobile | Move | Virtual Joystick |
| Mobile | Look | Touch & Drag |
| Mobile | Shoot | Fire Button |

### Project Structure

```
CocosCyberpunk/
├── assets/
│   ├── res/                    # Static resources (4656 files)
│   │   ├── ui/                 # UI assets
│   │   ├── materials/          # PBR materials
│   │   ├── meshes/             # 3D models
│   │   ├── animations/         # Skeletal animations
│   │   ├── effect/             # Particle effects
│   │   └── sound/              # Audio files
│   │
│   ├── resources/              # Runtime-loaded resources (1260 files)
│   │   ├── obj/                # Game object prefabs
│   │   ├── ui/                 # UI prefabs
│   │   ├── data/               # JSON game data
│   │   └── actor/              # Character resources
│   │
│   ├── scripts/                # TypeScript source (249 files)
│   │   ├── core/               # Core framework (123 files)
│   │   │   ├── actor/          # Actor system
│   │   │   ├── ai/             # AI & pathfinding
│   │   │   ├── ik/             # Inverse kinematics
│   │   │   ├── input/          # Input handling
│   │   │   ├── sensor/         # Detection sensors
│   │   │   └── ui/             # UI framework
│   │   │
│   │   └── logic/              # Game logic (126 files)
│   │       ├── init/           # Initialization
│   │       ├── camera/         # FPS/TPS camera
│   │       ├── actor/          # Character logic
│   │       ├── item/           # Item system
│   │       └── ui/             # Game UI
│   │
│   ├── scene-game-start.scene  # Main entry scene (BUILD THIS)
│   └── scene.scene             # Main game scene (33.9MB)
│
├── extensions/
│   └── pipeline/               # Custom render pipeline
│       └── pipeline/
│           ├── passes/         # Render passes (GBuffer, Bloom, TAA, FSR)
│           ├── components/     # Pipeline components
│           └── settings/       # Performance settings
│
├── settings/                   # Editor settings
├── package.json                # Project config
└── tsconfig.json               # TypeScript config
```

### System Architecture

```
┌─────────────────────────────────────────┐
│         Game Logic (logic/)             │
│   Init, Camera, Actor, Item, UI, FX     │
├─────────────────────────────────────────┤
│        Core Framework (core/)           │
│   Actor, AI, IK, Input, Sensor, Audio   │
├─────────────────────────────────────────┤
│    Custom Pipeline (extensions/)        │
│   Deferred Rendering, Post-Processing   │
├─────────────────────────────────────────┤
│           Cocos Creator 3.8             │
└─────────────────────────────────────────┘
```

### Baseline Devices

- **Android**: Huawei Hisilicon 970, Qualcomm Snapdragon 835
- **iOS**: Apple A10 Bionic (iPhone 7+)

Performance settings: `extensions/pipeline/pipeline/settings/href-setting.ts`

### License

See [Content License Agreement](./licenses/Cocos%20Cyberpunnk%20Content%20License%20Agreement.md) and [Copyright Notice](./licenses/Cocos%20Cyberpunk%20Copyright%20Notice.md).

### Credits

Game scene artwork by [The ArtCore Studios](http://www.artcore-studios.com/)

---

<a name="中文"></a>
## 中文

一个高质量的赛博朋克风格演示项目，展示 [Cocos Creator](https://www.cocos.com/creator) 的高级功能。

### 版本: v1.6 (3.8.0)

### 快速开始

#### 环境要求

1. **Cocos Creator 3.8.4**（最低 3.7.1）
   - 下载地址：[Cocos Creator 官网](https://www.cocos.com/creator-download)

2. **支持平台**
   - Windows
   - macOS
   - iOS
   - Android

#### 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/anthropics/CocosCyberpunk.git
cd CocosCyberpunk

# 2. 使用 Cocos Creator 打开
#    - 启动 Cocos Dashboard
#    - 点击「添加」选择项目文件夹
#    - 使用 Cocos Creator 3.8.4+ 打开项目
```

#### 运行项目

1. **编辑器内运行（开发模式）**
   - 打开 Cocos Creator
   - 打开场景：`assets/scene-game-start.scene`
   - 点击工具栏的 **播放** 按钮

2. **构建到目标平台**
   - 菜单：`项目` → `构建发布`
   - 选择目标平台（Windows/macOS/iOS/Android）
   - 将 `assets/scene-game-start.scene` 设为启动场景
   - 点击 `构建` 然后 `运行`

### 操作说明

| 平台 | 操作 | 控制方式 |
|------|------|----------|
| 桌面端 | 移动 | W/A/S/D |
| 桌面端 | 视角 | 鼠标 |
| 桌面端 | 射击 | 鼠标左键 |
| 桌面端 | 跳跃 | 空格键 |
| 移动端 | 移动 | 虚拟摇杆 |
| 移动端 | 视角 | 滑动屏幕 |
| 移动端 | 射击 | 开火按钮 |

### 项目结构

```
CocosCyberpunk/
├── assets/
│   ├── res/                    # 静态资源 (4656 个文件)
│   │   ├── ui/                 # UI 素材
│   │   ├── materials/          # PBR 材质
│   │   ├── meshes/             # 3D 模型
│   │   ├── animations/         # 骨骼动画
│   │   ├── effect/             # 粒子特效
│   │   └── sound/              # 音频文件
│   │
│   ├── resources/              # 运行时加载资源 (1260 个文件)
│   │   ├── obj/                # 游戏对象预制体
│   │   ├── ui/                 # UI 预制体
│   │   ├── data/               # JSON 游戏数据
│   │   └── actor/              # 角色资源
│   │
│   ├── scripts/                # TypeScript 源码 (249 个文件)
│   │   ├── core/               # 核心框架 (123 个文件)
│   │   │   ├── actor/          # 角色系统
│   │   │   ├── ai/             # AI 与寻路
│   │   │   ├── ik/             # 反向运动学
│   │   │   ├── input/          # 输入处理
│   │   │   ├── sensor/         # 检测传感器
│   │   │   └── ui/             # UI 框架
│   │   │
│   │   └── logic/              # 游戏逻辑 (126 个文件)
│   │       ├── init/           # 初始化
│   │       ├── camera/         # FPS/TPS 相机
│   │       ├── actor/          # 角色逻辑
│   │       ├── item/           # 物品系统
│   │       └── ui/             # 游戏 UI
│   │
│   ├── scene-game-start.scene  # 主入口场景（构建此场景）
│   └── scene.scene             # 主游戏场景 (33.9MB)
│
├── extensions/
│   └── pipeline/               # 自定义渲染管线
│       └── pipeline/
│           ├── passes/         # 渲染通道 (GBuffer, Bloom, TAA, FSR)
│           ├── components/     # 管线组件
│           └── settings/       # 性能设置
│
├── settings/                   # 编辑器设置
├── package.json                # 项目配置
└── tsconfig.json               # TypeScript 配置
```

### 系统架构

```
┌─────────────────────────────────────────┐
│         游戏逻辑层 (logic/)              │
│    初始化、相机、角色、物品、UI、特效      │
├─────────────────────────────────────────┤
│         核心框架层 (core/)               │
│   Actor、AI、IK、输入、传感器、音频       │
├─────────────────────────────────────────┤
│       自定义管线 (extensions/)           │
│       延迟渲染、后期处理、性能优化         │
├─────────────────────────────────────────┤
│           Cocos Creator 3.8             │
└─────────────────────────────────────────┘
```

### 游戏启动流程

```
scene-game-start.scene → init.ts → preload.ts → scene.scene → 游戏运行
     入口场景            初始化     资源预加载    主游戏场景
```

### 基准设备

- **Android**: 华为麒麟 970、高通骁龙 835
- **iOS**: Apple A10 Bionic (iPhone 7+)

性能配置文件：`extensions/pipeline/pipeline/settings/href-setting.ts`

### 渲染管线特性

- **延迟渲染** - G-Buffer + 延迟光照
- **后期处理** - Bloom 泛光、TAA 时间抗锯齿
- **超分辨率** - AMD FSR
- **性能优化** - 遮挡剔除、静态批处理、光照集群

### 许可证

详见 [内容许可协议](./licenses/Cocos%20Cyberpunnk%20Content%20License%20Agreement.md) 和 [版权声明](./licenses/Cocos%20Cyberpunk%20Copyright%20Notice.md)。

### 致谢

游戏场景美术由 [The ArtCore Studios](http://www.artcore-studios.com/) 制作
