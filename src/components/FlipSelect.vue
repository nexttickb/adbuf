<template>
<div style="" class="my-select">
	<div @click="isShow = !isShow" style="" class="opt-label">{{nowSymbol}}</div>
	<div style="width:0;height:0;">
		<div v-show="isShow" style="" class="opt-box">
			<div @click='onSelect(key)' class="opt-item" v-for="(value,key) in optionData[type]" style="">
				<div style="width:1.3rem;float:left;">{{value.symbol}}</div>
				<div style="width:3rem;float:left;">{{value.label}}</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
export default {
    name: 'FlipSelect',
    props: {
		type: {
			type: String,
			default:function(){
				return 'integer';
			}
		},
		name: {
			type: String,
			default:function(){
				return 'none';
			}
		},
    },
    components:{},
    data() {
        return {
			isShow:0,
			nowItem:'eq',
			optionData:{
				integer:{
					'eq':{symbol:'==', label:'等于'},
					'ne':{symbol:'!', label:'不等'},
					'le':{symbol:'<=', label:'小于等于'},
					'lt':{symbol:'<', label:'小于'},
					'gt':{symbol:'>', label:'大于'},
					'ge':{symbol:'>=', label:'大于等于'},
				},
				string:{
					'eq':{symbol:'==',label:'等于'},
					'bw':{symbol:'^',label:'开始于'},
					'bn':{symbol:'!^',label:'不开始于'},
					'cn':{symbol:'~',label:'包含'},
					'nc':{symbol:'!~',label:'不包含'},
					'ew':{symbol:'|',label:'结束于'},
					'en':{symbol:'!@',label:'不结束于'},
				}
			}
        }
    },
    computed: {
		nowSymbol:function(){
			return this.optionData[this.type][this.nowItem].symbol;
		}
    },
	mounted:function(){
	},
    methods: {
		onSelect(name){
			this.nowItem = name;
			this.isShow = 0;
			this.$emit('selectType', {name:this.name, value:this.nowItem});
		}
    }
}
</script>

<style lang='less' scoped>

.my-select{
	height:1rem;width:1.2rem;color:#688aa7;
	cursor:default;
}
.opt-label{
	height:1rem;line-height:0.9rem;text-align:center;
}
.opt-box{
	position: absolute;overflow-y:scroll;padding:0.2rem;margin-left:0.1rem;width:6rem;height:auto;border:1px solid #dfe6ec;background:#fcfdfd;border-radius:0.2rem;
}
.opt-item{
	font-size:0.59rem;line-height:0.69rem;width:100%;float:left;padding:0.1rem;box-sizing:border-box;
	&:hover{
		background:#eef1f6;
		border-radius:0.1rem;
		border:1px solid #dfe6ec;
	}
}

</style>
