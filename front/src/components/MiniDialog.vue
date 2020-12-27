<template>
<div  v-show="dialogShow" style="position:absolute;background:rgba(1,1,1,0.3);z-index:99999;top:0;left:0;right:0;bottom:0;display:flex;padding:3rem 6rem 3rem 6rem;">
	<div style="flex:1;background:#fff;border-radius:0.5rem;display:flex;flex-direction:column;">
		<div style="height:1.5rem;border-radius:0.5rem 0.5rem 0rem 0rem;background:#ccc;color:#fff;text-align:center;">
			<span>{{dialogContent.title}}</span>
		</div>
		<div style="flex:1;padding:0.5rem;overflow-y:scroll;box-sizing:border-box;">
			<FormRender ref="minform" billInfo:dialogContent.formConfig></FormRender>
  			<STable class="dialog-table" ref="minitable" v-show="dialogContent.showTable" v-on:onDblClick="onTableDblClick" :options = "{}" :columns = "dialogContent.grid.columns"></STable>
		</div>
		<div style="height:2rem;padding:0.1rem;display:flex;justify-content:space-around;">
			<div v-for="item in dialogContent.button" style="">
				<button style="width:3rem;height:1.3rem;" @click="btnClick(item.name)">{{item.label}}</button>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import STable from '@/components/STable.vue'
import FormRender from '@/components/FormRender'

export default {
	name: 'MiniDialog',
	data () {
    	return {
			dialogShow:false,
			dialogContent:{
				title: '',
				grid:{columns:[]},
				formConfig : {
					form:[]
				},
				button:[]
			}
    	}
  	},
	components:{STable,FormRender},
	props:['table', 'dadsay'],
	watch:{
		"dialogContent":function(){
			//mylog.info("change:", this.dialogContent);		
		}
	},
	methods:{
		btnClick:function(name){
			let data = this.$refs.minform.getValues();
			this.$emit("btnClick", {data: data, evt:name});
		},
		showDialog:function(conf){
			this.dialogShow = true;
			console.log('showDialog conf:', conf);
			this.$set(this, 'dialogContent', conf);
			this.$refs.minform.initData(this.dialogContent.formConfig);
		},
		setFormData:function(data){
			this.$refs.minform.setFormData(data);
		},
		hideDialog:function(){
			this.dialogShow = false;	
		},
		tableInsert:function(uId, data){
			return this.$refs.minitable.insert(uId, data);
		},
		tableClear:function(){
			return this.$refs.minitable.clear();
		},
		getSelectedRowId:function(){
			return this.$refs.minitable.getSelectedRowId();
		},
		getSelectedRowNumber:function(){
			return this.$refs.minitable.getSelectedRowNumber();
		},
		onTableDblClick:function(lineNumber, field){
			//mylog.info("onTableDblClick");
			this.dialogContent.table.onTableSelected.call(lineNumber, field);
		},
		doSayHello:function(){
			this.$emit("testmsg", {id: "666", body:"hello"});	
		}  
  }
}
</script>

<style lang = 'less' scoped>

/* 设置滚动条的样式 */
::-webkit-scrollbar {
width:12px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
-webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
border-radius:10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
border-radius:10px;
background:rgba(0,0,0,0.1);
-webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
background:rgba(255,0,0,0.4);
}

</style>
