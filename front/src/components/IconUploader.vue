<template>
<div class="">
    <div @click="onImgClick" class="" style="width:3rem;height:3rem;border:1px solid #ccc;border-radius:0.25rem;display:flex;flex-direction:column;box-sizing:border-box;padding:0.2rem;">
		<img style="width:2.5rem;height:2.5rem;border-radius:0.2rem" :src="value" v-show="value" />
		<div class="image" style="width:2.6rem;height:2.6rem;" v-show="!value"></div>
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
			progress:0,
			reader:{},
			img:{},
			canvas:{},
			context:{},
			oFile:{},
			maxWidth:144,
			maxHeight:144,
			imgPath:''
        }
    },
    computed: {
    },
	//暂时先这么吧，图片直接存入数据库 也解决了集群问题，如果需要上传cdn，那么保存到服务器后再上传cdn
	//顺便压缩图片，不允许过大的图片随便上传
	mounted:function(){
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.reader = new FileReader();
		this.img = new Image();
		this.reader.onload = (e)=>{
			console.log(e.target.result);
			this.img.src = e.target.result;
			this.imgPath = this.img.src;
		//	let data = {};
		//	data[this.name] = e.target.result;
		//	this.$emit('selected', data);
		};
		this.img.onload = ()=>{
			console.log('imgload', this.img);
			this.canvas.height = 144;
			this.canvas.width = 144;
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
			this.canvas.toBlob((blob)=>{
				console.log('blob:',blob);
				this.upload(this.canvas.toDataURL('image/png', 0.9));
				
			}, 'image/png');
		};
	},
    methods: {
		upload(urlData){
			console.log('urlData:', urlData);
			let data = {};
			data[this.name] = urlData;
			this.$emit('selected', data);
		},
		onImgClick(){
			this.$refs.file.click();
		},
		uploadFile() {
			this.oFile = this.$refs.file.files[0];
			console.log(this.oFile);
			if (this.oFile.type.indexOf("image") == 0) {
				this.reader.readAsDataURL(this.oFile);    
			}
		}
    }
}
</script>

<style lang='less' scoped>
.image{
	width:2.6rem;
	height:2.6rem;
	background:url('../assets/icon/image.svg') no-repeat 50% 36%;
	background-size: 50% 50%;
}
</style>
