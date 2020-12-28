<template>
	<div class="terminal" id="tpl-terminal" @click="onTerminalClick" style="flex:1;box-sizing:border-box;">
		<div style="display:none;width:0;height:0;right:1rem;">
			<div style="z-index:1000;width:15rem;height:8rem;margin-left:-15rem;font-size:0.5rem;box-sizing:border-box;display:flex;flex-direction:column;">
				<fieldset style="flex:1;border:1px solid #cccc;background:rgba(0,0,0,0.3);color:#0f0;padding:0.3rem;">
					<legend style="border:1px solid #cccc;background:rgba(0,0,0,0.3);color:#0f0;padding:0.1rem 0.3rem 0.1rem 0.3rem">STATUS</legend>
					<span>log......</span>
				</fieldset>
				<div style="margin-top:0.5rem;height:1rem;border:1px solid #cccc;padding:0.1rem;">
					<button>更新</button>
				</div>
				
			</div>
		</div>
		<div v-for="item in dataList" class="term-line">
			<span class="line-text" v-html="spaceShow(item.text)"></span>
		</div>
		<span class="line-text">
			<span v-show="session.inputStatus != 0">{{newLine.prompt}}</span> 
			<template v-show="session.inputStatus != 0" v-for="(i, index) in newLine.text">
				<span :class="[index == newLine.cursor?'edit-cursor':'']"  v-if="i == ' '">&nbsp;</span>
				<span :class="[index == newLine.cursor?'edit-cursor':'']"  v-if="i != ' '">{{i}}</span>
			</template >
			<input class="hide-input" autofocus="autofocus" @keydown="onInputKeyDown($event)" ref="editinput" type="text" v-model="input" />
			<span v-show="session.inputStatus != 0 && newLine.cursor == newLine.text.length" class="edit-cursor" style="">&nbsp;</span>
		</span>
	</div>
</template>

<script>
//import UserInfo from '@/components/UserInfo'
export default {
    name: '',
    props: {
    },
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
		RUNKIT.VoimBus.subscribe('status', (topic, res)=>{
			let id = res.data.id;
			let dev = this.devList[id].showData;
			if(id){
			}
		//	this.$set(this.devList[id].showData[k], 'data', res.data.payload[k]);
			
		});
	},
    data() {
        return {
			userInfo:{},
			session:{
				auth: 1,
				path:"/home",
				inputStatus:1
			},
			newLine:{
				prompt:"$",
				cursor:0,
				text:""
				
			},
			input:"",
			dataList:[
			]
        }
    },
    computed: {
    },
	mounted:function(){
		var self = this;
		RUNKIT.VoimBus.subscribe('public', (topic, res)=>{
			if('userInfo' == res.type){
				self.$set(this, 'userInfo', res.data);
			}
		});
		this.textLineAdd("#################################################");
		this.textLineAdd("#   xxxxxxxxxxxxxxxxx                           #");
		this.textLineAdd("#   xxxxxxxxxx                                  #");
		this.textLineAdd("#   xxxxxxxxxxxxxxxxxxxxx                       #");
		this.textLineAdd("#################################################");
		window.onresize = () => {
			this.handleScroll();
		}
		this.newInput();
	},
	watch:{
		input(val){
			this.onInsert(val);
		}
	},
	filters: {
		isSpace: function (value) {
　　　　　　return value.replace(/\s/g, "<span class='hide-text'>_</span>");
　　　　}
　　},
    methods: {
		handleScroll () {
			this.$el.scrollTop = this.$el.scrollHeight;
		},
		onTerminalClick:function(){
			this.$refs.editinput.focus();
		},
		onDel:function(){
			this.newLine.text = this.newLine.text.substr(0, this.newLine.cursor - 1) + this.newLine.text.substr(this.newLine.cursor);
			this.cursorChange(-1);
		},
		onInsert:function(str){
			this.newLine.text = this.newLine.text.substr(0, this.newLine.cursor) + str + this.newLine.text.substr(this.newLine.cursor);
			this.input = "";
			this.cursorChange(str.length);
		},
		spaceShow:function(value){
			return value.replace(/\s/g, "<span class='hide-text'>_</span>");
		},
		cursorChange:function(len){
			this.newLine.cursor += len;
			if(this.newLine.cursor > this.newLine.text.length)this.newLine.cursor = this.newLine.text.length
			if(this.newLine.cursor < 0)this.newLine.cursor = 0;
		},
		textLineAdd:function(text, lineNumber){
			if(typeof(lineNumber) != "undefined")
			{
				this.dataList.splice(lineNumber, 0, {text:text});
			}
			this.dataList.push({text:text});
			this.$nextTick(() => {
				this.handleScroll();
			})
			
		},
		onEnter:function(){
			if(this.session.inputStatus <= 0)return;
			this.textLineAdd(this.newLine.prompt + this.newLine.text);
			if(this.newLine.text == "" || this.checkLocalCmd())
			{	
				return this.newInput();
			}
			this.termCall();
			this.clearInput();
		},
		checkLocalCmd:function(){
			switch(this.newLine.text){
				case 'clear':
					this.dataList = [];
					this.clearInput();
					return true;
				break;
				case '':
				break;
			}
			
		},
		clearInput:function(){
			this.newLine.prompt = "";
			this.newLine.text = "";
			this.session.inputStatus = 0;
		},
		newInput:function(){
			this.newLine.prompt = "$";
			this.newLine.text = "";
			this.session.inputStatus = 1;
		},
		termCall:function(){
			let params = (this.newLine.text + '').replace(/\s+/g, ' ').split(' ');
			if('help' == params[0]){
				setTimeout(()=>{
					this.onRecv({type:"", cont:1, body:{text:'input: api_name params_json'}});
				}, 10);
				return;
			}
			RUNKIT.ServerApi.send(params[0], JSON.parse(params[1] || '{}'), (bl, res)=>{
				this.onRecv({type:"", cont:1, body:{text:JSON.stringify(res)}});
			});
		},
		onRecv:function(message){
			this.textLineAdd(message.body.text);
			if(message.cont == 1){
				this.newInput();
			}
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

<style lang='less'>
   
.terminal{
	@line-height:0.6rem;
	@backgroundColor:#333;
	@textColor:#eee;
	background:@backgroundColor;
	color:@textColor;
	height:100%;
	width:100%;
	overflow-y:scroll;
	padding:@line-height * 0.2;
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


</style>
