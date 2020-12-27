<template>
	<div class="ftable" style="color:#2d6798;flex:1;">
		<div class="ftable-th" :style="{height: height * 1.2 + 'rem'}">
			<div :class="[col.align, 'ftable-td']" :style="{width: col.width + 'rem', lineHeight:height * 1.2 + 'rem', fontSize: fontSize + 'rem', height: height * 1.2 + 'rem'}" v-for="col in gridConf.columns">{{col.label}}</div>
			<div :style="{width: gridConf.btnCol.width + 'rem'}" class="ftable-td"></div>
		</div>
		<div v-show="gridConf.search" class="ftable-th" style="">
			<div class="ftable-td search-opt" style="display:flex;font-size:0.6rem;box-sizing:border-box;" v-for="col in gridConf.columns">
				<FlipSelect :type="col.searchType" :name="col.field" @selectType="onSelectType"></FlipSelect>
				<div style="flex:1;box-sizing:border-box;"><input v-model.lazy="searchValues[col.field]" style="width:100%;border:none;height:1rem;padding:0;margin:0;" type="text" /></div>
				<button @click="searchValues[col.field] = ''" style="width:0.8rem;font-size:0.5rem;background:none;box-shadow:none;color:#666;">×</button>
			</div>
			<div :style="{width: gridConf.btnCol.width + 'rem'}" class="ftable-td"></div>
		</div>
		<div class="ftable-tbody" style="flex:1;">
			<div @click.right="rightEvent(rowId, rowData)" :style="{lineHeight:height * 1 + 'rem', height: height * 1 + 'rem', fontSize: fontSize + 'rem'}" :class="[{'active':rowData._tb_op.active}, 'ftable-tr']" v-for = "(rowData, rowId) in tableData">
				<div  :class="[col.align, 'ftable-td']" v-for = "col in gridConf.columns" @click="onTdClick(rowId, col.field || 'none')" @dblclick="onTdDblClick(rowId, col.field)">
					<div v-if="'decimal' == col.type" class="">{{rowData[col.field] | toDecimal2}}</div>
					<div v-if="'text' == col.type" class="">{{rowData[col.field]}}</div>
					<div v-if="'input' == col.type" class="">
						<input type="text" @blur="onChangeData(rowId, col.field, rowData[col.field])" v-model="rowData[col.field]" />
					</div>
					<div v-if="'number' == col.type" class="number-as-box">
						<div>{{rowData[col.field]}}</div>
					</div>
					
				</div>
				<div @click="onTdClick(rowId, 'tools')" class="center ftable-td" :style="{width: gridConf.btnCol.width + 'rem'}">
					<button v-for="b in gridConf.btnCol.btn" @click="lineBtn(rowData, b, rowId)">{{b.label}}</button>
				</div>
			</div>
		</div>
		<div v-show="gridConf.pagination" class="page-bar" :style="{}">
			<button @click="firstPage">首页</button>
			<button @click="prePage">上一页</button>
			<input v-model.lazy="nowPage" type="number" />
			<button @click="nextPage">下一页</button>
			<button @click="lastPage">尾页</button>
		</div>
	</div>
</template>

<script>

import FlipSelect from '@/components/FlipSelect'

export default {
  	name: 'STable',
	props:[],
	components:{FlipSelect},
  	data () {
    	return {
			api:{},
			gridConf:{
				columns:[],
				btnCol:{width:2, btn:[]},
				pagination:1
			},
			//search
			
			searchOpt:[],//搜索条件
			params:{},//查询条件
			searchValues:{},
			searchOptions:{},
			height:1,
			fontSize:0.6,
			nowPage:0,
			maxPage:100,
			tableData:{},
			preSelected:"",
			
			rowIndex:[]
    	}
  	},
	watch:{
		tableData:{
      		handler: function (val, oldVal) {
				var keys = [];
				for(var key in this.tableData)
				{
					keys.push(key);	
				}
				this.rowIndex = keys;
			},
		    deep: true
	    },
		nowPage:{
			handler:function(){
				this.getGridList();
			}
		},
		searchValues:{
      		handler: function (val, oldVal) {
				this.onSearch();
			},
		    deep: true
	    },
	},
	filters:{
		toDecimal2:function(val){
			return val;
		}
	},
	mounted:function(){
		
	},
	methods:{
		setConf(conf, api, params){
			this.$set(this, 'gridConf', conf);
			this.api = api;
			this.params = params || {};
			this.firstPage();
			this.reload();
			this.searchOptions = {};
		},
		firstPage(){
			this.nowPage = 1;
		},
		nextPage(){
			this.nowPage = (this.nowPage >= this.maxPage ? this.maxPage : this.nowPage + 1);
		},
		prePage(){
			this.nowPage = (this.nowPage <= 1 ? 1 : this.nowPage - 1);
		},
		lastPage(){
			this.nowPage = this.maxPage;
		},
		reload(){
			this.getGridList();
		},
		getGridList(){
			if(!this.api.retrieve)return;
			RUNKIT.APP.loading(1);
			RUNKIT.ServerApi.send(this.api.retrieve, {page:this.nowPage, limit:25, search:this.searchOpt, where:this.params}, (bl, res)=>{
				RUNKIT.APP.loading(0);
		//		console.log('detail:', bl, res);
				this.maxPage = res.pageCount || 100;
				this.clear();
				for(let i = 0; i < res.list.length; i++){
					this.insert(i, res.list[i]);
				}
			});
		},
		onSelectType(param){
			this.searchOptions[param.name] = param.value;
			this.onSearch();
		},
		onSearch(){
	//		console.log(this.searchValues, this.searchOptions);
			this.searchOpt = [];
			for(let key in this.searchValues){
				if(this.searchValues[key] != ''){
					this.searchOpt.push({name:key, type:this.searchOptions[key] || 'eq', value:this.searchValues[key]});
				}
			}
			this.reload();
	//		console.log('searchOpt:', JSON.stringify(this.searchOpt));
		},
		lineBtn:function(rowData, evt, rowId){
			console.log(rowData, evt, rowId);
			this.$emit("event", {data: rowData, evt:evt, rowId: rowId});
		},
		insert:function(rowId, datas){
			this.setRowData(rowId, datas);
		},
		update:function(rowId, key, value){
			//mylog.info("update", rowId, key, value);
			this.$set(this.tableData[rowId], key, value);
		},
		setRowData:function(rowId, rowData){
			var data = JSON.parse(JSON.stringify(rowData));
			data._tb_op = {active:false};
			this.$set(this.tableData, rowId, data);
	//		//mylog.info("setRowData:", rowId, data, JSON.stringify(this.tableData));
		},
		clear:function(){
			this.$set(this, "tableData", {});
			this.tableData = {};
		},
		delete:function(rowId){
			this.$delete(this.tableData, rowId);
		},
		getLength:function(){
			return this.tableData.length;	
		},
		onChangeData:function(rowId, field, value){
			this.$emit("changeData", {rowId: rowId, field:field, value:value});
		},
		rightEvent:function(rowId, rowData){
			this.selectRow(rowId);
			this.$emit("rightClick", rowData);
		},
		selectRow:function(rowId){
			var self = this;
			if(typeof(this.tableData[rowId]) == "undefined")return;
			if(typeof(this.tableData[self.preSelected]) != "undefined" && rowId != self.preSelected){
				this.tableData[self.preSelected]._tb_op.active = false;
			}
			this.preSelected = rowId + "";
			this.tableData[rowId]._tb_op.active = true;
			this.$emit("leftClick", this.tableData[rowId]);
		},
		onTdClick:function(rowId, field){
			//mylog.info("click", rowId, field);	
			this.$emit("onClick", {rowId: rowId, field:field});
			this.selectRow(rowId);
		},
		onTdDblClick:function(rowId, field){
			//mylog.info("dblClick", rowId, field);	
			this.$emit("onDblClick", {rowId: rowId, field:field});
		},
		selectPre:function(){
			this.selectRow(this.rowIndex[this.rowIndex[this.preSelected] - 1]);
		},
		selectNext:function(){
			this.selectRow(this.rowIndex[this.rowIndex[this.preSelected] + 1]);
		},
		getSelectedRowId:function(){
			return this.preSelected;
		},
		getSelectedRow:function(){
			return this.tableData[this.preSelected];
		},
		getTableData:function(){
			return this.tableData;
		},
		getTableArrayData:function(){
			let res = [];
			for(let item in this.tableData){
				res.push(this.tableData[item]);
			}
			return res;
		}
	}
}
</script>

<style lang="less" scoped>
	@table-line-height:0.8rem;
	@trade-color:#FEFEFE;
	.ftable{
		flex:1;
		display:flex;
		flex-direction:column;
		border: 1px solid #dfe6ec;
		
		.ftable-tr, .ftable-th{
			
		}
		
		.ftable-th{
	//		color:@trade-color;
			background-color: #eef1f6;
			height:@table-line-height * 1.2;
			line-height:@table-line-height * 1.2;
			overflow-y:scroll;
			&::-webkit-scrollbar {
				width: 5px;
			}
		}
		.number-as-box{
			display:flex;
			span{
				text-align:center;
				margin:0 0.5rem 0 0.5rem;
			}
			&>div{
				flex:1;
			}
			padding:0 1rem 0 1rem;
		}
		.number-as-button{
			height:@table-line-height;
			width:@table-line-height * 0.6;
			line-height:@table-line-height;
			font-size:@table-line-height * 0.6;
			border:0;
			border-radius:@table-line-height * 0.1;
			outline:none;
			background: rgba(220, 220, 220, 0.3);
			color:#678;
			&:active{
				background: rgba(255, 255, 255, 0.3);
				color:#333;
			}
		}
		.ftable-tbody{
			flex:1;
			overflow-y:scroll;
			&::-webkit-scrollbar {
				width: 5px;
			}
			&::-webkit-scrollbar-track {
				border-radius:10px;
			}
			&::-webkit-scrollbar-thumb {
				border-radius:10px;
				background:#333;
			}
		}
		.ftable-tfoot{
			height:@table-line-height * 1.5;
		}
		.ftable-tr{
			font-size:@table-line-height * 0.5;
			height:@table-line-height;
			line-height:@table-line-height;
		}
		.active{
			font-weight: bold;
			background:rgba(200,200,200, 0.1);
		}
		.selected{
		}
		.ftable-th, .ftable-tr{
			border-bottom:1px solid #dfe6ec;		
			display:flex;
			justify-content:space-around;
			.ftable-td{
				flex:1;
				overflow:hidden;
				border-left: 1px solid #dfe6ec;
				
			}
			
			padding:0 10px 0 5px;
		}
	}

	.ftable-blank{
		.ftable-th{
			color:@trade-color;
		}
		.selected{
			background:#000;
			color:#fff;
		}
	}

	.ftable-color{
		.ftable-th{
			color:rgb(27,158,211);
			background:rgb(254,248,229);
			border-top:1px solid rgb(215,215,215);
			border-bottom:1px solid rgb(215,215,215);
		}
		.ftable-tr{
			border-bottom:1px solid rgb(234,237,240);
			color:rgb(31,183,240);
		}
		.ftable-tr:nth-of-type(odd){ background:#fff;}
		.ftable-tr:nth-of-type(even){ background:rgb(242,249,255);}
	}

	.center{
		text-align:center;		
	}

	.left{
		text-align:left;	
	}

	.right{
		text-align:right;
	}


	.page-bar{
		height:1.5rem;
		padding:0.3rem;
		border-top:1px solid #eee;
		background:#f9f9f9;
		&>*{
			float:left;
			margin-left:0.3rem;
		}
		button{
			height:0.9rem;
			box-sizing:border-box;
		}
		input{
			height:0.9rem;
			box-sizing:border-box;
			width:1.6rem;
			border:1px solid #ccc;
			outline:none;text-align:center;
		}
	}
</style>
