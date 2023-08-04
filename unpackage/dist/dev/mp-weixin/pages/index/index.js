"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_popup_message2 + _easycom_uni_popup2 + _easycom_uni_icons2)();
}
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_popup_message + _easycom_uni_popup + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const STORAGE_KEY = "todoMVC";
    const filters = {
      all: (todoList2) => todoList2,
      active: (todoList2) => todoList2.filter((item) => !item.completed),
      completed: (todoList2) => todoList2.filter((item) => item.completed)
    };
    const newTodo = common_vendor.ref("");
    const toggleAll = common_vendor.ref(false);
    const editingItem = common_vendor.ref(null);
    const todoList = common_vendor.ref(JSON.parse(common_vendor.index.getStorageSync(STORAGE_KEY) || "[]"));
    const visibility = common_vendor.ref("all");
    const showList = common_vendor.computed(() => filters[visibility.value](todoList.value));
    const remaining = common_vendor.computed(() => filters.active(todoList.value).length);
    common_vendor.watchEffect(() => common_vendor.index.setStorageSync(STORAGE_KEY, JSON.stringify(todoList.value)));
    const addTodo = () => {
      if (todoList.value.find((item) => item.todo === newTodo.value)) {
        open();
        return;
      }
      newTodo.value && todoList.value.push({ todo: newTodo.value, completed: false });
      newTodo.value = "";
    };
    const onToggleAll = (e) => {
      toggleAll.value = !toggleAll.value;
      todoList.value.forEach((item) => item.completed = toggleAll.value);
    };
    const checkboxChange = (e) => {
      const values = e.detail.value;
      if (visibility.value === "active") {
        todoList.value.find((item) => item.todo === values[0]).completed = true;
      } else {
        todoList.value.forEach((item) => {
          if (values.includes(item.todo))
            item.completed = true;
          else {
            item.completed = false;
          }
        });
      }
    };
    const destroy = (index) => todoList.value.splice(index, 1);
    const editing = (item) => editingItem.value = item;
    const doneEdit = (item, index) => {
      const others = todoList.value.toSpliced(index, 1);
      if (others.find((current) => current.todo === item.todo)) {
        open();
        return;
      }
      if (!item.todo.length)
        destroy(index);
      editingItem.value = null;
    };
    const removeCompleted = () => {
      todoList.value = filters.active(todoList.value);
    };
    const showAll = () => visibility.value = "all";
    const showActive = () => visibility.value = "active";
    const showCompleted = () => visibility.value = "completed";
    const popup = common_vendor.ref();
    const open = () => {
      popup.value.open("center");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "error",
          message: "The task existed!",
          duration: 2e3
        }),
        b: common_vendor.sr(popup, "1cf27b2a-0", {
          "k": "popup"
        }),
        c: common_vendor.p({
          type: "message"
        }),
        d: common_vendor.o(addTodo),
        e: newTodo.value,
        f: common_vendor.o(($event) => newTodo.value = $event.detail.value),
        g: common_vendor.o(onToggleAll),
        h: toggleAll.value,
        i: todoList.value.length
      }, todoList.value.length ? {
        j: common_vendor.f(common_vendor.unref(showList), (item, index, i0) => {
          return common_vendor.e({
            a: !(editingItem.value === item)
          }, !(editingItem.value === item) ? common_vendor.e({
            b: item.todo,
            c: item.completed,
            d: common_vendor.t(item.todo),
            e: item.completed ? 1 : "",
            f: item.completed
          }, item.completed ? {
            g: common_vendor.o(($event) => destroy(index), item.todo),
            h: "1cf27b2a-2-" + i0,
            i: common_vendor.p({
              type: "closeempty",
              size: "20"
            })
          } : {}) : {}, {
            j: editingItem.value === item
          }, editingItem.value === item ? {
            k: common_vendor.o(($event) => doneEdit(item, index), item.todo),
            l: item.todo,
            m: common_vendor.o(($event) => item.todo = $event.detail.value, item.todo)
          } : {}, {
            n: common_vendor.o(($event) => editing(item), item.todo),
            o: item.todo
          });
        }),
        k: common_vendor.o(checkboxChange)
      } : {}, {
        l: todoList.value.length
      }, todoList.value.length ? {
        m: common_vendor.t(common_vendor.unref(remaining)),
        n: common_vendor.t(common_vendor.unref(remaining) === 1 ? "item" : "items"),
        o: todoList.value.length > common_vendor.unref(remaining),
        p: common_vendor.o(removeCompleted),
        q: visibility.value === "all" ? 1 : "",
        r: common_vendor.o(showAll),
        s: visibility.value === "active" ? 1 : "",
        t: common_vendor.o(showActive),
        v: visibility.value === "completed" ? 1 : "",
        w: common_vendor.o(showCompleted)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "E:/Juilen/HBuilderProjects/uni-todomvc/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
