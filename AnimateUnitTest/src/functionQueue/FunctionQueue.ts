module MyQueue {
	export interface FunctionInterFace {
		function: (...args) => Promise<any> | void,
		thisObj: any,
		parmes?: any[],
		isRun?: boolean,
		id?: number,
		delayTime?:number,
		functionName?:string,
		/** 是否暂停 */
		// isStop?: boolean,
	}
	/**
	 * 方法队列:主要用于控制不同协议之间方法有序,同步运行(主要用于,开始流程和结束流程的流程同步控制)
	 */
	export class FunctionQueue extends egret.EventDispatcher {
		/** 队列 */
		private queue: FunctionInterFace[] = [];
		private promiseChain: Promise<any>;
		private flagCount: number = 0;

		/** 方法已完成! */
		public static FunctionComplete = "FunctionComplete";

		public constructor() {
			super();
		}

		/** 入队 */
		public enqueue(fn: FunctionInterFace) {
			fn.isRun = false;
			fn.id = this.flagCount++;
			this.queue.push(fn);
			egret.log("function enqueue!");
			if (this.promiseChain) {
				return;
			}
			this.dequeue();
		}
		
		/** 获得方法名 */
		private getName = function (target: any) {
			return target.toString()
		}

		/** 队列内方法出现错误的时候,继续下一个 */
		private onError(e:any) {
			DEBUG && egret.error("执行方法队列出错!!!",e)
			this.dequeue();
		}

		/** 出队 */
		private  dequeue() {
			if (this.queue.length > 0) {
				let curFun = this.queue.shift();
				egret.log("function dequeue!");
				// egret.log("function name = ", this.getName(curFun.function));
				this.promiseChain = curFun.function.apply(curFun.thisObj, curFun.parmes)
				if (this.promiseChain) {
					this.promiseChain.then(this.dequeue.bind(this), this.onError.bind(this));
				} else {
					this.dequeue();
				}
			} else {
				this.promiseChain = null;
				egret.log("no function dequeue!");
			}
		}

		//===============================延迟入队========================================
		/** 保存计时器的id */
		private _timeList: number[] = [];
		/** 
		 * 同步延迟,阻塞,阻塞多少毫秒
		 */
		public delayEnqueueSync(fn: FunctionInterFace, delay: number,callback?:FunctionInterFace) {
			//额外入队一个等待方法
			fn.id = this.flagCount++;
			if(callback)
				this.enqueue({function:this.wait,thisObj:this,parmes:[fn,delay,callback]});
			else
				this.enqueue({function:this.wait,thisObj:this,parmes:[fn,delay]});
		}

		/**
		 * 用于异步函数,等待多少毫秒
		 * 同步等待
		 */
		private wait(targetFun: FunctionInterFace,delay: number,callback:FunctionInterFace = {function:this.defaultWaitCallback,thisObj:this,parmes:["方法等待结束!准备正式进入下个方法的执行!"]}) {
			let promise:Promise<any> = new Promise((resolve: Function) => {
				const _waitTimer = egret.setTimeout(() => {
					this._timeList.splice(this._timeList.indexOf(_waitTimer), 1); 
					//插队
					//等待时间结束,将方法放入队列头部
					// targetFun.isRun = false;
					this.queue.unshift(targetFun);
					resolve(); //先让等待方法执行完毕,之后再插入目标方法,执行目标方法
				}, this, delay);
				this._timeList.push(_waitTimer);
			});
			if(callback){
				promise.then(()=>{
					callback.function.apply(callback.thisObj,callback.parmes);				
				});
			}
			return promise;
		}

		private defaultWaitCallback(...str:string[]){
			egret.log(str);
		}


		//==========================挂起出队:如果有延迟的话,可以挂起,让其他执行,之后再加入========================
		/**
		 * 任务挂起,通过执行时间后,重新回到队列中去
		 * 该方式的时间控制不精确,因为会有可能会因为并发,导致同一时间多个方法先后入队头,
		 * 只适用于让某些方法在某些时间点加入流程中
		 */
		private taskSuspension(targetFun: FunctionInterFace,delay: number,callback:FunctionInterFace =  {function:this.defaultWaitCallback,thisObj:this,parmes:["方法等待结束!重新回到队列等待执行!"]}) {
			egret.log("方法开始挂起");
			let promise:Promise<any> = new Promise((resolve: Function) => {
				const _waitTimer = egret.setTimeout(() => {
					this._timeList.splice(this._timeList.indexOf(_waitTimer), 1); 
					//方法挂起结束,开始执行
					if(this.queue && (this.queue.length === 0)){
						this.enqueue(targetFun);
						egret.log("taskSuspension enqueue");
					} else if (this.queue && (this.queue.length>0)) {
						// targetFun.isRun = false;
						//插队
						// this.queue.splice(1,0,targetFun);
						// egret.log("function enqueue!");
						this.queue.unshift(targetFun);
						egret.log("taskSuspension enqueue unshift");
					}
					egret.log("function enqueue!?");
					if(callback){
						callback.function.apply(callback.thisObj,callback.parmes);
					}
				}, this, delay);
				this._timeList.push(_waitTimer);
				resolve();//挂起目标方法,暂不执行,立刻执行下个方法
			});
			return promise;
		}

		/** 
		 * 异步延迟,挂起,等待多少毫秒
		 */
		public delayEnqueueAsync(fn: FunctionInterFace, delay: number,callback?:FunctionInterFace){
			fn.id = this.flagCount++;
			if(callback)
				this.enqueue({function:this.taskSuspension,thisObj:this,parmes:[fn,delay,callback]});
			else
				this.enqueue({function:this.taskSuspension,thisObj:this,parmes:[fn,delay]});
		}

		//================================快速入队:有些方法一旦入队,希望能立即执行(作用不大)===================================
		/**
		 * 快速入队:入队后,下一个出队的是该方法,有可能受延迟入队影响
		 */
		public quickEnqueue(fn: FunctionInterFace) {
			fn.isRun = false;
			fn.id = this.flagCount++;
			this.queue.unshift(fn); //直接插入对头,会受延期入队和挂起入队影响导致好出队时机被延迟
			egret.log("function enqueue!");
			if (this.promiseChain) {
				return;
			}
			this.dequeue();
		}


		/** 清除方法队列 */
		public destory() {
			if (this._timeList.length) {
				const len = this._timeList.length;
				for(let i = this._timeList.length - 1; i >= 0; --i){
					egret.clearTimeout(this._timeList[i]);
				}
				this._timeList = null;
			}
			this.queue = [];
		}

	}
}