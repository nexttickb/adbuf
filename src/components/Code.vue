<template>
	<div class="code-edit" id="tpl-terminal" style="flex:1;box-sizing:border-box;display:flex;">
		<textarea :readonly="readonly" v-model="codeContent" wrap="off" style="overflow:scroll;resize: none;line-height:0.55rem;border:0;font-size:0.42rem;background:#333;color:#eee;flex:1;"></textarea>
	</div>
</template>

<script>
//import UserInfo from '@/components/UserInfo'
export default {
    name: '',
    props: ['id'],
    components:{},
	
	mounted:function(){
		var self = this;
		RUNKIT.VoimBus.subscribe('public', (topic, res)=>{
			if('showPage' == res.type){
				if(res.data.name == 'shell'){
					
				}
			}
		});
		RUNKIT.VoimBus.subscribe('shell', (topic, res)=>{
			console.log("Dash recv:", topic, res);
		});
		RUNKIT.VoimBus.subscribe('setConf', (topic, res)=>{
			console.log(topic, res);
			if(this.id == res.id){
				this.init(res.params, res.data);
			}
		});
		
	},
    data() {
        return {
			lineNum:0,
			codeContent:'',
			pageInfo:'',
			params: {},
			timer:0,
			readonly:1,
			isMonitor:0,
			isloading:0,
        }
    },
    computed: {
    },
	mounted:function(){
		var self = this;
		window.onresize = () => {
			this.handleScroll();
		}
		RUNKIT.VoimBus.subscribe('setConf', (topic, res)=>{
			if(this.id == res.id){
				this.setConf(res);
			}
		});
	},
	watch:{
		codeContent(val){
			//防抖 :)
			console.log('保存', this.timer);
			if((this.codeContent + '').length < 1 || this.timer || !this.isMonitor)return;
			
			console.log('保存');
			
			this.timer = setTimeout(()=>{
				this.params[this.pageInfo.codeConfig.contentCol] = this.codeContent;
				this.isloading = 1;
				RUNKIT.ServerApi.send(this.pageInfo.api.update, {data:this.params}, (bl, res)=>{	
					console.log('detail:', bl, res);
					clearTimeout(this.timer);
					this.timer = 0;
					this.isloading = 0;
				});
			}, 1200);
			
		}
	},
	filters: {

　　},
    methods: {
		handleScroll () {
			this.$el.scrollTop = this.$el.scrollHeight;
		},
		init(param){
			this.$nextTick(()=>{
				this.codeContent = '';
			});
			this.readonly = 1;
			this.isMonitor = 0;
			this.params[this.pageInfo.codeConfig.keyCol] = param[this.pageInfo.codeConfig.keyCol];
			this.isloading = 1;
			RUNKIT.ServerApi.send(this.pageInfo.api.retrieveOne, {data:param}, (bl, res)=>{	
				console.log('detail:', bl, res.data, this.params[this.pageInfo.codeConfig.contentCol]);
				this.codeContent = res.data[this.pageInfo.codeConfig.contentCol];
				this.$nextTick(()=>{
					this.readonly = false;
					this.isMonitor = 1;
					this.isloading = 0;
				});
				
			});
			
		},
		setConf(conf){
			if(this.isloading)return;
			console.log('conf:', JSON.stringify(conf));
			this.$set(this, 'pageInfo', conf.data);
			this.$nextTick(()=>{
				this.init(conf.params.data);
			});
			
		//	alert('pageInfo####' + JSON.stringify(this.pageInfo));
		},
		onWindowKeyDown:function(event){
			var self = this;
			self.stopEvent = function(){
				window.event? window.event.returnValue = false : evt.preventDefault();
			};
			var keyCode = -1;
			if(event.ctrlKey){
				keyCode = event.which + 1000;
			}else{
				keyCode = event.which;
			}
			switch( keyCode )
			{
				case 27: // ESC
					return;
				case 32: // SPACEBAR
					return;
				case 13: // ENTER
					return self.onEnter();
				case 9://TAB
				case 46: // DELETE
				case 8: // VK_BACK
					this.onDel();
				case 187: // +
				case 107: // 小键盘 +
				case 189: // -
				case 109: // 小键盘 -
				case 45: //ins
					return;
				case 37:	//left
					return this.cursorChange(-1);
				case 38:	//up
					return;
				case 39:	//right
					return this.cursorChange(1);
				case 40:	//down
					return;	
			}
			alert(keyCode);
		},
		onInputKeyDown:function(event){
			var self = this;
			
			if(event.which == 13)
			{
				return self.onEnter();
			}
			
			this.onWindowKeyDown(event);
		},
        showPage(name, param){
            RUNKIT.APP.showPage(name, param); 
        },
		alert(info){
			alert(info);
		}
    }
}
</script>

<style lang='less' scoped>
   
.code-edit{
	@line-height:0.6rem;
	@backgroundColor:#333;
	@textColor:#eee;
	background:@backgroundColor;
	color:@textColor;
	height:100%;
	width:100%;
	overflow-y:scroll;
	line-height:@line-height;

	font-family: Consolas, Monaco, monospace;//等宽字体
	
	@-webkit-keyframes gogogo {
		0%, 100%{
			opacity: 0;
		}
		50%{
			opacity: 1;
		}
	}
	.term-line{
		width:100%;
	}
	.line-text{
		font-size:@line-height;
		word-break:break-all;
		word-wrap: break-word;  
		.hide-text{
			color:@backgroundColor;
		}
	}
	.edit-cursor{
		width:@line-height/2;
		height:@line-height;
		background:#0f0;
		color:@backgroundColor;
	//	-webkit-animation:gogogo 1s infinite steps(1, start);
	}
	.hide-input{
		width:0px;
		height:0px;
		border:0px;
		background:@backgroundColor;
		padding:0;
		margin:0;
	}

}

/* 设置滚动条的样式 */
textarea::-webkit-scrollbar {
width:12px;
}
/* 滚动槽 */
textarea::-webkit-scrollbar-track {
-webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
border-radius:10px;
}
/* 滚动条滑块 */
textarea::-webkit-scrollbar-thumb {
border-radius:10px;
background:rgba(0,0,0,0.1);
-webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
}
textarea::-webkit-scrollbar-thumb:window-inactive {
background:rgba(255,0,0,0.4);
}




</style>
