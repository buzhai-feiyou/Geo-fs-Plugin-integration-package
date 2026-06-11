#🚀  GeoFS HUD-战斗机式平视显示器

[![许可证](https://img.shields.io/badge/license-GPLv3-blue.svg)](许可证)
[![GeoFS](https://img.shields.io/badge/GeoFS-Compatible-brightgreen.svg)](https://www.geo-fs.com)
[![版本](https://img.shields.io/badge/version-5.7.3-orange.svg)]()

用于GeoFS飞行模拟器的专业战斗机式平视显示器(HUD)。完全可定制、硬件加速且专为最佳飞行体验而设计。

---

##✨ 功能

|类别|特征|
|----------|---------|
| **核心** |空速、高度、垂直速度、航向、重力、推力、俯仰、横摇|
| **先进的** |姿态指示器、空速带、高度带、航向罗盘|
| **定制** |自定义HUD颜色、背景框切换、不透明度、比例、位置|
| **双数据** |TAS/GS可切换(主+子显示器)，MSL/AGL可切换(主+子显示器)|
| **磁带选项** |卷轴速度可调，适用于空速/高度磁带|
| **Attitude Indicator** | Pitch step (5°/10°), Line spacing (1-5px) |
| **Presets** | Center (no ads), Center (ads), Top-left |
| **Performance** | Uses Canvas (not DOM), Optimized rendering, No FPS drop |
| **Compatibility** | Works with Tampermonkey / Violentmonkey, Supports GeoFS default and modded aircraft |

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| `L` | Toggle HUD On/Off |
| `shift+L` | Open Settings Panel |
| `Alt + L` | Cycle Presets |

---

## 🖥️ Settings Panel

| Option | Description |
|--------|-------------|
| Preset | Switch between layouts |
| X/Y Position | Move HUD anywhere |
| Scale | Resize HUD (0.5x - 2.0x) |
| Opacity | Set transparency (0.3 - 1.0) |
|空速胶带卷轴|调整滚动速度|
|海拔磁带卷轴|调整滚动速度(x10)|
|姿态步骤|5°或10°增量|
|姿态线间距|1-5像素|
|背景框|切换黑色背景|
|主速度显示|TAS或GS|
|主高度显示|MSL或AGL|
|HUD主色|自定义十六进制颜色选择器|

所有设置均为**已自动保存**到您的浏览器。

---

##📥 安装

1.安装用户脚本管理器：[TamperMonkey](https://www.tampermonkey.net/)或[Violentmonkey](https://violentmonkey.github.io/)
2.点击[在这里](https://github.com/buzhai-feiyou/GeoFS-HUD/raw/main/geofs-hud.user.js)安装脚本
3.打开[GeoFS](https://www.geo-fs.com)
4.按`L`显示HUD

---

##🛠️请求

-现代浏览器(Chrome、Firefox、Edge等)
-geofs在3d模式下运行
-TamperMonkey或Violentmonkey扩展

---

##❓ 常见问题解答

**问：HUD未显示。我应该怎么做？**  
答：确保已启用TamperMonkey，重新加载页面，然后按`L`。 检查控制台(F12)是否有错误。

**问：我可以更改HUD的位置吗？**  
答：是，使用设置面板(`shift+L`).

**问：这是否适用于GeoFS Mobile？**  
答：它可能行得通，但它针对桌面浏览器进行了优化。

**问：空中交通管制有英文版的吗？**  
a：还没有。ATC插件目前只有中文版本。

**问：这真的是最好的HUD吗？**  
答：作者认为是这样。10，000多名GeoFS玩家同意这一观点。 🏆

---

##📜 许可证

此项目是根据**GPLv3**。您可以自由使用、修改和分发它，但必须保留原始版权声明和作者信用。

---

##🙏学分

**作者**: [不宅的飞友(布寨德飞友)](https://space.bilibili.com/3546664033847377)  
**支持**：B站(Bilibili)关注者和GeoFS社区

---

##💖礼物

如果您喜欢使用此HUD，请考虑给**喜欢，硬币，和最喜欢的**在我的哔哩哔哩主页上。  
您的支持使我有动力更新和改进。

[🎁 单击此处支持我](https://space.bilibili.com/3546664033847377)

---

##🌟星号此回购

如果这个HUD使您的GeoFS飞行更愉快，给它一个星！ ⭐
