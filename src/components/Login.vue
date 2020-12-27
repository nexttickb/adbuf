<template>
<div v-show="mode!=-1" style="position:absolute;width:100%;top:0;bottom:0;z-index:9999;background: #669933;" :class="['login', isError?'shake':'']">

	<div  style="min-width:23rem;width:50%;min-height:9.9rem;position: absolute;top: 50%; left: 50%;transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-webkit-transform: translate(-50%, -50%);">
		<div style="height:1.5rem;width:12rem;font-size:0.7rem;text-align:center;margin:1rem auto 0;color:#eee;">
			{{message}}
		</div>
		<div v-show="!isloading" style="" class="input-group">
			<input v-on:keyup.enter="stateMac" :placeholder="message" :readonly="mode==5" style="" v-model="inputValue" :type="inputType" class="input" />
			<div @click="stateMac" class="btn" style="" v-show="btnText">{{btnText}}</div>
		</div>
		<div v-show="isloading" class="load"></div>
		<div style="" class="btn-group">
			<!--
			<div class="button" v-show="mode<10" @click="mode=11" style="">3秒注册</div>
			<div class="button" v-show="mode>=10" @click="mode=1" style="">返回登录</div>
			-->
			<div class="button" v-show="mode==2" @click="mode=1" style="">换个账号</div>
			<!--
			<div class="button" v-show="mode==12||mode==13" @click="mode=11" style="">换个账号</div>
			-->
		</div>

	</div>
	
</div>
</template>

<script>


export default {
    name: 'Login',
    props: {
    },
    components:{},
    data() {
        return {
			mode:-1,
			message:'',
			btnText:'',
			inputType:'text',
			inputValue:'',
			isloading:0,
			loginForm:{userName:'', passWd:''},
			isError:0,
			regForm:{userName:'', passWd:'', rePassWd:''}
        }
    },
    computed: {
		
    },
	watch : {
		mode:function(){
			console.log(this.mode);
			this.isloading = 0;
			if(this.mode == 1){
				this.message = '请输入登录账号！';
				this.btnText = '验证';
				this.inputType = 'text';
				return;
			}
			if(this.mode == 2){
				this.message = '请输入登录密码！';
				this.btnText = '登录';
				this.inputType = 'password';
				return;
			}
			if(this.mode == 5){
				this.message = '密码输入次数过多，五分钟后再试！';
				this.btnText = '登录';
				this.inputType = 'text';
				return;
			}
			
			if(this.mode == 11){
				this.message = '请输入注册账号！';
				this.btnText = '验证';
				this.inputType = 'text';
				return;
			}
			if(this.mode == 12){
				this.message = '请输入注册密码！';
				this.btnText = '验证';
				this.inputType = 'password';
				return;
			}
			if(this.mode == 13){
				this.message = '请再次输入注册密码！';
				this.btnText = '注册';
				this.inputType = 'password';
				return;
			}
		}
	},
	mounted:function(){
		var self = this;
		RUNKIT.VoimBus.subscribe('public', (topic, res)=>{
			if('login' == res.type){
				this.init();
			}
			if('logged' == res.type){
				this.close();
			}
		});
		this.init();
	},
    methods: {
		init(){
			this.mode = 1;
		},
		close(){
			this.mode = -1;
		},
		async stateMac(){
			let res = {};
			switch(this.mode){
				//0禁止登录
				case 0:
					this.message = '禁止登录！';
				break;
				//1账号验证
				case 1:
					this.loginForm.userName = '' + this.inputValue;
					if(this.loginForm.userName.length <= 0){
						return this.setError();
					}
					this.isloading = 1;
					res = await RUNKIT.ServerApi.checkUser({userName:this.loginForm.userName});
					this.isloading = 0;
					if(res.code == 0){
						this.message = res.info;
						this.setError();
						return;
					}
					this.inputValue = '';
					this.mode = 2;
				break;
				//2密码验证
				case 2:
					this.loginForm.passWd = '' + this.inputValue;
					this.inputValue = '';
					this.isloading = 1;
					res = await RUNKIT.ServerApi.login(this.loginForm);
					this.isloading = 0;
					if(res.code != 0){
						this.message = res.info;
						this.setError();
						return;
					}
					this.mode = -1;
				break;
				
				//10禁止注册
				case 10:
				break;
				//11账号验证
				case 11:
					this.regForm.userName = '' + this.inputValue;
					if(this.regForm.userName.length <= 0){
						return;
					}
					this.isloading = 1;
					res = await RUNKIT.ServerApi.checkUser({userName:this.regForm.userName});
					this.isloading = 0;
					if(res.code != 0){
						this.message = res.info;
						return;
					}
					this.inputValue = '';
					this.mode = 12;
				break;
				//12密码验证
				case 12:
					this.regForm.passWd = '' + this.inputValue;
					//TODO:验证密码有效性
					if(this.regForm.passWd.length < 9){
						this.message = '密码长度必须大于9';
						return this.setError();
					}
					this.inputValue = '';
					this.mode = 13;
				break;
				//13二次密码验证
				case 13:
					this.regForm.rePassWd = '' + this.inputValue;
					if(this.regForm.rePassWd != this.regForm.passWd){
						this.inputValue = '';
						this.mode = 12;
						this.setMessage('两次输入密码不一致，请重新输入密码！');
						this.setError();
						return;
					}
					//TODO:登录验证
					this.isloading = 1;
					res = await RUNKIT.ServerApi.register(this.regForm);
					this.isloading = 0;
					if(res.code != 0){
						this.message = res.info;
						return;
					}
					this.inputValue = '';
					this.mode = 1;
					this.setMessage('注册成功，登录吧，输入账号：');
				break;

			}
		},
		setError(){
			this.isError = 1;
			setTimeout(()=>{
				this.isError = 0;
			},1000);
		},
		setMessage(msg){
			this.$nextTick(()=>{
				this.message = msg;
			});
		},
		showPage(name, param){
            RUNKIT.APP.showPage(name, param || {}, this.$options.name); 
        },
		clickMenu(menu){
			console.log(menu);
			this.showPage(menu.page, menu);
		}
    }
}
</script>

<style lang='less' scoped>
.input-group{
	height:1.5rem;
	border-radius:2rem;
	text-align:center;
	line-height:1.5rem;
	width:12rem;
	display:flex;
	margin:0.5rem auto 0;
	.input{
		flex:1;background:#eee;text-align:center;border-radius:2rem 0 0 2rem;border:0;cursor:default;
	}
	.btn{
		width:3rem;text-align:center;border-radius:0 2rem 2rem 0;background:#999;color:#fff;font-size:0.8rem;
		cursor:default;
	}
}

.btn-group{
	height:1.5rem;width:12rem;margin:0.5rem auto;
	.button{
		width:5rem;font-size:0.7rem;text-align:center;border-radius:1rem;color:#0099FF;float:right;margin-right:0.2rem;
		cursor:pointer;
	}
}


.load {
	height:1.5rem;width:12rem;margin:0.5rem auto;
	border-radius:1rem;
	background: repeating-linear-gradient(45deg, rgba(1,1,1,0.6), rgba(200,200,200,0.6) 5px);
	animation: move 1s linear infinite;
}
@keyframes move {
	0% {
	}
	100% {
	  background-position: 60px; /*你可以试试这个可以控制速度*/
	}
}

.shake{
	-webkit-animation-name: shake;
    animation-name: shake;
	-webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}
@keyframes shake {
	0%, 100% {
		-webkit-transform: translateZ(0);
		transform: translateZ(0);
	}
	10%, 30%, 50%, 70%, 90% {
		-webkit-transform: translate3d(-10px,0,0);
		transform: translate3d(-10px,0,0);
	}
	20%, 40%, 60%, 80% {
		-webkit-transform: translate3d(10px,0,0);
		transform: translate3d(10px,0,0);
	}
}
</style>
