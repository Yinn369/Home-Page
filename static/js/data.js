// 配置常量
const CONFIG = {
  CONFIG_PATH: "./config.json",
  FETCH_TIMEOUTS: {
    LAN: 100,
    WAN: 1000,
  },
  DEFAULT_ICON: "hugeicons:app-store",
};

// 存储项目数据
let projectList = [];

// 初始化函数
async function init() {
  try {
    const response = await fetch(CONFIG.CONFIG_PATH);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // 渲染内容
    loadContentHtml(data.group);
    // 检查项目链接状态
    await checkProjectLinksCombined(data.itemHide);
  } catch (error) {
    console.error("初始化失败:", error);
    showErrorMessage("配置加载失败，请检查配置文件。");
  }
}

// 渲染内容HTML
function loadContentHtml(grouplist) {
  const container = document.getElementsByTagName("content")[0];
  if (!container) {
    console.error("找不到content容器元素");
    return;
  }

  container.innerHTML = grouplist
    .map((group, groupIndex) => generateGroupHtml(group, groupIndex))
    .join("");
}

// 生成分组HTML
function generateGroupHtml(group, groupIndex) {
  const { name = "", icon = "", items = [] } = group;
  const groupIcon = `<span class="iconify" data-icon="${icon}" data-width="32" data-height="32"></span>`;

  return `
    <div class="title">
      ${groupIcon} ${name}
    </div>
    <div class="projectList">
      ${items
        .map((item, itemIndex) => generateItemHtml(item, groupIndex, itemIndex))
        .join("")}
    </div>
  `;
}

// 生成项目项HTML
function generateItemHtml(item, groupIndex, itemIndex) {
  const index = `item_${groupIndex}_${itemIndex}`;
  projectList.push({ ...item, index });

  const {
    title = "",
    description = "",
    icon = "",
    url = "",
    lanUrl = "",
  } = item;

  const itemIcon = generateItemIcon(icon);

  return `
    <a class="projectItem itemBox" 
       data-index="${index}" 
       target="_blank" 
       href="${url || lanUrl }" 
       title="${title}">
      <div class="projectItemLeft">
        <h1>${title}</h1>
        <p>${description}</p>
      </div>
      <div class="projectItemRight">
        ${itemIcon}
      </div>
      <div class="projectItemStatus">
      </div>
    </a>
  `;
}

// 生成图标HTML
function generateItemIcon(icon) {
  if (
    icon &&
    (icon.startsWith("http") || icon.startsWith("/") || icon.startsWith("./"))
  ) {
    return `<img src="${icon}" alt="" />`;
  }
  return `<span class="iconify" data-icon="${
    icon || CONFIG.DEFAULT_ICON
  }" data-width="32" data-height="32"></span>`;
}

// 检查项目链接状态
async function checkProjectLinksCombined(hide = false) {
  const results = await Promise.all(
    projectList.map((project) => checkProjectStatus(project, hide))
  );

  if (hide) {
    handleHiddenGroups(results);
  } else {
    // 对警告状态的项目进行重排序
    sortProjectItems();
  }
}

// 对项目进行排序，将警告状态的项目排在后面
function sortProjectItems() {
  const projectLists = document.querySelectorAll(".projectList");
  projectLists.forEach((list) => {
    const items = Array.from(list.children);
    const sortedItems = items.sort((a, b) => {
      const aHasWarn = a.classList.contains("projectItemWarn");
      const bHasWarn = b.classList.contains("projectItemWarn");
      return aHasWarn - bHasWarn; // false(0) 排在 true(1) 前面
    });

    // 重新添加排序后的元素
    sortedItems.forEach((item) => list.appendChild(item));
  });
}

// 检查单个项目状态
async function checkProjectStatus(project, hideMode) {
  const element = document.querySelector(`[data-index="${project.index}"]`);
  if (!element) return;

  const statusIcon = element.querySelector(".projectItemStatus");

  // 检查内网链接
  if (await tryFetchWithTimeout(project.lanUrl, CONFIG.FETCH_TIMEOUTS.LAN)) {
    statusIcon.innerHTML = generateItemIcon("mdi:wan");
    element.href = project.lanUrl; // 设置为内网链接
    return { index: project.index, visible: true };
  }

  // 检查外网链接
  if (await tryFetchWithTimeout(project.url, CONFIG.FETCH_TIMEOUTS.WAN)) {
    statusIcon.innerHTML = generateItemIcon("mdi:lan-pending");
    element.href = project.url; // 设置为外网链接
    return { index: project.index, visible: true };
  }

  if (hideMode) {
    element.style.display = "none";
    return { index: project.index, visible: false };
  }

  element.classList.add("projectItemWarn");
  statusIcon.innerHTML = generateItemIcon("mdi:offline");
}

// 处理隐藏分组
function handleHiddenGroups(results) {
  const groupMap = new Map();

  projectList.forEach((project) => {
    const match = project.index.match(/^item_(\d+)_\d+$/);
    if (match) {
      const groupIdx = match[1];
      if (!groupMap.has(groupIdx)) {
        groupMap.set(groupIdx, []);
      }
      groupMap.get(groupIdx).push(project.index);
    }
  });

  groupMap.forEach((itemIndexes, groupIdx) => {
    const visibleCount = itemIndexes.filter((idx) =>
      results.find((r) => r?.index === idx && r.visible)
    ).length;

    if (visibleCount === 0) {
      const projectListElem =
        document.querySelectorAll(".projectList")[groupIdx];
      const titleElem = document.querySelectorAll(".title")[groupIdx];

      projectListElem?.style.setProperty("display", "none");
      titleElem?.style.setProperty("display", "none");
    }
  });
}

// 带超时的fetch请求
async function tryFetchWithTimeout(url, timeout) {
  if (!url) return false;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

// 显示错误信息
function showErrorMessage(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 3000);
}

// 初始化应用
init();
