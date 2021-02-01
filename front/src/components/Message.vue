<template>
	<div class='' style='flex:1;display:flex;'>
		<div class="msg-lr-panel info-panel" style="display:flex;flex-direction:column;">
			<div style="height:1.2rem;line-height:1.2rem;box-sizing:border-box;display:flex;" class="inner">
				<div @click="userTypeTab = 0" :class="[userTypeTab == 0?'tab-active':'','tab']">待回复</div>
				<div @click="userTypeTab = 1" :class="[userTypeTab == 1?'tab-active':'','tab']">最近联系</div>
			</div>
			<div style="height:1rem;box-sizing:border-box;display:flex;" class="inner">
				<input style="width:100%;font-size:0.5rem;border:1px solid #ccc;border-radius:0.2rem;" class="tab" type="text" />
			</div>
			<div style="background:#fff;flex:1;" class="scl inner">
				<div style="float:left;width:100%;height:2rem;border-top:1px solid #eee;" v-for="(value, key) in onlineList"  :class="[activeUserId == key?'active':'']" @click="onMenuClick(key, value)">
					<div style="height:1rem;line-height:1rem;display:flex;"><div style="flex:1;overflow:hidden">{{value.user_name}}</div><div style="width:2rem;color:#ccc">00:42</div></div>
					<div style="height:0.9rem;color:#ccc;">{{value.user_name}}</div>
				</div>
			</div>
		</div>
		<div style="flex:1;display:flex;flex-direction:column;">
			
			<div class="msg-header" style="box-sizing:border-box;padding-left:0.2rem;">
				<div style="width:9rem;float:left;overflow:hidden">{{userInfo.user_name}}</div>
				<div class="msg-menu list" @click="infoPanel.isOpen = !infoPanel.isOpen"></div>
			</div>
			
			<div class="msg-body" style="overflow-y:scroll">
				<div class="msg-display scl" v-show="fPanelSelected == 'msg'"  ref="messagelist" style="">
					
					<template v-for="(item) in messages">
						<div class="msg-item" v-show="!item.isme">
							<div class="avatar">
								<div class="hide-box" style="float:right;">
									<span class="arrow arrow-left">◆</span>
								</div>
							</div>
							<div class="content-left">
								<span class="con-text">
									{{item.content}}
								</span>
							</div>
							
						</div>
						
						<div class="msg-item" v-show="item.isme">
							<div class="content-right">
								<span class="con-text">
									<div class="content-status">
										<div class="warn" v-show="item.status == -1">!</div>
										<div class="loading rotation" v-show="item.status == 0">。</div>
									</div>
									{{item.content}}
								</span>
							</div>
							<div class="avatar">
								<div class="hide-box">
									<span class="arrow arrow-right">◆</span>
								</div>
							</div>
						</div>
					</template>
					
				</div>
				<div v-show="fPanelSelected == 'msg'" class="message-bottom" style="height:7rem;display:flex;flex-direction:column;background:rgb(255,255,255);">
					<div class="bottom-toolbar" style="height:1.5rem;background:rgb(245,245,245);border-top:1px solid #ddd"></div>
					<textarea @keyup.ctrl.enter="sendMessage" v-model="messageInput" class="bottom-edit scl"  style="flex:1"></textarea>
				</div>
				<div v-show="fPanelSelected == 'term'" class="flex1 term"></div>
			</div>
		</div>
		
		<div class="msg-lr-panel info-panel" v-show="infoPanel.isOpen" style="display:flex;flex-direction:column;">
			<div style="height:5rem;background:#fff;" class="scl inner">
				<div>国家:{{userInfo.user_ext.country}}</div>
				<div>地区:{{userInfo.user_ext.area}}</div>
				<div>系统:{{userInfo.user_ext.os}}</div>
				<div>浏览器:{{userInfo.user_ext.browser}}</div>
				<div>IP:{{userInfo.user_ext.ip}}</div>
				<div>备注:{{userInfo.user_ext.remark}}</div>
			</div>
			<div style="height:1.2rem;line-height:1.2rem;box-sizing:border-box;display:flex;" class="inner">
				<div @click="fastMsgTab = 0" :class="[fastMsgTab == 0?'tab-active':'','tab']">个人快捷语</div>
				<div @click="fastMsgTab = 1" :class="[fastMsgTab == 1?'tab-active':'','tab']">公共快捷语</div>
			</div>
			<div style="height:1rem;box-sizing:border-box;display:flex;" class="inner">
				<input style="width:100%;font-size:0.5rem;border:1px solid #ccc;border-radius:0.2rem;" class="tab" type="text" />
			</div>
			<div style="background:#fff;flex:1;" class="scl inner">
				<p v-show="fastMsgTab == 0" v-for="i in 20">个人{{i}}</p>
				<p v-show="fastMsgTab == 1" v-for="i in 20">公共{{i}}</p>
			</div>
		</div>
		
	</div>

</template>

<script>

export default {
	name: 'Message',
	data () {
		return {
			isShow:1,
			fPanelSelected:'msg',
			fastMsgTab:0,
			userTypeTab:0,
			activeUserId:'',
			messageInput:'',
			onlineList:[
				{user_name:"hello0", active:0},
			],
			userInfo:{
				user_name:'',
				user_id:'',
				user_ext:{}
			},
			infoPanel:{
				isOpen:true,
			},
			messages:{},
			
		}
	},
	components:{},
	props: ['id', 'msg'],
	created:function(){

	},
	watch: {
		messages() {
			this.$nextTick(() => {
				let list = this.$refs.messagelist;
				list.scrollTop = list.scrollHeight;
			});
		}
	},
	mounted:function(){
		var self = this;

		RUNKIT.VoimBus.subscribe('setConf', (topic, res)=>{
			if(this.id == res.id){
		//		alert(JSON.stringify(res));
				this.setConf(res.data);
				this.init(res.params);
			}
		});
		
		RUNKIT.VoimBus.subscribe('network', (topic, res)=>{
			if(res.type == 'init'){
				this.init();
			}
		});
		this.getUserList();
	},
	methods:{
		init(params){
			
			
			//频道接收模式
			window.RUNKIT.ServerApi.send('', {}, (code, data, time)=>{
				console.log(code, data);
				this.onRecvData(data.data);
			}, {mode : 0, timeout: 0, req:'message'});
			this.addMessage({isme:0, msgId:"aaaaaaa", name:"", avatar:"", type:"t", content:"hello"});
			
		//	this.$set(this, 'userInfo', params);
		//	this.$set(this.userInfo, 'user_ext', params);
			/*
			this.userInfo.user_name = params.user_name;
			this.userInfo.user_id = params.user_id;
			this.userInfo.user_ext = params.user_ext;
			*/
		},
		setConf(data){
		},
		getUserList(){
			RUNKIT.ServerApi.send("Admin.userList", {}, (bl, res)=>{
				this.onlineList = JSON.parse(JSON.stringify(res.list));
			});
		},
		onRecvData(data){
			console.log("recv:", data);
			if(data.type =='ack'){
				this.messages[data.msgId].status = 1;
				clearTimeout(this.messages[data.msgId].timeout);return;
			}
			if(typeof(data.data) != "undefined")
				this.addMessage({msgId: data.msgId, isme:0, id:"", name:"", avatar:"", type:data.type, content:data.data});
		},
		addMessage(data){
			if(data.isme == 1){
				data.timeout = setTimeout(()=>{
					data.status = -1;
				}, 6000);
			}
			this.$set(this.messages, data.msgId, data);
		},
		sendMessage(){
			if(!this.messageInput)return;
			var messageUid = window.RUNKIT.ServerApi.createUUID();
			let messageText = this.messageInput;
			let msgData = (typeof(messageText)=="undefined"?this.messageInput:messageText);
			this.addMessage({
				isme:1, 
				status:0, 
				msgId:messageUid, 
				avatar:"",
				type:"t", 
				content:msgData, 
				timeout:0
			});
			let sendBuf = {from_user:'', to_user:this.userInfo.user_id, data:{msgId:messageUid, type:'text', data:messageText}};
			window.RUNKIT.ServerApi.send('Admin.sendMsg', sendBuf, (code, data, time)=>{
				console.log(code, data);
				if(0 == code){
					sendBuf.data.type = 'ack';
					this.onRecvData(sendBuf.data);
				}
			});
			setTimeout(()=>{
				this.messageInput = "";
			});
		},
		GetQueryString(name){
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
			if(r!=null)return  unescape(r[2]); return null;
		},
		onClickVioceStart(e){
			console.log("down", e);
			window.baiduAsrPlugin.begin();
		},
		onClickVioceStop(e){
			console.log("up", e);
			window.baiduAsrPlugin.stop();
		},
		onMenuClick(k, v){
			this.activeUserId = k;

			//test
			this.userInfo.user_name =v.user_name;
			this.userInfo.user_id = v.user_id;
			this.userInfo.user_ext = v;
			
			console.log(k, v);
		}
	}
}
</script>

<style lang="less" scoped>
	*{
		outline:none;
	}
	.message{
		display:flex;flex-direction:row;
	}
	.msg-body{
		flex:1;display:flex;flex-direction:column;
		background: #efefef;
	}
	.msg-header{
		height:1.5rem;text-align:left;background:rgb(250,250,250);border-bottom:1px solid #ddd;
		font-size:0.8rem;line-height:1.5rem;
	}
	.msg-menu{
		width:3rem;cursor:default;float:right;margin-right:0.5rem;box-sizing:border-box;
	}
	.msg-menu:action, .msg-menu:hover{
		color:#f00;
		background:#ccc;
	}
	.flex1{
		flex:1;
	}
	.term{
		background:#333;color:#0f0;
	}
	.msg-lr-panel{
		width:7rem;
	}
	.msg-display{
		flex:1;padding:0.1rem;
	}
	
	.scl{
		overflow-y:scroll;
	}
	.scl::-webkit-scrollbar {
        width: 0.2rem;
        height: 0.2rem;
    }
	.scl::-webkit-scrollbar-thumb {
        border-radius: 0.2rem;
        background: #888;
    }
	.scl::-webkit-scrollbar-track {
        background: #EDEDED;
    }
	
	.console{
		width:1.5rem;
		height:1.5rem;
		background:url('../assets/icon/console.svg') no-repeat center;
		background-size: 70% 70%;
	}

	.msg{
		width:1.5rem;
		height:1.5rem;
		background:url('../assets/icon/message.svg') no-repeat center;
		background-size: 80% 80%;
	}

	.list{
		width:1.5rem;
		height:1.5rem;
		background:url('../assets/icon/list.svg') no-repeat center;
		background-size: 80% 80%;
	}

	
	.msg-item {
		margin-top:0.8rem;
		margin-bottom:0.8rem;
		display:flex;
		min-height:3rem;
	}
	.avatar{
		width:2rem;
		height:2rem;
		background:#aaa;
		border-radius:3rem;
		margin:0 0.5rem 0 0.5rem;
	}
	.content-left, .content-right{
		flex:1;
		font-size:0.6rem;
	}
	.arrow{
		position:relative;
		font-size:2rem;
		display:none;
	}
	.arrow-left{
		color:#fff;
		margin-right:-1.2rem;
		text-shadow: -1px 0px 1px #aaa;
	}
	.arrow-right{
		color:#90d936;
		margin-left:-1.2rem;
		text-shadow: 1px 0px 1px #aaa;
	}
	.hide-box{
		width:0;
		height:0;
	}
	.con-text{
		box-shadow: 0px 0.6rem 1.9rem #ddd;
		border:1px solid #ccc;
		
		max-width: 69%;
		word-break: normal;
		word-wrap: break-word;
		word-break: break-all;
	}
	.bottom-edit{
		word-break: normal;
		word-wrap: break-word;
		word-break: break-all;
		font-size:0.69rem;
		padding:0.2rem;
		box-sizing:border-box;
	}
	.content-left .con-text{
		margin-right:0.3rem;
		background-color: #fff;
		border-radius:0.5rem;
		padding:0.6rem;
		float:left;
		margin-right:20%
	}
	.content-right .con-text{
		margin-left:0.3rem;
		background-color: #90d936;
		border-radius:0.5rem;
		padding:0.6rem;
		float:right;
		margin-left:20%
	}
	.content-left:before {

	}
	.content-right:before {

	}
	
	.content-status{
		width:0;height:0;
	}
	.warn, .loading{
		width:0.9rem;
		height:0.9rem;
		line-height:0.9rem;
		font-size:0.6rem;
		text-align:center;
		cursor:pointer;
		border-radius:2rem;
		position:relative;
		left:-1.69rem;
	}
	@-webkit-keyframes rotation{
		from {-webkit-transform: rotate(0deg);}
		to {-webkit-transform: rotate(360deg);}
	}

	.rotation{
		-webkit-transform: rotate(360deg);
		animation: rotation 1s linear infinite;
	}
	.warn{
		background:#f00;
		color:#fff;
	}
	.loading{
		background:#fff;
		color:#ccc;
	}
		
	.tab{
		flex:1;
		font-size:0.6rem;
		text-align:center;
		padding-bottom:0.1rem;
	}
	.tab-active{
		font-weight:bold;
		color:#58bc9c;
		border-bottom:1px solid #58bc9c;
	}
			
	.info-panel{
		font-size:0.6rem;
		line-height:0.8rem;
		box-sizing:border-box;

		&>div{
			width:100%;float:left;
		}
	}
	.inner{
		box-sizing:border-box;
		padding:0.1rem;
	}
	
	.active{
		color:#fff;
		background:#38f;
	}

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
</style>
