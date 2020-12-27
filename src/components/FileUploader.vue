<template>
<div class="">
    <div @click="onImgClick" class="" style="width:9rem;height:6rem;background:#efefef;border:1px dotted #ccc;border-radius:0.25rem;display:flex;box-sizing:border-box;padding:0.7rem;">
		<div style="flex:1;"></div>
		<svg style="flex:3;" xmlns="http://www.w3.org/200/svg">
			<circle cx="55" cy="55" r="50" fill="none" stroke="#D1D3D7" stroke-width="10" stroke-linecap="round"/>
			<circle class="demo2" id="J_demo2" cx="55" cy="55" r="50" fill="none" stroke="#20a0ff" stroke-width="10" :stroke-dasharray="showDir"/>
		</svg>
		<div style="flex:1;">
			<div style="width:0;height:0;">
				<div style="width:3rem;height:1rem;margin-top:1.7rem;margin-left:-2.9rem;">{{progress}}%</div>
			</div>
		</div>
		
		<input style="display:none" type="file" ref="file" multiple="false"  accept="image/*" @change="uploadFile">
	</div>
</div>
</template>

<script>
export default {
    name: 'imgUploader',
    props: ['placeholder', 'id', 'name', 'value'],
    components:{},
    data() {
        return {
			notice:'点击选择图片',
			progress:0,
			oFile:{}
        }
    },
    computed: {
		showDir:function(){
			return Math.PI * this.progress + ',10000';
		}
    },
	mounted:function(){
	},
    methods: {
		onImgClick(){
			this.$refs.file.click();
		},
		uploadFile(){
			var that = this;
			var file = this.$refs.file.files[0];
			var reader = new FileReader();
			reader.readAsArrayBuffer(file);
			reader.onload = (e)=>{
				//arraybuffer
				RUNKIT.ServerApi.sendFileData('Admin.typeList', {name:'aaa.txt', data:e.target.result}, (code, info, rate)=>{
					console.log(code, info, rate);
					this.progress = rate;
					this.notice = info;
				});
			}
		}
    }
}
</script>

<style lang='less' scoped>
.file{
	width:1rem;
	height:1rem;
	background:url('../assets/icon/file.svg') no-repeat;
	background-size: 50% 50%;  
}

.demo2{
    transform-origin: 55px 55px;
    transform: rotate(-90deg);
    transition: stroke-dasharray .3s ease-in;
}

</style>
