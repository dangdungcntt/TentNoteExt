String.isNullOrEmpty = function(value) {
  return !(typeof value === "string" && value.length > 0);
}

function shortUrl(url) {
  return $.ajax({
    url: 'https://short.tentstudy.xyz/api.php',
    method: 'post',
    data: { url },
    dataType: 'json'
  });
}

function saveNote(content) {
  return $.ajax({
    url: "https://note.tentstudy.xyz/actions/addnewlink.php", 
    method: 'post',
    data: { link: content }, 
    dataType: 'json'
  });
}

function saveLinkToNote(linkUrl, title) {
  shortUrl(linkUrl)
  .then(resShort => {
    if (resShort.success) {
      return saveNote(`${title} [[${resShort.url}]]`);
    }
  })
  .then(resSave => {
    // alert(resSave);
    if (resSave.success) {
      alert(resSave.message);
    } else {
      alert(resSave.error);
    }
  })
  .catch(err => alert('Có lỗi xuất hiện'));  
}

function saveToNote(content, title) {
  saveNote(`${title}: ${content}`)
  .then(resSave => {
    if (resSave.success) {
      alert(resSave.message);
    } else {
      alert(resSave.error);
    }
  })
  .catch(err => alert('Có lỗi xuất hiện')); 
}

function openNewTab(url) {
  chrome.tabs.create({url}); 
}

function clickLink(info) {
  var title = prompt("Nhập tiêu đề cho ghi chú");
  if (!String.isNullOrEmpty(title)) {
    if (info.linkUrl) {
      saveLinkToNote(info.linkUrl, title);
    } else if (info.pageUrl) {
      saveLinkToNote(info.pageUrl, title);
    }
  }
}

function selectText(info) {
  var title = prompt("Nhập tiêu đề cho ghi chú");
  if (!String.isNullOrEmpty(title)) {
    saveToNote(info.selectionText, title);
  }
}

function openNote() {
  openNewTab('https://note.tentstudy.xyz');
}

const root = chrome.contextMenus.create({
  title: "TentNote", 
  contexts:["all"], 
});

chrome.contextMenus.create({
  title: "Lưu liên kết vào note.tentstudy.xyz", 
  contexts:["link"], 
  parentId: root,
  onclick: clickLink,
});

chrome.contextMenus.create({
  title: "Lưu trang note.tentstudy.xyz", 
  contexts:["page"], 
  parentId: root,
  onclick: clickLink,
});

chrome.contextMenus.create({
  title: "Lưu nội dung vào note.tentstudy.xyz", 
  contexts:["selection"], 
  parentId: root,
  onclick: selectText,
});

chrome.contextMenus.create({
  title: "Mở note.tentstudy.xyz", 
  contexts:["all"], 
  parentId: root,
  onclick: openNote,
});
