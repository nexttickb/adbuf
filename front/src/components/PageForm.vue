<template>

<div  style="width:100%;display:flex;flex-direction:column;">
	<FormRender ref="minform" style="width:100%"></FormRender>
	<div style="width:100%;text-align:center;">
		<button @click="formSubmit" style="width:6rem;height:1.5rem;">确定</button>
	</div>
</div>

</template>

<script>

import FormRender from '@/components/FormRender'

export default {
    name: 'PageForm',
    props: ['info', 'id'],
    components:{FormRender},
    data() {
        return {
			nowDialog:'',
			pageInfo:{},
			retType:0,
		}
    },
    computed: {
		
    },
	mounted:function(){
		var self = this;
		RUNKIT.VoimBus.subscribe('public', (topic, res)=>{
			if('resize' == res.type){
			//	this.init();
			}
		});
		RUNKIT.VoimBus.subscribe('setConf', (topic, res)=>{
			if(this.id == res.id){
				this.setConf(res.data);
				this.init(res.params);
			}
		});
		
	},
    methods: {
		init(data){
			
			this.retType = 0;
			//如果没有指定获取接口，却给了数据，就直接使用。
			if(typeof(this.pageInfo.api.retrieveOne) == 'undefined'){
			//	this.retType = 1;
				this.$refs.minform.setFormData(data);
				return;
			}
			
			
			RUNKIT.APP.loading(1);
			RUNKIT.ServerApi.send(this.pageInfo.api.retrieveOne, {data:data}, (bl, res)=>{
				RUNKIT.APP.loading(0);
				console.log('detail:', bl, res);
				this.$refs.minform.setFormData(res.data);
			});
		},
		formSubmit(){
			let data = this.$refs.minform.getValues();
			/*
			if(this.retType){
				console.log('formDataRet:', data);
				this.$emit("formDataRet", {id:''});
				return;
			}
			RUNKIT.APP.loading(1);
			RUNKIT.ServerApi.send(this.pageInfo.api.update, {data:data}, (bl, res)=>{
				RUNKIT.APP.loading(0);
				console.log('detail:', bl, res);
			});
			*/
			let api = typeof(this.pageInfo.api.update)!='undefined' ? this.pageInfo.api.update : this.pageInfo.api.create;
			RUNKIT.APP.loading(1);
			RUNKIT.ServerApi.send(api, {data:data}, (bl, res)=>{
				RUNKIT.APP.loading(0);
			//	this.$refs.minidialog.hideDialog();
				console.log(bl, res);
				alert(res.info);
			//	this.$refs.maingrid.reload();
			});
		},
		setConf(conf){
			console.log('conf', conf);
			this.$set(this, 'pageInfo', conf);
			this.$refs.minform.initData(this.pageInfo.formConfig);
			this.init();
		},
		procToolbar(evt){
			if('create' == evt){
				this.openAddDialog();
			}
		},
		procDialogData(data){
			if('ok' == data.evt){
				let api = this.nowDialog == 'editDialog' ? this.pageInfo.api.update : this.pageInfo.api.create;
				RUNKIT.ServerApi.send(api, {where:data.data}, (bl, res)=>{
					this.$refs.minidialog.hideDialog();
					if(bl)alert('操作成功!');
					this.$refs.maingrid.reload();
				});
			}
		},
		showPage(name, param){
            RUNKIT.APP.showPage(name, param || {}, this.$options.name); 
        },
		clickMenu(menu){
			console.log(menu);
			this.showPage(menu.page, menu);
		},
		onChangeData:function(data){
			mylog.info("onChangeData:", data);	
			this.$emit("changeProduct", data);
		}
    }
}
</script>

<style lang='less' scoped>


</style>
