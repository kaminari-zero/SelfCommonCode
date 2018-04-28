namespace haixian {
	export type QueueFunc = (...args) => any;
	type FuncOjb = {
		func: QueueFunc;
		thisObj: any;
		/**
		 * 参数列表
		 */
		args: any[];
		/**
		 * 执行到这个函数,是否暂停执行下一个函数
		 */
		isStop?: boolean;
	};
	/**
	 * Created by yangsong on 15-8-19.
	 * 队列处理
	 */
	export class QueueExecutor {
		private _callBack: Function;
		private _callBackTarget: any;
		private _functions: FuncOjb[] = [];
		private _objPool: FuncOjb[] = [];
		/**
		 * 当前执行的函数
		 */
		private _curExecuteFunc: FuncOjb;
		/**
		 * 构造函数
		 */
		public constructor() {
		}

		/**
		 * 设置全部执行完成处理函数
		 * @param callBack 此队列处理完成执行函数
		 * @param callBackTarget 此队列处理完成执行函数所属对象
		 */
		public setCallBack(callBack: () => Promise<any>, callBackTarget: any): void {

			this._callBack = callBack;
			this._callBackTarget = callBackTarget;
		}


		/**
		 * 注册需要队列处理的函数
		 * @param $func 函数
		 * @param $thisObj 函数所属对象
		 */
		public enqueue(func: QueueFunc, thisObj: any, ...args): void {
			let obj = this._objPool.pop();
			if (obj) {
				obj.func = func;
				obj.thisObj = thisObj;
				obj.args = args;
			} else {
				obj = { func: func, thisObj: thisObj, args: args, isStop: false };
			}
			this._functions.push(obj);
			if (this._curExecuteFunc) {
				return;
			}
			this.execute();
		}
		/**
		 * 注册需要队列处理的函数
		 * @param $func 函数
		 * @param $thisObj 函数所属对象
		 */
		public enqueueAndStop(func: QueueFunc, thisObj: any, ...args): void {
			let obj = this._objPool.pop();
			if (obj) {
				obj.func = func;
				obj.thisObj = thisObj;
				obj.args = args;
			} else {
				obj = { func: func, thisObj: thisObj, args: args, isStop: true };
			}
			this._functions.push(obj);
			if (this._curExecuteFunc) {
				return;
			}
			this.execute();
		}
		/** 队列内方法出现错误的时候,继续下一个 */
		private onError(e: any) {
			DEBUG && egret.error("执行方法队列出错!!!", e)
			this.execute();
		}
		private _promise: Promise<any>;
		/**
		 * 是否暂停执行函数
		 */
		private isStop: boolean = false;
		/**
		 * 开始执行
		 */
		public execute(): void {
			if (this.isStop) {//如果之前暂停处理函数
				this.isStop = false;
				if (this._promise instanceof Promise) {
					this._promise.then(this.execute.bind(this), this.onError.bind(this));
				} else {
					this.execute();
				}
				this._promise = null;
				return;
			}
			if (this._functions.length) {
				let obj = this._curExecuteFunc = this._functions.shift();
				let result: Promise<any> = obj.func.apply(obj.thisObj, obj.args);
				if (obj.isStop) {//暂停执行函数
					this._promise = result;
					this.isStop = true;
					return;
				}
				if (result instanceof Promise) {
					result.then(this.execute.bind(this), this.onError.bind(this));
				} else {
					this.execute();
				}
			} else {
				this._curExecuteFunc = null;
				if (this._callBack) {
					this._callBack.call(this._curExecuteFunc);
				}
			}
		}
		public clear() {
			this._functions.length = 0;
			this._curExecuteFunc = this._callBack = null;
		}
	}

}