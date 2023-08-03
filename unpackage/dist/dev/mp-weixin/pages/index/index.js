"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const STORAGE_KEY = "todoMVC";
    const newTodo = common_vendor.ref("");
    const toggleAll = common_vendor.ref(false);
    const editingItem = common_vendor.ref(null);
    const todoList = common_vendor.ref([
      { todo: "66", completed: false },
      { todo: "77", completed: false }
    ]);
    todoList.value = JSON.parse(common_vendor.index.getStorageSync(STORAGE_KEY));
    common_vendor.watchEffect(() => {
      common_vendor.index.setStorageSync(STORAGE_KEY, JSON.stringify(todoList.value));
    });
    const activeList = common_vendor.ref();
    const completedList = common_vendor.ref();
    const showList = common_vendor.ref();
    let show = todoList.value;
    common_vendor.watchEffect(() => showList.value = show);
    common_vendor.watchEffect(() => activeList.value = todoList.value.filter((item) => !item.completed));
    common_vendor.watchEffect(() => completedList.value = todoList.value.filter((item) => item.completed));
    const addTodo = () => {
      newTodo.value && todoList.value.unshift({ todo: newTodo.value, completed: false });
      newTodo.value = "";
    };
    const onToggleAll = (e) => {
      toggleAll.value = !toggleAll.value;
      todoList.value.forEach((item) => item.completed = toggleAll.value);
    };
    const checkboxChange = (e) => {
      const values = e.detail.value;
      todoList.value.forEach((item) => {
        if (values.includes(item.todo))
          item.completed = true;
        else {
          item.completed = false;
        }
      });
    };
    const destroy = (index) => {
      todoList.value.splice(index, 1);
    };
    const editing = (item) => {
      editingItem.value = item;
    };
    const doneEdit = (item, index) => {
      if (!item.todo.length)
        todoList.value.splice(index, 1);
      editingItem.value = null;
    };
    const showAll = () => {
      show = todoList.value;
    };
    const showActive = () => {
      show = activeList.value;
    };
    const showCompleted = () => {
      console.log(completedList.value);
      show = completedList.value;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(addTodo),
        b: newTodo.value,
        c: common_vendor.o(($event) => newTodo.value = $event.detail.value),
        d: common_vendor.o(onToggleAll),
        e: toggleAll.value,
        f: todoList.value.length
      }, todoList.value.length ? {
        g: common_vendor.f(showList.value, (item, index, i0) => {
          return common_vendor.e({
            a: !(editingItem.value === item)
          }, !(editingItem.value === item) ? common_vendor.e({
            b: item.todo,
            c: item.todo,
            d: item.completed,
            e: common_vendor.t(item.todo),
            f: item.completed ? 1 : "",
            g: item.completed
          }, item.completed ? {
            h: common_vendor.o(($event) => destroy(index), item.todo),
            i: "1cf27b2a-0-" + i0,
            j: common_vendor.p({
              type: "closeempty",
              size: "20"
            })
          } : {}) : {}, {
            k: editingItem.value === item
          }, editingItem.value === item ? {
            l: common_vendor.o(($event) => doneEdit(item, index), item.todo),
            m: item.todo,
            n: common_vendor.o(($event) => item.todo = $event.detail.value, item.todo)
          } : {}, {
            o: common_vendor.o(($event) => editing(item), item.todo),
            p: item.todo
          });
        }),
        h: common_vendor.o(checkboxChange)
      } : {}, {
        i: common_vendor.t(activeList.value.length),
        j: common_vendor.unref(show) === todoList.value ? 1 : "",
        k: common_vendor.o(showAll),
        l: common_vendor.unref(show) === activeList.value ? 1 : "",
        m: common_vendor.o(showActive),
        n: common_vendor.unref(show) === completedList.value ? 1 : "",
        o: common_vendor.o(showCompleted)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "E:/Juilen/HBuilderProjects/uni-todomvc/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
