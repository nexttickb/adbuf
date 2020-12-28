<template>

<div>
	<div v-for="item in controlList">
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="'input' == item.type">
			<label  :for="formUid + item.name" :class="['mylabel', 'control-label', item.label==''?'hide':'']"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			</label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<div class="input-group">
				<input type="text" :placeholder="item.placeholder" @focus="onDomEvent($event, item)" @change="onDomEvent($event, item)" @blur="onDomEvent($event, item)" @dbclick="onDomEvent($event, item)" @click="onDomEvent($event, item)" :readonly="item.readonly || item.myReadonly" v-model="item.value" :data="item.name" class="form-control validate[required] new_name" />
			</div>
		</div>
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="'password' == item.type">
			<label  :for="formUid + item.name" :class="['mylabel', 'control-label', item.label==''?'hide':'']"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			</label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<div class="input-group">
				<input type="password" :placeholder="item.placeholder" @focus="onDomEvent($event, item)" @change="onDomEvent($event, item)" @blur="onDomEvent($event, item)" @dbclick="onDomEvent($event, item)" @click="onDomEvent($event, item)" :readonly="item.readonly || item.myReadonly" v-model="item.value" :data="item.name" class="form-control validate[required] new_name" />
			</div>
		</div>
		<div  :class="[getWidth(3)]"  v-if="'br' == item.type"></div>
		<div style="height:5rem;" :class="[getWidth(item.cols)]" :dname="item.name" rows="3" :draggable="model" v-if="item.type == 'textarea'">
			<label  :for="formUid + item.name" :class="['mylabel', 'control-label', item.label==''?'hide':'']"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<textarea  :placeholder="item.placeholder" :readonly="item.readonly || item.myReadonly" @focus="onDomEvent($event, item)" @change="onDomEvent($event, item)" @blur="onDomEvent($event, item)" @dbclick="onDomEvent($event, item)" @click="onDomEvent($event, item)" :rows="item.rows?item.rows:3" v-model="item.value" :data="item.name" class="form-control new_name" ></textarea>
		</div>
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="item.type == 'linput'">
			<label :for="formUid + item.name" :class="['mylabel', 'control-label', item.label==''?'hide':'']"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}<span style="color:Red; margin-left:10px;">*</span></label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<div class="input-group">
				<input :placeholder="item.placeholder" type="text" :readonly="item.readonly || item.myReadonly" v-model="item.value" :data="item.name" class="form-control validate[required] new_name" data-errormessage-value-missing="必填!" @focus="onDomEvent($event, item)" @change="onDomEvent($event, item)" @blur="onDomEvent($event, item)" @dbclick="onDomEvent($event, item)" @click="onDomEvent($event, item)" />
				<span class="input-group-addon">{{item.ltext}}</span>
			</div>
		</div>
		
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="item.type == 'com'">
			<label :for="formUid + item.name" class=" mylabel control-label"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}<span style="color:Red;margin-left:10px;">*</span></label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<div class="input-group">
				<input type="text" :placeholder="item.placeholder" :readonly="item.readonly || item.myReadonly" v-model="item.showValue" :oldShowValue="item.oldShowValue" :data="item.name" @keyup.enter="onDomEvent($event, item)" @focus="onDomEvent($event, item)" @change="onDomEvent($event, item)" @blur="onDomEvent($event, item)" @dbclick="onDomEvent($event, item)" @click="onDomEvent($event, item)" class="form-control validate[required] new_category" style="width:100%" />
				<span class="input-group-btn" @click="raiseItemEvent('button-click', item)">
					<a href="javascript:void(0);"  :class="['btn', 'btn-info', 'cat_select', (item.readonly || item.myReadonly)?'disabled':'']" title="请点击选择">{{item.btnName}}</a>
				</span>
			</div>
		</div>
		
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="item.type == 'com_text'">
			<label :for="formUid + item.name" ><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}<span style="color:Red;margin-left:10px;">*</span></label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<div class="input-group">
				<input type="text" :placeholder="item.placeholder" :readonly="item.readonly || item.myReadonly" v-model="item.value" :data="item.name" @focus="onDomEvent($event, item)" @change="onDomEvent($event, item)" @blur="onDomEvent($event, item)" @dbclick="onDomEvent($event, item)" @click="onDomEvent($event, item)" class="form-control validate[required] new_category" style="width:100%" />
				<span class="input-group-btn" @click="raiseItemEvent('button-click', item)">
					<a href="javascript:void(0);"  :class="['btn', 'btn-info', 'cat_select', (item.readonly || item.myReadonly)?'disabled':'']" title="请点击选择">{{item.btnName}}</a>
				</span>
			</div>
		</div>
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="(item.type == 'date' || item.type == 'datetime' || item.type == 'time')">
			<label :for="formUid + item.name" class="mylabel control-label"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}<span style="color:Red;margin-left:10px;">*</span></label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<div class="input-group">
				<input type="text" :placeholder="item.placeholder" :readonly="item.readonly || item.myReadonly" v-model="item.value" :initData="item.value" class="form-control   ctldate" :data="item.name" >
				<span class="input-group-addon">
					<span class="glyphicon glyphicon-calendar"></span>
				</span>
				</input>
			</div>
		</div>
			
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="item.type == 'select'">
			<label :for="formUid + item.name" class="mylabel control-label"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<select class="form-control new_enable" @focus="onDomEvent($event, item)" @change="onDomEvent($event, item)" @blur="onDomEvent($event, item)" @dbclick="onDomEvent($event, item)" @click="onDomEvent($event, item)" :disabled="item.readonly || item.myReadonly" v-model = "item.value" :data="item.name">
				<option v-for="sl in item.option" :value="sl.value">{{sl.label}}</option>
			</select>
		</div>
		

		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="item.type == 'radio'">
			<label :for="formUid + item.name" class="fleft mylabel control-label"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<div class="input-group" style="width:100%">
				<div class="btn-group btn-group-sex" data-toggle="buttons">
					<label v-for="sl in item.option" @click="item.value = sl.value" :class="[(item.readonly || item.myReadonly)?'disabled':'', 'btn', sl.value == item.value?'btn-info':'btn-default', sl.active?'active':'' ]" >
						<input type="radio" @focus="onDomEvent($event, item)" @change="onDomEvent($event, item)" @blur="onDomEvent($event, item)" @dbclick="onDomEvent($event, item)" @click="onDomEvent($event, item)" :readonly="item.readonly || item.myReadonly" :data="item.name" :class="[formUid + item.name]" :value="sl.value" v-model="item.value" :name="sl.label" autocomplete="off" checked="checked">{{sl.label}}
					</label>
				</div>
			</div>
		</div>
		
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="item.type == 'checkbox'">
			<label :for="formUid + item.name" class="mylabel control-label"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<div class="input-group" style="width:100%">
			<div class="btn-group" data-toggle="buttons">
				<label :class="['btn', item.value?'btn-info':'btn-default']" @click="item.value = !item.value">
					<input type="checkbox" autocomplete="off" :readonly="item.readonly || item.myReadonly" @focus="onDomEvent($event, item)" @change="onDomEvent($event, item)" @blur="onDomEvent($event, item)" @dbclick="onDomEvent($event, item)" @click="onDomEvent($event, item)" :class="formUid + item.name" v-model="item.value" :data="item.name" style="width:100%" />
					<i :class="['glyphicon', item.value?'glyphicon-check':'glyphicon-unchecked']"></i> {{item.label}}
				</label>
			</div>
			</div>
		</div>
		
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="item.type == 'custom'">
			<label :for="formUid + item.name" class="mylabel control-label"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<div :class="formUid + item.name">
				<input type="text" @focus="onDomEvent($event, item)" @change="onDomEvent($event, item)" @blur="onDomEvent($event, item)" @dbclick="onDomEvent($event, item)" @click="onDomEvent($event, item)" :readonly="item.readonly || item.myReadonly" v-model="item.value" :data="item.name" class="form-control new_name"  />
			</div>
		</div>
		<div :class="[getWidth(item.cols)]" style="display:none" :dname="item.name" :draggable="model" v-if="item.type == 'hidden'">
			<label :for="formUid + item.name" class="mylabel control-label"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<div :class="formUid + item.name">
				<input type="hidden" @focus="onDomEvent($event, item)" @change="onDomEvent($event, item)" @blur="onDomEvent($event, item)" @dbclick="onDomEvent($event, item)" @click="onDomEvent($event, item)" :readonly="item.readonly || item.myReadonly" v-model="item.value" :data="item.name" class="form-control new_name"  />
			</div>
		</div>
		
		<div style="height:15rem;" :class="[getWidth(3)]" :dname="item.name" rows="3" :draggable="model" v-if="item.type == 'code'">
			<label  :for="formUid + item.name" :class="['mylabel', 'control-label', item.label==''?'hide':'']"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			<span class="glyphicon glyphicon-edit edit-btn" v-if="model == 1" @click="raiseItemEvent('edit', item)"></span>
			<span class="glyphicon glyphicon-eye-close edit-btn" v-if="model == 1 && item.hideable === false" title="不可隐藏字段"></span>
			<textarea style="background:#000;color:#fff;font-size:0.5rem;" :placeholder="item.placeholder" :readonly="item.readonly || item.myReadonly" @focus="onDomEvent($event, item)" @change="onDomEvent($event, item)" @blur="onDomEvent($event, item)" @dbclick="onDomEvent($event, item)" @click="onDomEvent($event, item)" :rows="item.rows?item.rows:3" v-model="item.value" :data="item.name" class="form-control new_name" ></textarea>
		</div>
		
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="item.type == 'image'">
			<label :for="formUid + item.name" class="mylabel control-label"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			<ImgUploader :value="item.value" @selected="setFormData" :id="item.name" :name="item.name" :placeholder="item.placeholder"></ImgUploader>
		</div>
		
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="item.type == 'file'">
			<label :for="formUid + item.name" class="mylabel control-label"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			<FileUploader :value="item.value" @selected="setFormData" :id="item.name" :name="item.name" :placeholder="item.placeholder"></FileUploader>
		</div>
		
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="item.type == 'netSelect'">
			<label :for="formUid + item.name" class="mylabel control-label"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			<NetSelect :ctrConf="item" :value="item.value" @selected="setFormData" :needValue="item.needValue" :showValue="item.showValue" :id="item.name" :name="item.name" :placeholder="item.placeholder" :ref="item.name"></NetSelect>
		</div>
		
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="item.type == 'pageGrid'">
			<label :for="formUid + item.name" class="mylabel control-label"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			<PageGrid style="height:9rem;" @pageGrid="onpageGrid" class="flex-col" :id="item.name" :ref="item.name"></PageGrid>
		</div>
		
		<div :class="[getWidth(item.cols)]" :dname="item.name" :draggable="model" v-if="item.type == 'text'">
			<label :for="formUid + item.name" class="mylabel control-label"><span v-if="model == 1" class="badge">{{getOrderByName(item.name)}}</span>{{item.label}}</label>
			<div style="height:9rem;" @pageGrid="onpageGrid" class="flex-col" :id="item.name" :ref="item.name">
				{{item.value}}
			</div>
		</div>
		
	</div>
</div>

</template>

			
			
<script>

import ImgUploader from '@/components/ImgUploader'
import FileUploader from '@/components/FileUploader'

import NetSelect from '@/components/NetSelect'
//import pageGrid from '@/components/pageGrid'

import PageGrid from '@/components/PageGrid'

export default {
    name: 'Home',
	  props: {
		  group: String,
		  billInfo: Object
	  },
	  components:{ImgUploader,FileUploader,NetSelect, /*pageGrid, */PageGrid},
	  data: function () {
			return {
				formUid:"uid_" + (new Date().getTime()) + "_",
				model: 0,
				editModel:1,
				groupOrder2Index:{},
				controlList:[],
				fixValue:{},
				groupSelected:""
			}
		},
		/*
		ready:function(){
			var _self = this;
			for(var i = 0; i < _self.controlList.length; i++)
			{
				if(_self.controlList[i].type == "custom" && _self.controlList[i].group == _self.groupSelected)
				{
					_self.raiseItemEvent("custom-init", _self.controlList[i], _self.$("." + _self.formUid + _self.controlList[i].name));
				}
			}
		},
		*/
		created:function(){
		//	this.initData();
			if(typeof(this.group) != "undefined")
			{
				this.groupSelected = this.group;
			}
			
		},
		computed:{
				
		},
		methods: {
			$: function(selector) {
				return $(selector, this.$el);
			},
			initData:function(formData){
			
			/*
				formData = formData || {
					form:[
						{"group": "tickettop",	"name": "sn1", 	"value":"",	"label": "普通输入框","cols": 1,"order": 0,"hidden": false,"type": "input"},
						{"group": "tickettop",	"name": "sn1", 	"value":"",	"label": "l输入框","cols": 1,"order": 0,"hidden": false,"type": "linput"},
						{"group": "tickettop",	"name": "sn1", 	"value":"",	"label": "文本框","cols": 1,"order": 0,"hidden": false,"type": "textarea"},
						{"group": "tickettop",	"name": "sn2", 	"value":"",	"label": "金额","cols": 2,"order": 1,"hidden": false,"type": "money"},
						{"group": "tickettop",	"name": "sn6", 	"value":"",	"label": "自定义其他","cols": 3,"order": 5,"hidden": false,"type":"select", "option":[{value:1, label:"男", active:1},{value:0, label:"女"}]},
						{"group": "tickettop",	"name": "sn16", "value":"",	"label": "单选","cols": 1,"order": 0,"hidden": false,"type": "radio", "option":[{value:1, label:"男", active:1},{value:0, label:"女"}]},
					]
				};
				*/
			//	this.fixValue = {};
				let initData = {};
				initData.formgroup = [];
				initData.form = [];
				
				console.log('#############:', this.billInfo);
				let myBillInfo = JSON.parse(JSON.stringify(formData));

				for(var i = 0; i < myBillInfo.form.length; i++){
					var repeat = 0;
					if(this.model && myBillInfo.form[i].hidedlg){
						continue;	
					}
					for(var x = 0; x < myBillInfo.form.length; x++){
						if(myBillInfo.form[i].name == myBillInfo.form[x].name){
							repeat++;	
						}
					}
					if(repeat > 1){
				//		alert("表单配置name:" + myBillInfo.form[i].name + "出现了" + repeat + "次.");
					}
					myBillInfo.form[i].cols = typeof(myBillInfo.form[i].cols) == "undefined"?1:myBillInfo.form[i].cols;
					myBillInfo.form[i].hidden = typeof(myBillInfo.form[i].hidden) == "undefined"?false:myBillInfo.form[i].hidden;
					myBillInfo.form[i].label = typeof(myBillInfo.form[i].label) == "undefined"?"未命名":myBillInfo.form[i].label;
					myBillInfo.form[i].type = typeof(myBillInfo.form[i].type) == "undefined"?"input":myBillInfo.form[i].type;
					if(!myBillInfo.form[i].hidden){
						if(typeof(myBillInfo.form[i].value) == "undefined"){
							myBillInfo.form[i].value = "";
							myBillInfo.form[i].showValue = "";
							myBillInfo.form[i].oldShowValue = "";
						}
						myBillInfo.form[i].mygroup = myBillInfo.form[i].group;
						initData.form.push(myBillInfo.form[i]);
					}
				}
				this.formgroup = initData.formgroup;
				this.controlList = initData.form;
				
				console.log(this.controlList);
				this.setFormData(myBillInfo.billData);
				
				let nowValues = this.getValues();
				//特殊组件处理
				this.$nextTick(()=>{
					for(var i = 0; i < myBillInfo.form.length; i++) {//pageGrid
						if(myBillInfo.form[i].type == 'netSelect' || myBillInfo.form[i].type == 'pageGrid'){
							try{
								RUNKIT.APP.initPage(myBillInfo.form[i].name, myBillInfo.form[i].target, nowValues);
							}catch(e){
								console.error('err:', e);
							}
						}
					}
					this.$forceUpdate();
				});
				
			 },

			 setFormData:function(data){
				var _self = this;
				console.log("setFormData:" + JSON.stringify(data));
				for(var item in data) 
				{
					console.log(item);
					for(var i = 0; i < this.controlList.length; i++)
					{
						if(item == this.controlList[i].name)	
						{
							console.log("data[item]:", typeof(data[item]), item, data[item]);
							
							if(this.controlList[i].type == "pageGrid")
							{
								
							//	this.$refs[this.controlList[i].name][0].setData(data[item]);
								break;
							}
							
							if(typeof(data[item]) == "object")
							{
								for(var it in data[item])
								{
									//this.controlList[i][it]	= data[item][it];
									this.$set("controlList[" + i + "]." + it, data[item][it]);
								}
							}else if("com" == this.controlList[i].type){
								this.controlList[i].value = data[item];	
								this.controlList[i].showValue = data[item];	
							}else{
								console.log("item:", item, data[item]);
								this.controlList[i].value = data[item];
							}
							if(this.controlList[i].type == "custom")
							{
								_self.raiseItemEvent("custom-change", _self.controlList[i], _self.$("." + _self.formUid + _self.controlList[i].name));
							}
							
						}
					}
				}
			},

			clearFormData:function(){
				for(var i = 0; i < this.controlList.length; i++)
				{
					if("com" == this.controlList[i].type){
						this.controlList[i].value = "";	
						this.controlList[i].showValue = "";	
						this.controlList[i].oldShowValue = "";	
					}else{
						this.controlList[i].value = "";	
					}
					if(this.controlList[i].type == "custom")
					{
						_self.raiseItemEvent("custom-change", _self.controlList[i], _self.$("." + _self.formUid + _self.controlList[i].name));
					}
				}
			},

			updateItem: function(name, values) {
				var self = this;
				var idx = self.getIndexByName(name);
				if(idx >= 0 && $.isPlainObject(values)) {
					var item = self.controlList[idx];
					$.each(values, function(k, v) {
						item[k] = v;
					});
				}
			},
			
			//这个是普通输入框的事件
			onDomEvent:function(ev, item){
			    return this.raiseItemEvent("dom-event", item, ev);
			},

			showGroup:function(groupName){
				this.groupOrder2Index = {};
				this.groupSelected = groupName;	
			},

			//整个表单只读
			formReadonly:function(flag){
				if(typeof(flag) == "undefined")flag = 1;
				this.editModel = flag;
				for(var i = 0; i < this.controlList.length; i ++)
				{
					this.$set("controlList[" + i + "].myReadonly", flag);	
				}
			},

			getValues:function(){
				var res = {};
				for(var i = 0; i < this.controlList.length; i++)
				{	
					if(typeof(this.controlList[i].name) != 'undefined')
						res[this.controlList[i].name] = this.controlList[i].value;
				}
				/*
				//特殊组件返回的多值补充
				for(let k in this.fixValue){
					res[k] = this.fixValue[k];
				}
				*/
				return res;
			},

			raiseItemEvent:function(evtName, item, params){
		//		return this.$dispatch('item-event', evtName, item, params);
			},

			getOrderArrInGroup:function(){
				try {
				var res = [];
				var x = 1;
				for(var i = 0; i < this.controlList.length; i++)
				{
					if(this.groupSelected == this.controlList[i].mygroup)
					{
						res.push(x++);
					}
				}
				return res;
				}catch(e){console.error('xxx', e);}
			},

			getCountInGroup: function(group) {
				var x = 0;
				for(var i = 0; i < this.controlList.length; i++) {
					if(group == this.controlList[i].mygroup && !this.controlList[i].hidedlg) {
						x++;
					}
				}
				return x;
			},

			selectClick:function(item){
				item.isShow = !item.isShow;
				this.$forceUpdate();
			},
			// 根据 name 获取组内序号
			getOrderByName:function(name){
				for(var i = 0, x = 0; i < this.controlList.length; i++)
				{
					if(this.groupSelected == this.controlList[i].mygroup)
					{
						x++;
					}

					if(this.controlList[i].name == name && this.groupSelected == this.controlList[i].mygroup)
					{
						this.groupOrder2Index[x] = i;
						return x;
					}
				}
				return -1;
			},

			getIndexByName:function(name){
				for(var i = 0; i < this.controlList.length; i++)
				{
					if(this.groupSelected == this.controlList[i].mygroup && this.controlList[i].name == name)
					{
						return i;
					}
				}
				return -1;
			},

			getIndexByOrder:function(order, group){
				return this.groupOrder2Index[order];
			},
			
			setFocus:function(name){
				// bug: need fix ...
				this.$('div[dname="' + name + '"] [tabindex]').focus();
				//$("." + this.formUid + name).focus();
			},

			changeSelectedOrder:function(newOrder, name){
				console.log("changeSelectedOrder: move", name, 'to order',  newOrder);
				if(newOrder < 0)return;

				var srcIndex = this.getIndexByName(name);
				var dstIndex = this.getIndexByOrder(newOrder, this.groupSelected);

				var old = this.controlList[srcIndex];
				this.controlList.splice(srcIndex, 1);
				this.controlList.splice(dstIndex, 0, old);
			},

			replaceItem: function(item) {
				var idx = this.getIndexByName(item.name);
				if( idx < 0 ) return false;
				this.controlList.splice(idx,1, $.extend({}, item, true));
				return true;
			},
			
			getWidth: function(type) {
				var res = "";
				if(1 == type)
				{
					res += "form-group col-1 col-lg-4 col-md-4 col-sm-4 col-xs-12";
				}
				if(2 == type)
				{
					res += "form-group col-2 col-lg-8 col-md-8 col-sm-8 col-xs-12";
				}
				if(3 == type)
				{
					res += "form-group col-3 col-lg-12 col-md-12 col-sm-12 col-xs-12";
				}
				if(this.model == 1)
				{
					res += " edit-model"
				}
				return res;
			},
			render:function(){
				
			},
			onpageGrid(res){
			//	alert(JSON.stringify(res));
				this.updateItem(res.name, res.data);
			}
		}
	}

</script>

<style lang='less'>

.col-1{
	width:30%;
}
.col-2{
	width:60%;
}
.col-3{
	width:90%;
}

.form-group{
	font-size:0.6rem;
//	border:1px solid #eee;
	margin:0.2rem;
	padding:0.1rem;
	float:left;
//	width:30%;
display:flex;
flex-direction:column;
}


*, ::after, ::before {
    box-sizing: border-box;
}
label {
    cursor: default;
}
label {
    display: inline-block;
    margin-bottom: .5rem;
	font-size:0.5rem;
}

.form-control {
    display: block;
    width: 100%;
 //   height: calc(0.5em + .75rem + 2px);
    padding: .175rem .25rem;
    font-size: 0.7rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
	flex:1;
	
	
}
input::placeholder, textarea::placeholder {
    color: #ccc;
}




.my-select{
	width:100%;
	color:#688aa7;
	cursor:default;
}
.opt-label{
	height:1rem;line-height:0.9rem;text-align:center;
}
.opt-box{
	position: absolute;overflow-y:scroll;padding:0.2rem;margin-left:0.1rem;width:6rem;height:auto;border:1px solid #dfe6ec;background:#fcfdfd;border-radius:0.2rem;
}


.triangle{
	width:0.9rem;
	height:0.5rem;
	margin-top:0.5rem;
	margin-right:0.3rem;
	&::after{
		content: '';
            display: block;
            border-left: 0.43rem solid transparent ;
            border-right: 0.43rem solid transparent;
            border-top: 0.43rem solid #999;
	}
}


</style>