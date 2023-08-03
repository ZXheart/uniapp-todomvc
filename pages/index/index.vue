<script setup>
	import { computed, ref, watchEffect } from 'vue'
	// state
	const STORAGE_KEY = 'todoMVC'
	const newTodo = ref('')
	const toggleAll = ref(false)
	const editingItem = ref(null)
	// computed
	const todoList = ref([
		{ todo: '66', completed: false },
		{ todo: '77', completed: false },
	])
	// persist state
	todoList.value = JSON.parse(uni.getStorageSync(STORAGE_KEY))
	watchEffect(() => {
		uni.setStorageSync(STORAGE_KEY, JSON.stringify(todoList.value))
	})
	const activeList = ref()
	const completedList = ref()
	const showList = ref()
	let show = todoList.value

	watchEffect(() => showList.value = show)

	watchEffect(() => activeList.value = todoList.value.filter(item => !item.completed))
	watchEffect(() => completedList.value = todoList.value.filter(item => item.completed))
	//custom events
	const addTodo = () => {
		newTodo.value && todoList.value.unshift({ todo: newTodo.value, completed: false })
		newTodo.value = ''
	}
	const onToggleAll = (e) => {
		toggleAll.value = !toggleAll.value
		todoList.value.forEach(item => item.completed = toggleAll.value)
	}
	const checkboxChange = e => {
		const values = e.detail.value
		todoList.value.forEach(item => {
			if (values.includes(item.todo)) item.completed = true
			else { item.completed = false }
		})
	}
	const destroy = (index) => {
		todoList.value.splice(index, 1)
	}
	const editing = (item) => {
		editingItem.value = item
	}
	// means nothings but for input autofocus
	// #ifdef H5
	// const tt = () => {}
	// #endif
	const doneEdit = (item, index) => {
		if (!item.todo.length) todoList.value.splice(index, 1)
		editingItem.value = null
	}
	const showAll = () => {
		show = todoList.value
	}
	const showActive = () => {
		show = activeList.value
	}
	const showCompleted = () => {
		console.log(completedList.value)
		show = completedList.value
	}
</script>

<template>
	<view class="todomvc">
		<view class="header">
			<view class="logo">todos</view>
			<input class="new-todo" type="text" v-model="newTodo" @blur="addTodo" focus placeholder="what needs to be done?">
			<checkbox class="toggle-all" @click="onToggleAll" :checked="toggleAll"></checkbox>
		</view>
		<view class="main" v-if="todoList.length">
			<checkbox-group @change="checkboxChange">
				<template v-for="item,index in showList" :key="item.todo">
					<!-- #ifdef H5 -->
					<view class="todo-item" @click="editing(item)">
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<view class="todo-item" @longpress="editing(item)">
							<!-- #endif -->
							<view class="view" v-if="!(editingItem===item)">
								<checkbox class="toggle" :value="item.todo" :data-current="item.todo" :checked="item.completed" />
								<label class="todo-text" :class="{completed:item.completed}">{{item.todo}}</label>
								<view class="destroy" v-if="item.completed">
									<uni-icons type="closeempty" size="20" @click="destroy(index)"></uni-icons>
								</view>
							</view>
							<input class="editing" type="text" @blur="doneEdit(item,index)" v-if="editingItem===item" focus v-model="item.todo">
						</view>
				</template>
			</checkbox-group>
		</view>
		<view class="footer">
			<view class="left">{{activeList.length}} item left</view>
			<view class="filter">
				<view :class="{checked:show===todoList}" @click="showAll">All</view>
				<view class="active" :class="{checked:show===activeList}" @click="showActive">Active</view>
				<view :class="{checked:show===completedList}" @click="showCompleted">Completed</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.toggle-all :deep(.uni-checkbox-input) {
		border-radius: 50% !important;
	}

	// --------------------------------------
	.todomvc {
		background-color: rgb(245, 245, 245);
		height: 100vh;

		.header {
			position: relative;

			.logo {
				text-align: center;
				font-size: 160rpx;
				color: rgb(184, 63, 69);
			}

			.new-todo {
				padding-left: 100rpx;
				background-color: #fff;
				border-top: 1px solid #eee;
				height: 100rpx;
			}

			.toggle-all {
				position: absolute;
				bottom: 25rpx;
				left: 20rpx;
			}
		}

		.main {
			.todo-item {
				position: relative;
				padding-left: 100rpx;
				background-color: #fff;
				border-top: 1px solid #eee;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 35rpx;

				.toggle {
					position: absolute;
					left: 20rpx;
				}

				.completed {
					text-decoration: line-through;
					color: #aaa;
				}

				.destroy {
					position: absolute;
					top: 0;
					right: 20rpx;

					:deep(.uniui-closeempty) {
						color: #aaa !important;
					}
				}

				.editing {
					position: absolute;
					left: 100rpx;
					bottom: 0;
					width: calc(100% - 100rpx);
					height: 100rpx;
					line-height: 100rpx;
					border: 1px solid rgb(184, 63, 69);
					font-size: 35rpx;
				}
			}
		}

		.footer {
			height: 150rpx;
			background-color: #fff;
			border-top: 1px solid #eee;

			.left {
				padding-left: 30rpx;
				height: 70rpx;
				line-height: 70rpx;
			}

			.filter {
				display: flex;
				justify-content: center;
				align-items: center;

				.checked {
					padding: 5rpx 20rpx;
					border: 1px solid rgb(184, 63, 69);
					border-radius: 5rpx;
				}

				.active {
					margin: 0 30rpx;
				}
			}
		}
	}
</style>