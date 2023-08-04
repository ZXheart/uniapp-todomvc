<script setup>
	import { computed, ref, watchEffect } from 'vue'

	const STORAGE_KEY = 'todoMVC'
	const filters = {
		all: todoList => todoList,
		active: todoList => todoList.filter(item => !item.completed),
		completed: todoList => todoList.filter(item => item.completed),
	}
	// A. state
	const newTodo = ref('')
	const toggleAll = ref(false)
	const editingItem = ref(null)
	const todoList = ref(JSON.parse(uni.getStorageSync(STORAGE_KEY) || '[]'))
	const visibility = ref('all')
	// B. derived state
	const showList = computed(() => filters[visibility.value](todoList.value))
	const remaining = computed(() => filters.active(todoList.value).length)
	// C. persist state
	watchEffect(() => uni.setStorageSync(STORAGE_KEY, JSON.stringify(todoList.value)))
	// D. custom events
	const addTodo = () => {
		if (todoList.value.find(item => item.todo === newTodo.value)) {
			open()
			return
		}
		newTodo.value && todoList.value.push({ todo: newTodo.value, completed: false })
		newTodo.value = ''
	}
	const onToggleAll = (e) => {
		toggleAll.value = !toggleAll.value
		todoList.value.forEach(item => item.completed = toggleAll.value)
	}
	const checkboxChange = e => {
		const values = e.detail.value
		if (visibility.value === 'active') {
			todoList.value.find(item => item.todo === values[0]).completed = true
		} else {
			todoList.value.forEach(item => {
				if (values.includes(item.todo)) item.completed = true
				else { item.completed = false }
			})
		}
	}
	const destroy = index => todoList.value.splice(index, 1)
	const editing = (item) => editingItem.value = item
	const doneEdit = (item, index) => {
		// const others = todoList.value.filter((_, currentIndex) => currentIndex !== index)
		const others = todoList.value.toSpliced(index, 1)
		if (others.find(current => current.todo === item.todo)) {
			open()
			return
		}
		if (!item.todo.length) destroy(index)
		editingItem.value = null
	}
	const removeCompleted = () => {
		todoList.value = filters.active(todoList.value)
	}
	const showAll = () => visibility.value = 'all'
	const showActive = () => visibility.value = 'active'
	const showCompleted = () => visibility.value = 'completed'

	// alert waring message if todo task existed! 
	const popup = ref()
	const open = () => {
		popup.value.open('center')
	}
</script>

<template>
	<!-- <button @click="open">打开弹窗</button> -->
	<uni-popup ref="popup" type="message">
		<uni-popup-message type="error" message="The task existed!"
			:duration="2000"></uni-popup-message>
	</uni-popup>
	<view class="todomvc">
		<view class="header">
			<view class="logo">todos</view>
			<!-- #ifdef H5 -->
			<input class="new-todo" type="text" v-model="newTodo" @blur="addTodo" focus
				placeholder="what needs to be done?">
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<input class="new-todo" type="text" v-model="newTodo" @confirm="addTodo" focus
				placeholder="what needs to be done?">
			<!-- #endif -->
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
								<checkbox class="toggle" :value="item.todo"
									:checked="item.completed" />
								<label class="todo-text"
									:class="{completed:item.completed}">{{item.todo}}</label>
								<view class="destroy" v-if="item.completed">
									<uni-icons type="closeempty" size="20"
										@click="destroy(index)"></uni-icons>
								</view>
							</view>
							<!-- #ifdef H5 -->
							<input class="editing" type="text" @blur="doneEdit(item,index)"
								v-if="editingItem===item" focus v-model="item.todo">
							<!-- #endif -->
							<!-- #ifndef H5 -->
							<input class="editing" type="text" @confirm="doneEdit(item,index)"
								v-if="editingItem===item" focus v-model="item.todo">
							<!-- #endif -->
						</view>
				</template>
			</checkbox-group>
		</view>
		<view class="footer" v-if="todoList.length">
			<view class="item-info">
				<view class="left">{{remaining}} {{remaining===1?'item':'items'}} left</view>
				<view class="clear-done" :class="{checked:true}" v-show="todoList.length>remaining"
					@click="removeCompleted">
					clear completed
				</view>
			</view>
			<view class="filter">
				<view :class="{checked:visibility==='all'}" @click="showAll">All</view>
				<view class="active" :class="{checked:visibility==='active'}" @click="showActive">
					Active</view>
				<view :class="{checked:visibility==='completed'}" @click="showCompleted">Completed
				</view>
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

			.checked {
				padding: 5rpx 20rpx;
				border: 1px solid rgb(184, 63, 69);
				border-radius: 5rpx;
			}

			.item-info {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 30rpx;

				.left {
					height: 70rpx;
					line-height: 70rpx;
				}
			}


			.filter {
				display: flex;
				justify-content: center;
				align-items: center;



				.active {
					margin: 0 30rpx;
				}
			}
		}
	}
</style>